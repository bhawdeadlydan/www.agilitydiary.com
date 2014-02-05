define(
	[
		'js/utilities/console',
		'jQuery',
		'angular-raw'
	], function(console, $) {
		console.log('In Angular Bootstrap');
		console.log('Angular is '+ angular);
		return window.angular;
	}
);
