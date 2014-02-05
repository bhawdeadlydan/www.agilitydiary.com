'use strict';

describe('Directive: leaflet', function () {

  // load the directive's module
  beforeEach(module('browserAppApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<leaflet></leaflet>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the leaflet directive');
  }));
});
