define(
	[
		'js/utilities/console',
		'angular',
		'jQuery',
		'iscroll',
	],
	function(console, angular, $, iScroll) {
		angular.module('ng-iscroll', []).directive('ngIscroll', function() {
			
			return {
				replace: false,
				restrict: 'A',
				link: function(scope, element, attr){
					var _iscroll;
					
					
					/**
					 * @description Resize the element with the directive
					 */
					function resizeElement() {
						var $element = $(element)
							$parent = $('#' + attr.fit),
							$header = $('.header'),
							$footer = $('#footer'),
							height = 0,
							calculatedHeight = 0,
							innerHeight = window.innerHeight;
						
						height = $header.height();
						height += $footer.height();
						
						calculatedHeight = innerHeight - height;
						
						$element.css({
							height: calculatedHeight + 'px'
						});
						
						$footer.css({
							top:  innerHeight - $footer.height()
						});
					}
					
					
					/**
					 * @description Create the iScroll item here
					 */
					function setScroll() {
						resizeElement();
						
						_iscroll = new iScroll(document.getElementById(attr.id), {							
							momentum: true,
							hScrollbar: false,
							vScrollbar: true
						});
					}
					
					
					/**
					 * @event The data has been added to the element,
					 * iScroll needs the element to be fullsize before it works.
					 */
					scope.$watch(attr.ngIscroll, function(value) {
						scope.$on('iScrollBind', setScroll);
					});
					
					
					/**
					 * @event Data has changed, tell iScroll to refresh
					 */
					scope.$on('iScrollrefresh', function() {
						console.log('ISCROLL refresh');
						
						setTimeout(function () {
							_iscroll.refresh();
							_iscroll.scrollTo(0, 0, 1000);
						}, 1);
					});
					
					
					/**
					 * @event The element is being removed. Destroy iScroll and
					 * free up the memory.
					 */
					element.bind('$destroy', function() {
						console.log('destroy');
						if(typeof _iscroll !== 'undefined') {
							_iscroll.destroy(true);	
						}
					});
				}
			};
		});
	}
);