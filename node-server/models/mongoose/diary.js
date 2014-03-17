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

	Friends: [
		{
			LinkedUser: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}
		}
	],

	Journal: [
		{
			Message: String,

			DateTime: {
				type: Date,
				default: Date.now
			},

			TagsText: String,

			Links: [
				{
					LinkedObject: mongoose.Schema.Types.ObjectId,

					LinkType: String
				}
			]
		}
	],

	PendingPhotos: [
		{
			Path: String
		}
	],

	Photos: [
		{
			Path: String,

			DateTime: {
				type: Date,
				default: Date.now
			}
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

					Date: Date,
					Class: {
						Number: String,
						Type: String,
						Name: String
					},
					Time: String,
					Faults: String,
					Place: String,
					Judge: String,
					Points: String,
					Notes: String
				}
			],

			Photos: [
				{
					Path: String,
				}
			]
		}
	]
});




module.exports = mongoose.model('Diary', diarySchema);
