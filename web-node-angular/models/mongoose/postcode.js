var mongoose = require('mongoose');
require('mongoose-double')(mongoose); // patch mongoose

var postCodeSchema = mongoose.Schema({
	Postcode: String,
	Latitude: mongoose.Schema.Types.Double,
	Longitude: mongoose.Schema.Types.Double,
	Easting: Number,
	Northing: Number,
	GridRef: String,
	County: String,
	District: String,
	Country: String,
	Terminated: String
});

postCodeSchema.index({ Postcode: 1 });

module.exports = mongoose.model('postcode', postCodeSchema);

