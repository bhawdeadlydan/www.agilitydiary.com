var mongoose = require('mongoose');

var venueSchema = mongoose.Schema({
	name: String,
	address: String,
	postcode: String,
	location: {
		latitude: Number,
		longitude: Number
	}
});

module.exports = mongoose.model('Venue', venueSchema);

