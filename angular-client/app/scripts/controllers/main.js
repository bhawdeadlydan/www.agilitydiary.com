"use strict";

var app = angular.module('browserAppApp');

app.controller('MainController', [
	'$scope', '$rootScope', 'Mapdata', 'ShowService', 'ProfileService', 'SearchService', '$location', '$timeout', '$route', '$routeParams',
	function ($scope, $rootScope, Mapdata, ShowService, ProfileService, SearchService, $location, $timeout, $route, $routeParams) {




		/**
		 * Module level variables
		 */
		$rootScope.homeSectionClass = 'active';
		$rootScope.showsSectionClass = '';
		$rootScope.mapSectionClass = '';
		$rootScope.venuesSectionClass = '';

		/**
		 * Post something
		 */
		$scope.post = {};
		$scope.post.message = '';
		$scope.post.click = postSomething;
		$scope.setThemeMainColour = setThemeMainColour;





		function setThemeMainColour(colour) {
			ProfileService.setThemeMainColour({
				colour: colour
			}).success($scope.fetchProfile)
			.error(function () {

			});
		}




		function fetchPublicProfile() {
			ProfileService.getPublic($scope.publicId, function (data) {
				$scope.publicProfile = data;
			}, function (error) {

			});
		}




		/**
		 * Post Something Click Handler
		 */
		function postSomething() {

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

					break;

				case 'public':
					$scope.publicId = $routeParams.id;
					$scope.publicProfile = {};

					fetchPublicProfile();
					break;
				}
			}

			try {
				var profileDropzone = new Dropzone('div#uploadPhoto', { url: '/agility-diary/user/upload-photo' });

				profileDropzone.on('complete', function file() {
					profileDropzone.removeFile(file);
					profileDropzone.removeAllFiles();
					$scope.fetchProfile();
				});
			} catch (e) {

			}


			try {
				var profileDropzone = new Dropzone('div#uploadProfileImage', { url: '/agility-diary/user/uploadFile' });

				profileDropzone.on('complete', function file() {
					profileDropzone.removeFile(file);
					profileDropzone.removeAllFiles();
					$scope.fetchProfile();
				});
			} catch (e) {

			}

			try {
				var profileDropzone = new Dropzone('div#uploadProfileBackgroundImage', { url: '/agility-diary/user/uploadBackgroundFile' });

				profileDropzone.on('complete', function file() {
					profileDropzone.removeFile(file);
					profileDropzone.removeAllFiles();
					$scope.fetchProfile();
				});
			} catch (e) {

			}
		}



		/**
		 * Start here
		 */

		main();
	}
]);
