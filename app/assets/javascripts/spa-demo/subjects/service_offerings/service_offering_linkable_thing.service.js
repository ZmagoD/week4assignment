(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.ServiceOfferingLinkableThing", ServiceOfferingLinkableThing);

  ServiceOfferingLinkableThing.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];
  function ServiceOfferingLinkableThing($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/api/service_offerings/:service_offerings_id/linkable_things");
  }

})();