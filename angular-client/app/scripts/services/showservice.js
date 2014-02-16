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


			module.upcomingShows = function (initCallback, successCallback, errorCallback) {
				var url = '/map/shows/upcoming';

				console.log(caches.upcomingShows);
				initCallback(caches.upcomingShows);

				$http.get(url).success(function (data) {
					caches.upcomingShows = data;
					successCallback(data);
				}).error(function (err) {
					errorCallback(err);
				});
			};




			module.categories = function (successCallback, errorCallback) {
				var url = '/agility-diary/show/categories';

				$http.get(url).success(function (data) {
					successCallback(data);
				}).error(function (err) {
					errorCallback(err);
				});
			};




			module.details = function (opts, successCallback, errorCallback) {
				var url = '/agility-diary/show/details?id=' + opts.id;

				$http.get(url).success(function (data) {
					successCallback(data);
				}).error(function (err) {
					errorCallback(err);
				});
			};




			module.enterShow = function (opts, successCallback, errorCallback) {
				var url = '/agility-diary/enterShow?id=' + opts.id;
				return $http.get(url).success(successCallback).error(errorCallback);
			};




			module.resignShow = function(id, successCallback, errorCallback) {
				var url = '/agility-diary/resignShow?id=' + id;
				return $http.get(url).success(successCallback).error(errorCallback);
			};




			module.userData = function(opts, successCallback, errorCallback) {
				var session_data,
					url;

				session_data = Authenticationservice.load();
				url = '/agility-diary/userData';
				return $http.get(url).success(successCallback).error(errorCallback);
			};




			return module;
		}
	]);
