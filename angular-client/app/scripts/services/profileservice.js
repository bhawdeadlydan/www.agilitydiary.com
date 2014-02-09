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
				lastChecked = new Date(2000, 1, 1);




			module.get = function (successCallback, errorCallback) {
				var url = '/agility-diary/userData',
					checkAgain = true,
					millisecondsSinceChecked = new Date() - lastChecked;

				if (millisecondsSinceChecked > 10 * 1000) {
					checkAgain = true;
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




			return module;
		}
	]);
