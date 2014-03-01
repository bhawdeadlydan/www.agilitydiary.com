var app = angular.module('browserAppApp');

app.controller('RelationshipController', [
	'$scope', 'Mapdata', 'ShowService', 'ProfileService', 'RelationshipService', '$location', '$route', '$routeParams', '$rootScope',
	function RelationshipController($scope, Mapdata, ShowService, ProfileService, RelationshipService, $location, $route, $routeParams, $rootScope) {
		"use strict";

		$scope.listUsers = {};
		$rootScope.homeSectionClass = '';
		$rootScope.showsSectionClass = '';
		$rootScope.mapSectionClass = '';
		$rootScope.venuesSectionClass = '';
		$rootScope.peopleSectionClass = ' active ';

		$scope.$watch('profile', profileHasChanged);

		function profileHasChanged() {
			scanForFriends();
		}

		function scanForFriends() {
			_.each($scope.listUsers, function (loopUser) {
				loopUser.isFriend = false;

				_.each($scope.profile.Friends, function (loopFriend) {
					if ((loopFriend.LinkedUser !== null) && (angular.isDefined(loopFriend.LinkedUser._id))) {
						if (loopFriend.LinkedUser._id == loopUser._id) {
							loopUser.isFriend = true;
						}
					}
				});
			});
		}

		function listUsers() {
			RelationshipService.listUsers(function (success) {
				$scope.listUsers = success;

				scanForFriends();
			}, function (error) {

			});
		}

		listUsers();

		$scope.addFriend = function (user) {
			ProfileService.addFriend(user._id).success(function () {
				user.isFriend = true;
			}).error(function () {

			});
		};

		$scope.removeFriend = function (user) {
			ProfileService.removeFriend(user._id).success(function () {
				user.isFriend = false;
			}).error(function () {

			});
		};

	}
]);
