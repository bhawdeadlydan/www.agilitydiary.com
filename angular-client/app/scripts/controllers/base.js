var app = angular.module('browserAppApp');

app.controller('BaseController', [
	'$scope', 'ProfileService', '$location', '$route', '$rootScope', '$routeParams',
	function BaseController($scope, ProfileService, $location, $route, $rootScope, $routeParams) {
		"use strict";


		/**
		 * Module level variables
		 */

		$scope.profile = {};

		$rootScope.homeSectionClass = '';
		$rootScope.showsSectionClass = '';
		$rootScope.mapSectionClass = '';


		/**
		 * Get the users profile
		 */

		function fetchProfile() {
			ProfileService.get(function (data) {
				$scope.profile = data;
			}, function (error) {

			});
		}

		fetchProfile();
	}
]);
