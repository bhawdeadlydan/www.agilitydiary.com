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

		UserPhotos: data.UserPhotos,

		Weather: {
			WorldWeatherOnline: {
				"data": {
					"current_condition": [{
						"cloudcover": "50",
						"humidity": "72",
						"observation_time": "12:33 PM",
						"precipMM": "0.0",
						"pressure": "1021",
						"temp_C": "14",
						"temp_F": "57",
						"visibility": "10",
						"weatherCode": "116",
						"weatherDesc": [{
							"value": "Partly Cloudy"
						}],
						"weatherIconUrl": [{
							"value": "http:\/\/cdn.worldweatheronline.net\/images\/wsymbols01_png_64\/wsymbol_0002_sunny_intervals.png"
						}],
						"winddir16Point": "SW",
						"winddirDegree": "220",
						"windspeedKmph": "15",
						"windspeedMiles": "9"
					}],
					"request": [{
						"query": "Lat 52.18 and Lon -2.54",
						"type": "LatLon"
					}],
					"weather": [{
						"date": "2014-03-07",
						"precipMM": "3.1",
						"tempMaxC": "13",
						"tempMaxF": "55",
						"tempMinC": "2",
						"tempMinF": "35",
						"weatherCode": "113",
						"weatherDesc": [{
							"value": "Sunny"
						}],
						"weatherIconUrl": [{
							"value": "http:\/\/cdn.worldweatheronline.net\/images\/wsymbols01_png_64\/wsymbol_0001_sunny.png"
						}],
						"winddir16Point": "WNW",
						"winddirDegree": "284",
						"winddirection": "WNW",
						"windspeedKmph": "28",
						"windspeedMiles": "17"
					}, {
						"date": "2014-03-08",
						"precipMM": "0.2",
						"tempMaxC": "14",
						"tempMaxF": "57",
						"tempMinC": "4",
						"tempMinF": "40",
						"weatherCode": "113",
						"weatherDesc": [{
							"value": "Sunny"
						}],
						"weatherIconUrl": [{
							"value": "http:\/\/cdn.worldweatheronline.net\/images\/wsymbols01_png_64\/wsymbol_0001_sunny.png"
						}],
						"winddir16Point": "S",
						"winddirDegree": "178",
						"winddirection": "S",
						"windspeedKmph": "31",
						"windspeedMiles": "19"
					}, {
						"date": "2014-03-09",
						"precipMM": "0.0",
						"tempMaxC": "16",
						"tempMaxF": "61",
						"tempMinC": "5",
						"tempMinF": "42",
						"weatherCode": "113",
						"weatherDesc": [{
							"value": "Sunny"
						}],
						"weatherIconUrl": [{
							"value": "http:\/\/cdn.worldweatheronline.net\/images\/wsymbols01_png_64\/wsymbol_0001_sunny.png"
						}],
						"winddir16Point": "S",
						"winddirDegree": "187",
						"winddirection": "S",
						"windspeedKmph": "19",
						"windspeedMiles": "12"
					}, {
						"date": "2014-03-10",
						"precipMM": "0.4",
						"tempMaxC": "12",
						"tempMaxF": "54",
						"tempMinC": "5",
						"tempMinF": "41",
						"weatherCode": "116",
						"weatherDesc": [{
							"value": "Partly Cloudy"
						}],
						"weatherIconUrl": [{
							"value": "http:\/\/cdn.worldweatheronline.net\/images\/wsymbols01_png_64\/wsymbol_0002_sunny_intervals.png"
						}],
						"winddir16Point": "ENE",
						"winddirDegree": "57",
						"winddirection": "ENE",
						"windspeedKmph": "13",
						"windspeedMiles": "8"
					}, {
						"date": "2014-03-11",
						"precipMM": "0.3",
						"tempMaxC": "15",
						"tempMaxF": "58",
						"tempMinC": "2",
						"tempMinF": "35",
						"weatherCode": "113",
						"weatherDesc": [{
							"value": "Sunny"
						}],
						"weatherIconUrl": [{
							"value": "http:\/\/cdn.worldweatheronline.net\/images\/wsymbols01_png_64\/wsymbol_0001_sunny.png"
						}],
						"winddir16Point": "ENE",
						"winddirDegree": "72",
						"winddirection": "ENE",
						"windspeedKmph": "10",
						"windspeedMiles": "6"
					}]
				}
			}
		}
	};
};
