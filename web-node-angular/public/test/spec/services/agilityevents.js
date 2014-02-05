'use strict';

describe('Service: Agilityevents', function () {

  // load the service's module
  beforeEach(module('browserAppApp'));

  // instantiate service
  var Agilityevents;
  beforeEach(inject(function (_Agilityevents_) {
    Agilityevents = _Agilityevents_;
  }));

  it('should do something', function () {
    expect(!!Agilityevents).toBe(true);
  });

});
