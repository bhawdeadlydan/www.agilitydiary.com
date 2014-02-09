'use strict';

var module = angular.module('browserAppApp');

module.controller('ShowsController', [
	'$scope', 'Mapdata', 'ShowService', '$location', '$route', '$routeParams',
	function ($scope, Mapdata, ShowService, $location, $route, $routeParams) {


		/**
		 * @defaults
		 */
		$scope.upcomingShows = {};




		/**
		 * @description Fetch upcoming shows
		 */
		function fetchUpcomingShows() {
			ShowService.upcomingShows(function(data) {
				$scope.upcomingShows = data;
			}, function(data) {
				$scope.upcomingShows = data;
			}, function(err) {
				// failed
			});
		}




		function fetchEnteredShows() {
			Mapdata.userData({}, function(data) {
		  		$scope.events = data.EnteredShows;
		  	});

			$scope.resignShow = function (event) {

		  		Mapdata.resignShow(event._id, function () {

		  			Mapdata.userData({}, function(data) {
				  		$scope.events = data.EnteredShows;
				  	});

		  		}, function() {

		  		});
		  	};
		}




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
			Mapdata.enterShow(event._id, function () {
				$location.path('/entered');
			}, function() {

			});
		};




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
