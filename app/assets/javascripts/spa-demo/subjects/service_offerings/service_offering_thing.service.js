(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.ServiceOfferingThing", ServiceOfferingThing);

  ServiceOfferingThing.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];
  function ServiceOfferingThing($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url +
      "/api/things/:thing_id/service_offerings");
  }

})();