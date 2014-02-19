/**
 * GET /
 * Home page.
 */
var path = require('path');

exports.index = function (req, res) {
	if (req.user) {
		res.sendfile(path.join(__dirname, '..', '..', 'angular-client', 'app', 'index.html'));
	} else {
		res.render('account/login.jade', {
			title: 'Login'
		});
	}
};
