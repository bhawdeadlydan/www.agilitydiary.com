"use strict";
/* use strict */
/* global require, process, console, exports */
/* jshint unused: false */
/* jshint quotmark:false */

var http = require('http');
var xml2js = require('xml2js');
var mongodb = require('mongodb');
var fs = require('fs');
var csv = require('csv');
var _ = require('underscore');
var secrets = require('../config/secrets');
var moment = require('moment-timezone');
moment().tz("Europe/London").format();

var ClubModel = require('../models/mongoose/club');
var VenueModel = require('../models/mongoose/venue');
var PostCodeModel = require('../models/mongoose/postcode');
var ShowModel = require('../models/mongoose/show');

var databaseCachedObject;


function getDatabaseConnection(success, fail) {
	if((typeof databaseCachedObject !== 'undefined') && (databaseCachedObject !== null)) {
		success(databaseCachedObject);
	} else {
		var MongoClient = mongodb.MongoClient;

		MongoClient.connect(secrets.dbconnection, function(err, db) {
			if(err) {
				fail(err);
			}

			databaseCachedObject = db;
			success(db);
		});
	}
}


function listEvents(req, res) {

}


function getScrapedData(success, fail) {
	getDatabaseConnection(function(database) {
		var scraped = database.collection('scraped');
		scraped.find().toArray(success, fail);
	});
}


function checkClub(name, success) {
	ClubModel.find({
		name: name
	}).exec(function(err, data) {
		if(data.length === 0) {
			ClubModel.create({
				name: name
			}, function(err, data) {
				console.log('Added club to database ' + name);
				success();
			});
		} else {
			console.log('Found club in database ' + name);
			success();
		}
	});
}


function checkVenue(name, address, postcode, success) {
	VenueModel.find({
		name: name,
		postcode: postcode
	}).exec(function(err, data) {
		if(data.length === 0) {
			VenueModel.create({
				name: name,
				address: address,
				postcode: postcode
			}, function(err, data) {
				console.log('Added venue to database ' + name);
				success();
			});
		} else {
			console.log('Found venue in database ' + name);
			success();
		}
	});
}


function checkShow(item, success) {
	// skip junk
	if(item === null) {
		success();
		return;
	}

	if(item.data === null) {
		success();
		return;
	}

	if(typeof item.data.response === 'undefined') {
		success();
		return;
	}

	if(typeof item.data.response.showname === 'undefined') {
		success();
		return;
	}

	console.log('Reading item');
	console.log(item);

	var clubName = typeof item.data.response.clubname !== 'undefined' ? item.data.response.clubname[0] : '';
	var showName = typeof item.data.response.showname !== 'undefined' ? item.data.response.showname[0] : '';
	var showDate = typeof item.data.response.showdate !== 'undefined' ? item.data.response.showdate[0] : '';
	var showEnd = typeof item.data.response.showend !== 'undefined' ? item.data.response.showend[0] : '';
	var closingDate = typeof item.data.response.closingdate !== 'undefined' ? item.data.response.closingdate[0] : '';
	var insertObject = {
		Name: showName,
		Club: clubName,
		ShowDate: showDate,
		ShowEnd: showEnd
	};

	ShowModel.find(insertObject)
	.exec(function(err, data) {
		if(err) {
			console.log(err);
			console.log('Inserting object');
			console.log(insertObject);
			console.log(data);
		} else {
			if(data.length !== 0) {
				// skip
				success();
			} else {
				ShowModel.create({
					Name: showName,
					Club: clubName,
					ShowDate: showDate,
					ShowEnd: showEnd,
					ClosingDate: closingDate,
					ParsedDate: moment(showDate, 'DD/MM/YYYY').toDate(),
					ParsedEnd: moment(showEnd, 'DD/MM/YYYY').toDate(),
					ParsedClosingDate: moment(closingDate, 'DD/MM/YYYY').toDate(),
					Venue: {
						Name: typeof item.data.response.venuename !== 'undefined' ? item.data.response.venuename[0] : '',
						Address: typeof item.data.response.venueaddress !== 'undefined' ? item.data.response.venueaddress[0] : '',
						PostCode: typeof item.data.response.venuepostcode !== 'undefined' ? item.data.response.venuepostcode[0] : '',
					},
					EntriesTo: typeof item.data.response.entriesto !== 'undefined' ? item.data.response.entriesto[0] : '',
					Logo: typeof item.data.response.logo !== 'undefined' ? item.data.response.logo[0] : '',
					Website: typeof item.data.response.website !== 'undefined' ? item.data.response.website[0] : ''
				}, function(err, newShow) {
					if(err) {
						console.log(err);
						process.exit(1);
					} else {
						success();
					}
				});
			}
		}
	});
}


