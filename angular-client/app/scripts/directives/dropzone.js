// dropzone
angular.module('browserAppApp')
	.directive('dropZone', ['$rootScope', '$timeout', 'CommentsService', function popup($rootScope, $timeout, CommentsService) {
		return {
			restrict: 'E',

			templateUrl: 'app/templates/directives/dropZone.html',

			scope: {
			},
			link: function link($scope, $element, attrs) {
				var profileDropzone = new Dropzone('div#uploadPhoto', {
					url: '/agility-diary/user/upload-photo',
					previewTemplate: '<div id="dz-preview-template" class="dz-preview dz-file-preview"><div class="dz-details">       <div class="dz-filename"><span data-dz-name></span></div><div class="dz-size" data-dz-size></div><img data-dz-thumbnail /></div><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div></div>'
				});

				profileDropzone.on('complete', function file() {
					profileDropzone.removeFile(file);
					profileDropzone.removeAllFiles();
					$scope.fetchProfile();
				});

				$element.bind('dragover', function () {
				});
			},
			controller: function ($scope, $element) {


			}
		};
	}]);
