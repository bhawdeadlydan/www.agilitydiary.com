'use strict';

angular.module('browserAppApp')
  .controller('EventsController', ['$scope', 'Mapdata', '$location', function ($scope, Mapdata, $location) {

  	$scope.events = {};

  	Mapdata.events({}, function(data) {
  		$scope.events = data;
  	});

  	$scope.enterShow = function (event) {
  		alert(event._id);
  		Mapdata.enterShow(event._id, function () {
  			$location.path('/entered')
  		}, function() {

  		});
  	};

  }]);
