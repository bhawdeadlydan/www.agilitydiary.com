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

		Show.findOne({
			_id: req.query.id
		}, function (err, show) {

			Diary.find({
				User: user
			}, function (err, diary) {

				if (diary.length === 0) {
					console.log('No diary entry');

					diary = Diary.create({
						User: user,
						EnteredShows: [
							show
						]
					}, function (err, diary) {
						if (err) {
							console.log(err);
						} else {
							res.send(diary);
						}
					});
				} else {

					var isAdded = false;
					_.each(diary[0].EnteredShows, function (iterator) {
						if(iterator.equals(show._id) === true) {
							isAdded = true;
						}
					});

					if (isAdded === false) {
						diary[0].EnteredShows.push(show);
					}

					diary[0].save(function (err, diary) {
						console.log('saved');

						res.send(diary);
					});
				}

			});

		});
	});
};




exports.resignShow = function (req, res) {
	User.findById(req.user.id, function (err, user) {
		console.log(user);

		Show.findOne({
			_id: req.query.id
		}, function (err, show) {

			Diary.findOne({
				User: user
			}, function (err, diary) {

				if (diary === null) {
					console.log('No diary entry');

					diary = Diary.create({
						User: user,
						EnteredShows: [

						]
					}, function (err, diary) {
						if (err) {
							console.log(err);
						} else {
							res.send(diary);
						}
					});
				} else {

					var isAdded = false;
					_.each(diary.EnteredShows, function (iterator) {
						if(iterator.equals(req.query.id) === true) {

							diary.EnteredShows.remove(iterator);
						}
					});

					diary.save(function (err, diary) {
						console.log('saved');

						res.send(diary);
					});
				}

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