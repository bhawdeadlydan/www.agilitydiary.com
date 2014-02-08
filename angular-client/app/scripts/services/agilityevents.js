'use strict';

angular.module('browserAppApp')
  .service('Agilityevents', [ '$resource', '$http', function Agilityevents($resource, $http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    //
    var module = {};

    module.getEvents = function() {

    };

    return module;

  }]);
