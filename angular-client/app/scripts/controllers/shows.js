var app = angular.module('browserAppApp');

app.controller('ShowsController', [
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
		$rootScope.showsSectionClass = 'active';
		$rootScope.mapSectionClass = '';
		$rootScope.venuesSectionClass = '';

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


		/**
		 * click handlers
		 */

		$scope.resignShow = resignShow;
		$scope.enterShow = enterShow;
		$scope.controls.saveRecord = saveRecord;
		$scope.filterResultsForShow = filterResultsForShow;
		$scope.hasUserEnteredShow = hasUserEnteredShow;


		$scope.filteredShows = [];




		function pageShows() {
			function paginate() {
				$scope.paging.pageStartsAt = ($scope.paging.page - 1) * $scope.paging.pageSize;
				$scope.paging.pageEndsAt = (($scope.paging.page) * $scope.paging.pageSize) - 1;
				$scope.paging.results = [];
				$scope.paging.pages = [];

				for(var i = 0; i < $scope.filteredShows.length; i++) {
					if ((i >= $scope.paging.pageStartsAt) && (i <= $scope.paging.pageEndsAt)){
						$scope.paging.results.push($scope.filteredShows[i]);
					} else {

					}

					if (i % $scope.paging.pageSize === 0) {
						$scope.paging.pages.push( ($scope.paging.pages.length + 1).toString() );
					}
				}
			}

			$scope.paging =  {
				pageSize: 10,
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




		function resetMarkers(data) {
			if (typeof $scope.markers.Location !== 'undefined') {
				var location = $scope.markers.Location;
				$scope.markers = {
					Location: location
				};
			} else {
				$scope.markers = {};
			}

			function generateHtmlForShow(item) {
				return '<div>' +
				'<a href="#/shows/details/' + item._id + '">' + item.Name + '</a> <span> ' + item.ShowDate + '<span></div>';
			}

			_.each(data, function(item) {
				if(typeof item.Location !== 'undefined') {

					if (typeof item.Venue.Id !== 'undefined') {

						if (typeof $scope.markers[item.Venue.Id] === 'undefined') {
							var newMarker = {
								_id: item._id,
								lat: item.Location.Latitude,
								lng: item.Location.Longitude,
								message: null,
								popupText: undefined, //item.ΩΩname,
								focus: false,
								draggable: false,
								html: generateHtmlForShow(item)
							};

							$scope.markers[item.Venue.Id] = newMarker;
						} else {
							var oldMarker = $scope.markers[item.Venue.Id];
							oldMarker.html += generateHtmlForShow(item);
						}
					}
				}
			});
		}




		function filterShows() {
			var results = [];

			_.each($scope.enteredShows, function (item) {
				var includeThis = false;

				if ($scope.selectedCategories.length > 0) {
					if ($scope.showHasSelectedCategory(item)) {
							includeThis = true;
					} else {
						includeThis = false;
					}
				} else {
					includeThis = true;
				}

				/*if ($scope.showIsInSearch(item)) {
					includeThis = true;
				}*/

				if (includeThis === true) {
					results.push(item);
				}
			});

			$scope.filteredShows = results;
			resetMarkers(results);

			pageShows();
		}




		function hasUserEnteredShow(show) {
			var entered = false;

			_.each($scope.profile.EnteredShows, function (iterShow) {
				if (show._id == iterShow._id) {
					entered = true;
				}
			});

			return entered;
		}



		/**
		 * Scope watchers
		 */

		$scope.$watch('profile', profileHasChanged);




		function filterResultsForShow(list) {
			var results = [];

			_.each(list, function (item) {
				if (item.Show === $scope.id) {
					results.push(item);
				}
			});

			return results;
		}




		function profileHasChanged() {
			checkAttending();
		}




		function errorHandler(error) {

		}




		function updateShowData(data) {
			$scope.stopSpinner();

			$scope.enteredShows = data;
			filterShows();
		}




		/**
		 * Upcoming Shows
		 */

		function fetchPreviousShows() {
			$scope.startSpinner();

			ShowService.previousShows(updateShowData, updateShowData, errorHandler);
		}




		/**
		 * Todays Shows
		 */

		function fetchTodaysShows() {
			ShowService.todaysShows(updateShowData, updateShowData, errorHandler);
		}




		/**
		 * Upcoming Shows
		 */

		function fetchUpcomingShows() {
			$scope.startSpinner();

			ShowService.upcomingShows(function (data) {
				$scope.enteredShows = data;
			}, function (data) {
				$scope.enteredShows = data;
				$scope.stopSpinner();
				filterShows();
			}, function (err) {
				$scope.stopSpinner();
				// failed
			});
		}




		/**
		 * Entered Shows
		 */

		function fetchEnteredShows() {
			ShowService.enteredShows({}, function (data) {
				$scope.enteredShows = data;

				_.each($scope.enteredShows, function (showIterator) {
					showIterator.enterResults = checkIsTodayOrHasHappened(new Date(showIterator.ParsedDate));
				});
			});
		}




		function fetchCategories() {
			ShowService.categories(function (data) {
				$scope.categories = data;
				_.each(data, function (item) {
					//$scope.selectedCategories.push(item);
				});
			}, function (error) {

			});
		}




		function checkAttending() {
			$scope.attending = false;

			if (($scope.profile !== null) && (angular.isDefined($scope.profile.EnteredShows))){
				_.each($scope.profile.EnteredShows, function (show) {
					if (angular.equals(show._id, $scope.id)) {
						$scope.attending = true;
					}
				});
			}
		}




		function checkIsTodayOrHasHappened(testDate) {
			var today,
				midnightTonight,
				parseDate;

			today = new Date();
			midnightTonight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

			return (testDate.getTime() <= midnightTonight.getTime());
		}




		function checkClosed() {
			var today,
				parseDate,
				midnightThisMorning;

			$scope.entriesOpen = true;

			today = new Date();
			midnightThisMorning = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

			var closeDate = new Date($scope.show.ParsedDate);

			$scope.entriesOpen = closeDate < midnightThisMorning;
		}




		/**
		 * Show Details
		 */

		function details(id) {
			ShowService.details({
				id: id
			}, function (data) {
				$scope.show = data;
				$scope.center.lat = data.Location.Latitude;
				$scope.center.lng = data.Location.Longitude;
				$scope.center.zoom = 15;

				$scope.enterResults = checkIsTodayOrHasHappened(new Date($scope.show.ParsedDate));

				var newMarker = {
					_id: data._id,
					lat: data.Location.Latitude,
					lng: data.Location.Longitude,
					message: null,
					popupText: data.Name,
					focus: true,
					draggable: false
					//html: '<span><a href="#/shows/details/' + item._id + '">' + item.name + '</a></span>'
				};

				checkAttending();
				checkClosed();

				$scope.markers.Venue = newMarker;
			}, function (err) {
				// failed
			});
		}




		function saveRecordError(response) {
		}




		function saveRecord() {
			if (!$scope.form.$valid) {
				return;
			}

			var data = {
				dogId: $scope.controls.dogId,
				showId: $scope.id,
				class: $scope.controls.class,
				time: $scope.controls.time,
				faults: $scope.controls.faults,
				place: $scope.controls.place,
				judge: $scope.controls.judge,
				points: $scope.controls.points
			};

			ProfileService.addResult(data)
				.success($scope.fetchProfile)
				.error(saveRecordError);
		}




		/**
		 * Click Handlers
		 */

		function enterShow(event) {
			ShowService.enterShow({
				id: $scope.id
			}, function (data) {
				//$scope.profile = data;
				//checkAttending();
				//$location.path('#/shows/entered');
				//details($scope.id);
				$scope.fetchProfile();
				details($scope.id);

			}, function () {

			});
		}




		function resignShow(event) {
			ShowService.resignShow($scope.id, function () {

				ShowService.userData({}, function (data) {
					$scope.fetchProfile();
					details($scope.id);
					//$scope.profile = data;
					//$scope.enteredShows = data.EnteredShows;
				});

				//checkAttending();

			}, function () {

			});
		}




		/**
		 * @event
		 * Category is being toggled
		 */

		$scope.categoryClick = function (category) {
			if ($scope.selectedCategories.indexOf(category) === -1) {
				$scope.selectedCategories.push(category);
			} else {
				$scope.selectedCategories.splice($scope.selectedCategories.indexOf(category), 1);
			}

			filterShows();
		};




		/**
		 * Return if the category is selected
		 */

		$scope.isCategorySelected = function (category) {
			return $scope.selectedCategories.indexOf(category) !== -1;
		};




		/**
		 * Check if the current Show model is in the selected categories list
		 */

		$scope.showHasSelectedCategory = function (item) {
			return $scope.selectedCategories.indexOf(item.Meta.ShowType) !== -1;
		};




		$scope.showIsInSearch = function (item) {
			if ($scope.searchText === '') {
				return true;
			}

			return item.Name.toLowerCase().indexOf($scope.searchText.toLowerCase()) !== -1;
		};




		$scope.searchClearClick = function () {
			$scope.searchText = '';
		};




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

				if (document.querySelector('div#uploadProfileImage') !== null) {
					var profileDropzone = new Dropzone('div#uploadProfileImage', {
						url: '/agility-diary/show/user-upload-photo?id=' + $scope.id
					});

					profileDropzone.on('complete', function file() {
						profileDropzone.removeFile(file);
						profileDropzone.removeAllFiles();
						details($scope.id);
					});
				}
				break;

			case 'entered':
				fetchCategories();
				fetchEnteredShows();
				break;

			case 'previous':
				fetchCategories();
				fetchPreviousShows();
				break;

			case 'upcoming':
			case '':
				fetchCategories();
				fetchUpcomingShows();
			}
		}




		function controllerDestroy() {
			$scope.stopSpinner();
		}



		$scope.$on('$destroy', controllerDestroy);




		main();
	}
]);
