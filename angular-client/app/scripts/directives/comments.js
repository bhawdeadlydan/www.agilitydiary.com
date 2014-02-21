angular.module('browserAppApp')
	.directive('comments', ['$rootScope', '$timeout', '$interval', 'CommentsService', function popup($rootScope, $timeout, $interval, CommentsService) {
		return {
			templateUrl: 'app/templates/directives/comments.html',
			restrict: 'E',
			scope: {
				'item': '=',
			},
			link: function link(scope, element, attrs) {
				var timeoutId;

				scope.commentList = {};

				console.log('link comments');
				/*CommentsService.getComments(scope.item)
					.success(function (data) {
						scope.commentList = data;
					})
					.error(function (data) {

					});*/


				timeoutId = $interval(function () {
					loadComments();
				}, 5000);

				element.on('$destroy', function () {
					$interval.cancel(timeoutId);
				});


				function loadComments() {
					CommentsService.getComments(scope.item)
						.success(function (data) {
							if (!angular.equals(scope.commentList, data)) {
								scope.commentList = data;
							}
						})
						.error(function (data) {

						});
				}
			},
			controller: function ($scope, $element) {


				function commentSuccess() {
					//loadComments();
					$scope.message = '';
				}

				$scope.addComment = function () {
					if ($scope.commentsForm.$valid === true) {
						CommentsService.addComments({
							itemId: $scope.item,
							message: $scope.message
						}).success(commentSuccess);
					}
				};
			}
		};
	}]);
