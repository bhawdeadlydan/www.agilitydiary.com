'use strict';

angular.module('browserAppApp')
.service('Authenticationservice', [
	'$resource',
	'$http',
	'Localstoragedataservice', function Authenticationservice($resource, $http, Localstoragedataservice) {

		var persist = {};

		return {
			quicksaveAccount: function(data) {
				var localRow;

				localRow = Localstoragedataservice.newItem(data);
				Localstoragedataservice.save([localRow], 'quicksaveAccount');

				console.log('Saving');
				console.log(data);
			},

			quickloadAccount: function() {
				var persistedData,
					storedData;

				storedData = Localstoragedataservice.list('quicksaveAccount');
				if(storedData.length === 1) {
					return storedData[0];
				}

				return {};
			},

			save: function(data) {
				var localRow;

				persist['data'] = data;

				localRow = Localstoragedataservice.newItem(data);
				Localstoragedataservice.save([localRow], 'authentication');

				console.log('Saving');
				console.log(data);
			},

			load: function() {
				var persistedData,
					storedData;

				storedData = Localstoragedataservice.list('authentication');
				if(storedData.length === 1) {
					persist['data'] = storedData[0];
				}

				return persist['data'];
			},

			signIn: function(data, successCallback, errorCallback) {
				var url = settings.serverHost + '/sign-in?username=' + data.username + '&password=' + data.password;

				console.log('GET ' + url);
				return $http.get(url/*,
					{
						headers: {
							'Authorization': functions.authorizationHeader(username, password),
							'Accept': 'application/json'
						}
					}*/
				).success(successCallback).error(errorCallback);
			},


			signUp: function(data, successCallback, errorCallback) {
				var session_data,
					url;

				url = settings.serverHost + settings.api.signUp;

				$http.post(url, data)
					.success(successCallback)
					.error(errorCallback);
			},

			isSignedIn: function() {
				if((typeof persist['data'] !== 'undefined') && (typeof persist['data'].authentication_token !== 'undefined')) {
					return true;
				} else {
					return false;
				}
			},
		};
	}]);
