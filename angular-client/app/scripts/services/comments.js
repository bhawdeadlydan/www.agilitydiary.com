'use strict';

angular.module('browserAppApp')
	.service('CommentsService', [
		'$resource',
		'$http',
		'Settings',

		function CommentsService($resource, $http, Settings) {
			var module = {},
				profile = {},
				lastChecked = new Date(2000, 1, 1);

			module.getComments = function (id) {
				var url = '/agility-diary/comments/get?itemId=' + id;

				return $http.get(url);
			};

			module.addComments = function (data) {
				var url = '/agility-diary/comments/add';

				return $http.post(url, {
					itemId: data.id,
					message: data.message
				});
			};

			return module;
		}
	]);
