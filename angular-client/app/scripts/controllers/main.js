"use strict";

var app = angular.module('browserAppApp');

app.controller('MainController', [
	'$scope',
	'$rootScope',
	'Mapdata',
	'ShowService',
	'ProfileService',
	'SearchService',
	'$location',
	'$timeout',
	'$route',
	'$routeParams',
	'html',
	function ($scope, $rootScope, Mapdata, ShowService, ProfileService, SearchService, $location, $timeout, $route, $routeParams, html) {




		/**
		 * Module level variables
		 */
		$rootScope.homeSectionClass = 'active';
		$rootScope.showsSectionClass = '';
		$rootScope.mapSectionClass = '';
		$rootScope.venuesSectionClass = '';
		$rootScope.peopleSectionClass = '';
		$rootScope.clubsSectionClass = '';
		$rootScope.accountSectionClass = '';

		/**
		 * Post something
		 */
		$scope.post = {};
		$scope.post.message = '';
		$scope.post.tags = '';
		$scope.post.click = postSomething;
		$scope.removePendingPhotoClick = removePendingPhotoClick;
		$scope.setThemeMainColour = setThemeMainColour;

		$scope.updateUser = updateUser;

		$scope.controls = {};
		$scope.controls.name = '';
		$scope.controls.email = '';
		$scope.controls.bio = '';
		$scope.controls.location = '';

		$scope.$watch('profile', profileChanged);





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

				$rootScope.homeSectionClass = '';
				$rootScope.showsSectionClass = '';
				$rootScope.mapSectionClass = '';
				$rootScope.venuesSectionClass = '';
				$rootScope.peopleSectionClass = 'active';

			}, function (error) {

			});
		}




		function removePendingPhotoClick(id) {
			ProfileService.removePendingPhoto(id, function (data) {
				$scope.fetchProfile();
			}, function (error) {

			});
		}




		/**
		 * Post Something Click Handler
		 */
		function postSomething() {
			ProfileService.addJournalEntry($scope.post.message, $scope.post.tags, function (data) {
				$scope.fetchProfile();
				$scope.post.message = '';
				$scope.post.tags = '';
			}, function (error) {

			});
		}




		function updateUser() {
			ProfileService.updateUser($scope.controls.name, $scope.controls.email, $scope.controls.bio, $scope.controls.location, function (data) {
				$scope.fetchProfile();
			}, function (error) {
				$scope.fetchProfile();
			});

		}




		function profileChanged() {
			if (angular.isDefined($scope.profile) && ($scope.profile !== null)) {
				$scope.controls.name = $scope.profile.User.profile.name;
				$scope.controls.email = $scope.profile.User.email;
				$scope.controls.bio = $scope.profile.User.profile.bio;
				$scope.controls.location = $scope.profile.User.profile.location;
			}
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

				case 'linked-accounts':
				case 'security':
				case 'account':
					$rootScope.homeSectionClass = '';
					$rootScope.accountSectionClass = 'active';


					break;

				case 'public':
					$scope.publicId = $routeParams.id;
					$scope.publicProfile = {};

					fetchPublicProfile();
					break;
				}
			}

			if (document.querySelector('div#uploadPhoto') !== null) {
				var profileDropzone = new Dropzone('div#uploadPhoto', {
					url: '/agility-diary/user/upload-photo',
					previewTemplate: html.dropZone.previewTemplate
				});

				profileDropzone.on('complete', function file() {
					profileDropzone.removeFile(file);
					profileDropzone.removeAllFiles();
					$scope.fetchProfile();
				});
			}

			if (document.querySelector('div#uploadProfileImage') !== null) {
				var profileDropzone = new Dropzone('div#uploadProfileImage', {
					url: '/agility-diary/user/uploadFile',
					previewTemplate: html.dropZone.previewTemplate
				});

				profileDropzone.on('complete', function file() {
					profileDropzone.removeFile(file);
					profileDropzone.removeAllFiles();
					$scope.fetchProfile();
				});
			}

			if (document.querySelector('div#uploadProfileBackgroundImage') !== null) {
				var profileDropzone = new Dropzone('div#uploadProfileBackgroundImage', {
					url: '/agility-diary/user/uploadBackgroundFile',
					previewTemplate: html.dropZone.previewTemplate
				});

				profileDropzone.on('complete', function file() {
					profileDropzone.removeFile(file);
					profileDropzone.removeAllFiles();
					$scope.fetchProfile();
				});
			}
		}



		/**
		 * Start here
		 */

		main();
	}
]);
