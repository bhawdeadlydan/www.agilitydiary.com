var mongoose = require('mongoose');
require('mongoose-double')(mongoose);

var showSchema = mongoose.Schema({
	Name: String,
	Clubs: Array,
	ShowDate: Date,
	ShowEnd: Date,
	ClosingDate: Date,
	Venue: {
		Name: String,
		Address: String,
		PostCode: String,
	},

	Location: {
		Latitude: mongoose.Schema.Types.Double,
		Longitude: mongoose.Schema.Types.Double
	},

	EntriesTo: String,
	Files: Array,
	Logo: String,
	Website: String
});

module.exports = mongoose.model('Show', showSchema);
