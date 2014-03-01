var app = angular.module('browserAppApp');

app.controller('VenuesController', [
	'$scope',
	'$rootScope',
	'Mapdata',
	'ShowService',
	'PersistService',
	'ProfileService',
	'$location',
	'$route',
	'$routeParams',
	'CommentsService',
	function ($scope, $rootScope, Mapdata, ShowService, PersistService, ProfileService, $location, $route, $routeParams, CommentsService) {
		"use strict";

		/**
		 * Setup scope
		 */
		$rootScope.homeSectionClass = '';
		$rootScope.showsSectionClass = '';
		$rootScope.venuesSectionClass = ' active ';
		$rootScope.mapSectionClass = '';

		$scope.upcomingShows = {};
		$scope.selectedCategories = []; //PersistService('shows.selectedCategories', []);
		$scope.enteredShows = {};
		$scope.categories = {};
		$scope.details = {};
		$scope.center = {};
		$scope.bounds = {};
		$scope.searchText = '';
		$scope.markers = {};
		$scope.attending = false;
		$scope.id = null;
		$scope.controls = {};
		$scope.comments = {};
		$scope.paging = {
			page: 1,
			totalPages: 1,
			results: []
		};
		$scope.venues = [];
		$scope.venue = null;
		$scope.paging = {
			page: 1,
			totalPages: 1,
			results: []
		};
		
		
		
		
		function pageVenues() {
			function paginate() {
				$scope.paging.pageStartsAt = ($scope.paging.page - 1) * $scope.paging.pageSize;
				$scope.paging.pageEndsAt = (($scope.paging.page) * $scope.paging.pageSize) - 1;
				$scope.paging.results = [];
				$scope.paging.pages = [];
				
				for(var i = 0; i < $scope.venues.length; i++) {
					if ((i >= $scope.paging.pageStartsAt) && (i <= $scope.paging.pageEndsAt)){
						$scope.paging.results.push($scope.venues[i]);	
					} else {
						
					}
					
					if (i % $scope.paging.pageSize === 0) {
						$scope.paging.pages.push( ($scope.paging.pages.length + 1).toString() );
					}
				}
			}
			
			$scope.paging =  {
				pageSize: 5,
				page: 1,
				totalPages: 1,
				results: [],
				pages: [],
				backClick: function() {
					$scope.paging.page--;
					paginate();
				},
				nextClick: function() {
					$scope.paging.page++;
					paginate();
				},
				jumpToPage: function(page) {
					$scope.paging.page = page ;
					paginate();
				}
			};
			
			paginate();
		}




		function controllerDestroy() {
			$scope.stopSpinner();
		}



		$scope.$on('$destroy', controllerDestroy);
		
		
		
		
		function getVenueData() {
			$scope.startSpinner();
			
			Mapdata.venues({}, function(data) {
				$scope.stopSpinner();
				
				$scope.venues = data;
				pageVenues();

				_.each(data, function(item) {
					if(typeof item.location !== 'undefined') {
						var newMarker = {
							_id: item._id,
							lat: item.location.latitude,
							lng: item.location.longitude,
							message: null,
							popupText: undefined, //item.ΩΩname,
							focus: false,
							draggable: false,
								html: '<span>' +
								'<a href="#/venues/details/' + item._id + '">' + item.name + '</a>' +
								// item.name +
								'</span>'
						};

						$scope.markers[item._id] = newMarker;
					}
				});

			}, function(err) {

			});
		}
		
		
		
		
		function details(id) {
			$scope.startSpinner();
			Mapdata.venues({}, function(data) {
				$scope.stopSpinner();
				$scope.venues = data;
				
				_.each($scope.venues, function (venue) {
					if (venue._id === id) {
						$scope.venue = venue;
						
						$scope.center.lat = venue.location.latitude;
						$scope.center.lng = venue.location.longitude;
						$scope.center.zoom = 15;
		
						var newMarker = {
							_id: venue._id,
							lat: venue.location.latitude,
							lng: venue.location.longitude,
							message: null,
							popupText: data.name,
							focus: true,
							draggable: false						
						};
		
						$scope.markers.Venue = newMarker;
					}
				})
			});
		}




		/**
		 * Main function
		 */

		function main() {
			var action = '';

			if (typeof $route.current.$$route.action !== 'undefined') {
				action = $route.current.$$route.action;
			}
			
			switch (action) {
			case 'details':
				$scope.id = $routeParams.id;
				details($scope.id);
				break;
			
			case 'list':
				getVenueData();
				break;
			}
		}


		main();
	}
]);
