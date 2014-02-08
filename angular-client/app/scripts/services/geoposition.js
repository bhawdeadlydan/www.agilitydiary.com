'use strict';

angular.module('browserAppApp')
	.service('GeopositionService', function Geoposition($resource, $http, Settings) {

		var _functionalityAvailable = false,
			_position = null;


		function getText() {
			var locationDataUrl = Settings.serverHost + '/find-nearest?lat=' +
				_position.latitude + '&lng='+
				_position.longitude;

			$http.get(locationDataUrl)
				.success(function (data) {
					console.log(data);

					var locationText = data[0].fields.town + ', ' + data[2].fields.name;
					_position.text = locationText;

					/*
					$('#id_location_text').attr('placeholder', locationText);
					if($('#hidden_location_text').length !== 0) {
						$('#hidden_location_text').val(locationText);
					}

					var oldHref, newHref;

					oldHref = $('a[data-js]').attr('data-href');
					newHref = oldHref + '?messages?location=&default_location=' +
						locationText + '&filter=&latlng=' + p.coords.latitude
						+ '%2C' + p.coords.longitude +'&radius=15&accuracy=' + p.coords.accuracy;
					$('a[data-js]').attr('href', newHref);

					*/
				}).error(function(e) {

				});
		}

		/**
		 * @description Set a timeout to rescan the GPS
		 */
		function queueTimer() {
			window.setTimeout(scanPosition, Settings.geoPositionScanInterval);
		}


		/**
		 * @description Scan the GPS
		 */
		function scanPosition() {
			geoPosition.getCurrentPosition(function(p) {
				console.log(p);
				_position = {
					shortLatitude: parseFloat(p.coords.latitude).toFixed(2),
					shortLongitude: parseFloat(p.coords.longitude).toFixed(2),
					accuracy: p.coords.accuracy,
					altitude: p.coords.altitude,
					altitudeAccuracy: p.coords.altitudeAccuracy,
					heading: p.coords.heading,
					latitude: p.coords.latitude,
					longitude: p.coords.longitude,
					speed: p.coords.speed,
					text: ''
				};

				console.log('Geoposition: ');
				console.log(_position);
				queueTimer();
				getText();
			},function(e) {
				// error somewhere
				console.log(e);
				queueTimer();
			},{
				enableHighAccuracy:true
			});
		}


		/**
		 * @description Initialise. Called on startup
		 *
		 * Starts the initialisation of geopositioning so it can be done
		 * in the background.
		 *
		 * We set a timer firing to periodically update the GPS location.
		 * This way we're not relying on callbacks when we need a position
		 *
		 */
		function initialise() {
			console.log('Initialising geoposition module');

			if(geoPosition.init()){
				console.log('Geoposition functionality ON');

				_functionalityAvailable = true;
				window.setTimeout(scanPosition, Settings.geoPositionInitialScanInterval);
			}
			else{
				console.log('Geoposition functionality OFF');
				// we have no geoposition functionality
			}
		}


		initialise();



		this.getPosition = function() {
			if(_position === null) {
				return null;
			}

			return _position;
		};


		this.isFunctionalityAvailable = function() {
			return _functionalityAvailable;
		};


		this.getLocationText = function(latitude, longitude, successCallback) {
			var locationDataUrl = Settings.serverHost + '/find-nearest?lat=' +
				latitude + '&lng='+ longitude;

			$http.get(locationDataUrl)
				.success(function (data) {
					console.log('Success');
					console.log(data);

					successCallback(data[0].fields.town + ', ' + data[2].fields.name);
				}).error(function(e) {

				});

		};

	});
