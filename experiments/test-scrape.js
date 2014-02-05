"use strict";
/* use strict */
/* global require, process, console */
/* jshint unused: false */
/* jshint quotmark:false */

var http = require('http'),
	xml2js = require('xml2js'),
	settings = require('./settings.js'),
	mongodb = require('mongodb'),
	_ = require('underscore');

var databaseCachedObject;


function parseXml(xml, success) {
	var parseString = xml2js.parseString;
	parseString(xml, function (err, result) {
		console.dir(result);
		success(result);
	});
}


function connectToDatabase(success, fail) {
	if((typeof databaseCachedObject !== 'undefined') && (databaseCachedObject !== null)) {
		success(databaseCachedObject);
	} else {
		var MongoClient = mongodb.MongoClient;

		MongoClient.connect(settings.configuration.mongodb, function(err, db) {
			if(err) {
				fail(err);
			}

			databaseCachedObject = db;
			success(db);
		});
	}
}


function addToDatabase(database, data, success) {
	var collection = database.collection('scraped');

	collection.insert(data, success);
}


function startScraping(url, database, finished) {
	var index = 54;

	function addToDatabaseCallback(err, docs) {
		console.log(docs);

		if(err) {
			console.log(err);
			finished();
		}

		index++;
		if(index > 4000) {
			finished();
		} else {
			getNextData();
		}
	}

	function handleJson(jsonData) {
		var data = {
			url: url,
			index: index,
			data: jsonData
		};

		addToDatabase(database, data, addToDatabaseCallback);
	}

	function httpGetCallback(res) {
		var bodyBuffer = [];

		console.log("Got response: " + res.statusCode);
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));

		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
			bodyBuffer.push(chunk);
		});

		res.on('end', function () {
			parseXml(bodyBuffer.join(''), handleJson);
		});
	}

	function httpGetError(e) {
		console.log("Got error: " + e.message);
	}

	function getNextData() {
		http.get(url + index.toString(), httpGetCallback).on('error', httpGetError);
	}

	getNextData();
}


connectToDatabase(function(database) {
	/*startScraping(settings.configuration.url, database, function() {
		process.exit(1);
	});*/

	var collection = database.collection('scraped');
	collection.find().toArray(function(err, items) {
		var clubs = [];

		_.each(items, function(item) {
			if(item.data !== null) {
				if(typeof item.data.response.clubname !== 'undefined') {
					if(clubs.indexOf(item.data.response.clubname.toString()) === -1) {
						clubs.push(item.data.response.clubname.toString());
					}
				}
			}
		});

		clubs.sort();
		console.log(clubs);

	});
});
