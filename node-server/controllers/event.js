var mongoose = require('mongoose');
var _ = require('underscore');
var Event = require('../models/mongoose/event');

exports.list = function(req, res) {
	Event.find(function(err, data) {
		res.send(data);
	});
};


/**
 *
 */
exports.create = function(req, res) {
	var newEvent = Event({
		name: 'This is a new event'
	});

	newEvent.save(function(err, newEvent) {
		res.redirect('/map/events/list');
	});
};