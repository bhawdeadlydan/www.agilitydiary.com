var app = angular.module('browserAppApp');

app.controller('RelationshipController', [
	'$scope', 'Mapdata', 'ShowService', 'ProfileService', 'RelationshipService', '$location', '$route', '$routeParams',
	function RelationshipController($scope, Mapdata, ShowService, ProfileService, RelationshipService, $location, $route, $routeParams) {
		"use strict";

		$scope.profile = {};
		$scope.listUsers = {};

		RelationshipService.listUsers(function (success) {
			$scope.listUsers = success;
		}, function (error) {

		});

	}
]);
