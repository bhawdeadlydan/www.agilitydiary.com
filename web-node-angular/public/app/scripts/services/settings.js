'use strict';

angular.module('browserAppApp')
  .service('Settings', function Settings() {

    var module = {
		serverHost: 'http://www.jellyvine.com',

		geoPositionInitialScanInterval: 0,
		geoPositionScanInterval: 		60*1000,
		centreMapRefresh: 				200,

		api: {
			newPost: 			'/new-post-js',
			allSearches: 		'/all-searches',
			allWatchingList: 	'/all-watching',
			searchNearHere: 	'/quick-box',
			textSearch: 		'/text-search',
			findNearestTown: 	'/find-nearest',
			updateWatching: 	'/update-watching',
			addWatching:	 	'/add-watching',
			signUp: 			'/sign-up-js'
		},

		// time to wait before starting an API search
		searchApiPause: 200
	};

	// override development
	if ((typeof window.settings !==	'undefined') &&
		(typeof window.settings.server !== 'undefined')) {
		module.serverHost = 'http://'.concat(window.settings.server);
	}

	return module;
  });
