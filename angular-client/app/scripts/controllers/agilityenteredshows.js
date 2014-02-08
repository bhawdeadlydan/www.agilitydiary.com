'use strict';

angular.module('browserAppApp')
  .controller('EnteredShowsController', ['$scope', 'Mapdata', function ($scope, Mapdata) {

  	$scope.events = {};

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
  }]);