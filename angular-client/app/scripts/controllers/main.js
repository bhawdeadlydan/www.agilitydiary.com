var app = angular.module('browserAppApp');

app.controller('MainController', [
	'$scope', 'Mapdata', 'ShowService', 'ProfileService', '$location', '$route', '$routeParams',
	function ($scope, Mapdata, ShowService, ProfileService, $location, $route, $routeParams) {
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
				$scope.profile = data;
			}, function (error) {

			});
		}




		/**
		 * Main function
		 */

		function main() {
			var action = '';

			console.log('This is a feature');

			if (angular.isDefined($route.current)) {
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

			var profileDropzone = new Dropzone('div#uploadProfileImage', { url: '/agility-diary/user/uploadFile' });

			profileDropzone.on('complete', function file() {
				profileDropzone.removeFile(file);
				profileDropzone.removeAllFiles();
				fetchProfile();
			});
		}



		/**
		 * Start here
		 */

		main();
	}
]);
