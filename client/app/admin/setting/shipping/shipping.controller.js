angular.module('luxire')
.controller('ShippingController',function($scope, $uibModal, shipping_service, ZoneService, $state, $stateParams, $uibModal, ShippingMethodService){

  $scope.alerts = [];
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    console.log(index);
    $scope.alerts.splice(index, 1);
  };

  if($stateParams && $stateParams.prev_state_status != null){
    $scope.alerts.push($stateParams.prev_state_status);
  }


  $scope.address = {};
  shipping_service.get_stock_location().then(function(data){
    $scope.address = data.data;
    shipping_service.countries().then(function(data){
      $scope.countries = data.data;
    },function(error){
      console.error(error);
    });
  }, function(error){
    console.log(error);
  });

  $scope.edit_address = function(){
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'app/admin/setting/shipping/partials/ship_from_address.html',
      controller: 'AddressModalInstance',
      backdrop: 'static',
      windowClass: 'address_modal',
      size: 'md',
      resolve: {
        current_address: function(){
          return $scope.address;
        },
        countries: function(){
          return $scope.countries;
        }
      }
    });

    modalInstance.result.then(function(modified_address){
      shipping_service.update_stock_location(modified_address).then(function(data){
        console.log(data);
        $scope.address = data.data;
      },function(error){
        console.error(error);
      });
      console.log('modified_address', modified_address);
    },function(){
      console.log('Modal dismissed at: '+ new Date());
    });
  };



  /*zones*/
  $scope.zones = [];
  ZoneService.index().then(function(data){
    console.log(data);
    $scope.zones = data.data.zones;
  }, function(error){
    console.error(error);
  });

  $scope.add_zone = function(event){
    event.preventDefault();
    $state.go('admin.shipping_setting_zones_new');
  };

  $scope.edit_zone = function(event, zone){
    event.preventDefault();
  };

  $scope.delete_zone = function(zone, index){
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'delete_zone.html',
      controller: 'DeleteZoneModalController',
      size: 'md',
      backdrop: 'static',
      resolve: {
        zone: function () {
          return zone;
        }
      }

    });
    modalInstance.result.then(function (zone) {
      $scope.zones.splice(index, 1);
      $scope.alerts.push({type: 'success', message: 'Zone \''+zone.name+'\' deleted successfully!'});
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });


    // ZoneService.destroy(zone.id).then(function(data){
    //   console.log(data);
    //   $scope.alerts.push({type: 'success', message: 'Zone \''+zone.name+'\' deleted successfully!'});
    //   $scope.zones.splice(index, 1);
    // }, function(error){
    //   console.error(error);
    //   $scope.alerts.push({type: 'danger', message: 'Failed to delete zone \''+zone.name});
    //
    // });
  };

  /*Shipping methods*/
  $scope.shipping_methods = [];

  ShippingMethodService.index().then(function(data){

    angular.forEach(data.data, function(value, key){
      angular.forEach(value, function(val, key){
        console.log(typeof val=='object' && val !== null);
        if(typeof val=='object' && val !== null){
          value.calculator_details = val.type.split('::');
        }
      });

    });
    $scope.shipping_methods = data.data;
    console.log(data);
  }, function(error){
    console.error(error);
  });

  $scope.calculator_extractor = function(shipping_method){
    console.log(shipping_method);
    // angular.forEach(shipping_method, function(val, key){
    //   console.log(typeof val=='object' && val !== null);
    //   if(typeof val=='object' && val !== null){
    //     return val.type.split('::');
    //   }
    // });
  };

  $scope.edit_shipping_method = function(event, shipping_method){
    event.preventDefault();
  };
  $scope.delete_shipping_method = function(shipping_method, index){
    ShippingMethodService.destroy(shipping_method.id).then(function(data){
      console.log(data);
      alert('success');
      $scope.shipping_methods.splice(index, 1);
    }, function(error){
      console.error(error);
    });
  };

  $scope.add_new_method = function(){
    $state.go('admin.shipping_setting_shipping_method_new');
  };

  /*Navigate to carrier services state*/
  $scope.go_to_carrier_services = function(){
    $state.go('admin.shipping_setting_realtime_carriers');
  };
})
.controller('AddressModalInstance',function($scope, $uibModalInstance, current_address, countries, shipping_service){
  console.log(current_address);
  $scope.countries = countries;
  $scope.populate_states = function(country_id){
    $scope.states = $scope.countries[country_id -1].states;
    console.log($scope.states);
  };

  $scope.country_select = function(country){
    console.log(country);
  };

  $scope.address = current_address;
  console.log(countries);
  $scope.states = current_address.country_id != (null || undefined) ? $scope.populate_states(current_address.country_id) : [];
  $scope.submit_attempt = false;

  // shipping_service.countries().then(function(data){
  //   console.log(data);
  //   $scope.countries = data.data;
  // },function(error){
  //   console.error(error);
  // });



  /*dismiss model on clicking cancel*/
  $scope.cancel = function(){
    console.log($scope.address);
    $uibModalInstance.dismiss('cancel');
  };
  /*dismiss model on clicking close*/
  $scope.close_modal = function(){
    $scope.cancel();
  };
  $scope.update_address = function(){
    $scope.submit_attempt = true;
    if($scope.address_form.$valid){
      console.log($scope.address);
        $uibModalInstance.close($scope.address);
    }
  };

})
.controller('ShippingCarrierController',function($scope, shipping_service, $state){
  $scope.active_carriers = {
      ups_login: "",
      ups_password: "",
      ups_key: "",
      shipper_number: null,
      fedex_login: "",
      fedex_password: "",
      fedex_account: "",
      fedex_key: "",
      usps_login: "",
      usps_commercial_base: false,
      usps_commercial_plus: false,
      canada_post_login: "",
      units: "imperial",
      unit_multiplier: 16,
      default_weight: 0,
      handling_fee: null,
      max_weight_per_package: 0,
      test_mode: false
    }
  shipping_service.get_active_shipping_carriers().then(function(data){
    $scope.active_carriers = data.data;
    console.log(data);
  }, function(error){
    console.error(error);
  });

  $scope.update = function(){
    shipping_service.update_active_shipping_carriers($scope.active_carriers).then(function(data){
      $scope.active_carriers = data.data;

      console.log(data);
    }, function(error){
      console.log(error);
    });
  };

  $scope.cancel = function(){
    $state.go('admin.shipping_setting');
  };

})
.controller('ShippingMethodController', function($scope, ZoneService, $state, ShippingMethodService){

  $scope.shipping_method = {
    shipping_method: {
      name: '',
      display_on: '',
      admin_name: '',
      code: '',
      tracking_url: '',
      shipping_categories: ['1'],
      calculator_type: 'Flat rate',
      tax_category_id: '1',
      zones: []

    }
  };

  $scope.calculators = [];
  $scope.available_zones = [];
  $scope.tax_categories = []
  ShippingMethodService.new().then(function(data){
    console.log(data);
    $scope.calculators = data.data.calculators;
    $scope.available_zones = data.data.spree_zones;
    $scope.tax_categories = data.data.spree_tax_categories;
  }, function(error){
    console.error(error);
  });
  // {"shipping_method":{"name":"USPS", "display_on":"", "admin_name":"", "code":"", "tracking_url":"", "shipping_categories":["1"], "calculator_type":"Spree::Calculator::Shipping::Usps::ExpressMail", "tax_category_id":"1"}}
  $scope.zones = [];
  ZoneService.index().then(function(data){
    console.log(data);
    $scope.zones = data.data.zones;
  }, function(error){
    console.error(error);
  });

  $scope.selected_zones = [];
  $scope.cancel = function(){
    $state.go('admin.shipping_setting');
  };



  $scope.check_change = function(is_selected, zone){
    if(is_selected == true){
      $scope.selected_zones.push(zone.id);
    }
    else if(is_selected == false){
      $scope.selected_zones.splice($scope.selected_zones.indexOf(zone.id),1);

    }
    console.log('selected zone id', $scope.selected_zones);
  };

  $scope.save = function(){
    $scope.shipping_method.shipping_method.zones = $scope.selected_zones;
    console.log($scope.shipping_method);
    ShippingMethodService.create($scope.shipping_method).then(function(data){
      console.log(data);
      alert('success');
    }, function(error){
      console.error(error);
    });
  };


})
.controller('AddZoneController', function($scope, ZoneService, $http, countries, ZoneService, $state){
  $scope.zone = {
    zone:{
      name: '',
      description: '',
      zone_members: []
    }
  };
  $scope.selected_countries = [];
  $scope.loadCountries = function($query){
    return countries.search($query);
  };

  $scope.add_tag = function(tag){
    console.log(tag);
  };

  $scope.remove_tag = function(tag){
    console.log(tag);
  };

  $scope.cancel = function(){
    $state.go()
  };

  $scope.save_zone = function(){
    console.log($scope.zone);
    console.log($scope.selected_countries);
    angular.forEach($scope.selected_countries, function(val, key){
      $scope.zone.zone.zone_members.push({
        zoneable_type: "Spree::Country",
        zoneable_id: val.id
      });
    });
    ZoneService.create($scope.zone).then(function(data){
      $state.go('admin.shipping_setting',{prev_state_status: {type: 'success', message: 'Zone \''+data.data.name+'\' created successfully!'}});
      console.log(data);
    }, function(error){
      console.error(error);
    })
  };



})
.controller('DeleteZoneModalController', function($scope, $uibModalInstance, zone, ZoneService){
  $scope.zone = zone;
  $scope.delete = function () {

    ZoneService.destroy(zone.id).then(function(data){
      console.log(data);
      $uibModalInstance.close(zone);
    }, function(error){
      console.error(error);
      // $scope.alerts.push({type: 'danger', message: 'Failed to delete zone \''+zone.name});
    });

  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})
