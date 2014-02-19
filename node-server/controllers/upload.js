// upload controller
var _ = require('underscore');
var uploadPath = '';
var fs = require('fs');
var util = require('util');
var path = require('path');
var User = require('../models/mongoose/user');

exports.uploadFile = function (request, response) {
	var instream;
	var outstream;
	var outPath;

	User.findById(request.user.id, function (err, user) {
		var fileItem = request.files;
		var tempPath = fileItem.file.path;
		var originalFilename = fileItem.file.originalFilename;
		var originalExtension = originalFilename.split('.');
		originalExtension = originalExtension[originalExtension.length - 1];

		var newFileName = user._id + '.' + originalExtension;
		var outPath = path.resolve(__dirname + '/../../workspace/photos/' + newFileName);

		console.log(tempPath);
		console.log(outPath);

		instream = fs.createReadStream(tempPath);
		outstream = fs.createWriteStream(outPath);

		util.pump(instream, outstream, function (err) {
			if (err) {
				console.log(err);
			} else {

				user.profile.picture = '/workspace/photos/' + newFileName;

				user.save(function (err, user) {
					response.send(200);
				});
			}
		});
	});
};

exports.uploadPath = uploadPath;
