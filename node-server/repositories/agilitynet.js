"use strict";

var http = require('http'),
	xml2js = require('xml2js'),
	_ = require('underscore');


function parseXml(xml, success) {
	var parseString = xml2js.parseString;
	parseString(xml, function (err, result) {
		success(null, result);
	});
}


function startScraping(url, finished) {

	function httpGetCallback(res) {
		var bodyBuffer = [];

		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			bodyBuffer.push(chunk);
		});

		res.on('end', function () {
			parseXml(bodyBuffer.join(''), finished);
		});
	}

	function httpGetError(e) {
		console.log("Got error: " + e.message);
	}

	http.get(url, httpGetCallback).on('error', httpGetError);
}


function requestShowsAtAglance(finished) {
	startScraping('http://www.agilitynet.co.uk/activepages/requestShowsAtAglance.asp?initrequest=yes&idx=0&limit=50&_=1391850993450', function (err, success) {
		if (err) {
			console.log(err);
		}

		finished(err, success);
	});
}

exports.requestShowsAtAglance = requestShowsAtAglance;