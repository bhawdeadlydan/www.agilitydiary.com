var _ = require('underscore');
var mongoose = require('mongoose');
var Show = require('../models/mongoose/show');
var ShowViewModel = require('../models/viewmodels/show');
var Diary = require('../models/mongoose/diary');
var User = require('../models/mongoose/user');
var Upload = require('./upload.js');



exports.userUploadPhoto = Upload.UploadManager({
	scale: [
		{
			width: 200,
			height: 100
		},
		{
			width: 80,
			height: 60
		}
	]
}, function (request, response, data) {
	Show.findOne({
		_id: request.query.id
	}).exec(function (err, show) {
		show.UserPhotos.push({
			Path: data.newUrlPath,
			User: request.user
		});
		show.save(function (err, show) {
			response.send(200);
		});
	});
});




/**
 * List all shows
 */
exports.list = function (req, res) {
	Show.find().exec(function (err, data) {
		res.send(data);
	});
};




/**
 * List all shows
 */
exports.details = function (req, res) {
	Show.findOne({
		_id: req.query.id
	}).populate('Attending').exec(function (err, data) {
		res.send(ShowViewModel(data));
	});
};




exports.categories = function (req, res) {
	var data = [
		'BAA', 'FAB', 'Independent', 'Invitation', 'Irish Kennel Club', 'KC', 'Other', 'Series', 'Training', 'UKA'
	];

	data.sort();

	res.send(data);
};




exports.upcomingListData = upcomingListData;




function upcomingListData(callback) {
	Show.find({
		ParsedDate: {
			$gte: new Date()
		}
	})
	.sort({
		ParsedDate: 1
	})
	.exec(function (err, data) {
		callback(data);
	});
}




/**
 * List upcoming shows
 */
exports.upcomingList = function (req, res) {
	upcomingListData(function(data) {
		var result = [];

		_.each(data, function (iterator) {
			result.push(ShowViewModel(iterator));
		});

		res.send(result);
	});
};




/**
 * List previous shows
 */
exports.previousList = function (req, res) {
	Show.find({
		ParsedDate: {
			$lt: new Date()
		}
	})
	.sort({
		ParsedDate: -1
	})
	.exec(function (err, data) {
		var result = [];

		_.each(data, function (iterator) {
			result.push(ShowViewModel(iterator));
		});

		res.send(result);
	});
};




/**
 * List previous shows
 */
exports.enteredList = function (request, res) {
	User.findById(request.user.id, function (err, user) {
		Diary.findOne({
			User: user
		}, function (err, diary) {

			Show.find({
				_id: {
					$in: diary.EnteredShows
				}
			})
			.sort({
				ParsedDate: -1
			})
			.exec(function (err, data) {
				var result = [];

				_.each(data, function (iterator) {
					result.push(ShowViewModel(iterator));
				});

				res.send(result);
			});
		});
	});
};





/**
 * List upcoming shows
 */
exports.todaysList = function (req, res) {
	Show.find({
		ParsedDate: {
			$eq: new Date()
		}
	})
	.sort({
		ParsedDate: 1
	})
	.exec(function (err, data) {
		var result = [];

		_.each(data, function (iterator) {
			result.push(ShowViewModel(iterator));
		});

		res.send(result);
	});
};
