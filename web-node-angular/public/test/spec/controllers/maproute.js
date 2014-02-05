'use strict';

describe('Controller: MaprouteCtrl', function () {

  // load the controller's module
  beforeEach(module('browserAppApp'));

  var MaprouteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaprouteCtrl = $controller('MaprouteCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
