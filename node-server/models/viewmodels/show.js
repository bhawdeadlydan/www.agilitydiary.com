var PostCodeModel = require('../mongoose/postcode');

function getShowType(data) {

	var colour = typeof data.Meta.ShowTypeColour !== 'undefined' ? data.Meta.ShowTypeColour : '';

	switch (colour) {
	case '#0000FF':
		return 'BAA';

	case '#FF33FF':
		return 'FAB';

	case '#0099CC':
		return 'Independent';

	case '#FFFF00':
		return 'Invitation';

	case '#99FF66':
		return 'Irish Kennel Club';

	case '#006600':
		return 'KC';

	case '#663399':
		return 'Other';

	case  '#0099CC':
		return 'Series';

	case '#996633':
		return 'Training';

	case '#FF0000':
		return 'UKA';
	}
}




/**
 * Show ViewModel
 *
 * @param {object} data Mongoose document from Show Schema
 */
module.exports = function (data, done) {
	return {
		_id: data._id,
		Name: data.Name,
		Club: data.Club,
		ShowDate: data.ShowDate,
		ShowEnd: data.ShowEnd,
		ClosingDate: data.ClosingDate,

		ParsedDate: data.ParsedDate,
		ParsedEnd: data.ParsedEnd,
		ParsedClosingDate: data.ParsedClosingDate,

		Venue: {
			Name: data.Venue.Name,
			Address: data.Venue.Address,
			PostCode: data.Venue.PostCode,
			Id: data.Venue.Id
		},

		Location: {
			Latitude: data.Location.Latitude,
			Longitude: data.Location.Longitude
		},

		EntriesTo: data.EntriesTo,
		Files: data.Files,
		Logo: data.Logo,
		Website: data.Website,

		Meta: {
			ShowTypeColour: typeof data.Meta.ShowTypeColour !== 'undefined' ? data.Meta.ShowTypeColour : '',
			ShowType: getShowType(data)
		}
	};
}