var app = angular.module('browserAppApp');

app.controller('BaseController', [
	'$scope', 'ProfileService', '$location', '$route', '$routeParams',
	function BaseController($scope, ProfileService, $location, $route, $routeParams) {
		"use strict";


		/**
		 * Module level variables
		 */

		$scope.profile = {};


		/**
		 * Get the users profile
		 */

		function fetchProfile() {
			ProfileService.get(function (data) {
				console.log('Profile loaded');
				$scope.profile = data;
			}, function (error) {

			});
		}

		console.log('BaseController');
		fetchProfile();
	}
]);
