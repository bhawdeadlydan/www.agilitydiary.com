module.exports = {
	db: 'Boxa',
	// db: '127.0.0.1',
	dbconnection: 'mongodb://Boxa:27017/agilitynet',
	// dbconnection: 'mongodb://127.0.0.1:27017/agilitynet',

	sendgrid: {
		user: 'Your SendGrid Username',
		password: 'Your SendGrid Password'
	},

	nyt: {
		key: 'Your New York Times API Key'
	},

	lastfm: {
		api_key: 'Your API Key',
		secret: 'Your API Secret'
	},

	facebook: {
		clientID: 'Your App ID',
		clientSecret: 'Your App Secret',
		callbackURL: '/auth/facebook/callback',
		passReqToCallback: true
	},

	github: {
		clientID: 'Your Client ID',
		clientSecret: 'Your Client Secret',
		callbackURL: '/auth/github/callback',
		passReqToCallback: true
	},

	twitter: {
		consumerKey: 'QUSx5AyMLzebfuJxyFjRw',
		consumerSecret: '9qZvjSEFvfTsElby8tuAdh93Tj9cK1dgKdJQlUYkE',
		callbackURL: '/auth/twitter/callback',
		passReqToCallback: true
	},

	google: {
		clientID: 'Your Client ID',
		clientSecret: 'Your Client Secret',
		callbackURL: '/auth/google/callback',
		passReqToCallback: true
	},

	tumblr: {
		consumerKey: 'Your Consumer Key',
		consumerSecret: 'Your Consumer Secret',
		callbackURL: '/auth/tumblr/callback'
	},

	foursquare: {
		clientId: 'Your Client ID',
		clientSecret: 'Your Client Secret',
		redirectUrl: 'http://localhost:3000/auth/foursquare/callback'
	},

	paypal: {
		host: 'api.sandbox.paypal.com', // or api.paypal.com
		client_id: 'Your Client ID',
		client_secret: 'Your Client Secret',
		returnUrl: 'http://localhost:3000/api/paypal/success',
		cancelUrl: 'http://localhost:3000/api/paypal/cancel'
	}
};
