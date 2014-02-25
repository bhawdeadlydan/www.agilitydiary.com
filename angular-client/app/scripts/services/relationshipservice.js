'use strict';

angular.module('browserAppApp')
	.service('RelationshipService', [
		'$resource',
		'$http',
		'Authenticationservice',
		'Settings',

		function RelationshipService($resource, $http, Authenticationservice, Settings) {
			var module = {},
				profile = {},
				lastChecked = new Date(2000, 1, 1).getTime();




			/**
			 * List Users
			 */
			module.listUsers = function (successCallback, errorCallback) {
				var url = '/agility-diary/user/listUsers';

				$http.get(url).success(function (data) {
					successCallback(data);
				}).error(function (err) {
					errorCallback(err);
				});
			};



			/**
			 * @module RelationshipService
			 */
			return module;
		}
	]);
