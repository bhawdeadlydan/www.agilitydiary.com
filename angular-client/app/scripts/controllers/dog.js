var app = angular.module('browserAppApp');

app.controller('DogController', [
	'$scope', 'Mapdata', 'ShowService', 'ProfileService', '$location', '$route', '$routeParams',
	function DogController($scope, Mapdata, ShowService, ProfileService, $location, $route, $routeParams) {
		"use strict";




		$scope.dog = {
			name: '',
			sex: ''
		};




		$scope.saveDog = function () {
			ProfileService.addDog({
				name: $scope.name,
				sex: $scope.sex
			}, function (data) {
				$location.path('#/');
			}, function (error) {
				console.log(error);
			});
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
			case '':

			}
		}




		main();
	}
]);
