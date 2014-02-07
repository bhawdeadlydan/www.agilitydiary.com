var _ = require('underscore');
var mongoose = require('mongoose');
var Show = require('../models/mongoose/show');
var ShowViewModel = require('../models/viewmodels/show');




/**
 * List all shows
 */
exports.list = function(req, res) {
	Show.find().exec(function(err, data) {
		res.send(data);
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