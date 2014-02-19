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

				$timeout(loadComments, 1000);

				function loadComments() {
					CommentsService.getComments($scope.item)
						.success(function (data) {
							$scope.commentList = data;

							$timeout(loadComments, 1000);
						})
						.error(function (data) {
							$timeout(loadComments, 1000);
						});
				}

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
