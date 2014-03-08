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

	default:
		return 'Untagged';
	}
}




var monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
]




/**
 * Show ViewModel
 *
 * @param {object} data Mongoose document from Show Schema
 */
module.exports = function (data, done) {
	if (data === null) {
		return {};
	}

	//data = data.toJSON();

	return {
		_id: typeof data._id !== 'undefined' ? data._id : null,
		Name: data.Name,
		Club: data.Club,
		ShowDate: data.ShowDate,
		ShowEnd: data.ShowEnd,
		ClosingDate: data.ClosingDate,

		ParsedDate: data.ParsedDate,
		ParsedEnd: data.ParsedEnd,
		ParsedClosingDate: data.ParsedClosingDate,

		ShowMonth: monthNames[data.ShowDate.split('/')[1] - 1],
		ShowYear: data.ShowDate.split('/')[2],

		//NumberOfDays: Math.round(Math.abs((new Date(data.ParsedEnd).getTime() - new Date(data.ParsedDate)).getTime())/(24*60*60*1000))),

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
		},

		Attending: data.Attending,

		UserPhotos: data.UserPhotos
	};
};
