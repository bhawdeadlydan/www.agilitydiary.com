'use strict';

angular.module('browserAppApp')
	.controller('MapController', ['$scope', '$timeout', 'GeopositionService', 'Settings', 'Mapdata', function ($scope, $timeout, GeopositionService, Settings, Mapdata) {

		var _searchData,
			position,
			currentPositionHeading,
			mapdata = Mapdata;



		/**
		 * @description Factory function to create a new search object
		 */
		function createNewSearch() {
			return {
				searchText: '',
				location: {
					latitude: null,
					longitude: null,
					positionText: null
				},
				locationConfirmed: false,
				saved: false,
				sent: false,
				leaflet: {
					centre: {
						lat: 0,
						lng: 0,
						zoom: 14,
						initialised: false
					},
					locate: false
				},
				bounds: {}
			};
		}

		_searchData = createNewSearch();


		$scope.controls = {};
		$scope.events = {};


		$scope.controls.searchBox = {
			value: '',
			placeholder: 'Search here',
			change: function(i) {
				console.log(this.value);
			}
		};

		/**
		 * @description Set some initial variables so the
		 * leaflet directive can watch the scope for changes
		 */
		function bindMapToScope() {
			$scope.center = {
				lat: 0,
				lng: 0,
				zoom: 10
			};

			$scope.markers = {

			};
		}


		/**
		 * @description Centre the map on location from the GPS
		 */
		function centreMap() {
			console.log('CentreMap');

			if(_searchData.leaflet.centre.initialised===true) {
				return;
			}

			position = GeopositionService.getPosition();

			if(position === null) {
				$timeout(centreMap, Settings.centreMapRefresh);
			} else {
				console.log(_searchData.leaflet.centre.initialised);
				if (_searchData.leaflet.centre.initialised === false) {
					$scope.center.lat = position.latitude;
					$scope.center.lng = position.longitude;

					$scope.markers.Location.lat = $scope.center.lat;
					$scope.markers.Location.lng = $scope.center.lng;

					_searchData.leaflet.centre.initialised = true;

					//console.log('Placeholder becomes ' + placeholder);
					populatePlaceholder($scope.markers.Location.lat, $scope.markers.Location.lng);


					// tell any listeners we've moved the map
					$scope.$broadcast('leafletmap.centreChanged', $scope.center);
				}

			}
		}


		/**
		 * @description Attempt to populate the title from the nearest town
		 * @param lat
		 * @param lng
		 */
		function populateTitle(lat, lng) {
		  mapdata.findNearestTown(lat, lng,
			function(data) {
			  var i, placeholder='', town='', region='';

			  for(i=0; i<data.length; i++) {
				if(data[i].model === 'db.town') {
				  town = data[i].fields.town;
				}

				if(data[i].model === 'db.region') {
				  region = data[i].fields.name;
				}
			  }

			  placeholder = town;
			  if(region !== town) {
				placeholder += ', ' + region;
			  }

			  $scope.controls.title = town;// placeholder;
			},
			function(error) {
			}
		  );
		}


		function populatePlaceholder(lat, lng) {
			if((typeof lat === 'undefined') || (typeof lng === 'undefined')) {
				return;
			}
			if((lat===null) && (lng===null)) {
				return;
			}

			console.log('Populating placeholder from ' + lat + ' ' + lng);
			mapdata.findNearestTown(lat, lng,
				function(data) {
					var i, placeholder='', town='', region='';

					console.log(data);

					for(i=0; i<data.length; i++) {
						if(data[i].model === 'db.town') {
							town = data[i].fields.town;
						}

						if(data[i].model === 'db.region') {
							region = data[i].fields.name;
						}
					}

					placeholder = town;
					if(region !== town) {
						placeholder += ', ' + region;
					}


					$scope.controls.searchBox.placeholder = placeholder;
					$scope.controls.title = town;
				},
				function(error) {
				}
			);
		}


		/**
		 * @description Create a new search object
		 */
		function newSearch() {
			if((typeof position === 'undefined') || (position === null)) {
				$timeout(centreMap, 10);
			} else {
				console.log(position);

				_searchData.location.latitude = position.latitude;
				_searchData.location.longitude = position.longitude;
				_searchData.location.positionText = position.text;

				console.log('Search Data:');
				console.log(_searchData);

				$scope.data = _searchData;

				$scope.data.leaflet.center.lat = position.latitude;
				$scope.data.leaflet.center.lng = position.longitude;
			}
		}


		function getVenueData() {
			mapdata.venues({}, function(data) {
				_.each(data, function(item) {
					if(typeof item.location !== 'undefined') {
						var newMarker = {
							lat: item.location.latitude,
							lng: item.location.longitude,
							message: null,
							popupText: item.name,
							focus: false,
							draggable: false,
						};

						$scope.markers[item._id] = newMarker;
					}
				});

			}, function(err) {

			});
		}


		function main() {
			bindMapToScope();
			newSearch();

			$scope.markers = {
				Location: {
					lat: $scope.center.lat,
					lng: $scope.center.lng,
					message: '',
					focus: true,
					draggable: true,
					dragend: function(marker) {
						populatePlaceholder($scope.markers.Location.lat, $scope.markers.Location.lng);
					}
				}
			};

			$timeout(getVenueData, 2000);
			Mapdata.events({}, function(data) {
				$scope.events = data;
			});
		}

		main();

	}]);
