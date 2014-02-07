'use strict';

describe('Controller: AgilityeventsCtrl', function () {

  // load the controller's module
  beforeEach(module('browserAppApp'));

  var AgilityeventsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AgilityeventsCtrl = $controller('AgilityeventsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
