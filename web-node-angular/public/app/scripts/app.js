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
      .when('/events', {
        templateUrl: 'app/views/events.html',
        controller: 'EventsController'
      })
      .otherwise({
        redirectTo: '/'
      });

   //   $locationProvider.html5Mode(true).hashPrefix('#');
  });
