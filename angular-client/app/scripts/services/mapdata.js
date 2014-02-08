'use strict';

angular.module('browserAppApp')
	.service('Mapdata', [
		'$resource',
		'$http',
		'Authenticationservice',
		'Settings',

		function Mapdata($resource, $http, Authenticationservice, Settings) {

			var persist = {};
			var _searchNearHereLatch = false,
				settings = Settings;

			return {
				venues: function(opts, successCallback, errorCallback) {
					var session_data,
						url;

					session_data = Authenticationservice.load();
					url = '/agility-diary/venue/list' //settings.serverHost + settings.api.allSearches +
						//'?a=' + session_data.authentication_token;
					return $http.get(url).success(successCallback).error(errorCallback);
				},



				enterShow: function(id, successCallback, errorCallback) {
					var url = '/agility-diary/enterShow?id=' + id;
					return $http.get(url).success(successCallback).error(errorCallback);
				},




				resignShow: function(id, successCallback, errorCallback) {
					var url = '/agility-diary/resignShow?id=' + id;
					return $http.get(url).success(successCallback).error(errorCallback);
				},




				userData: function(opts, successCallback, errorCallback) {
					var session_data,
						url;

					session_data = Authenticationservice.load();
					url = '/agility-diary/userData';
					return $http.get(url).success(successCallback).error(errorCallback);
				},



				events: function(opts, successCallback, errorCallback) {
					var session_data,
						url;

					session_data = Authenticationservice.load();
					url = '/map/shows/upcoming' //settings.serverHost + settings.api.allSearches +
						//'?a=' + session_data.authentication_token;
					return $http.get(url).success(successCallback).error(errorCallback);
				},



				/**
				 * @description
				 * Return a combined list of all searches run on server
				 */
				allSearches: function(opts, successCallback, errorCallback) {
					var session_data,
						url;

					session_data = Authenticationservice.load();
					url = settings.serverHost + settings.api.allSearches +
						'?a=' + session_data.authentication_token;
					return $http.get(url).success(successCallback).error(errorCallback);
				},


				/**
				 * @description
				 * Return the messages for a single saved watch search
				 */
				watchList: function(opts, successCallback, errorCallback) {
					var session_data,
						url;

					session_data = Authenticationservice.load();
					url = settings.serverHost + '/view-search/' + opts.id +
						'?a=' + session_data.authentication_token;

					return $http.get(url).success(successCallback).error(errorCallback);
				},


				/**
				 * @description
				 * Fetch a list of all the saved searches
				 */
				allWatchingList: function(opts, successCallback, errorCallback) {
					var session_data,
						url;

					session_data = Authenticationservice.load();
					url = settings.serverHost + settings.api.allWatchingList +
						'?a=' + session_data.authentication_token;
					return $http.get(url).success(successCallback).error(errorCallback);
				},

				/**
				 * @description
				 * Return a list of suggestions for places
				 */
				textSearch: function(q, successCallback, errorCallback) {
					var url;

					url = settings.serverHost + settings.api.textSearch + '?q=' + escape(q);

					return $http.get(url).success(successCallback).error(errorCallback);
				},

				/**
				 * @description
				 * Return all messages within a radius of a point or a specified bounds
				 *
				 * @param opts object
				 *		lat	required
				 *		lng required
				 *
				 * Will default to roughly 10 miles.
				 *
				 * Or specify
				 *
				 *		northEastPoint object  { lat: x, lng: y}
				 *		southWestPoint object  { lat: x, lng: y}
				 */
				searchNearHere: function(opts, successCallback, errorCallback) {
					var url;

					url = settings.serverHost + settings.api.searchNearHere +
						'?a=' + 0 + //session_data.authentication_token
						'&lat=' + opts.lat +
						'&lng=' + opts.lng;

					if(_searchNearHereLatch === true) {
						return null;
					}
					_searchNearHereLatch = true;

					if (
						(typeof opts.northEastPoint !== 'undefined') &&
						(typeof opts.southWestPoint !== 'undefined')
					){
						url += '&northEastLat=' + opts.northEastPoint.lat +
							'&northEastLng=' + opts.northEastPoint.lng +
							'&southWestLat=' + opts.southWestPoint.lat +
							'&southWestLng=' + opts.southWestPoint.lng;
					}

					return $http.get(url).success(function(data) {
						_searchNearHereLatch = false;
						successCallback(data);
					}).error(function(error) {
						_searchNearHereLatch = false;
						errorCallback(error);
					});
				},


				/**
				 * @description Find the nearest town name
				 *
				 * @param lat required
				 * @param lng required
				 */
				findNearestTown: function(lat, lng, successCallback, errorCallback) {
					var url;

					url = settings.serverHost + settings.api.findNearestTown +
						'?lat=' + escape(lat) +
						'&lng=' + escape(lng);

					return $http.get(url).success(successCallback).error(errorCallback);
				},


				/**
				 * @description
				 *
				 * Post a new message
				 */
				postNewMessage: function(data, successCallback, errorCallback) {
					var session_data,
						url;

					session_data = Authenticationservice.load();
					url = settings.serverHost + settings.api.newPost + '?a=' +
						session_data.authentication_token;

					$http.post(url, data)
						.success(successCallback)
						.error(errorCallback);
				},


				updateWatching: function(id, lat, lng, successCallback, errorCallback) {
					var session_data,
						url,
						data;

					session_data = Authenticationservice.load();
					url = settings.serverHost + settings.api.updateWatching + '?a=' +
						session_data.authentication_token;

					data = {
						'id': id,
						'lat': lat,
						'lng': lng
					};

					$http.post(url, data)
						.success(successCallback)
						.error(errorCallback);
				},


				addWatching: function(lat, lng, successCallback, errorCallback) {
					var session_data,
						url,
						data;

					session_data = Authenticationservice.load();
					url = settings.serverHost + settings.api.addWatching + '?a=' +
						session_data.authentication_token;

					data = {
						'lat': lat,
						'lng': lng
					};

					$http.post(url, data)
						.success(successCallback)
						.error(errorCallback);
				}
			};
		}
	]);

