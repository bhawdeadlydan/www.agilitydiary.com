// dropzone
angular.module('browserAppApp')
	.directive('dropZone', ['$rootScope', '$timeout', 'CommentsService', function popup($rootScope, $timeout, CommentsService) {
		return {
			restrict: 'E',
			scope: {
			},
			link: function link($scope, $element, attrs) {

				$element.bind('dragover', function() {
				});
			},
			controller: function ($scope, $element) {


			}
		};
	}]);
