var app = angular.module('browserAppApp');

app.controller('ShowsController', [
	'$scope', 'Mapdata', 'ShowService', 'PersistService', '$location', '$route', '$routeParams',
	function ($scope, Mapdata, ShowService, PersistService, $location, $route, $routeParams) {
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
			});

			$scope.resignShow = function (event) {
				ShowService.resignShow(event._id, function () {

					ShowService.userData({}, function (data) {
						$scope.enteredShows = data.EnteredShows;
					});

				}, function () {

				});
			};
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

				$scope.markers.Location = newMarker;
			}, function (err) {
				// failed
			});
		}




		/**
		 * Click Handlers
		 */

		$scope.enterShow = function (event) {
			ShowService.enterShow({
				id: event._id
			}, function () {
				$location.path('#/shows/entered');
			}, function () {

			});
		};




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
		 * Main function
		 */

		function main() {
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
				details($routeParams.id);
				break;

			case 'entered':
				fetchCategories();
				fetchEnteredShows();
				break;

			case 'upcoming':
			case '':
				fetchCategories();
				fetchUpcomingShows();
			}
		}




		main();
	}
]);
