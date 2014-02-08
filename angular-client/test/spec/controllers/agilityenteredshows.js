'use strict';

describe('Controller: AgilityenteredshowsCtrl', function () {

  // load the controller's module
  beforeEach(module('browserAppApp'));

  var AgilityenteredshowsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AgilityenteredshowsCtrl = $controller('AgilityenteredshowsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
