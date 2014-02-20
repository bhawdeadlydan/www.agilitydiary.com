// upload controller
var _ = require('underscore');
var uploadPath = '';
var fs = require('fs');
var fsExtra = require('fs.extra');
var util = require('util');
var path = require('path');
var uuid = require('node-uuid');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true });
var User = require('../models/mongoose/user');




exports.uploadFile = UploadManager({
	scale: [
		{
			width: 200,
			height: 100
		}
	]
}, function (request, response, data) {
	User.findById(request.user.id, function (err, user) {
		user.profile.picture = data.assetPath + '/' + _.findWhere(data.scaled, { width: 200 }).url;

		user.save(function (err, user) {
			response.send(200);
		});
	});
});




function UploadManager(options, fn) {
	function UploadModelHandlerPrototype(request, response) {

		var data = {};
		var instream;
		var outstream;
		var outPath;
		var today = new Date();
		var fileItem = request.files;

		data.uuid = uuid.v4();
		data.tempPath = fileItem.file.path;
		data.originalFilename = fileItem.file.originalFilename;
		data.originalExtension = data.originalFilename.split('.');
		data.originalExtension = '.' + data.originalExtension[data.originalExtension.length - 1];

		data.photosLocalDirectory = path.resolve(__dirname + '/../../workspace/photos/');

		data.stampedDirectory = request.user.id + '/' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '/' + data.uuid;

		data.newLocalDirectory = data.photosLocalDirectory + '/' + data.stampedDirectory;

		console.log(data.newDirectory);

		fsExtra.mkdirRecursive(data.newLocalDirectory, function () {
			data.outPath = data.newLocalDirectory + '/' + 'source' + data.originalExtension;
			data.assetPath = '/workspace/photos/';
			data.newUrlPath = data.assetPath + data.stampedDirectory + '/source' + data.originalExtension;

			instream = fs.createReadStream(data.tempPath);
			outstream = fs.createWriteStream(data.outPath);

			util.pump(instream, outstream, function (err) {
				if (err) {
					console.log(err);
				} else {

					console.log('now resize');
					// now the image is saved
					//
					var scaleIndex = 0;
					data.scaled = [];

					function finishedScaling () {
						fn(request, response, data);
					}

					function scaleNextItem () {
						if (scaleIndex < options.scale.length) {
							var width = options.scale[scaleIndex].width;
							var height = options.scale[scaleIndex].height;
							var newScaledObject = {
								width: width,
								height: height,
								name: 'source_' + width + 'x' + height + data.originalExtension
							};

							newScaledObject.localPath = data.newLocalDirectory + '/' + newScaledObject.name;
							newScaledObject.url = data.stampedDirectory + '/' + newScaledObject.name;

							data.scaled.push(newScaledObject);

							console.log('From: ' + data.outPath);
							console.log('To:  ' + newScaledObject.localPath);

							imageMagick(data.outPath)
								.resize(width, height)
								.autoOrient()
								.write(newScaledObject.localPath, function (err) {
									if (err) {
										console.log(err);
									}
									if (!err) {
										console.log(' hooray! ');
										scaleIndex++;
										scaleNextItem();
									}
								});
						} else {
							finishedScaling();
						}
					}

					scaleNextItem();
				}
			});
		});
	}

	return UploadModelHandlerPrototype;
}




exports.uploadPath = uploadPath;
