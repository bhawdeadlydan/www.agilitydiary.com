'use strict';

describe('Service: Geoposition', function () {

  // load the service's module
  beforeEach(module('browserAppApp'));

  // instantiate service
  var Geoposition;
  beforeEach(inject(function (_Geoposition_) {
    Geoposition = _Geoposition_;
  }));

  it('should do something', function () {
    expect(!!Geoposition).toBe(true);
  });

});
