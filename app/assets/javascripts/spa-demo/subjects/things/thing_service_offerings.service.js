(function() {
    "use strict";

    angular
        .module("spa-demo.subjects")
        .factory("spa-demo.subjects.ThingServiceOffering", ThingServiceOffering);

    ThingServiceOffering.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];
    function ThingServiceOffering($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + "/api/things/:thing_id/service_offerings/:id",
            { thing_id: '@thing_id', id: '@id'},
            { update: {method:"PUT"} }
            );
    }

})();