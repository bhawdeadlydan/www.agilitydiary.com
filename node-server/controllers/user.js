var mongoose = require('mongoose');
var passport = require('passport');
var _ = require('underscore');

var User = require('../models/mongoose/user');
var Diary = require('../models/mongoose/diary');
var DiaryViewModel = require('../models/viewmodels/diary');
var Show = require('../models/mongoose/show');
var ShowViewModel = require('../models/viewmodels/show');

var networkConfiguration = require('../repositories/networkConfiguration');

var Upload = require('./upload.js');
var Tasks = require('./tasks');





//open2 = amqplib.connect(secrets.amqp);

// Consumer
/*
open2.then(function (conn) {
	var ok = conn.createChannel();

	ok = ok.then(function (ch) {
		return when.all([
				ch.assertQueue('colorificreturn2'),
				ch.assertExchange('amq.direct', 'direct'),
				ch.bindQueue('colorificreturn2', 'amq.direct', '#'),
				ch.consume('colorificreturn2', function (msg) {
					console.log('ret');
					if (msg !== null) {
						console.log('return message');
						console.log(msg.content.toString());
						ch.ack(msg);
					}
				})
			]
		);

	});
	return ok;
}).then(null, console.warn);
*/


exports.uploadFile = Upload.UploadManager({
	scale: [
		{
			width: 200,
			height: 100
		},
		{
			width: 80,
			height: 60
		},
		{
			width: 64,
			height: 64
		}
	]
}, function (request, response, data) {
	User.findById(request.user.id, function (err, user) {
		user.profile.picture =  data.newUrlPath; //data.assetPath + '/' + _.findWhere(data.scaled, { width: 200 }).url;

		user.save(function (err, user) {
			response.send(200);
		});
	});
});




exports.uploadBackgroundFile = Upload.UploadManager({
	scale: [
		{
			width: 200,
			height: 100
		},
		{
			width: 80,
			height: 60
		},
		{
			width: 64,
			height: 64
		}
	]
}, function (request, response, data) {
	User.findById(request.user.id, function (err, user) {
		var ipAddress = networkConfiguration.getIpAddresses()[0];
		console.log(ipAddress);

		user.profile.backgroundpicture =  data.newUrlPath; //data.assetPath + '/' + _.findWhere(data.scaled, { width: 200 }).url;

		user.save(function (err, user) {
			console.log(request.app.settings);
			var port = request.app.settings.port;

			Tasks.colorific({
				filename: data.outPath,
				fileUrl: 'http://' + ipAddress + ':' + port + data.newUrlPath,
				sender: {
					queue: 'colorificreturn2',
					api: 'http://' + ipAddress + ':' + port + '/agility-diary/user/setProfileColours'
				},
				returnData: request.user.id
			});

			response.send(200);
		});
	});
});





exports.addDogPhoto = Upload.UploadManager({
	scale: [
		{
			width: 200,
			height: 100
		},
		{
			width: 80,
			height: 60
		},
		{
			width: 64,
			height: 64
		}
	]
}, function (request, response, data) {
	User.findById(request.user.id, function (err, user) {
		Diary.findOne({
			User: user
		}, function (err, diary) {

			_.each(diary.Dogs, function (dog) {
				if (dog._id.toString() === request.query.id.toString()) {
					dog.Photos.push({
						Path: data.newUrlPath
					});
				}
			});

			diary.save(function (err, diary) {
				response.send(200);
			});
		});
	});
});




