'use strict';

angular.module('browserAppApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute'
])
.config(function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'app/views/main.html',
			controller: 'MainController'
		})
		.when('/map', {
			templateUrl: 'app/views/map.html',
			controller: 'MapController'
		})

		.when('/dogs/add', {
			templateUrl: 'app/views/dogs/add.html',
			controller: 'DogController',
			action: 'add'
		})

		.when('/dogs', {
			templateUrl: 'app/views/dogs/list.html',
			controller: 'DogController',
			action: 'edit'
		})

		.when('/dogs/:id', {
			templateUrl: 'app/views/dogs/add.html',
			controller: 'DogController',
			action: 'details'
		})

		.when('/shows/entered', {
			templateUrl: 'app/views/shows/entered.html',
			controller: 'ShowsController',
			action: 'entered'
		})

		.when('/shows/upcoming', {
			templateUrl: 'app/views/shows/upcoming.html',
			controller: 'ShowsController',
			action: 'upcoming'
		})

		.when('/shows/previous', {
			templateUrl: 'app/views/shows/upcoming.html',
			controller: 'ShowsController',
			action: 'previous'
		})

		.when('/shows/details/:id', {
			templateUrl: 'app/views/shows/details.html',
			controller: 'ShowsController',
			action: 'details'
		})

		.when('/shows/results/:id', {
			templateUrl: 'app/views/shows/results.html',
			controller: 'ShowsController',
			action: 'details'
		})

		.when('/shows', {
			templateUrl: 'app/views/shows/entered.html',
			controller: 'ShowsController',
			action: 'entered'
		})

		.when('/entered', {
			templateUrl: 'app/views/enteredShows.html',
			controller: 'EnteredShowsController'
		})

		.otherwise({
			redirectTo: '/'
		});

 //   $locationProvider.html5Mode(true).hashPrefix('#');
});
