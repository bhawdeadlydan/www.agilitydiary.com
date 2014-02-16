var _ = require('underscore');

module.exports = function (data) {
	"use strict";




	function getEnabledDogs() {
		var result = [];

		_.each(data.Dogs, function (dogIterator) {
			if (dogIterator.Deleted === false) {
				result.push(dogIterator);
			}
		});

		return result;
	}




	var result = {
		User: data.User,

		EnteredShows: data.EnteredShows,

		Dogs: getEnabledDogs(data.Dogs)
	};

	return result;
};
