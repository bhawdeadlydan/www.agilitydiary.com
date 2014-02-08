/**
 * GET /
 * Home page.
 */
var path = require('path');

exports.index = function(req, res) {
  //res.render('home', {
  //  title: 'Home'
  //});

  res.sendfile(path.join(__dirname, '..', '..', 'angular-client', 'app','index.html'));
};