exports.setProfileColours = function (request, response) {
	var userId = request.body.return_data;

	User.findById(userId, function (err, user) {
		var colourData = JSON.parse(request.body.colours.replace(/'/g, '"'));
		var selected = true;

		user.profile.colours = [];

		_.each(colourData, function (colour) {
			user.profile.colours.push({
				colour: colour,
				selected: selected
			});

			if (selected === true) {
				selected = false;
			}
		});

		user.save(function (err, user) {
			response.send(200);
		});
	});
};




exports.setThemeMainColour = function (request, response) {
	User.findById(request.user.id, function (err, user) {
		user.profile.theme.mainColour = request.body.colour;

		user.save(function (err, user) {
			response.send(200);
		});
	});
};





exports.setDogProfilePhoto = Upload.UploadManager({
	scale: [
		{
			width: 200,
			height: 100
		},
		{
			width: 80,
			height: 60
		},
		{
			width: 64,
			height: 64
		}
	]
}, function (request, response, data) {
	User.findById(request.user.id, function (err, user) {
		Diary.findOne({
			User: user
		}, function (err, diary) {

			_.each(diary.Dogs, function (dog) {
				if (dog._id.toString() === request.query.id.toString()) {
					dog.Profile.Photo = data.newUrlPath;
				}
			});

			diary.save(function (err, diary) {
				response.send(200);
			});
		});
	});
});





function checkUserData(req) {
	User.findById(req.user.id, function (err, user) {
		console.log(user);

		Diary.find({
			User: user
		}, function (err, diary) {

			if (diary.length === 0) {
				diary = Diary({
					User: user
				});

				diary.save(function (err, diary) {
					console.log('saved');
				});
			}

			user.populate('Diary', function (err, user) {
				console.log(user);

				res.send(user);
			});
		});


	});
}




/**
 * GET /login
 * Login page.
 */
function createNewDiaryForUser(user, done) {
	Diary.create({
		User: user,
		EnteredShows: [ ],
		Dogs: [ ]
	}, function (err, diary) {
		if (err) {
			done(err);
		} else {
			done(undefined, diary);
		}
	});
}




function addUserToShow(show, user, success) {
	show.Attending.push(user);
	show.save(function () {
		success();
	});
}




function removeUserFromShow(show, user, success) {
	show.Attending.splice(show.Attending.indexOf(user), 1);
	show.save(function () {
		success();
	});
}




exports.enterShow = function (req, res) {
	User.findById(req.user.id, function (err, user) {
		console.log(user);

		Show.findOne({
			_id: req.query.id
		}, function (err, show) {

			Diary.find({
				User: user
			}, function (err, diary) {

				if (diary.length === 0) {
					console.log('No diary entry');

					diary = Diary.create({
						User: user,
						EnteredShows: [
							show
						]
					}, function (err, diary) {
						if (err) {
							console.log(err);
						} else {
							sendDiary(res, diary);
						}
					});
				} else {

					var isAdded = false;
					_.each(diary[0].EnteredShows, function (iterator) {
						if (iterator.equals(show._id) === true) {
							isAdded = true;
						}
					});

					if (isAdded === false) {
						diary[0].EnteredShows.push(show);
					}

					diary[0].save(function (err, diary) {
						addUserToShow(show, user, function () {
							res.send(200);
						});
					});
				}

			});

		});
	});
};




exports.resignShow = function (req, res) {
	User.findById(req.user.id, function (err, user) {
		console.log(user);

		Show.findOne({
			_id: req.query.id
		}, function (err, show) {

			Diary.findOne({
				User: user
			}, function (err, diary) {

				if (diary === null) {
					console.log('No diary entry');

					diary = Diary.create({
						User: user,
						EnteredShows: [

						]
					}, function (err, diary) {
						if (err) {
							console.log(err);
						} else {
							sendDiary(res, diary);
						}
					});
				} else {

					var isAdded = false;
					_.each(diary.EnteredShows, function (iterator) {
						if (iterator.equals(req.query.id) === true) {

							diary.EnteredShows.remove(iterator);
						}
					});

					diary.save(function (err, diary2) {
						console.log('saved');

						removeUserFromShow(show, user, function () {
							res.send(200);
						});
					});
				}

			});

		});
	});
};




function sendDiary(res, diary) {
	diary.populate('EnteredShows', function (err, diary) {
		diary.populate('User', function (err, diary) {
			diary.populate('Friends.LinkedUser', function (err, diary) {
				var value = DiaryViewModel(diary);
				res.send(value);
			});
		});
	});
}





exports.listUsers = function (request, response) {
	User.findById(request.user.id, function (err, user) {
		Diary.findOne({
			User: user
		}, function (err, diary) {
			User.find({ }, function (err, diaryList) {
				var item;

				for(var i = 0; i < diaryList.length; i++) {
					item = diaryList[i];
					item.name = 'bob';

					item.isFriend = 'false';

					/*_.each(diary.Friends, function (linkedUserItem) {
						if ((typeof linkedUserItem.LinkedUser !== 'undefined') && (linkedUserItem.LinkedUser !== null)){
							if (linkedUserItem.LinkedUser.toString() == item._id) {
								item.IsFriend = true;
							}
						}
					});*/

					//var itemId = mongoose.Types.ObjectId(item._id);

					/*if (_.contains(diary.Friends.LinkedUser, item._id)) {
						item.IsFriend = true;
					} else {
						item.IsFriend = false;
					}*/


				};

				//console.log(diaryList);

				response.send(diaryList);
			});
		});
	});
};




exports.listUsersData = listUsersData;




function listUsersData(callback) {
	Diary.find({

	})
	.populate('User')
	.exec(function (err, diaryList) {
		callback(diaryList);
	});
}




exports.publicUserData = function (request, response) {
	var id = request.query.id;

	User.findById(id, function (err, user) {
		Diary.findOne({
			User: user
		}, function (err, diary) {
			sendDiary(response, diary);
		});
	});
};




exports.userData = function (req, res) {
	User.findById(req.user.id, function (err, user) {
		Diary.findOne({
			User: user
		}, function (err, diary) {
			if (err) {
				res.send(500, { error: 'Error' });
			}

			if (diary === null) {
				createNewDiaryForUser(user, function (err, diary) {
					if (err) {
						res.send(500, { error: 'Error' });
					} else {
						sendDiary(res, diary);
					}
				});
			} else {
				sendDiary(res, diary);
			}
		});
	});
};





exports.addFriend = function (request, response) {
	User.findById(request.user.id, function (err, user) {
		Diary.findOne({
			User: user
		}, function (err, diary) {
			if (err) {
				response.send(500, { error: 'Error' });
			} else {
				User.findById(request.body.userId, function (err, friendUser) {
					if (err) {
						response.send(500);
					} else {
						diary.Friends.push({
							LinkedUser: friendUser
						});

						diary.save(function (err, diary) {
							if (err) {
								response.send(500);
							} else {
								response.send(200);
							}
						});
					}
				});
			}
		});
	});
};




exports.removeFriend = function (request, response) {
	User.findById(request.user.id, function (err, user) {
		Diary.findOne({
			User: user
		}, function (err, diary) {
			if (err) {
				response.send(500, { error: 'Error' });
			} else {
				var removeId = request.body.userId;

				diary.Friends.splice(diary.Friends.indexOf(removeId), 1);

				diary.save(function (err, diary) {
					if (err) {
						response.send(500);
					} else {
						response.send(200);
					}
				});

			}
		});
	});
};




exports.addResult = function (request, response) {
	User.findById(request.user.id, function (err, user) {
		Diary.findOne({
			User: user
		}, function (err, diary) {
			if (err) {
				response.send(500, { error: 'Error' });
			}

			_.each(diary.Dogs, function (dog) {
				if (dog._id.toString() == request.body.dogId.toString()) {
					console.log('match');
					dog.Results.push({
						Show: request.body.showId,
						Class: request.body.class,
						Time: request.body.time,
						Faults: request.body.faults,
						Place: request.body.place,
						Judge: request.body.judge,
						Points: request.body.points
					});

					diary.save(function (err, diary) {
						response.send(200);
					});
				}
			});
		});
	});
};




exports.addDog = function (req, res) {
	User.findById(req.user.id, function (err, user) {
		Diary.findOne({
			User: user
		}, function (err, diary) {
			if (err) {
				res.send(500, { error: 'Error' });
			}

			diary.Dogs.push({
				Status: 'enabled',
				Profile: {
					Name: req.body.name,
					Sex: req.body.sex,
					DateOfBirth: req.body.dateofbirth,
					Photo: '',
					Breed: req.body.breed,
					KennelClub: {
						Height: req.body.kcheight,
						Grade: req.body.kcgrade,
						RegisteredName: req.body.kcregisteredname,
						RegisteredNumber: req.body.kcregisterednumber
					},
					Microchip: req.body.microchip,
					Tattoo: req.body.tattoo
				}
			});

			diary.save(function (err, diary) {
				console.log(err);
				res.send(DiaryViewModel(diary));
			});


		});
	});
};




exports.updateDog = function (req, res) {
	User.findById(req.user.id, function (err, user) {
		Diary.findOne({
			User: user
		}, function (err, diary) {
			if (err) {
				res.send(500, { error: 'Error' });
			}

			_.each(diary.Dogs, function (dog) {
				if (dog._id == req.body._id) {

					console.log('found dog');

					dog.Profile.Name = req.body.name;
					dog.Profile.Sex = req.body.sex;
					dog.Profile.DateOfBirth = req.body.dateofbirth;
					dog.Profile.Photo = req.body.photo;
					dog.Profile.Breed = req.body.breed;

					dog.Profile.KennelClub.Height = req.body.kcheight;
					dog.Profile.KennelClub.Grade = req.body.kcgrade;
					dog.Profile.KennelClub.RegisteredName = req.body.kcregisteredname;
					dog.Profile.KennelClub.RegisteredNumber = req.body.kcregisterednumber;

					dog.Profile.Microchip = req.body.microchip;
					dog.Profile.Tattoo = req.body.tattoo;
				}
			});

			diary.save(function (err, diary) {
				console.log(err);
				res.send(DiaryViewModel(diary));
			});


		});
	});
};




exports.deleteDog = function (req, res) {
	User.findById(req.user.id, function (err, user) {
		Diary.findOne({
			User: user
		}, function (err, diary) {
			if (err) {
				res.send(500, { error: 'Error' });
			}

			_.each(diary.Dogs, function (dog) {
				if ((typeof dog !== 'undefined') && (typeof req.body._id !== 'undefined')) {
					if (dog._id.toString() == req.body._id.toString()) {
						dog.Deleted = true;
					}
				}
			});

			console.log(diary);

			diary.save(function (err, diary) {
				res.send(DiaryViewModel(diary));
			});
		});
	});
};




exports.getLogin = function (req, res) {
	if (req.user) return res.redirect('/');
	res.render('account/login', {
		title: 'Login'
	});
};




/**
 * POST /login
 * Sign in using email and password.
 * @param {string} email
 * @param {string} password
 */

exports.postLogin = function (req, res, next) {
	req.assert('email', 'Email is not valid').isEmail();
	req.assert('password', 'Password cannot be blank').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/login');
	}

	passport.authenticate('local', function (err, user, info) {
		if (err) return next(err);

		if (!user) {
			req.flash('errors', { msg: info.message });
			return res.redirect('/login');
		}

		req.logIn(user, function (err) {
			checkUserData(req);

			if (err) return next(err);
			return res.redirect('/');
		});
	})(req, res, next);
};




/**
 * GET /signup
 * Signup page.
 */

exports.getSignup = function (req, res) {
	if (req.user) return res.redirect('/');
	res.render('account/signup', {
		title: 'Create Account'
	});
};

/**
 * POST /signup
 * Create a new local account.
 * @param {string} email
 * @param {string} password
 */

exports.postSignup = function (req, res, next) {
	req.assert('email', 'Email is not valid').isEmail();
	req.assert('password', 'Password must be at least 4 characters long').len(4);
	req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/signup');
	}

	var user = new User({
		email: req.body.email,
		password: req.body.password
	});

	user.save(function (err) {
		if (err) {
			if (err.code === 11000) {
				req.flash('errors', { msg: 'User with that email already exists.' });
			}
			return res.redirect('/signup');
		}
		req.logIn(user, function (err) {
			if (err) return next(err);
			res.redirect('/');
		});
	});
};

