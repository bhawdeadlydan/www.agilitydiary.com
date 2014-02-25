var app = angular.module('browserAppApp');

app.controller('ShowsController', [
	'$scope',
	'$rootScope',
	'Mapdata',
	'ShowService',
	'PersistService',
	'ProfileService',
	'$location',
	'$route',
	'$routeParams',
	'CommentsService',
	function ($scope, $rootScope, Mapdata, ShowService, PersistService, ProfileService, $location, $route, $routeParams, CommentsService) {
		"use strict";

		/**
		 * Setup scope
		 */
		$rootScope.homeSectionClass = '';
		$rootScope.showsSectionClass = 'active';
		$rootScope.mapSectionClass = '';

		$scope.upcomingShows = {};
		$scope.selectedCategories = []; //PersistService('shows.selectedCategories', []);
		$scope.enteredShows = {};
		$scope.categories = {};
		$scope.details = {};
		$scope.center = {};
		$scope.bounds = {};
		$scope.searchText = '';
		$scope.markers = {};
		$scope.attending = false;
		$scope.id = null;
		$scope.profile = {};
		$scope.controls = {};
		$scope.comments = {};


		/**
		 * click handlers
		 */

		$scope.resignShow = resignShow;
		$scope.enterShow = enterShow;
		$scope.controls.saveRecord = saveRecord;
		$scope.filterResultsForShow = filterResultsForShow;
		$scope.hasUserEnteredShow = hasUserEnteredShow;


		$scope.filteredShows = [];




		function filterShows() {
			var results = [];

			_.each($scope.enteredShows, function (item) {
				if ($scope.showHasSelectedCategory(item)) {
					if ($scope.showIsInSearch(item)) {
						results.push(item);
					}
				}
			});

			$scope.filteredShows = results;
		}




		function hasUserEnteredShow(show) {
			var entered = false;

			_.each($scope.profile.EnteredShows, function (iterShow) {
				if (show._id == iterShow._id) {
					entered = true;
				}
			});

			return entered;
		}



		/**
		 * Scope watchers
		 */

		$scope.$watch('profile', profileHasChanged);




		function filterResultsForShow(list) {
			var results = [];

			_.each(list, function (item) {
				if (item.Show === $scope.id) {
					results.push(item);
				}
			});

			return results;
		}




		function profileHasChanged() {
			checkAttending();
		}




		function errorHandler(error) {

		}




		function updateShowData(data) {
			$scope.stopSpinner();

			$scope.enteredShows = data;
			filterShows();
		}




		/**
		 * Upcoming Shows
		 */

		function fetchPreviousShows() {
			$scope.startSpinner();

			ShowService.previousShows(updateShowData, updateShowData, errorHandler);
		}




		/**
		 * Todays Shows
		 */

		function fetchTodaysShows() {
			ShowService.todaysShows(updateShowData, updateShowData, errorHandler);
		}




		/**
		 * Upcoming Shows
		 */

		function fetchUpcomingShows() {
			$scope.startSpinner();

			ShowService.upcomingShows(function (data) {
				$scope.enteredShows = data;
			}, function (data) {
				$scope.enteredShows = data;
				$scope.stopSpinner();
				filterShows();
			}, function (err) {
				$scope.stopSpinner();
				// failed
			});
		}




		/**
		 * Entered Shows
		 */

		function fetchEnteredShows() {
			ShowService.enteredShows({}, function (data) {
				$scope.enteredShows = data;

				_.each($scope.enteredShows, function (showIterator) {
					showIterator.enterResults = checkIsTodayOrHasHappened(new Date(showIterator.ParsedDate));
				});
			});
		}




		function fetchCategories() {
			ShowService.categories(function (data) {
				$scope.categories = data;
				_.each(data, function (item) {
					$scope.selectedCategories.push(item);
				});
			}, function (error) {

			});
		}




		function checkAttending() {
			$scope.attending = false;

			_.each($scope.profile.EnteredShows, function (show) {
				if (angular.equals(show._id, $scope.id)) {
					$scope.attending = true;
				}
			});
		}




		function checkIsTodayOrHasHappened(testDate) {
			var today,
				midnightTonight,
				parseDate;

			today = new Date();
			midnightTonight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

			return (testDate.getTime() <= midnightTonight.getTime());
		}




		function checkClosed() {
			var today,
				parseDate,
				midnightThisMorning;

			$scope.entriesOpen = true;

			today = new Date();
			midnightThisMorning = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

			var closeDate = new Date($scope.show.ParsedDate);

			$scope.entriesOpen = closeDate < midnightThisMorning;
		}




		/**
		 * Show Details
		 */

		function details(id) {
			ShowService.details({
				id: id
			}, function (data) {
				$scope.show = data;
				$scope.center.lat = data.Location.Latitude;
				$scope.center.lng = data.Location.Longitude;
				$scope.center.zoom = 15;

				$scope.enterResults = checkIsTodayOrHasHappened(new Date($scope.show.ParsedDate));

				var newMarker = {
					_id: data._id,
					lat: data.Location.Latitude,
					lng: data.Location.Longitude,
					message: null,
					popupText: data.Name,
					focus: true,
					draggable: false
					//html: '<span><a href="#/shows/details/' + item._id + '">' + item.name + '</a></span>'
				};

				checkAttending();
				checkClosed();

				$scope.markers.Location = newMarker;
			}, function (err) {
				// failed
			});
		}




		function saveRecordError(response) {
		}




		function saveRecord() {
			if (!$scope.form.$valid) {
				return;
			}

			var data = {
				dogId: $scope.controls.dogId,
				showId: $scope.id,
				class: $scope.controls.class,
				time: $scope.controls.time,
				faults: $scope.controls.faults,
				place: $scope.controls.place,
				judge: $scope.controls.judge,
				points: $scope.controls.points
			};

			ProfileService.addResult(data)
				.success(fetchProfile)
				.error(saveRecordError);
		}




		/**
		 * Click Handlers
		 */

		function enterShow(event) {
			ShowService.enterShow({
				id: $scope.id
			}, function (data) {
				//$scope.profile = data;
				//checkAttending();
				//$location.path('#/shows/entered');
				//details($scope.id);
				fetchProfile(true);
				details($scope.id);

			}, function () {

			});
		}




		function resignShow(event) {
			ShowService.resignShow($scope.id, function () {

				ShowService.userData({}, function (data) {
					fetchProfile(true);
					details($scope.id);
					//$scope.profile = data;
					//$scope.enteredShows = data.EnteredShows;
				});

				//checkAttending();

			}, function () {

			});
		}




		/**
		 * @event
		 * Category is being toggled
		 */

		$scope.categoryClick = function (category) {
			if ($scope.selectedCategories.indexOf(category) === -1) {
				$scope.selectedCategories.push(category);
			} else {
				$scope.selectedCategories.splice($scope.selectedCategories.indexOf(category), 1);
			}

			filterShows();
		};




		/**
		 * Return if the category is selected
		 */

		$scope.isCategorySelected = function (category) {
			return $scope.selectedCategories.indexOf(category) !== -1;
		};




		/**
		 * Check if the current Show model is in the selected categories list
		 */

		$scope.showHasSelectedCategory = function (item) {
			return $scope.selectedCategories.indexOf(item.Meta.ShowType) !== -1;
		};




		$scope.showIsInSearch = function (item) {
			if ($scope.searchText === '') {
				return true;
			}

			return item.Name.toLowerCase().indexOf($scope.searchText.toLowerCase()) !== -1;
		};




		$scope.searchClearClick = function () {
			$scope.searchText = '';
		};




		/**
		 * Get the users profile
		 */

		function fetchProfile(invalidate_cache) {
			if (angular.isDefined(invalidate_cache) && invalidate_cache === true) {
				ProfileService.invalidateCache();
			}

			ProfileService.get(function (data) {
				$scope.profile = data;
			}, function (error) {

			});
		}




		/**
		 * Main function
		 */

		function main() {
			fetchProfile();

			var action = '';

			if (typeof $route.current.$$route.action !== 'undefined') {
				action = $route.current.$$route.action;
			}

			switch (action) {
			case 'details':
				$scope.id = $routeParams.id;
				details($scope.id);

				if (document.querySelector('div#uploadProfileImage') !== null) {
					var profileDropzone = new Dropzone('div#uploadProfileImage', {
						url: '/agility-diary/show/user-upload-photo?id=' + $scope.id
					});

					profileDropzone.on('complete', function file() {
						profileDropzone.removeFile(file);
						profileDropzone.removeAllFiles();
						details($scope.id);
					});
				}
				break;

			case 'entered':
				fetchCategories();
				fetchEnteredShows();
				break;

			case 'previous':
				fetchCategories();
				fetchPreviousShows();
				break;

			case 'upcoming':
			case '':
				fetchCategories();
				fetchUpcomingShows();
			}
		}




		function controllerDestroy() {
		}



		$scope.$on('$destroy', controllerDestroy);




		main();
	}
]);
