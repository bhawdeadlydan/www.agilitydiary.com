'use strict';

var app = angular.module('browserAppApp');

app.controller('ShowsController', [
	'$scope', 'Mapdata', 'ShowService', '$location', '$route', '$routeParams',
	function ($scope, Mapdata, ShowService, $location, $route, $routeParams) {




		/**
		 * Upcoming Shows
		 */

		function fetchUpcomingShows() {
			$scope.upcomingShows = {};

			ShowService.upcomingShows(function(data) {
				$scope.upcomingShows = data;
			}, function(data) {
				$scope.upcomingShows = data;
			}, function(err) {
				// failed
			});
		}




		/**
		 * Entered Shows
		 */

		function fetchEnteredShows() {
			$scope.enteredShows = {};

			ShowService.userData({}, function(data) {
				$scope.enteredShows = data.EnteredShows;
			});

			$scope.resignShow = function (event) {
				ShowService.resignShow(event._id, function () {

					ShowService.userData({}, function(data) {
						$scope.enteredShows = data.EnteredShows;
					});

				}, function() {

				});
			};
		}




		/**
		 * Show Details
		 */

		function details(id) {
			$scope.details = {};

			ShowService.details({
				id: id
			}, function(data) {
				$scope.show = data;
			}, function(err) {
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
			}, function() {

			});
		};




		/**
		 * Main function
		 */

		function main() {
			var action = '';

			if(typeof $route.current.$$route.action !== 'undefined') {
				action = $route.current.$$route.action;
			}

			console.log(action);
			console.log($location.href);
			console.log($routeParams.id);
			console.log('Shows Controller');

			switch(action) {
			case 'details':
				details($routeParams.id);
				break;

			case 'entered':
				fetchEnteredShows();
				break;

			case 'upcoming':
			case '':
				fetchUpcomingShows();
			}
		}




		main();
	}
]);
