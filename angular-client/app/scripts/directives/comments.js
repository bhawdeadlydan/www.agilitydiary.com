angular.module('browserAppApp')
	.directive('comments', ['$rootScope', '$timeout', 'CommentsService', function popup($rootScope, $timeout, CommentsService) {
		return {
			templateUrl: 'app/templates/directives/comments.html',
			restrict: 'E',
			scope: {
				'item': '=',
			},
			link: function link(scope, element, attrs) {
				scope.commentList = {};

				console.log('link comments');
				CommentsService.getComments(scope.item)
					.success(function (data) {
						scope.commentList = data;
					})
					.error(function (data) {

					});
			},
			controller: function ($scope, $element) {

				function commentSuccess() {
					CommentsService.getComments($scope.item)
						.success(function (data) {
							$scope.commentList = data;
							$scope.message = '';
						})
						.error(function (data) {

						});
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
