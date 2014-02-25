// dropzone
angular.module('browserAppApp')
	.directive('dynamicStyle', ['$rootScope', '$timeout', 'CommentsService', function popup($rootScope, $timeout, CommentsService) {
		return {
			templateUrl: 'app/templates/directives/dynamicStyle.css',

			scope: {
				selectedProfileColour: '=colour'
			},

			link: function link(scope, element, attrs) {
				if (angular.isDefined(scope.selectedProfileColour)) {

				} else {
					scope.selectedProfileColour = '#fff';
				}
			}
		};
	}]);
