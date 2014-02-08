var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
	name: String,

});

module.exports = mongoose.model('Event', eventSchema);

