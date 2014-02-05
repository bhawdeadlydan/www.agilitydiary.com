"use strict";
/* use strict */
/* global require, exports */
/* jshint unused: false */
/* jshint quotmark:false */

exports.configuration = {
	endBlock: '<?xml version="1.0" ?><response><showdate></showdate><showend></showend><closingdate></closingdate><files></files><error></error></response>',

	url: 'http://agilitynet.co.uk/activepages/requestShowsAtAglance.asp?cmd=getdetails&id=',

	mongodb: 'mongodb://127.0.0.1:27017/agilitynet'
};