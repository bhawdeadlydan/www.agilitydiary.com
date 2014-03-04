'use strict';

angular.module('browserAppApp')
	.service('ProfileService', [
		'$resource',
		'$http',
		'Authenticationservice',
		'Settings',

		function ProfileService($resource, $http, Authenticationservice, Settings) {
			var module = {},
				profile = {},
				lastChecked = new Date(2000, 1, 1).getTime();




			module.get = function (successCallback, errorCallback) {
				var url = '/agility-diary/userData',
					checkAgain = false,
					millisecondsSinceChecked = new Date().getTime() - lastChecked;

				if (millisecondsSinceChecked > 10 * 1000) {
					checkAgain = true;
					lastChecked = new Date().getTime();
				}

				if (checkAgain === true) {
					$http.get(url).success(function (data) {
						profile = data;
						successCallback(data);
					}).error(function (err) {
						errorCallback(err);
					});
				} else {
					successCallback(profile);
				}
			};




			module.getPublic = function (id, successCallback, errorCallback) {
				var url = '/agility-diary/user/public?id=' + id;

				$http.get(url).success(function (data) {
					successCallback(data);
				}).error(function (err) {
					errorCallback(err);
				});
			};




			module.removePendingPhoto = function (id, successCallback, errorCallback) {
				var url = '/agility-diary/user/remove-pending-photo';

				$http.post(url, {
					id: id
				}).success(function (data) {
					successCallback(data);
				}).error(function (err) {
					errorCallback(err);
				});
			};




			module.updateUser = function (name, email, bio, location, successCallback, errorCallback) {
				var url = '/agility-diary/user/update';

				$http.post(url, {
					name: name,
					email: email,
					bio: bio,
					location: location
				}).success(function (data) {
					successCallback(data);
				}).error(function (err) {
					errorCallback(err);
				});
			};




			module.addJournalEntry = function (message, tags, successCallback, errorCallback) {
				var url = '/agility-diary/user/add-journal-entry';

				$http.post(url, {
					message: message,
					tags: tags
				}).success(function (data) {
					successCallback(data);
				}).error(function (err) {
					errorCallback(err);
				});
			};





			module.invalidateCache = function () {
				lastChecked = new Date(2000, 1, 1).getTime();
			};




			module.addDog = function (postData, successCallback, errorCallback) {
				var url = '/agility-diary/user/add-dog';

				$http.post(url, postData).success(function (data) {
					profile = data;
					successCallback(data);
				}).error(function (err) {
					errorCallback(err);
				});
			};




			module.setThemeMainColour = function (postData, successCallback, errorCallback) {
				var url = '/agility-diary/user/setThemeMainColour';

				return $http.post(url, postData);
			};




			module.addFriend = function (friendId, successCallback, errorCallback) {
				var url = '/agility-diary/user/add-friend';

				return $http.post(url, {
					userId: friendId
				});
			};




			module.removeFriend = function (friendId, successCallback, errorCallback) {
				var url = '/agility-diary/user/remove-friend';

				return $http.post(url, {
					userId: friendId
				});
			};




			module.updateDog = function (postData, successCallback, errorCallback) {
				var url = '/agility-diary/user/update-dog';

				$http.post(url, postData).success(function (data) {
					profile = data;
					successCallback(data);
				}).error(function (err) {
					errorCallback(err);
				});
			};




			module.addResult = function (data) {
				var url = '/agility-diary/user/add-result';

				return $http.post(url, data);
			};




			module.deleteDog = function (postData, successCallback, errorCallback) {
				var url = '/agility-diary/user/delete-dog';

				$http.post(url, postData).success(function (data) {
					profile = data;
					successCallback(data);
				}).error(function (err) {
					errorCallback(err);
				});
			};




			return module;
		}
	]);
