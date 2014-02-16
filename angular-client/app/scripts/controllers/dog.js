var app = angular.module('browserAppApp');

app.controller('DogController', [
	'$scope', 'Mapdata', 'ShowService', 'ProfileService', '$location', '$route', '$routeParams',
	function DogController($scope, Mapdata, ShowService, ProfileService, $location, $route, $routeParams) {
		"use strict";



		/**
		 * Module level variables
		 */



		$scope.dog = {
			name: '',
			sex: ''
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




		$scope.deleteDog = function (dog) {
			ProfileService.deleteDog({
				_id: dog._id
			}, function (data) {
				$scope.profile = data;
			}, function (error) {
				console.log(error);
			});
		};




		$scope.saveDog = function () {
			ProfileService.addDog({
				name: $scope.dog.name,
				sex: $scope.dog.sex
			}, function (data) {
				$location.path('/dogs');
				$scope.profile = data;
			}, function (error) {
				console.log(error);
			});
		};





		/**
		 * Main function
		 */

		function main() {
			var action = '';

			fetchProfile();

			if (typeof $route.current.$$route.action !== 'undefined') {
				action = $route.current.$$route.action;
			}

			console.log(action);
			console.log($location.href);
			console.log($routeParams.id);
			console.log('Dog Controller');

			switch (action) {
			case 'details':
				console.log('Details');

				$scope.$watch('profile', function () {
					_.each($scope.profile.Dogs, function (dogIterator) {
						if (dogIterator._id == $routeParams.id) {
							$scope.dog = dogIterator;
						}
					});
				});
			}
		}




		main();
	}
]);
