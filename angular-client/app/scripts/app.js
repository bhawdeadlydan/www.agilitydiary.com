"use strict";

// current top level paths
// /dogs
// /map
// /profile
// /shows
// /users

angular.module('browserAppApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'imageFilters'
])
.config(function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'app/views/main.html',
			controller: 'MainController'
		})

		.when('/profile', {
			templateUrl: 'app/views/users/edit.html',
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
			action: 'list'
		})

		.when('/dogs/:id/edit', {
			templateUrl: 'app/views/dogs/edit.html',
			controller: 'DogController',
			action: 'edit'
		})

		.when('/dogs/:id/details', {
			templateUrl: 'app/views/dogs/details.html',
			controller: 'DogController',
			action: 'details'
		})

		.when('/dogs/:id', {
			templateUrl: 'app/views/dogs/profile.html',
			controller: 'DogController',
			action: 'details'
		})

		.when('/dogs/:id/results', {
			templateUrl: 'app/views/dogs/results.html',
			controller: 'DogController',
			action: 'results'
		})

		.when('/dogs/:id/photos', {
			templateUrl: 'app/views/dogs/photos.html',
			controller: 'DogController',
			action: 'details'
		})

		.when('/photos/:id', {
			templateUrl: 'app/views/photos/details.html',
			controller: 'PhotoController'
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
			templateUrl: 'app/views/shows/previous.html',
			controller: 'ShowsController',
			action: 'previous'
		})

		.when('/shows/details/:id', {
			templateUrl: 'app/views/shows/details.html',
			controller: 'ShowsController',
			action: 'details'
		})

		.when('/shows/photos/:id', {
			templateUrl: 'app/views/shows/gallery.html',
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

		.when('/venues/details/:id', {
			templateUrl: 'app/views/venues/details.html',
			controller: 'VenuesController',
			action: 'details'
		})

		.when('/venues', {
			templateUrl: 'app/views/venues/list.html',
			controller: 'VenuesController',
			action: 'list'
		})

		.when('/entered', {
			templateUrl: 'app/views/enteredShows.html',
			controller: 'EnteredShowsController'
		})

		.when('/people', {
			templateUrl: 'app/views/users/list.html',
			controller: 'RelationshipController'
		})

		.when('/people/:id', {
			templateUrl: 'app/views/users/public.html',
			controller: 'MainController',
			action: 'public'
		});

		//.otherwise({
		///	redirectTo: '/'
		//});

		$locationProvider.html5Mode(true);//.hashPrefix('#');
});
