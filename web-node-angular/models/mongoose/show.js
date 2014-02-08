/**
 * @module
 */
var mongoose = require('mongoose');
require('mongoose-double')(mongoose);


/**
 * A single show
 */
var showSchema = mongoose.Schema({
	Name: String,
	Club: String,
	Clubs: Array,
	ShowDate: String,
	ShowEnd: String,
	ClosingDate: String,

	ParsedDate: Date,
	ParsedEnd: Date,
	ParsedClosingDate: Date,

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
	Website: String,

	Meta: {
		ShowTypeColour: String
	}
});


module.exports = mongoose.model('Show', showSchema);
