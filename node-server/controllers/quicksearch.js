"use strict";


var _ = require('underscore');
var mongoose = require('mongoose');
var showController = require('./show.js');
var userController = require('./user.js');
var User = require('../models/mongoose/user');
var Diary = require('../models/mongoose/diary');
var Venue = require('../models/mongoose/venue');
var searchIndex;




if (typeof searchIndex === 'undefined') {
	searchIndex = [];
}




function initialiseShows(next) {
	console.log('Loading Shows into search index');

	showController.upcomingListData(function (data) {
		_.each(data, function (showItem) {
			searchIndex.push({
				Id: showItem._id,
				Name: showItem.Name,
				Type: 'Show',
				Details: '<div class="metaDetail"><i class="fa fa-map-marker"></i><span>' + showItem.Venue.Name + ', ' + showItem.Venue.PostCode +
					'| <i class="fa fa-calendar"></i><span>' + showItem.ShowDate + '</span>' +
					'<span ng-show="show.ShowDate !== show.ShowEnd"> - <span>' + showItem.ShowEnd + '</span></span></div>',
				Indexed: showItem.Name.toLowerCase()
			});
		});

		next();
	});
}




function initialiseUsers(next) {
	console.log('Loading Users into search index');

	User.find({

	}).exec(function (err, data) {
		_.each(data, function (showItem) {
			if (typeof showItem.profile !== 'undefined') {
				searchIndex.push({
					Id: showItem._id,
					Name: showItem.profile.name,
					Img: showItem.profile.picture,
					Type: 'User',
					Details: showItem.profile.name,
					Indexed: showItem.profile.name.toLowerCase()
				});
			}
		});

		next();
	});
}




function initialiseVenues(next) {
	console.log('Loading Venues into search index');

	Venue.find(function (err, data) {
		_.each(data, function (showItem) {
			searchIndex.push({
				Id: showItem._id,
				Name: showItem.name,
				Type: 'Venue',
				Details: showItem.address + ', ' + showItem.postcode,
				Indexed: showItem.name.toLowerCase()
			});
		});

		next();
	});
}




function initialise() {
	initialiseShows(function () {
		initialiseUsers(function () {
			initialiseVenues(function () {
				console.log('Search index length: ' + searchIndex.length);
			});
		});
	});
}




function ResultsViewModel(query, results) {
	return {
		Query: query,
		Results: results,
		Corpus: searchIndex.length
	};
}




function localQuicksearch(userId, searchQuery, callback) {
	var results = [];

	User.findById(userId, function (err, user) {
		Diary.findOne({
			User: user
		}, function (err, diary) {

			_.each(diary.Dogs, function (dog) {
				if (dog.Deleted === false) {
					if ((typeof dog.Profile.Name !== 'undefined') && (dog.Profile.Name !== null)) {
						if (dog.Profile.Name.toLowerCase().indexOf(searchQuery) !== -1) {
							results.push({
								Id: dog._id,
								Name: dog.Profile.Name,
								Img: dog.Profile.Photo,
								Type: 'Dog',
								Details: dog.Profile.Breed
							});
						}
					}
				}
			});

			callback(results);
		});
	});
}




function globalQuickSearch(searchQuery) {
	var results = [];
	var count = 0;
	var match = 0;
	var item;
	var searchQueryItems = searchQuery.split(' ');
	var searchQueryCount;
	var includeThis;

	for (count = 0; count < searchIndex.length && match < 10; count += 1) {
		item = searchIndex[count];
		
		if (searchQueryItems.length !== 0) {
			includeThis = true;
			
			for (searchQueryCount = 0; searchQueryCount < searchQueryItems.length; searchQueryCount++) {
				if (item.Indexed.indexOf(searchQueryItems[searchQueryCount]) === -1) {
					includeThis = false;
				}
			}
			
			if (includeThis === true) {
				results.push(item);
				match += 1;
			}
		}
	}

	return results;
}




function search(request, response) {
	var searchQuery = request.query.q.toLowerCase();

	if (searchQuery.length < 4) {
		response.send(200);
	} else {
		localQuicksearch(request.user.id, searchQuery, function (localResults) {
			var results = globalQuickSearch(searchQuery);

			response.send(ResultsViewModel(searchQuery, localResults.concat(results)));
		});
	}
}




exports.initialise = initialise;
exports.search = search;
