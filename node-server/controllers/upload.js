// upload controller
var _ = require('underscore');
var uploadPath = '';
var fs = require('fs');
var fsExtra = require('fs.extra');
var util = require('util');
var path = require('path');
var uuid = require('node-uuid');

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

		var userDirectory = path.resolve(__dirname + '/../../workspace/photos/' + user._id + '/');
		var today = new Date();

		var stampedDirectory = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '/';
		var newDirectory = userDirectory + '/' + stampedDirectory;

		console.log(newDirectory);

		fsExtra.mkdirRecursive(newDirectory, function() {
			var newFileName = stampedDirectory + uuid.v4() + '.' + originalExtension;
			var outPath = userDirectory + '/' + newFileName;

			console.log(tempPath);
			console.log(outPath);

			instream = fs.createReadStream(tempPath);
			outstream = fs.createWriteStream(outPath);

			util.pump(instream, outstream, function (err) {
				if (err) {
					console.log(err);
				} else {

					user.profile.picture = '/workspace/photos/' + user._id + '/' + newFileName;

					user.save(function (err, user) {
						response.send(200);
					});
				}
			});
		});


	});
};

exports.uploadPath = uploadPath;
