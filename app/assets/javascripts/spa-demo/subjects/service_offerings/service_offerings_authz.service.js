(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.ServiceOfferingsAuthz", ServiceOfferingsFactory);

  ServiceOfferingsFactory.$inject = ["spa-demo.authz.Authz",
    "spa-demo.authz.BasePolicy"];
  function ServiceOfferingsFactory(Authz, BasePolicy) {
    function ServiceOfferingsAuthz() {
      BasePolicy.call(this, "ServiceOffering");
    }

    //start with base class prototype definitions
    ServiceOfferingsAuthz.prototype = Object.create(BasePolicy.prototype);
    ServiceOfferingsAuthz.constructor = ServiceOfferingsAuthz;

    //override and add additional methods
    ServiceOfferingsAuthz.prototype.canCreate=function() {
      //console.log("ItemsAuthz.canCreate");
      return Authz.isAuthenticated();
    };

    return new ServiceOfferingsAuthz();
  }
})();