function getScrapedDataProcessShows(success) {
	return function(err, items) {
		var itemIndex = 0;

		function handleItem() {
			console.log(itemIndex);
			if(itemIndex < items.length) {
				var item = items[itemIndex];
				itemIndex++;

				checkShow(item, function(err) {
					console.log('here');
					handleItem();
				});

			} else {
				console.log('finished');
				success(items);
			}
		}

		handleItem();
	};
}


function getScrapedDataProcessClubs(success) {
	return function(err, items) {
		var itemIndex = 0;

		function handleItem() {
			console.log(itemIndex);
			if(itemIndex < items.length) {
				var item = items[itemIndex];
				itemIndex++;

				if((typeof item.data !== 'undefined') && (item.data !== null)) {
					if(typeof item.data.response.clubname !== 'undefined') {
						console.log(item.data.response.clubname[0]);

						checkClub(item.data.response.clubname[0], function(err) {
							console.log('here');
							handleItem();
						});
					} else {
						handleItem();
					}
				} else {
					handleItem();
				}
			} else {
				console.log('finished');
				success(items);
			}
		}

		handleItem();
	};
}


function getScrapedDataProcessVenue(success) {
	return function(err, items) {
		var itemIndex = 0;

		function handleItem() {
			console.log(itemIndex);
			if(itemIndex < items.length) {
				var item = items[itemIndex];
				itemIndex++;

				if((typeof item.data !== 'undefined') && (item.data !== null)) {
					if(typeof item.data.response.venuename !== 'undefined') {
						var name = item.data.response.venuename[0];
						var address = typeof item.data.response.venueaddress !== 'undefined' ? item.data.response.venueaddress[0] : '';
						var postcode = typeof item.data.response.venuepostcode !== 'undefined' ? item.data.response.venuepostcode[0] : '';

						checkVenue(name, address, postcode, function(err) {
							console.log('here');
							handleItem();
						});
					} else {
						handleItem();
					}
				} else {
					handleItem();
				}
			} else {
				console.log('finished');
				success(items);
			}
		}

		handleItem();
	};
}


function parseImport(req, res) {
	var showCallback = getScrapedDataProcessShows(function() {
		res.send('done');
	});

	var clubCallback = getScrapedDataProcessClubs(function() {
		getScrapedData(showCallback);
	});

	var venueCallback = getScrapedDataProcessVenue(function() {
		getScrapedData(clubCallback);
	});

	//getScrapedData(venueCallback);
	getScrapedData(showCallback);
}


function lookupVenues(req, res) {
	VenueModel.find().exec(function(err, data) {
		var index = 0;

		function done() {
			res.send('done');
		}

		function lookupNextVenue() {
			if(index < data.length) {
				var item = data[index];
				index++;


				console.log(item);

				lookupNextVenue();
			} else {
				done();
			}
		}

		lookupNextVenue();
	});
}


function lookupPostcode(req, res) {
	var postcode = req.query.q;

	console.log(postcode);
	PostCodeModel.find({
		Postcode: postcode,
		Terminated: ''
	}, function(err, data) {

		res.send(data);
	});
}


function populateVenueLatLng() {
	VenueModel.find().exec(function(err, data) {
		_.each(data, function(item) {
			PostCodeModel.find({
				Postcode: item.postcode,
				Terminated: ''
			}, function(err, postcodeData) {
				if(err) {
					console.log(err);
				} else {
					if(postcodeData.length === 1) {
						console.log('Updating');

						item.location.latitude = postcodeData[0]['Latitude'].value;
						item.location.longitude = postcodeData[0]['Longitude'].value;

						console.log(item);
						item.save();
					}
				}

			});
		});
	});

}


function isValid(item) {
	var result = false;

	try {
		if((typeof item !== 'undefined') && (item !== null)) {
			result = true;
		}
	} catch(e) {

	}

	return result;
}


exports.getDatabaseConnection = getDatabaseConnection;
exports.listEvents = listEvents;
exports.parseImport = parseImport;
exports.lookupVenues = lookupVenues;
exports.lookupPostcode = lookupPostcode;
exports.populateVenueLatLng = populateVenueLatLng;