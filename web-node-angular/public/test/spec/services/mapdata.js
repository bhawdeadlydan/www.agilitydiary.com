'use strict';

describe('Service: Mapdata', function () {

  // load the service's module
  beforeEach(module('browserAppApp'));

  // instantiate service
  var Mapdata;
  beforeEach(inject(function (_Mapdata_) {
    Mapdata = _Mapdata_;
  }));

  it('should do something', function () {
    expect(!!Mapdata).toBe(true);
  });

});
