module.exports = {
	db: '192.168.1.111',
	dbconnection: 'mongodb://192.168.1.111:27017/agilitynet',
	amqp: 'amqp://192.168.1.111',

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
		clientID: '1399023843698329',
		clientSecret: 'a66218150180079a44c8d1e72cf2d83d',
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
		clientID: '783463788712-mrpp3oehptuihn513uj2ab4h459gk3vb.apps.googleusercontent.com',
		clientSecret: 'cHjCpEcwGLQJx-Jqg5PUbSq8',
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
