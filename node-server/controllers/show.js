var _ = require('underscore');
var mongoose = require('mongoose');
var Show = require('../models/mongoose/show');
var ShowViewModel = require('../models/viewmodels/show');
var Diary = require('../models/mongoose/diary');
var User = require('../models/mongoose/user');


/**
 * List all shows
 */
exports.list = function(req, res) {
	Show.find().exec(function(err, data) {
		res.send(data);
	});
};




exports.enterShow = function (req, res) {
	User.findById(req.user.id, function (err, user) {
		console.log(user);

		Show.find({
			_id: req.query.id
		}, function (err, show) {

			Diary.find({
				User: user
			}, function (err, diary) {

				if (diary.length === 0) {
					diary = Diary({
						User: user
					});
				}

				if(typeof diary.EnteredShows === 'undefined') {
					diary.EnteredShows = [];
				}

				diary.EnteredShows.push(show);

				diary.save(function (err, diary) {
					console.log('saved');

					res.send(diary);
				});

			});

		});
	});
};




/**
 * List upcoming shows
 */
exports.upcoming = function(req, res) {
	Show.find({
		ParsedDate: {
			$gt: new Date()
		}
	})
	.sort({
		ParsedDate: 1
	})
	.exec(function(err, data) {
		var result = [];

		_.each(data, function(iterator) {
			result.push(ShowViewModel(iterator));
		});

		res.send(result);
	});
};