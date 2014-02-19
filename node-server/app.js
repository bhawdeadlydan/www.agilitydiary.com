/**
 * Module dependencies.
 */

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
require('mongoose-double')(mongoose); // patch mongoose
var passport = require('passport');
var expressValidator = require('express-validator');




/**
 * Controllers
 */

var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var commentsController = require('./controllers/comment');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');
var showController = require('./controllers/show');
var eventController = require('./controllers/event');
var venueController = require('./controllers/venue');
var uploadController = require('./controllers/upload');
uploadController.uploadPath = __dirname + '/../workspace/photos';
var agilitynetbridgeController = require('./controllers/agilitynetbridge');




/**
 * API keys + Passport configuration.
 */

var secrets = require('./config/secrets');
var passportConf = require('./config/passport');




/**
 * Create Express server.
 */

var app = express();




/**
 * Mongoose configuration.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function () {
	console.log('✗ MongoDB Connection Error. Please make sure MongoDB is running.'.red);
});




/**
 * Express
 */

var hour = 3600000;
var day = (hour * 24);
var week = (day * 7);
var month = (day * 30);

app.locals.cacheBuster = Date.now();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser({
	uploadDir: __dirname + '/../workspace/uploads',
	keepExtensions: true
}));
app.use(express.limit('5mb'));
app.use(express.json());
app.use(express.urlencoded());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(express.session({
	secret: 'your secret code',
	store: new MongoStore({
		db: mongoose.connection.db,
		auto_reconnect: true
	})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
	res.locals.user = req.user;
	next();
});
app.use(flash());
//app.use(less({ src: __dirname + '/public', compress: true }));
app.use(app.router);




/**
 * Static folders (should be mapped in Nginx)
 */
app.use('app', express.static(__dirname + '../angular-client/app'));

app.use('/static', function (req, res) {
	var pathName = path.join(__dirname, '..', 'static', req.path);
	res.sendfile(pathName);
});

app.use('/workspace/photos', function (req, res) {
	var pathName = path.join(__dirname, '..', 'workspace/photos', req.path);
	res.sendfile(pathName);
});

app.use('/bower_components', function (req, res) {
	var pathName = path.join(__dirname, '..', 'angular-client', 'app', 'bower_components', req.path);
	res.sendfile(pathName);
});

//app.use('/bower_components', express.static(__dirname + '../public/app/bower_components'));
app.use(express.static(path.join(__dirname, '../angular-client'), { maxAge: week }));

app.use(function (req, res) {
	//res.sendfile(path.join(__dirname, '..', '/public', 'app','index.html'));
	res.status(404);
	res.render('404');
});
app.use(express.errorHandler());




/**
 * Routes
 */

app.get('/agility-diary/shows/list', showController.list);
app.get('/agility-diary/shows/upcoming', showController.upcomingList);
app.get('/agility-diary/shows/previous', showController.previousList);
app.get('/agility-diary/shows/todays', showController.todaysList);

app.get('/agility-diary/show/details', showController.details);
app.get('/agility-diary/show/categories', showController.categories);

app.get('/agility-diary/venue/list', venueController.list);
app.get('/agility-diary/userData', userController.userData);

app.post('/agility-diary/user/add-dog', userController.addDog);
app.post('/agility-diary/user/delete-dog', userController.deleteDog);
app.post('/agility-diary/user/add-result', userController.addResult);

app.post('/agility-diary/comments/add', commentsController.addComment);
app.get('/agility-diary/comments/get', commentsController.getComments);

app.get('/agility-diary/enterShow', userController.enterShow);
app.get('/agility-diary/resignShow', userController.resignShow);

app.post('/agility-diary/uploadFile', uploadController.uploadFile);




// management tools -- move out
app.get('/agilitynetbridge/requestShowsAtAGlance', agilitynetbridgeController.requestShowsAtAGlance);
app.get('/agilitynetbridge/parseImport', agilitynetbridgeController.parseImport);
app.get('/agilitynetbridge/lookupVenues', agilitynetbridgeController.lookupVenues);
app.get('/agilitynetbridge/lookupPostcode', agilitynetbridgeController.lookupPostcode);
app.get('/agilitynetbridge/populateVenueLatLng', agilitynetbridgeController.populateVenueLatLng);
app.get('/agilitynetbridge/populateShowLatLng', agilitynetbridgeController.populateShowLatLng);
app.get('/agilitynetbridge/populateShowVenues', agilitynetbridgeController.populateShowVenues);







app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);




/**
 *  Account pages with server side templates
 */

app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);




/**
 * API Helpers
 */

app.get('/api', apiController.getApi);
app.get('/api/foursquare', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFoursquare);
app.get('/api/tumblr', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTumblr);
app.get('/api/facebook', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFacebook);
app.get('/api/scraping', apiController.getScraping);
app.get('/api/github', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getGithub);
app.get('/api/lastfm', apiController.getLastfm);
app.get('/api/nyt', apiController.getNewYorkTimes);
app.get('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTwitter);
app.get('/api/aviary', apiController.getAviary);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);




/**
 * OAuth routes for sign-in.
 */

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));




/**
 * OAuth routes for API examples that require authorization.
 */

app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), function(req, res) {
	res.redirect('/api/foursquare');
});
app.get('/auth/tumblr', passport.authorize('tumblr'));
app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), function(req, res) {
	res.redirect('/api/tumblr');
});




/**
 * Start
 */

app.listen(app.get('port'), function() {
	console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
