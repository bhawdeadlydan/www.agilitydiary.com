'use strict';

angular.module('browserAppApp')
	.service('PersistService', [
		'$resource',
		'$http',
		'Authenticationservice',
		'Settings',

		function PersistService($resource, $http, Authenticationservice, Settings) {

			var persist = {};

			return function (namespace, defaultValue) {
				console.log(namespace);
				debugger

				if (typeof persist[namespace] === 'undefined') {
					persist[namespace] = defaultValue;
				}

				return persist[namespace];
			};

		}
	]);