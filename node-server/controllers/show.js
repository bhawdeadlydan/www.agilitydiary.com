var _ = require('underscore');
var mongoose = require('mongoose');
var Show = require('../models/mongoose/show');
var ShowViewModel = require('../models/viewmodels/show');
var Diary = require('../models/mongoose/diary');
var User = require('../models/mongoose/user');


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
	}).exec(function (err, data) {
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




/**
 * List upcoming shows
 */
exports.upcomingList = function (req, res) {
	Show.find({
		ParsedDate: {
			$gte: new Date()
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
