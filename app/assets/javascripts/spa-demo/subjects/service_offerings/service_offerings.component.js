(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .component("sdServiceOfferingSelector", {
      templateUrl: serviceOfferingSelectorTemplateUrl,
      controller: ServiceOfferingSelectorController,
      bindings: {
        authz: "<"
      }
    })
    .component("sdServiceOfferingEditor", {
      templateUrl: serviceOfferingEditorTemplateUrl,
      controller: ServiceOfferingEditorController,
      bindings: {
        authz: "<"
      },
      require: {
        serviceOfferingsAuthz: "^sdServiceOfferingsAuthz"
      }
    });


  serviceOfferingSelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function serviceOfferingSelectorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.service_offering_selector_html;
  }

  serviceOfferingEditorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function serviceOfferingEditorTemplateUrl(APP_CONFIG) {
    return APP_CONFIG.service_offering_editor_html;
  }

  ServiceOfferingSelectorController.$inject = ["$scope",
    "$stateParams",
    "spa-demo.authz.Authz",
    "spa-demo.subjects.ServiceOffering"];
  function ServiceOfferingSelectorController($scope, $stateParams, Authz, ServiceOffering) {
    var vm=this;

    vm.$onInit = function() {
      console.log("ServiceOfferingSelectorController",$scope);
      $scope.$watch(function(){ return Authz.getAuthorizedUserId(); },
        function(){
          if (!$stateParams.id) {
            vm.items = ServiceOffering.query();
          }
        });
    }
    return;
    //////////////
  }

//   <sd-service-offering-editor authz="$ctrl.authz"></sd-service-offering-editor>
  ServiceOfferingEditorController.$inject = ["$scope","$q",
    "$state", "$stateParams",
    "spa-demo.authz.Authz",
    "spa-demo.subjects.ServiceOffering",
    "spa-demo.subjects.ServiceOfferingThing",
    "spa-demo.subjects.ServiceOfferingLinkableThing"
  ];
  function ServiceOfferingEditorController($scope, $q, $state, $stateParams,
                                 Authz, ServiceOffering, ServiceOfferingThing,
                                           ServiceOfferingLinkableThing) {
    var vm=this;
    vm.create = create;
    vm.clear  = clear;
    vm.update  = update;
    vm.remove  = remove;
    vm.linkThings = linkThings;

    vm.$onInit = function() {
      console.log("ServiceOfferingEditorController",$scope);
      $scope.$watch(function(){ return Authz.getAuthorizedUserId(); },
        function(){
          if ($stateParams.id) {
            reload($stateParams.id);
          } else {
            newResource();
          }
        });
    }
    return;
    //////////////
    function newResource() {
      console.log("newResource()");
      vm.item = new ServiceOffering();
      vm.serviceOfferingsAuthz.newItem(vm.item);
      return vm.item;
    }

    function reload(serviceOfferingId) {
      vm.things = ServiceOffering.query({id: serviceOfferingId});
    }

    function clear() {
      newResource();
      $state.go(".", {id:null});
    }

    function create() {
      vm.item.$save().then(
        function(){
          $state.go(".", {id: vm.item.id});
        },
        handleError);
    }

    function update() {
      vm.item.errors = null;
      var update=vm.item.$update();
      linkThings(update);
    }

    function remove() {
      vm.item.errors = null;
      vm.item.$delete().then(
        function(){
          console.log("remove complete", vm.item);
          clear();
        },
        handleError);
    }

    function linkThings(parentPromise) {
      var promises=[];

      if (parentPromise) { promises.push(parentPromise); }
      angular.forEach(vm.selected_linkables, function(linkable){
        var resource=ServiceOfferingThing.save({image_id:vm.item.id}, {thing_id:linkable});
        promises.push(resource.$promise);
      });

      vm.selected_linkables=[];
      console.log("waiting for promises", promises);
      $q.all(promises).then(
        function(response){
          console.log("promise.all response", response);
          $scope.imageform.$setPristine();
          reload();
        },
        handleError);
    }

    function handleError(response) {
      console.log("error", response);
      if (response.data) {
        vm.item["errors"]=response.data.errors;
      }
      if (!vm.item.errors) {
        vm.item["errors"]={}
        vm.item["errors"]["full_messages"]=[response];
      }
      $scope.serviceofferingform.$setPristine();
    }
  }

})();
