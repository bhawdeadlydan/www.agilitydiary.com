var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
	User: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},

	Item: {
		type: mongoose.Schema.Types.ObjectId,
	},

	Message: String,

	DateTime: {
		type: Date,

		default: Date.now
	}
});

module.exports = mongoose.model('Comment', commentSchema);

