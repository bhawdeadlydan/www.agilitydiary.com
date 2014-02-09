var mongoose = require('mongoose');

var diarySchema = new mongoose.Schema({
	User: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},

	EnteredShows: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Show'
		}
	],

	Dogs: [
		{
			Profile: {
				Name: String,
				DateOfBirth: Date,
				Photo: String,
				Sex: String
			}
		}
	]
});




module.exports = mongoose.model('Diary', diarySchema);