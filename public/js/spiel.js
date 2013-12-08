$(document).ready(function(){
	$.ajax({
		url:'http://developer.echonest.com/api/v4/song/profile',
		data:{
			'api_key':'R9RBK9MF4OKHSIVRW',
			'format': 'json',
			'id':echonestid,
			'bucket':'audio_summary'
			},
		success:function(data){console.log(echonestid);
			var song = data.response.songs[0];
			var songDuration = parseInt(song.duration);
			var songData = new Array();
			$.ajax({
				url: song.audio_summary.analysis_url,
				success:function(data){
					$.each(data.sections,function(index,value){
						var duration = parseInt(value.duration);
						for(i=1;i<=duration;i++)
						{
							var key = parseInt(value.start)+i
							songData[key] = duration;
						}
					});
				}
			});
			var track;
			track = window.tomahkAPI.Track(song.title,song.artist_name, {
				width:$('div.container').width(),
				height:$(document).height(),
				disabledResolvers: [
					"Officialfm","Lastfm","Jamendo","Rdio","SpotifyMetadata","Exfm"
				],
				handlers: {
					onloaded: function() {
						//console.log(track.connection+":\n  api loaded");
						$('#player').css('height',$(document).height());
					},
					onended: function() {
						//console.log(track.connection+":\n  Song ended: "+track.artist+" - "+track.title);
					},
					onplayable: function() {
						console.log(track.connection+":\n  playable");
						track.play();
					},
					onresolved: function(resolver, result) {
						//console.log(track.connection+":\n  Track found: "+resolver+" - "+ result.track + " by "+result.artist);
					},
					ontimeupdate: function(timeupdate) {
						var currentTime = timeupdate.currentTime;
						var duration = timeupdate.duration;
						currentTime = parseInt(currentTime);
						duration = parseInt(duration);
						if(duration>0&&currentTime>0){
							if(songData[currentTime]>30)
							{
								//track.pause();
								$('#player iframe').slideUp();
								$('#play').get(0).play();
								$('#play').get(0).playbackRate='2.0';
								//track.seek(currentTime+parseInt(songData[currentTime]));
								//var timeSkip = parseInt(songData[currentTime]);
								var timeSkip = 10;
								//setTimeout(function(){track.play()},(timeSkip*1000));
							}
							else
							{
								$('#player > *').slideDown();
								$('#play').get(0).pause();
							}
							console.log(songDuration+' - '+songData[currentTime]+' - '+currentTime);
						}
						//console.log(track.connection+":\n  Time update: "+currentTime + " "+duration + " "+timeupdate.duration);
					},
					onplay: function(data) {
						console.log('Play');
					},
					onpause: function(data) {
						console.log('Pause');
					}
				}
			});
			$('#player').html(track.render());
			track.play();
		}
	});
	$('#playPause').click(function(e){
		e.preventDefault();
		var song = $('#play').get(0);
		if (song.paused)
			song.play();
		else
			song.pause();
	});
});