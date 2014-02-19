var mongoose = require('mongoose');
var passport = require('passport');
var _ = require('underscore');

var User = require('../models/mongoose/user');
var Comment = require('../models/mongoose/comment');

var Diary = require('../models/mongoose/diary');
var DiaryViewModel = require('../models/viewmodels/diary');

var Show = require('../models/mongoose/show');
var ShowViewModel = require('../models/viewmodels/show');


exports.addComment = function (request, response) {
	User.findById(request.user.id, function (err, user) {
		Comment.create({
			User: user,
			Message: request.body.message,
			Item: request.body.itemId
		}, function (err, comment) {
			response.send(200);
		});
	});
};


exports.getComments = function (request, response) {
	var query = Comment.find({
		Item: request.itemId
	});

	query.populate('User');
	query.sort({
		DateTime: 1
	});
	query.exec(function (err, comments) {
		//comments.populate('User', function (err, comments) {
			response.send(comments);
		//});
	});
};
