'use strict';

angular.module('browserAppApp')
	.service('ShowService', [
		'$resource',
		'$http',
		'Authenticationservice',
		'Settings',

		function ShowService($resource, $http, Authenticationservice, Settings) {
			var module = {};
			var caches = {
				upcomingShows: {}
			};

			module.upcomingShows = function(initCallback, successCallback, errorCallback) {
				var url = '/map/shows/upcoming';

				console.log(caches.upcomingShows);
				initCallback(caches.upcomingShows);

				$http.get(url).success(function(data) {
					caches.upcomingShows = data;
					successCallback(data);
				}).error(function(err) {
					errorCallback(err);
				});
			};




			module.details = function(opts, successCallback, errorCallback) {
				var url = '/agility-diary/show/details?id=' + opts.id;

				$http.get(url).success(function(data) {
					successCallback(data);
				}).error(function(err) {
					errorCallback(err);
				});
			};

			return module;

		}
	]);
