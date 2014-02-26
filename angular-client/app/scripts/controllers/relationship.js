var app = angular.module('browserAppApp');

app.controller('RelationshipController', [
	'$scope', 'Mapdata', 'ShowService', 'ProfileService', 'RelationshipService', '$location', '$route', '$routeParams',
	function RelationshipController($scope, Mapdata, ShowService, ProfileService, RelationshipService, $location, $route, $routeParams) {
		"use strict";

		$scope.profile = {};
		$scope.listUsers = {};

		function fetchProfile() {
			ProfileService.invalidateCache();

			ProfileService.get(function (data) {
				$scope.profile = data;
			}, function (error) {

			});
		}

		$scope.$watch('profile', profileHasChanged);

		function profileHasChanged() {
			scanForFriends();
		}

		function scanForFriends() {
			_.each($scope.listUsers, function(loopUser) {
				loopUser.isFriend = false;

				_.each($scope.profile.Friends, function(loopFriend) {
					if (loopFriend.LinkedUser == loopUser._id) {
						loopUser.isFriend = true;
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
		fetchProfile();

		$scope.addFriend = function(user) {
			ProfileService.addFriend(user._id).success(function() {
				user.isFriend = true;
			}).error(function() {

			});
		};

		$scope.removeFriend = function(user) {
			ProfileService.removeFriend(user._id).success(function() {
				user.isFriend = false;
			}).error(function() {

			});
		}

	}
]);
