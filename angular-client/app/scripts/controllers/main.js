var app = angular.module('browserAppApp');

app.controller('MainController', [
	'$scope', '$rootScope', 'Mapdata', 'ShowService', 'ProfileService', 'SearchService', '$location', '$timeout', '$route', '$routeParams',
	function ($scope, $rootScope, Mapdata, ShowService, ProfileService, SearchService, $location, $timeout, $route, $routeParams) {
		"use strict";




		/**
		 * Module level variables
		 */

		$scope.profile = {};
		$rootScope.homeSectionClass = 'active';
		$rootScope.showsSectionClass = '';
		$rootScope.mapSectionClass = '';

		/**
		 * Post something
		 */
		$scope.post = {};
		$scope.post.message = '';
		$scope.post.click = postSomething;

		$scope.quicksearch = {};
		$scope.quicksearch.results = [];
		$scope.quicksearch.query = '';
		$scope.quicksearch.change = quickSearch;
		$scope.quicksearch.timeout = null;
		$scope.quicksearch.searching = false;


		function quicksearchAddPaths(data) {
			_.each(data.Results, function (item) {
				switch (item.Type) {
				case 'Show':
					item.Path = '#/shows/details/' + item.Id;
					break;

				case 'User':
					item.Path = '#/users/details/' + item.Id;
					break;

				case 'Venue':
					item.Path = '#/users/details/' + item.Id;
					break;

				case 'Dog':
					item.Path = '#/dogs/' + item.Id;
					break;
				}
			});

			return data;
		}



		function quickSearch() {
			if ($scope.quicksearch.timeout !== null) {
				$timeout.cancel($scope.quicksearch.timeout);
			}

			$scope.quicksearch.query = $scope.quicksearch.query.trim();

			if ($scope.quicksearch.query === '') {
				$scope.quicksearch.results = [];
			} else {
				$scope.quicksearch.timeout = $timeout(function () {
					$scope.quicksearch.searching = true;

					SearchService.quickSearch($scope.quicksearch.query, function (data) {
						$scope.quicksearch.searching = false;

						data = quicksearchAddPaths(data);
						$scope.quicksearch.results = data;
					}, function (error) {
						$scope.quicksearch.searching = false;
					});
				}, 1000);
			}
		}



		/**
		 * Get the users profile
		 */

		function fetchProfile() {
			ProfileService.invalidateCache();

			ProfileService.get(function (data) {
				$scope.profile = data;
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
					fetchProfile();
				}
			}

			var profileDropzone = new Dropzone('div#uploadProfileImage', { url: '/agility-diary/user/uploadFile' });

			profileDropzone.on('complete', function file() {
				profileDropzone.removeFile(file);
				profileDropzone.removeAllFiles();
				fetchProfile();
			});



			var profileDropzone = new Dropzone('div#uploadProfileBackgroundImage', { url: '/agility-diary/user/uploadBackgroundFile' });

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
