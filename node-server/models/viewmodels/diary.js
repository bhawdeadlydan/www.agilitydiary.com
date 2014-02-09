var _ = require('underscore');

module.exports = function (data) {
	"use strict";




	function getEnabledDogs() {
		var result = [];

		_.each(data.Dogs, function (dogIterator) {
			if (dogIterator.Status === 'enabled') {
				result.push(dog);
			}
		});

		return result;
	}




	var result = {
		User: data.User,

		EnteredShows: data.EnteredShows,

		Dogs: getEnabledDogs()
	};

	return result;
};