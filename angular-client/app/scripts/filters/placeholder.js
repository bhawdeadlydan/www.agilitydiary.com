angular.module('imageFilters', [])
	.filter('placeholder', function () {
		return function (value) {
			var placeholder = false;

			if (!angular.isDefined(value)) {
				placeholder = true;
			} else {
				if (value === '') {
					placeholder = true;
				}
			}

			if (placeholder) {

			} else {
				return value;
			}
		};
	});


angular.module('imageFilters')
	.filter('imageSize', function () {
		return function (value, size) {
			console.log(value);
			console.log(size);

			var placeholder = false;

			if (!angular.isDefined(value)) {
				placeholder = true;
			} else {
				if (value === '') {
					placeholder = true;
				}
			}

			if (placeholder) {
				return 'http://placehold.it/' + size;
			} else {
				return [ value, '_', size ].join('');
			}
		};
	});
