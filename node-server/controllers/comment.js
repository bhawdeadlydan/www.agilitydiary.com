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
	console.log(request.body);
	console.log(request.body.itemId);
	var item = mongoose.Types.ObjectId(request.body.itemId);

	User.findById(request.user.id, function (err, user) {
		Comment.create({
			User: user,
			Message: request.body.message,
			Item: item
		}, function (err, comment) {
			response.send(200);
		});
	});
};


exports.getComments = function (request, response) {
	var query = Comment.find({
		Item: mongoose.Types.ObjectId(request.query.itemId)
	});

	query.populate('User');
	query.sort({
		DateTime: 1
	});
	query.exec(function (err, comments) {
		response.send(comments);
	});
};
