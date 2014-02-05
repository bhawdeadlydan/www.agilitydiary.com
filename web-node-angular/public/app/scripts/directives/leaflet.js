'use strict';

angular.module('browserAppApp')
  .directive("leaflet", ["$http", "$log", '$timeout', function ($http, $log, $timeout) {

	var defaults = {
		maxZoom: 14,
		tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		icon: {
			url: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-icon.png',
			retinaUrl: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-icon@2x.png',
			size: [25, 41],
			anchor: [12, 40],
			popup: [0, -40],
			shadow: {
				url: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-shadow.png',
				retinaUrl: 'http://cdn.leafletjs.com/leaflet-0.5.1/images/marker-shadow.png',
				size: [41, 41],
				anchor: [12, 40]
			}
		},
		path: {
			weight: 10,
			opacity: 1
		},
		scrollWheelZoom: false
	};
	var _mapElementCache = {};

	return {
		restrict: "E",
		replace: true,
		transclude: true,
		//scope: {
		//	center: '=center',
		//	markers: '=markers',
		//	defaults: '=defaults',
		//	path: '=path'
		//},
		template: '<div class="angular-leaflet-map"></div>',
		link: function ($scope, element, attrs /*, ctrl */) {
			var opts,
				map,
				clickMarker=null,
				_draggingBlockClick=false,
				$parentElement,
				$mapElement,
				$wrapperElement,
				$townSelector,
				$searchWrapperText,
				locate = false,
				cheId = null,
				elementCacheId,
				bounceOnAdd;

			if(attrs.elementcacheid !== 'undefined') {
				elementCacheId = attrs.elementcacheid;
			}

			function setupCenter() {
				console.log('Leaflet.setupCenter');

				if (!$scope.center) {
					return;
				}

				if ($scope.center.lat && $scope.center.lng && $scope.center.zoom) {
					map.setView([$scope.center.lat, $scope.center.lng], $scope.center.zoom);
				} else if ($scope.center.autoDiscover === true) {
					map.locate({ setView: true, maxZoom: $scope.leaflet.maxZoom });
				}

				map.on("dragend", function (/* event */) {
					$scope.$apply(function (scope) {
						mapDragged();
					});
				});

				map.on("zoomend", function (/* event */) {
					if ($scope.center.zoom !== map.getZoom()) {
						$scope.$apply(function (s) {
							s.center.zoom = map.getZoom();

							$scope.mapBounds = map.getBounds();
							$scope.$broadcast('leafletmap.centreChanged', $scope.center);
						});
					}
				});

				$scope.$watch("center", function (center /*, oldValue */) {
					if (center.lat && center.lng && center.zoom) {
						map.setView([center.lat, center.lng], center.zoom);

						if(locate === true) {
							if(attrs.clickmarker !== 'undefined') {

								$scope.markers[clickMarker].lat = center.lat;
								$scope.markers[clickMarker].lng = center.lng;

								if(typeof $scope.markers[clickMarker].dragend !== 'undefined') {
									$scope.markers[clickMarker].dragend($scope.markers[clickMarker]);
								}
							}
						}

					}
				}, true);
			}

			function setupDestructor() {
				$scope.$on('$destroy', function() {
					console.log('DIRECTIVE DESTROY');

					// remove markers
					//for (var name in $scope.markers) {
					//	map.removeLayer($scope.markers[name]);
					//}

					if(elementCacheId !== null) {
						_mapElementCache[elementCacheId].element.detach();
					}
				});
			}



			/**
			 * @description Define any markers and watch for changes to the scope
			 */
			function setupMarkers(bounceOnAdd) {
				// reset markers
				var markers = {};
				$scope.leaflet.markers = !!attrs.testing ? markers : 'Add testing="testing" to <leaflet> tag to inspect this object';

				if (!$scope.markers) {
					return;
				}

				for (var name in $scope.markers) {
					markers[name] = createMarker(name, $scope.markers[name], map, bounceOnAdd);
				}

				$scope.$watch("markers", function (newMarkers /*, oldMarkers*/) {
					var name;

					for (name in newMarkers) {
						if (markers[name] === undefined) {
							markers[name] = createMarker(name, newMarkers[name], map, bounceOnAdd);
						}
					}

					// Delete markers from the array
					for (name in markers) {
						if (newMarkers[name] === undefined) {
							delete markers[name];
						}
					}

					sizeTextMarkers();

				}, true);
			}

			function createMarker(name, scopeMarker, map, bounceOnAdd) {
				var marker = buildMarker(name, scopeMarker, bounceOnAdd);

				marker.on("drag", function () {
					$scope.$apply(function (scope) {
						scopeMarker.lat = marker.getLatLng().lat;
						scopeMarker.lng = marker.getLatLng().lng;

						if(typeof scopeMarker.drag !== 'undefined') {
							scopeMarker.drag(marker);
						}
					});

					if (scopeMarker.message) {
						marker.openPopup();
					}
				});


				marker.on("dragend", function () {
					$scope.$apply(function (scope) {
						scopeMarker.lat = marker.getLatLng().lat;
						scopeMarker.lng = marker.getLatLng().lng;

						if(typeof scopeMarker.dragend !== 'undefined') {
							scopeMarker.dragend(marker);
						}
					});

					if (scopeMarker.message) {
						marker.openPopup();
					}
				});

				$scope.$watch('markers.' + name, function (data, oldData) {
					if (!data) {
						map.removeLayer(marker);
						return;
					}

					if (oldData) {
						if (data.draggable !== undefined && data.draggable !== oldData.draggable) {
							if (data.draggable === true) {
								marker.dragging.enable();
							} else {
								marker.dragging.disable();
							}
						}

						if (data.focus !== undefined && data.focus !== oldData.focus) {
							if (data.focus === true) {
								marker.openPopup();
							} else {
								marker.closePopup();
							}
						}

						if (data.message !== undefined && data.message !== oldData.message) {
							marker.bindPopup(data);
						}

						if (data.lat !== oldData.lat || data.lng !== oldData.lng) {
							marker.setLatLng(new L.LatLng(data.lat, data.lng));
						}
					}
				}, true);

				marker.addTo(map);

				return marker;
			}

			function sizeTextMarkers() {
				$('.mapTextMarker').each(function(index, element) {
					var $element = $(element),
						$span = $element.find('span'),
						spanWidth;

					spanWidth = $span.outerWidth();
					$element.width(spanWidth + 24 + 12);
				});
			}

			function buildMarker(name, data, bounceOnAdd) {
				var marker;

				// use text marker if we have a messag
				if (data.message) {
					var opts = {
						text: data.message,
						lat: $scope.markers[name].lat,
						lng: $scope.markers[name].lng,
						icon: data.icon
					};

					marker = leafletMarkers.mapTextMarker(opts);
					//marker.bindPopup(data.message);
				} else {
					marker = new L.Marker($scope.markers[name],
						{
							icon: buildIcon(data),
							draggable: data.draggable ? true : false
						}
					);
				}
				return marker;
			}

			function buildIcon(data) {
				var iconUrl;

				iconUrl = defaults.icon.url;

				if(typeof data.icon !== 'undefined') {
					return L.icon({
						iconUrl: defaults.icon.url,
						iconRetinaUrl: defaults.icon.retinaUrl,
						iconAnchor: defaults.icon.anchor,
						popupAnchor: defaults.icon.popup,
						shadowUrl: '',
						shadowRetinaUrl: '',
						shadowSize: 0,
						shadowAnchor: 0,
						className: 'avatarImage',
						riseOnHover: true,
						iconSize: defaults.icon.size //new L.Point(24, 24)
					});
				}

				return L.icon({
					iconUrl: defaults.icon.url,
					iconRetinaUrl: defaults.icon.retinaUrl,
					iconSize: defaults.icon.size,
					iconAnchor: defaults.icon.anchor,
					popupAnchor: defaults.icon.popup,
					shadowUrl: defaults.icon.shadow.url,
					shadowRetinaUrl: defaults.icon.shadow.retinaUrl,
					shadowSize: defaults.icon.shadow.size,
					shadowAnchor: defaults.icon.shadow.anchor
				});
			}

			$scope.$on('leafletmap.startlocate', function() {
				locate = true;
				map.locate({
					watch: true,
					setView: true,
					enableHighAccuracy: true
				});
			});

			$scope.$on('leafletmap.stoplocate', function() {
				locate = false;
				map.stopLocate();
			});

			function mapDragged() {
				$scope.center.lat = map.getCenter().lat;
				$scope.center.lng = map.getCenter().lng;

				$scope.mapBounds = map.getBounds();

				$scope.$broadcast('leafletmap.centreChanged', $scope.center);
			}

			function initialiseMap() {
				var cachedData;

				opts = {
					scrollWheelZoom: attrs.scrollwheelzoom === 'true',
					dragging: attrs.dragging === 'true'
				};

				// find the jQuery elements so we can fit the map to the full height
				$parentElement = $(element.parent()[0]);
				$mapElement = $(element);
				$wrapperElement = $('#wrapper');
				$townSelector = $('#townSelector');
				$searchWrapperText = $('#searchWrapper input');


				if((typeof attrs.fullsize !== 'undefined') && (attrs.fullsize === 'true')) {
					var height,
						innerHeight = window.innerHeight;

					height = $('.header').height();
					height += $('#footer').height();
					height += $searchWrapperText.outerHeight();

					$mapElement.css({
						height: innerHeight - height,
						border: 'none'
					});

					$('#footer').css({
						top:  innerHeight - $('#footer').height()
					});

					$townSelector.css({
						top: $mapElement.position().top
					});
				}

				// check cache for element
				/*if((elementCacheId !== null) && (elementCacheId in _mapElementCache)) {
					console.log('Found in cache');

					cachedData = _mapElementCache[elementCacheId];

					$scope.leaflet = cachedData.leaflet;
					map = cachedData.map;
					$(element).replaceWith(cachedData.element);
					$mapElement = cachedData.element;

					console.log('ok');
				} else {} */
				map = new L.Map(element[0], opts);

				map.setView([0, 0], 1);


				$scope.map = map;

				window.leafletmap = map;

				$scope.leaflet = {};
				$scope.leaflet.map = !!attrs.testing ? map : 'Add testing="testing" to <leaflet> tag to inspect this object';
				$scope.leaflet.maxZoom = !!(attrs.defaults && $scope.defaults.maxZoom) ? parseInt($scope.defaults.maxZoom, 14) : defaults.maxZoom;
				$scope.leaflet.tileLayer = !!(attrs.defaults && $scope.defaults.tileLayer) ? $scope.defaults.tileLayer : defaults.tileLayer;
				$scope.leaflet.bounceOnAdd = true;
				if((attrs.bounce !== 'undefined' ) && (attrs.bounce == 'true')) { bounceOnAdd = true; }
				bounceOnAdd = true;
				$scope.mapBounds = null;

				map.scrollWheelZoom = false;
				map.dragging = false;
				L.tileLayer($scope.leaflet.tileLayer, { maxZoom: $scope.leaflet.maxZoom }).addTo(map);

				if(elementCacheId !== null) {
					_mapElementCache[elementCacheId] = {
						'element': $(element),
						'map': map,
						'leaflet': $scope.leaflet
					};
				}
			}

			initialiseMap();
			setupCenter();
			setupMarkers($scope.leaflet.bounceOnAdd);
			setupDestructor();

			if(attrs.clickmarker !== 'undefined') {
				clickMarker = attrs.clickmarker;

				map.on('dragstart', function() {
					console.log('Blocking drag');
					_draggingBlockClick = true;
				});

				map.on('dragend', function(e) {
					$timeout(function() {
						console.log('unBlocking drag');
						_draggingBlockClick = false;

						mapDragged();
					}, 100);
				});

				map.on('click', function(e) {
					if(_draggingBlockClick === false) {
						console.log('**click');

						$timeout(function() {
							$scope.markers[clickMarker].lat = e.latlng.lat;
							$scope.markers[clickMarker].lng = e.latlng.lng;

							if(typeof $scope.markers[clickMarker].dragend !== 'undefined') {
								$scope.markers[clickMarker].dragend($scope.markers[clickMarker]);
							}
						}, 10);
					}
				});
			}


		}
	};
}]);
