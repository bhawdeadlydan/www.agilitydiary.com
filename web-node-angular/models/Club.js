var mongoose = require('mongoose');

var clubSchema = mongoose.Schema({
	name: String
});

module.exports = mongoose.model('Club', clubSchema);

