/***
	Primary App file
	----------------
	Author: Mike Elsmore <mike@elsmore.me> @ukmadlz
***/

/* Initial Requires for Express */
// Express
var express = require('express');
var app = express();
// Jade
var jade = require('jade');
// Stylus
var stylus = require('stylus');
// Nib
var nib = require('nib');
// URL
var url = require('url');

/* Set Up App */
process.env.TZ = 'Europe/London';
var app = express()
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
app.set('views', __dirname + '/application/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
	{
		src: __dirname + '/public',
		compile: compile
	}
))
app.use(express.static(__dirname + '/public'));
app.use(express.logger());

// Index
app.get('/', function(req,res){
	res.render('index')
});

// Play
app.get('/play', function (req, res) {
	res.render('play',{
		id:req.query.id
	})
});

// Start Listening
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});