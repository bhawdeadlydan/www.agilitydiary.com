angular.module('browserAppApp')
	.directive('quickSearch', [
		'$rootScope',
		'$timeout',
		'SearchService',
		'$location',
		function popup($rootScope, $timeout, SearchService, $location) {
			return {
				templateUrl: 'app/templates/directives/quickSearch.html',

				link: function link(scope, element, attrs) {

					var $scope = scope;

					$scope.quicksearch = {};
					$scope.quicksearch.results = [];
					$scope.quicksearch.query = '';
					$scope.quicksearch.change = quickSearch;
					$scope.quicksearch.timeout = null;
					$scope.quicksearch.searching = false;
					$scope.navigateToItem = navigateToItem;




					function cancelExistingSearch() {
						if ($scope.quicksearch.timeout !== null) {
							$timeout.cancel($scope.quicksearch.timeout);
						}
						$scope.quicksearch.cssClass = '';
					}




					function notifySearching() {
						$scope.quicksearch.searching = true;
						$scope.quicksearch.cssClass = 'searching';
					}




					function notifyFinishedSearching() {
						$scope.quicksearch.searching = false;
						$scope.quicksearch.cssClass = '';
					}




					function navigateToItem(path) {
						console.log('Quicksearch navigate to: ' + path);

						cancelExistingSearch();
						$scope.quicksearch.results = [];
						$scope.quicksearch.query = '';
						$location.path(path);
					}




					function quicksearchAddPaths(data) {
						_.each(data.Results, function (item) {
							// default to the image from the server
							item.ImagePath = item.Img;

							switch (item.Type) {
							case 'Show':
								item.Path = '/shows/details/' + item.Id;
								break;

							case 'User':
								item.Path = '/users/' + item.Id;
								break;

							case 'Venue':
								item.Path = '/users/details/' + item.Id;
								break;

							case 'Dog':
								item.Path = '/dogs/' + item.Id;
								break;
							}
						});

						return data;
					}




					function quickSearch() {
						cancelExistingSearch();

						$scope.quicksearch.query = $scope.quicksearch.query.trim();

						if ($scope.quicksearch.query === '') {
							$scope.quicksearch.results = [];
						} else {
							notifySearching();

							$scope.quicksearch.timeout = $timeout(function () {
								SearchService.quickSearch($scope.quicksearch.query, function (data) {
									notifyFinishedSearching();

									data = quicksearchAddPaths(data);
									$scope.quicksearch.results = data;
								}, function (error) {
									$scope.quicksearch.searching = false;
								});
							}, 1000);
						}
					}

				}
			};
		}
	]);
