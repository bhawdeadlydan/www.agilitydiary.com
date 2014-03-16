var mongoose = require('mongoose');
var _ = require('underscore');
var Club = require('../models/mongoose/club');

exports.list = function(req, res) {
	Club.find(function(err, data) {
		res.send(data);
	});
};
