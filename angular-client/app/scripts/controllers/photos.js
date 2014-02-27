var app = angular.module('browserAppApp');

app.controller('PhotoController', [
	'$scope', 'Mapdata', 'ShowService', 'ProfileService', 'RelationshipService', '$location', '$route', '$routeParams',
	function PhotoController($scope, Mapdata, ShowService, ProfileService, RelationshipService, $location, $route, $routeParams) {
		"use strict";

		$scope.listUsers = {};
		$scope.photo = {};
		$scope.photoId = null;


		$scope.$watch('profile', profileHasChanged);


		function profileHasChanged() {
			if (angular.isDefined($scope.profile) &&
				($scope.profile !== null) &&
				(angular.isDefined($scope.profile.Photos))) {
				_.each($scope.profile.Photos, function (photo) {
					if (photo._id == $scope.photoId) {
						$scope.photo = photo;
					}
				});
			}
		}


		function main() {
			var action;

			if (angular.isDefined($route.current)) {
				if ((typeof $route.current.$$route.action !== 'undefined') && ($route.current.$$route.action !== null)) {
					action = $route.current.$$route.action;
				}

				console.log($location.href);
				console.log($routeParams.id);

				$scope.photoId = $routeParams.id;
			}
		}

		main();
	}
]);
