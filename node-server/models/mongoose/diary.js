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
			Deleted: {
				type: Boolean,
				default: false
			},

			Profile: {
				Name: String,
				DateOfBirth: Date,
				Photo: String,
				Sex: String,
				Breed: String,
				KennelClub: {
					Height: String,
					Grade: String,
					RegisteredName: String,
					RegisteredNumber: String
				},
				Microchip: String,
				Tattoo: String
			},

			Results: [
				{
					Show: {
						type: mongoose.Schema.Types.ObjectId,
						ref: 'Show'
					},

					Class: String,

					Date: Date,

					Time: String,

					Faults: String,

					Place: String,

					Judge: String,

					Points: String
				}
			]
		}
	]
});




module.exports = mongoose.model('Diary', diarySchema);
