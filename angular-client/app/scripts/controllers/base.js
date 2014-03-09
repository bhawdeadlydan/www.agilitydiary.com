var app = angular.module('browserAppApp');

app.controller('BaseController', [
	'$scope', 'ProfileService', '$location', '$route', '$rootScope', '$routeParams',
	function BaseController($scope, ProfileService, $location, $route, $rootScope, $routeParams) {
		"use strict";


		/**
		 * Module level variables
		 */

		$scope.profile = null;

		$rootScope.homeSectionClass = '';
		$rootScope.showsSectionClass = '';
		$rootScope.mapSectionClass = '';
		$rootScope.venuesSectionClass = '';
		$rootScope.peopleSectionClass = '';
		$rootScope.clubsSectionClass = '';
		$rootScope.accountSectionClass = '';

		$scope.startSpinner = startSpinner;
		$scope.stopSpinner = stopSpinner;


		function resetTabs() {
			$rootScope.tabbedNavigation = {
				homeSectionClass: '',
				showsSectionClass: '',
				mapSectionClass: '',
				venuesSectionClass: '',
				peopleSectionClass: ''
			};
		}

		function setTab(tab) {

		}

		$scope.resetTabs = resetTabs;




		/**
		 * Get the users profile
		 */

		$scope.fetchProfile = fetchProfile;

		function fetchProfile() {
			ProfileService.invalidateCache();

			ProfileService.get(function (data) {
				$scope.profile = data;
			}, function (error) {
				// handle error here
			});
		}




		function startSpinner() {

			var opts = {
				lines: 13, // The number of lines to draw
				length: 20, // The length of each line
				width: 10, // The line thickness
				radius: 30, // The radius of the inner circle
				corners: 1, // Corner roundness (0..1)
				rotate: 0, // The rotation offset
				direction: 1, // 1: clockwise, -1: counterclockwise
				color: '#000', // #rgb or #rrggbb or array of colors
				speed: 1.4, // Rounds per second
				trail: 60, // Afterglow percentage
				shadow: false, // Whether to render a shadow
				hwaccel: false, // Whether to use hardware acceleration
				className: 'spinner', // The CSS class to assign to the spinner
				zIndex: 2e9, // The z-index (defaults to 2000000000)
				top: ($(window).height()/2 ) - 100, // Top position relative to parent in px
				left: 'auto' // Left position relative to parent in px
			};

			var target = document.getElementById('spinner');
			$scope.spinner = new Spinner(opts).spin(target);
		}

		function stopSpinner() {
			if (typeof $scope.spinner !== 'undefined') {
				$scope.spinner.stop();
			}
		}


		fetchProfile();
		resetTabs();
	}
]);
