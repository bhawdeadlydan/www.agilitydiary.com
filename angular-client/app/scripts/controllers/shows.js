var app = angular.module('browserAppApp');

app.controller('ShowsController', [
	'$scope',
	'Mapdata',
	'ShowService',
	'PersistService',
	'ProfileService',
	'$location',
	'$route',
	'$routeParams',
	function ($scope, Mapdata, ShowService, PersistService, ProfileService, $location, $route, $routeParams) {
		"use strict";

		/**
		 * Setup scope
		 */

		$scope.upcomingShows = {};
		$scope.selectedCategories = PersistService('shows.selectedCategories', []);
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


		/**
		 * click handlers
		 */

		$scope.resignShow = resignShow;
		$scope.enterShow = enterShow;
		$scope.controls.saveRecord = saveRecord;



		/**
		 * Scope watchers
		 */

		$scope.$watch('profile', profileHasChanged);




		function profileHasChanged() {
			checkAttending();
		}




		function errorHandler(error) {

		}




		function updateShowData(data) {
			$scope.upcomingShows = data;
		}




		/**
		 * Upcoming Shows
		 */

		function fetchPreviousShows() {
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
			ShowService.upcomingShows(function (data) {
				$scope.upcomingShows = data;
			}, function (data) {
				$scope.upcomingShows = data;
			}, function (err) {
				// failed
			});
		}




		/**
		 * Entered Shows
		 */

		function fetchEnteredShows() {
			ShowService.userData({}, function (data) {
				$scope.enteredShows = data.EnteredShows;

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

			console.log('Checking attending');

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

				$scope.markers.Location = newMarker;
			}, function (err) {
				// failed
			});
		}




		function saveRecordError(response) {
			console.log(response);
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
				fetchProfile();
			}, function () {

			});
		}




		function resignShow(event) {
			ShowService.resignShow($scope.id, function () {

				ShowService.userData({}, function (data) {
					fetchProfile();
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
			fetchProfile();

			var action = '';

			if (typeof $route.current.$$route.action !== 'undefined') {
				action = $route.current.$$route.action;
			}

			console.log(action);
			console.log($location.href);
			console.log($routeParams.id);
			console.log('Shows Controller');

			switch (action) {
			case 'details':
				$scope.id = $routeParams.id;
				details($scope.id);
				break;

			case 'entered':
				fetchCategories();
				fetchEnteredShows();
				break;

			case 'previous':
				fetchPreviousShows();
				break;

			case 'upcoming':
			case '':
				fetchCategories();
				fetchUpcomingShows();
			}
		}




		function controllerDestroy() {
			console.log('Controller is being destroyed');
		}



		$scope.$on('$destroy', controllerDestroy);




		main();
	}
]);
