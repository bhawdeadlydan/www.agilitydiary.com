var _ = require('underscore');
var mongoose = require('mongoose');

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
	
	
	
	
	function getJournal(data) {
		var result = [];
		
		_.each(data.Journal, function (journalIterator) {
			for (var i=0; i< journalIterator.Links.length; i++) {
				var linkedObject = journalIterator.Links[i];
				
				if (linkedObject.LinkType === 'Photo') {
					
					_.each(data.Photos, function (loopPhoto) {
						if (loopPhoto._id.toString() == linkedObject.LinkedObject) {
							linkedObject['Path'] = loopPhoto.Path;
						}
					});
				}
			}
						
			result.push(journalIterator);
		});
		
		return result;
	}




	var result = {
		User: data.User,

		EnteredShows: data.EnteredShows,

		Friends: data.Friends,

		Dogs: getEnabledDogs(data.Dogs),

		Photos: data.Photos,
		
		PendingPhotos: data.PendingPhotos,
		
		Journal: getJournal(data)
	};

	return result;
};
