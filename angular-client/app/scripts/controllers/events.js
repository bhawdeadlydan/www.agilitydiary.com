'use strict';

angular.module('browserAppApp')
  .controller('EventsController', ['$scope', 'Mapdata', '$location', function ($scope, Mapdata, $location) {

  	$scope.events = {};

  	Mapdata.events({}, function(data) {
  		$scope.events = data;
  	});

  	$scope.enterShow = function (event) {

  		Mapdata.enterShow(event._id, function () {
  			$location.path('/entered')
  		}, function() {

  		});
  	};

  }]);
