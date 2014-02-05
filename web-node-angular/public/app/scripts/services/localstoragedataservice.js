'use strict';

angular.module('browserAppApp')
  .service('Localstoragedataservice', function Localstoragedataservice() {
    /**
	 * collection so we can access the methods inbetween
	 * @type {Object}
	 */
	var functions = {

		/**
		 * Add an item to the list
		 * @param {object} data   JSON object containing the row data
		 * @param {string} listId text nane of the list. Example: 'dogs'
		 */
		add: function(data, listId) {
			var dataList = functions.list(listId);
			dataList.push(data);
			functions.save(dataList, listId);
		},

		/**
		 * Edit an item in the list
		 * @param  {[type]} data [description]
		 * @param {string} listId text name of the list. Example: 'dogs'
		 * @return {[type]}      [description]
		 */
		edit: function(data) {

		},

		/**
		 * Read a list of items from localstorage
		 * @param  {string} listId The name of the localstorage key
		 * @return {array}
		 */
		list: function(listId) {
			if(typeof(localStorage[listId]) === 'undefined') {
				functions.save([], listId);
			}

			return JSON.parse(localStorage[listId]);
		},

		/**
		 * Save a list into localstorage
		 * @param  {array} data   Data to store
		 * @param  {string} listId key for localstorage
		 */
		save: function(data, listId) {
			localStorage[listId] = JSON.stringify(data);
		},

		/**
		 * Generate a guid
		 * @return {string} useful id
		 */
		guid: function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(character) {
				var randomNumber = Math.random()*16|0;
				var replaceCharacter = character === 'x' ? randomNumber : (randomNumber & 0x3|0x8);
				return replaceCharacter.toString(16);
			});
		},

		/**
		 * Return the current datetime, separated by -
		 */
		now: function() {
			var date = new Date();
			var combine = [
				date.getFullYear(),
				("0" + (date.getMonth() + 1)).slice(-2),
				("0" + date.getDate()).slice(-2),
				date.getHours(),
				date.getMinutes(),
				date.getSeconds(),
				date.getMilliseconds()
			];
			return combine.join('-');
		},

		/**
		 * Return a base object to extend
		 */
		newItem: function(config) {
			var baseItem = {
				status: 'new',
				rowId: functions.guid(),
				modified_date: functions.now(),
				created_date: new Date()
			};
			var modifiedItem = _.extend(baseItem, config);
			return modifiedItem;
		},

		/**
		 * Clear localstorage for logout
		 */
		clear: function() {
			localStorage.clear();
		}
	};

	return functions;
  });
