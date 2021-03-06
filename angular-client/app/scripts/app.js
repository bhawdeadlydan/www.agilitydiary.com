"use strict";

// current top level paths
// /dogs
// /map
// /profile
// /shows
// /users
// /clubs

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

		.when('/account', {
			templateUrl: 'app/views/account/edit.html',
			controller: 'MainController',
			action: 'account'
		})

		.when('/account/dogs', {
			templateUrl: 'app/views/account/dogs.html',
			controller: 'MainController',
			action: 'account'
		})

		.when('/account/linked-accounts', {
			templateUrl: 'app/views/account/linked.html',
			controller: 'MainController',
			action: 'linked-accounts'
		})

		.when('/account/security', {
			templateUrl: 'app/views/account/security.html',
			controller: 'MainController',
			action: 'security'
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

		.when('/dogs/:id/viewResults', {
			templateUrl: 'app/views/dogs/viewResults.html',
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

		.when('/shows/camps', {
			templateUrl: 'app/views/shows/camps.html',
			controller: 'ShowsController',
			action: 'entered'
		})

		.when('/shows/workshops', {
			templateUrl: 'app/views/shows/workshops.html',
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

		.when('/shows/viewResults/:id', {
			templateUrl: 'app/views/shows/viewResults.html',
			controller: 'ShowsController',
			action: 'details'
		})

		.when('/shows', {
			templateUrl: 'app/views/shows/entered.html',
			controller: 'ShowsController',
			action: 'entered'
		})

		.when('/shows/add', {
			templateUrl: 'app/views/shows/add.html',
			controller: 'ShowsController',
			// action: 'entered'
		})

		.when('/shows/edit', {
			templateUrl: 'app/views/shows/edit.html',
			controller: 'ShowsController',
			// action: 'entered'
		})

		.when('/shows/claim/:id', {
			templateUrl: 'app/views/shows/claim.html',
			controller: 'ShowsController'
			// action: 'details'
		})

		.when('/venues/details/:id', {
			templateUrl: 'app/views/venues/details.html',
			controller: 'VenuesController',
			action: 'details'
		})

		.when('/venues/photos/:id', {
			templateUrl: 'app/views/venues/photos.html',
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

		.when('/people/following', {
			templateUrl: 'app/views/users/following.html',
			controller: 'RelationshipController'
		})

		.when('/people/trainers', {
			templateUrl: 'app/views/users/trainers.html',
			controller: 'RelationshipController'
		})

		.when('/people/judges', {
			templateUrl: 'app/views/users/judges.html',
			controller: 'RelationshipController'
		})

		.when('/people/:id', {
			templateUrl: 'app/views/users/public.html',
			controller: 'MainController',
			action: 'public'
		})

		.when('/clubs/details/:id', {
			templateUrl: 'app/views/clubs/details.html',
			controller: 'ClubsController',
			action: 'details'
		})

		.when('/clubs/photos/:id', {
			templateUrl: 'app/views/clubs/photos.html',
			controller: 'ClubsController',
			action: 'details'
		})

		.when('/clubs', {
			templateUrl: 'app/views/clubs/list.html',
			controller: 'ClubsController',
			action: 'list'
		})

		.when('/feedback', {
			templateUrl: 'app/views/feedback.html',
			controller: 'FeedbackController',
		})

		.when('/contact', {
			templateUrl: 'app/views/contact.html',
			controller: 'ContactController',
		})

		.when('/_=_', {
			redirectTo: '/'
		});

		//.otherwise({
		//	redirectTo: '/'
		//});

		$locationProvider.html5Mode(true);//.hashPrefix('#');
});
