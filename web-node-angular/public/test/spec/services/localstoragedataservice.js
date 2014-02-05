'use strict';

describe('Service: Localstoragedataservice', function () {

  // load the service's module
  beforeEach(module('browserAppApp'));

  // instantiate service
  var Localstoragedataservice;
  beforeEach(inject(function (_Localstoragedataservice_) {
    Localstoragedataservice = _Localstoragedataservice_;
  }));

  it('should do something', function () {
    expect(!!Localstoragedataservice).toBe(true);
  });

});
