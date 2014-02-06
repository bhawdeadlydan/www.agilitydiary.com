var mongoose = require('mongoose');

var mapLocationSchema = mongoose.Schema({
	name: String
});

module.exports = mongoose.model('MapLocation', mapLocationSchema);