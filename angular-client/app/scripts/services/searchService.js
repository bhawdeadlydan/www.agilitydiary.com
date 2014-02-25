'use strict';

angular.module('browserAppApp')
	.service('SearchService', [
		'$resource',
		'$http',
		'Authenticationservice',
		'Settings',

		function SearchService($resource, $http, Authenticationservice, Settings) {
			var module = {};




			module.quickSearch = function (query, successCallback, errorCallback) {
				var url = '/agility-diary/search/quicksearch?q=' + escape(query);

				$http.get(url).success(function (data) {
					successCallback(data);
				}).error(function (err) {
					errorCallback(err);
				});
			};




			return module;
		}
	]);
