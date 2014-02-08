'use strict';

angular.module('browserAppApp')
  .controller('EventsController', ['$scope', 'Mapdata', function ($scope, Mapdata) {

  	$scope.events = {};

  	Mapdata.events({}, function(data) {
  		$scope.events = data;
  	});

  }]);