/**
 * GET /account
 * Profile page.
 */

exports.getAccount = function (req, res) {
	res.render('account/profile', {
		title: 'Account Management'
	});
};

/**
 * POST /account/profile
 * Update profile information.
 */

exports.postUpdateProfile = function (req, res, next) {
	User.findById(req.user.id, function (err, user) {
		if (err) return next(err);
		user.email = req.body.email || '';
		user.profile.name = req.body.name || '';
		user.profile.gender = req.body.gender || '';
		user.profile.location = req.body.location || '';
		user.profile.website = req.body.website || '';

		user.save(function (err) {
			if (err) return next(err);
			req.flash('success', { msg: 'Profile information updated.' });
			res.redirect('/account');
		});
	});
};

/**
 * POST /account/password
 * Update current password.
 * @param {string} password
 */

exports.postUpdatePassword = function (req, res, next) {
	req.assert('password', 'Password must be at least 4 characters long').len(4);
	req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/account');
	}

	User.findById(req.user.id, function (err, user) {
		if (err) return next(err);

		user.password = req.body.password;

		user.save(function (err) {
			if (err) return next(err);
			req.flash('success', { msg: 'Password has been changed.' });
			res.redirect('/account');
		});
	});
};

/**
 * POST /account/delete
 * Delete user account.
 * @param {string} id
 */

exports.postDeleteAccount = function (req, res, next) {
	User.remove({ _id: req.user.id }, function (err) {
		if (err) return next(err);
		req.logout();
		res.redirect('/');
	});
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth2 provider from the current user.
 * @param {string} provider
 * @param {string} id
 */

exports.getOauthUnlink = function (req, res, next) {
	var provider = req.params.provider;
	User.findById(req.user.id, function (err, user) {
		if (err) return next(err);

		user[provider] = undefined;
		user.tokens = _.reject(user.tokens, function (token) { return token.kind === provider; });

		user.save(function (err) {
			if (err) return next(err);
			req.flash('info', { msg: provider + ' account has been unlinked.' });
			res.redirect('/account');
		});
	});
};

/**
 * GET /logout
 * Log out.
 */

exports.logout = function (req, res) {
	req.logout();
	res.redirect('/');
};
