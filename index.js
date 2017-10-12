console.log('This app is starting');

var Twit = require('twit');
var config = require('./config');
var exec = require('child_process').exec;
var fs = require('fs');
var Rita = require('rita');
//var express = require('express');
//var app = express();
//var server = app.listen(3000);

//app.use(express.static('ernest_p5'));
var T = new Twit(config);
var tweet_status;
var marker = 0;
//var cmd = "processing-java --sketch=`pwd`/ernest_p5 --run";

setInterval(postTweet, 1000*30);

function generateMarkovStatus() {
	var responses = fs.readFileSync('hemingsays.txt').toString().split("\n");

	tweet_status = responses[parseInt(marker)];
	marker++;
	console.log(tweet_status);
}
//generateStatus();

function generateStatus() {
	var text = "";
	var rmarkov = new Rita.RiMarkov(6);
	rmarkov.loadText(text); 
	status = rmarkov.generateSentences(2);
	console.log(status);
}

function postTweet() {
	generateMarkovStatus();

	var tweet = {
			status: tweet_status
		}
	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
		if(err) {
			console.log("Something went wrong while posting the tweet");
		} else {
			console.log("The tweet was posted - " + tweet_status);
		}
	}
}

function random (low, high) {
    return Math.random() * (high - low) + low;
}