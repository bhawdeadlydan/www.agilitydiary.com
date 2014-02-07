var mongoose = require('mongoose');
var _ = require('underscore');
var Venue = require('../models/mongoose/venue');

exports.list = function(req, res) {
	Venue.find(function(err, data) {
		res.send(data);
	});
};
