// dropzone
angular.module('browserAppApp')
	.directive('dynamicStyle', ['$rootScope', '$timeout', 'CommentsService', function popup($rootScope, $timeout, CommentsService) {
		return {
			templateUrl: 'app/templates/directives/dynamicStyle.css',
			link: function link(scope, element, attrs) {
				scope.dynamicProfileSelectedColour =  scope.getSelectedProfileColour();
			}
		};
	}]);
