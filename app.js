var fs = require('fs');
var exec = require('child_process').exec;
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var Twit = require('twit');
var getNumOfLines = require('./lines');

var T = new Twit({
    consumer_key:         '',
    consumer_secret:      '',
    access_token:         '',
    access_token_secret:  ''
});

var fileLinelength = "";
var usedIndex = fs.readFileSync('./usedTweet.txt', 'utf8');

function sendTweet(data){
	var tweet = "empty";
	fileLinelength = data.substr(0,4);

	do {
		tweet = "";
		index = Math.floor(Math.random() * fileLinelength);
		get_line('./wordlistv.txt', index, function(err, line){
	  		tweet = line;
		});
		if (tweet === ""){
			fs.writeFile('./usedTweet.txt', "", function(err){
				if(err){
					return console.log(err);
				}
			});
		}
	} while (isTweeted(tweet));

	console.log(tweet);
	fs.appendFile('./usedTweet.txt', tweet + '\n', function(err){
		if(err){
			return console.log(err);
		}
	});

	T.post('statuses/update', { status: tweet }, function(err, data, response) {
    	console.log(data);
  	});
}

function get_line(filename, line_no, callback) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\r\n");

    if(+line_no > lines.length){
      throw new Error('File end reached without finding line');
    }
    callback(null, lines[+line_no]);
}

function isTweeted(i){
	if (usedIndex.indexOf(i) != -1){
		return true;
	}else{
		return false;
	}
}

// Execution
getNumOfLines(sendTweet);

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

module.exports = app;
