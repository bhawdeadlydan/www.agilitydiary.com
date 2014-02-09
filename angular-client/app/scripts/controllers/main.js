var app = angular.module('browserAppApp');

app.controller('MainController', [
	'$scope', 'Mapdata', 'ShowService', 'ProfileService', '$location', '$route', '$routeParams',
	function ($scope, Mapdata, ShowService, ProfileService, $location, $route, $routeParams) {
		"use strict";




		$scope.profile = {};




		function fetchProfile() {
			ProfileService.get(function (data) {
				$scope.profile = data;
			}, function (error) {

			});
		}




		/**
		 * Main function
		 */

		function main() {
			var action = '';

			if ((typeof $route.current.$$route.action !== 'undefined') && ($route.current.$$route.action !== null)) {
				action = $route.current.$$route.action;
			}

			console.log(action);
			console.log($location.href);
			console.log($routeParams.id);
			console.log('Shows Controller');

			switch (action) {
			case '':
				fetchProfile();
			}
		}




		main();

	}
]);