angular.module('luxire')
.controller('DiscountHomeController', function($scope, $state, $uibModal, DiscountService){

  /*Alerts to display messages*/
  $scope.alerts = [];
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    console.log(index);
    $scope.alerts.splice(index, 1);
  };

  $scope.show_promotions_list = false
  DiscountService.index().then(function (data) {
    console.log(data);
    $scope.promotions = data.data;
    $scope.show_promotions_list = data.data.length>0? true: false;
  },function (error) {
    console.error(error);
  })

  /*Delete a promotion*/
  $scope.delete_promotion = function(promo, index){

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'delete_promotion.html',
      controller: 'DeleteDiscountController',
      size: 'md',
      backdrop: 'static',
      resolve: {
        promo: function () {
          return promo;
        }
      }

    });
    modalInstance.result.then(function (promo) {
      $scope.promotions.splice(index, 1);
      $scope.alerts.push({type: 'success', message: 'Discount \''+promo.code+'\' deleted successfully!'});
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });



  };

  $scope.edit_promotion = function(event, promo){
    console.log(promo);
    $state.go('admin.edit_discount',{id: promo.id,promo_object: promo});
  };

})
.controller('DeleteDiscountController', function($scope, $uibModalInstance, promo, DiscountService){
  $scope.promo = promo;
  $scope.delete = function () {
    DiscountService.delete(promo.id).then(function(data){
      $uibModalInstance.close(promo);
      console.log(data);
    }, function(error){
      console.error(error);
    });

  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})
.controller('AddDiscountController',function($scope, products, DiscountService, $state){

  /*Alerts to display messages*/
  $scope.alerts = [];
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    $scope.alerts.splice(index, 1);
  };

  $scope.discountObject = {
    promotion: {
      id: '',
      name: '',
      code: '',
      path: '',
      advertise: '0',
      description: '',
      promotion_category_id: '',
      usage_limit: '',
      starts_at: new Date(),
      expires_at: ''
    }
  };

  $scope.change_infinity_flag = function (flag) {
    if (flag==true) {
      $scope.discountObject.usageLimit='';
    }
  };
  $scope.update_promotion = function(){
    if($scope.discountObject.promotion.id == ''){
      DiscountService.create($scope.discountObject).then(function(data){
        angular.forEach($scope.discountObject.promotion, function(value, key){
          $scope.discountObject.promotion[key] = data.data[key];
        });

        $scope.alerts.push({type: 'success', message: 'Discount \''+data.data.code+'\' created successfully!'});
        console.log($scope.alerts);
        console.log(data);
      },function(error){
        $scope.alerts.push({type: 'danger', message: 'Discount creation failed!'});
        console.error(error);
      });
    }
    else{
      DiscountService.update($scope.discountObject).then(function(data){
        $scope.alerts.push({type: 'success', message: 'Discount \''+data.data.code+'\' updated successfully!'});
        console.log(data);
      },function(error){
        $scope.alerts.push({type: 'danger', message: 'Discount updation failed!'});
        console.error(error);
      });
    }
  };

  $scope.cancel = function(){
    $state.go('admin.discount');
  };


  $scope.today = function() {
    $scope.discountObject.promotion.starts_at = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.discountObject.promotion.expires_at = null;
  };

  // $scope.discountCodeGen = function() {
  //   var length = 12;
  //   var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //  var result = '';
  //  for (var i = length; i > 0; --i) {
  //    result += chars[Math.round(Math.random() * (chars.length - 1))];
  // }
  // $scope.discountObject.promotion.code = result;
  //
  // }

$scope.disabled = function(date, mode) {
  return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
};

$scope.toggleMin = function() {
  $scope.minDate = $scope.minDate ? null : new Date();
};
$scope.toggleMin();
$scope.maxDate = new Date(2020, 5, 22);

$scope.open = function($event,mode) {
  if(mode=='start'){
    $scope.start_date_status.opened = !$scope.start_date_status.opened;
  }
  else{
    $scope.end_date_status.opened = !$scope.start_date_status.opened;

  }
  // $scope.status.opened = true;
};

$scope.dateOptions = {
  formatYear: 'yy',
  startingDay: 1
};

$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = $scope.formats[0];

$scope.status = {
  opened: false
};

$scope.start_date_status = {
  opened: false
};
$scope.end_date_status = {
  opened: false
};

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
var afterTomorrow = new Date();
afterTomorrow.setDate(tomorrow.getDate() + 2);
$scope.events =
  [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

$scope.getDayClass = function(date, mode) {
  if (mode === 'day') {
    var dayToCheck = new Date(date).setHours(0,0,0,0);

    for (var i=0;i<$scope.events.length;i++){
      var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

      if (dayToCheck === currentDay) {
        return $scope.events[i].status;
      }
    }
  }

  return '';
};

/*Types of discount*/
$scope.discount_types = [{id: 1, title: '$'},
                        {id: 2, title: '% Discount'},
                         {id: 3, title: 'Free Shipping'}];

/*zones*/
var zones = [{id: 1,title: 'India'},{id: 2 ,title: 'United States'}];


/*Discount object prototype*/
var Discount = function(){
  this.redeem_types = [{id: 0, title: '$', value: 100},
                      {id: 1, title: '% Discount', value: 100},
                      {id: 2, title: 'Free Shipping', value_le: 100,zones: zones, selected_zone: zones[0]}];
  this.selected_redeem_type = this.redeem_types[0];
  this.discount_categories = [{id: 0, title: 'all orders'},
                              {id: 1, title: 'orders over'},
                              {id: 2, title: 'collection'},
                              {id: 3, title: 'specific product'},
                              {id: 4, title: 'customer in group'}];
  this.selected_discount_category = this.discount_categories[0];
};

/*Discounts array*/
$scope.discounts = [];
$scope.discounts.push(new Discount());
console.log($scope.discounts);

$scope.redeem_option_change = function(index, selected_redeem_type){
  console.log('index', index);
  console.log('redeem type', selected_redeem_type);
};

$scope.add_rule = function(event){
  event.preventDefault();
  $scope.discounts.push(new Discount());

};

/*spree based approach*/
$scope.rules = [{id: 0,title: 'Item total', label: 'Item total', criteria: {
                base_cutoff_options: [{id:0,title: 'greater than',value: 100},{id:1,title: 'greater than or equal to',value: 1000}],
                base_cutoff_selected_option: {id:0,title: 'greater than',value: 100},
                higher_cutoff_options: [{id:0,title: 'less than',value: 100},{id:1,title: 'less than or equal to',value: 1000}],
                higher_cutoff_selected_option: {id:0,title: 'less than',value: 100}
              }},
                {id: 1,title: 'Product(s)', label: 'Product(s)', criteria: {
                  product_quantity: [{id: 0, title: 'atleast one', label: 'atleast one'},
                                    {id: 1, title: 'all', label: 'all'},
                                    {id: 2, title: 'none', label: 'none'}],
                  selected_product_quantity: {id: 0, title: 'atleast one', label: 'atleast one'},
                  selected_products: []
                }},
                {id: 2,title: 'User', label: 'User'},
                {id: 3,title: 'First order', label: 'First order'},
                {id: 4,title: 'User Logged In', label: 'User Logged In'},//to avoid using certain discount codes for guest checkout
                {id: 5,title: 'One Use Per User', label: 'One Use Per User'},
                {id: 6,title: 'Taxon(s)', label: 'Taxon(s)'}];

$scope.rules_json = {
                    'Spree::Promotion::Rules::ItemTotal': {id: 0,title: 'Item total', label: 'Item total', criteria: {
                                    base_cutoff_options: [{id:0,title: 'greater than',value: 100},{id:1,title: 'greater than or equal to',value: 1000}],
                                    base_cutoff_selected_option: {id:0,title: 'greater than',value: 100},
                                    higher_cutoff_options: [{id:0,title: 'less than',value: 100},{id:1,title: 'less than or equal to',value: 1000}],
                                    higher_cutoff_selected_option: {id:0,title: 'less than',value: 100}
                                  }},
                    'Spree::Promotion::Rules::Product': {id: 1,title: 'Product(s)', label: 'Product(s)', criteria: {
                                    product_quantity: [{id: 0, title: 'atleast one', label: 'atleast one'},
                                                      {id: 1, title: 'all', label: 'all'},
                                                      {id: 2, title: 'none', label: 'none'}],
                                    selected_product_quantity: {id: 0, title: 'atleast one', label: 'atleast one'},
                                    selected_products: []
                                  }},
                    'Spree::Promotion::Rules::User': {id: 2,title: 'User', label: 'User'},
                    'Spree::Promotion::Rules::FirstOrder': {id: 3,title: 'First order', label: 'First order'},
                    'Spree::Promotion::Rules::UserLoggedIn': {id: 4,title: 'User Logged In', label: 'User Logged In'},//to avoid using certain discount codes for guest checkout
                    'Spree::Promotion::OneUsePerUser': {id: 5,title: 'One Use Per User', label: 'One Use Per User'},
                    'Spree::Promotion::Taxon': {id: 6,title: 'Taxon(s)', label: 'Taxon(s)'}
                  };


$scope.added_rules = [];
$scope.added_rules_json = {};

// $scope.added_actions = [];

$scope.added_products_to_rule = [];

var rules_indexes_map = [0,1,2,3,4,5,6];
var added_rules_indexes_map = [];

$scope.selected_rule_type = 'Spree::Promotion::Rules::ItemTotal';

$scope.get_obj_key_len = function (val) {
  return Object.keys(val).length;
}
$scope.select_rule = function(selected_rule_type){
  if(selected_rule_type !== null){
    $scope.selected_rule_type = selected_rule_type;
  }
  console.log(selected_rule_type);
  console.log($scope.selected_rule_type);
  // if(selected_rule !== null){
  //   $scope.selected_rule = selected_rule;
  //   console.log('selected_rule', selected_rule);
  //   console.log('selected_rule_should have been', $scope.selected_rule);
  // }
};

$scope.redeem_types = [{id: 0, title: '$', value: 100},{id: 1, title: '% Discount', value: 100}];

$scope.add_selected_rule = function(){
  console.log($scope.selected_rule_type);
  var promo_rule = {promotion_rule: {type: $scope.selected_rule_type},
  promotion_id: $scope.discountObject.promotion.id};
  DiscountService.add_rule(promo_rule).then(function(data){
    $scope.added_rules_json[$scope.selected_rule_type] = $scope.rules_json[$scope.selected_rule_type];
    $scope.added_rules_json[$scope.selected_rule_type].ref_id = data.data.id;
    delete $scope.rules_json[$scope.selected_rule_type];
    var obj_keys = Object.keys($scope.rules_json)
    $scope.selected_rule_type = obj_keys.length != 0 ? obj_keys[0] : null;
    console.log(data);
    $scope.alerts.push({type: 'success', message: 'Rule added successfully!'});
  }, function(error){
    $scope.alerts.push({type: 'danger', message: 'Rule addition failed!'});
    console.error(error);
  });

};
var rule_details = {};
$scope.update_rules = function () {
  var promo_object = {promotion:{match_policy: $scope.preferred_match_policy, promotion_rules_attributes: {},id: $scope.discountObject.promotion.id}};
  angular.forEach($scope.added_rules_json, function(val, key){
    if(key === 'Spree::Promotion::Rules::ItemTotal'){
      rule_details = {};
      rule_details.id = val.ref_id;
      rule_details.preferred_operator_min = val.criteria.base_cutoff_selected_option.title==='greater than'? 'gt' : 'gte';
      rule_details.preferred_operator_max = val.criteria.higher_cutoff_selected_option.title==='less than'? 'lt' : 'lte';
      rule_details.preferred_amount_min = val.criteria.base_cutoff_selected_option.value;
      rule_details.preferred_amount_max = val.criteria.higher_cutoff_selected_option.value;
      promo_object.promotion.promotion_rules_attributes[rule_details.id] = rule_details;
    }
    else if(key === 'Spree::Promotion::Rules::Product'){
      rule_details = {};
      rule_details.id = val.ref_id;
      rule_details.preferred_match_policy = 'any';//change
      rule_details.product_ids_string = '';
      for(var j=0;j<val.criteria.selected_products.length;j++){
        if(j==0){
          rule_details.product_ids_string = rule_details.product_ids_string+val.criteria.selected_products[j].id;
        }
        else{
          rule_details.product_ids_string = rule_details.product_ids_string+','+val.criteria.selected_products[j].id
        }
      }
      promo_object.promotion.promotion_rules_attributes[rule_details.id] = rule_details;
    }
    else{
      promo_object.promotion.promotion_rules_attributes[val.ref_id] = val.ref_id;
    }
  });
  console.log(promo_object);
  DiscountService.update(promo_object).then(function(data){
    $scope.alerts.push({type: 'success', message: 'Rule updated successfully!'});
  }, function(error){
    $scope.alerts.push({type: 'danger', message: 'Rule updation failed!'});
    console.error(error);
  });
};

$scope.actions = [{id: 0, title: 'Create whole order adjustment',label: 'Create whole order adjustment',
                    redeem_types: [{id: 0, title: '$', value: 100},{id: 1, title: '% Discount', value: 100}],
                    selected_redeem_type: {id: 1, title: '% Discount', value: 100}},
                  {id: 1, title: 'Create line item adjustment',label: 'Create line item adjustment',
                  redeem_types: [{id: 0, title: '$', value: 100},{id: 1, title: '% Discount', value: 100}]},
                  {id: 2, title: 'Free shipping',label: 'Free shipping'}];

$scope.actions_json = {
                      'Spree::Promotion::Actions::CreateAdjustment': {id: 0, title: 'Create whole order adjustment',label: 'Create whole order adjustment',
                                          redeem_types: [{id: 0, title: '$', value: 100},{id: 1, title: '% Discount', value: 100}],
                                          selected_redeem_type: {id: 1, title: '% Discount', value: 100}},
                      'Spree::Promotion::Actions::FreeShipping': {id: 2, title: 'Free shipping',label: 'Free shipping'},
                      'Spree::Promotions::Actions::LineAdjustment': {id: 1, title: 'Create line item adjustment',label: 'Create line item adjustment',
                                                                    redeem_types: [{id: 0, title: '$', value: 100},{id: 1, title: '% Discount', value: 100}]}
          };
$scope.selected_actions_json = {};
$scope.selected_action_type = 'Spree::Promotion::Actions::CreateAdjustment';

$scope.selected_action = $scope.actions[0];
$scope.new_selected_action = $scope.actions[0];
$scope.change_action_type = function(action){
  console.log(action);
  console.log($scope.selected_action_type);
  if(action!==null){
    $scope.selected_action_type = action;
  }
  // $scope.new_selected_action = action;
};
$scope.add_selected_action = function(){
  var action = {action_type: $scope.selected_action_type, promotion_id: $scope.discountObject.promotion.id}
  DiscountService.add_action(action).then(function(data){
    $scope.selected_actions_json[$scope.selected_action_type] = $scope.actions_json[$scope.selected_action_type];
    $scope.selected_actions_json[$scope.selected_action_type].ref_id = data.data.id;
    if(data.data.calculator){
      $scope.selected_actions_json[$scope.selected_action_type].cal_id = data.data.calculator.id;
    }
    delete $scope.actions_json[$scope.selected_action_type];
    var obj_keys = Object.keys($scope.actions_json)
    $scope.selected_action_type = obj_keys.length != 0 ? obj_keys[0] : null;
    console.log(data);
    $scope.alerts.push({type: 'success', message: 'Action added successfully!'});
  }, function(error){
    $scope.alerts.push({type: 'danger', message: 'Failed to add action!'});
    console.error(error);
  });
};
$scope.remove_selected_action = function(event, action_key){
  event.preventDefault();
  var promo_id = $scope.discountObject.promotion.id;
  var action_id = $scope.selected_actions_json[action_key].ref_id;
  var action = {action_type: action_key,promotion_id: promo_id};
  DiscountService.delete_action(promo_id, action_id, action).then(function(data){
    console.log(data);
    $scope.actions_json[action_key] = $scope.selected_actions_json[action_key];
    delete $scope.selected_actions_json[action_key];
    var obj_keys = Object.keys($scope.actions_json)
    $scope.selected_action_type = obj_keys.length != 0 ? obj_keys[0] : null;
    $scope.alerts.push({type: 'success', message: 'Action removed successfully!'});
  }, function(error){
    $scope.alerts.push({type: 'danger', message: 'Failed to remove action!'});
    console.log(error);
  });
};

$scope.update_action = function(){
  angular.forEach($scope.selected_actions_json, function(val, key){
    if(val.label=='Create whole order adjustment'){
        if(val.selected_redeem_type.title==='$'){
            var action = {promotion:{promotion_actions_attributes:{},id:$scope.discountObject.promotion.id}};
            action.promotion.promotion_actions_attributes[val.ref_id] = {id: val.ref_id, calculator_type:"Spree::Calculator::FlatRate"}
            DiscountService.update(action).then(function(data){
              action.promotion.promotion_actions_attributes[val.ref_id].calculator_attributes =
              {preferred_amount: val.selected_redeem_type.value,preferred_currency: 'USD',id: val.cal_id}
              DiscountService.update(action).then(function(data){
                console.log('action', action);
                console.log(data);
                $scope.alerts.push({type: 'success', message: 'Action updated successfully!'});

              }, function(error){
                $scope.alerts.push({type: 'danger', message: 'Failed to update action!'});

                console.error(error);
              });

                console.log(data);
            }, function(error){
              console.error(error);
            });
        }
        else{
          console.log('%');
          var action = {promotion:{promotion_actions_attributes:{},id:$scope.discountObject.promotion.id}}
          action.promotion.promotion_actions_attributes[val.ref_id] = {id: val.ref_id, calculator_type:"Spree::Calculator::FlatPercentItemTotal"};
          DiscountService.update(action).then(function(data){
            console.log(data.data);

            action.promotion.promotion_actions_attributes[val.ref_id].calculator_attributes =
            {preferred_flat_percent: val.selected_redeem_type.value,id: val.cal_id}
            DiscountService.update(action).then(function(data){
              console.log('action', action);
              console.log(data);
              $scope.alerts.push({type: 'success', message: 'Action updated successfully!'});
            }, function(error){
              $scope.alerts.push({type: 'danger', message: 'Failed to update action!'});
              console.error(error);
            });
            console.log(data);
          }, function(error){
            console.error(error);
          });
        }
      }
  });

};

$scope.remove_selected_rule = function(event, rule_type){
  event.preventDefault();
  var promo_id = $scope.discountObject.promotion.id;
  var rule_ref_id = $scope.added_rules_json[rule_type].ref_id;
  DiscountService.delete_rule(promo_id, rule_ref_id).then(function(data){
    $scope.rules_json[rule_type] = $scope.added_rules_json[rule_type];
    delete $scope.added_rules_json[rule_type];
    var obj_keys = Object.keys($scope.rules_json)
    $scope.selected_rule_type = obj_keys.length != 0 ? obj_keys[0] : null;
    $scope.alerts.push({type: 'success', message: 'Rule deleted successfully!'});
    console.log(data);
  }, function(error){
    $scope.alerts.push({type: 'danger', message: 'Rule deletion failed!'});
    console.log(error);
  });
};

$scope.loadItems = function(query){
  return products.searchProducts(query);
};

$scope.active_product_tags = {};
$scope.add_product_tag = function (tag) {
  $scope.active_product_tags[tag.id] = {product_name: tag.name,selected_redeem_type: {id: 0, title: '$', value: 100}}
};

$scope.remove_product_tag = function (tag) {
  delete $scope.active_product_tags[tag.id];
};



})
.controller('EditDiscountController',function($scope, products, DiscountService, $state, $stateParams){
  console.log('promo_object', $stateParams.promo_object);
  $scope.promo_edit_object = $stateParams.promo_object
  $scope.state_name = $state.current.name;
  console.log($state);
  /*Alerts to display messages*/
  $scope.alerts = [];
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    console.log(index);
    console.log($scope.alerts);
    $scope.alerts.splice(index, 1);
    console.log($scope.alerts);
  };

  $scope.discountObject = {
    promotion: {
      id: '',
      name: '',
      code: '',
      path: '',
      advertise: '0',
      description: '',
      promotion_category_id: '',
      usage_limit: '',
      starts_at: new Date(),
      expires_at: ''
    }
  };
  angular.forEach($scope.discountObject.promotion,function(val,key){
    $scope.discountObject.promotion[key] = $scope.promo_edit_object[key];
  });

  $scope.selected_rule_type = null;
  $scope.selected_action_type = null;

  $scope.added_rules_json = {};

  // $scope.added_actions = [];

  $scope.added_products_to_rule = [];



  $scope.rules_json = {
                      'Spree::Promotion::Rules::ItemTotal': {id: 0,title: 'Item total', label: 'Item total', criteria: {
                                      base_cutoff_options: [{id:0,title: 'greater than',value: 100},{id:1,title: 'greater than or equal to',value: 1000}],
                                      base_cutoff_selected_option: {id:0,title: 'greater than',value: 100},
                                      higher_cutoff_options: [{id:0,title: 'less than',value: 100},{id:1,title: 'less than or equal to',value: 1000}],
                                      higher_cutoff_selected_option: {id:0,title: 'less than',value: 100}
                                    }},
                      'Spree::Promotion::Rules::Product': {id: 1,title: 'Product(s)', label: 'Product(s)', criteria: {
                                      product_quantity: [{id: 0, title: 'atleast one', label: 'atleast one'},
                                                        {id: 1, title: 'all', label: 'all'},
                                                        {id: 2, title: 'none', label: 'none'}],
                                      selected_product_quantity: {id: 0, title: 'atleast one', label: 'atleast one'},
                                      selected_products: []
                                    }},
                      'Spree::Promotion::Rules::User': {id: 2,title: 'User', label: 'User'},
                      'Spree::Promotion::Rules::FirstOrder': {id: 3,title: 'First order', label: 'First order'},
                      'Spree::Promotion::Rules::UserLoggedIn': {id: 4,title: 'User Logged In', label: 'User Logged In'},//to avoid using certain discount codes for guest checkout
                      'Spree::Promotion::OneUsePerUser': {id: 5,title: 'One Use Per User', label: 'One Use Per User'},
                      'Spree::Promotion::Taxon': {id: 6,title: 'Taxon(s)', label: 'Taxon(s)'}
                    };

  angular.forEach($scope.promo_edit_object.spree_promotion_rules, function(val, key){
    $scope.added_rules_json[val.type] = $scope.rules_json[val.type];
    delete $scope.rules_json[val.type];
  });

  $scope.change_infinity_flag = function (flag) {
    if (flag==true) {
      $scope.discountObject.usageLimit='';
    }
  };
  $scope.update_promotion = function(){
    if($scope.discountObject.promotion.id == ''){
      DiscountService.create($scope.discountObject).then(function(data){
        angular.forEach($scope.discountObject.promotion, function(value, key){
          $scope.discountObject.promotion[key] = data.data[key];
        });

        $scope.alerts.push({type: 'success', message: 'Discount \''+data.data.code+'\' created successfully!'});
        console.log($scope.alerts);
        console.log(data);
      },function(error){
        $scope.alerts.push({type: 'danger', message: 'Discount creation failed!'});
        console.error(error);
      });
    }
    else{
      DiscountService.update($scope.discountObject).then(function(data){
        $scope.alerts.push({type: 'success', message: 'Discount \''+data.data.code+'\' updated successfully!'});
        console.log(data);
      },function(error){
        $scope.alerts.push({type: 'danger', message: 'Discount updation failed!'});
        console.error(error);
      });
    }
  };

  $scope.cancel = function(){
    $state.go('admin.discount');
  };


  $scope.today = function() {
    $scope.discountObject.promotion.starts_at = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.discountObject.promotion.expires_at = null;
  };

  // $scope.discountCodeGen = function() {
  //   var length = 12;
  //   var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //  var result = '';
  //  for (var i = length; i > 0; --i) {
  //    result += chars[Math.round(Math.random() * (chars.length - 1))];
  // }
  // $scope.discountObject.promotion.code = result;
  //
  // }

$scope.disabled = function(date, mode) {
  return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
};

$scope.toggleMin = function() {
  $scope.minDate = $scope.minDate ? null : new Date();
};
$scope.toggleMin();
$scope.maxDate = new Date(2020, 5, 22);

$scope.open = function($event,mode) {
  if(mode=='start'){
    $scope.start_date_status.opened = !$scope.start_date_status.opened;
  }
  else{
    $scope.end_date_status.opened = !$scope.start_date_status.opened;

  }
  // $scope.status.opened = true;
};

$scope.dateOptions = {
  formatYear: 'yy',
  startingDay: 1
};

$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
$scope.format = $scope.formats[0];

$scope.status = {
  opened: false
};

$scope.start_date_status = {
  opened: false
};
$scope.end_date_status = {
  opened: false
};

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
var afterTomorrow = new Date();
afterTomorrow.setDate(tomorrow.getDate() + 2);
$scope.events =
  [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

$scope.getDayClass = function(date, mode) {
  if (mode === 'day') {
    var dayToCheck = new Date(date).setHours(0,0,0,0);

    for (var i=0;i<$scope.events.length;i++){
      var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

      if (dayToCheck === currentDay) {
        return $scope.events[i].status;
      }
    }
  }

  return '';
};



/*spree based approach*/
$scope.rules = [{id: 0,title: 'Item total', label: 'Item total', criteria: {
                base_cutoff_options: [{id:0,title: 'greater than',value: 100},{id:1,title: 'greater than or equal to',value: 1000}],
                base_cutoff_selected_option: {id:0,title: 'greater than',value: 100},
                higher_cutoff_options: [{id:0,title: 'less than',value: 100},{id:1,title: 'less than or equal to',value: 1000}],
                higher_cutoff_selected_option: {id:0,title: 'less than',value: 100}
              }},
                {id: 1,title: 'Product(s)', label: 'Product(s)', criteria: {
                  product_quantity: [{id: 0, title: 'atleast one', label: 'atleast one'},
                                    {id: 1, title: 'all', label: 'all'},
                                    {id: 2, title: 'none', label: 'none'}],
                  selected_product_quantity: {id: 0, title: 'atleast one', label: 'atleast one'},
                  selected_products: []
                }},
                {id: 2,title: 'User', label: 'User'},
                {id: 3,title: 'First order', label: 'First order'},
                {id: 4,title: 'User Logged In', label: 'User Logged In'},//to avoid using certain discount codes for guest checkout
                {id: 5,title: 'One Use Per User', label: 'One Use Per User'},
                {id: 6,title: 'Taxon(s)', label: 'Taxon(s)'}];

$scope.rules_json = {
                    'Spree::Promotion::Rules::ItemTotal': {id: 0,title: 'Item total', label: 'Item total', criteria: {
                                    base_cutoff_options: [{id:0,title: 'greater than',value: 100},{id:1,title: 'greater than or equal to',value: 1000}],
                                    base_cutoff_selected_option: {id:0,title: 'greater than',value: 100},
                                    higher_cutoff_options: [{id:0,title: 'less than',value: 100},{id:1,title: 'less than or equal to',value: 1000}],
                                    higher_cutoff_selected_option: {id:0,title: 'less than',value: 100}
                                  }},
                    'Spree::Promotion::Rules::Product': {id: 1,title: 'Product(s)', label: 'Product(s)', criteria: {
                                    product_quantity: [{id: 0, title: 'atleast one', label: 'atleast one'},
                                                      {id: 1, title: 'all', label: 'all'},
                                                      {id: 2, title: 'none', label: 'none'}],
                                    selected_product_quantity: {id: 0, title: 'atleast one', label: 'atleast one'},
                                    selected_products: []
                                  }},
                    'Spree::Promotion::Rules::User': {id: 2,title: 'User', label: 'User'},
                    'Spree::Promotion::Rules::FirstOrder': {id: 3,title: 'First order', label: 'First order'},
                    'Spree::Promotion::Rules::UserLoggedIn': {id: 4,title: 'User Logged In', label: 'User Logged In'},//to avoid using certain discount codes for guest checkout
                    'Spree::Promotion::OneUsePerUser': {id: 5,title: 'One Use Per User', label: 'One Use Per User'},
                    'Spree::Promotion::Taxon': {id: 6,title: 'Taxon(s)', label: 'Taxon(s)'}
                  };


$scope.added_rules = [];
var rules_indexes_map = [0,1,2,3,4,5,6];
var added_rules_indexes_map = [];



$scope.get_obj_key_len = function (val) {
  return Object.keys(val).length;
}
$scope.select_rule = function(selected_rule_type){
  if(selected_rule_type !== null){
    $scope.selected_rule_type = selected_rule_type;
  }
  console.log(selected_rule_type);
  console.log($scope.selected_rule_type);
  // if(selected_rule !== null){
  //   $scope.selected_rule = selected_rule;
  //   console.log('selected_rule', selected_rule);
  //   console.log('selected_rule_should have been', $scope.selected_rule);
  // }
};

$scope.redeem_types = [{id: 0, title: '$', value: 100},{id: 1, title: '% Discount', value: 100}];

$scope.add_selected_rule = function(){
  console.log($scope.selected_rule_type);
  var promo_rule = {promotion_rule: {type: $scope.selected_rule_type},
  promotion_id: $scope.discountObject.promotion.id};
  DiscountService.add_rule(promo_rule).then(function(data){
    $scope.added_rules_json[$scope.selected_rule_type] = $scope.rules_json[$scope.selected_rule_type];
    $scope.added_rules_json[$scope.selected_rule_type].ref_id = data.data.id;
    delete $scope.rules_json[$scope.selected_rule_type];
    var obj_keys = Object.keys($scope.rules_json)
    $scope.selected_rule_type = obj_keys.length != 0 ? obj_keys[0] : null;
    console.log(data);
    $scope.alerts.push({type: 'success', message: 'Rule added successfully!'});
  }, function(error){
    $scope.alerts.push({type: 'danger', message: 'Rule addition failed!'});
    console.error(error);
  });

};
var rule_details = {};
$scope.update_rules = function () {
  var promo_object = {promotion:{match_policy: $scope.preferred_match_policy, promotion_rules_attributes: {},id: $scope.discountObject.promotion.id}};
  angular.forEach($scope.added_rules_json, function(val, key){
    if(key === 'Spree::Promotion::Rules::ItemTotal'){
      rule_details = {};
      rule_details.id = val.ref_id;
      rule_details.preferred_operator_min = val.criteria.base_cutoff_selected_option.title==='greater than'? 'gt' : 'gte';
      rule_details.preferred_operator_max = val.criteria.higher_cutoff_selected_option.title==='less than'? 'lt' : 'lte';
      rule_details.preferred_amount_min = val.criteria.base_cutoff_selected_option.value;
      rule_details.preferred_amount_max = val.criteria.higher_cutoff_selected_option.value;
      promo_object.promotion.promotion_rules_attributes[rule_details.id] = rule_details;
    }
    else if(key === 'Spree::Promotion::Rules::Product'){
      rule_details = {};
      rule_details.id = val.ref_id;
      rule_details.preferred_match_policy = 'any';//change
      rule_details.product_ids_string = '';
      for(var j=0;j<val.criteria.selected_products.length;j++){
        if(j==0){
          rule_details.product_ids_string = rule_details.product_ids_string+val.criteria.selected_products[j].id;
        }
        else{
          rule_details.product_ids_string = rule_details.product_ids_string+','+val.criteria.selected_products[j].id
        }
      }
      promo_object.promotion.promotion_rules_attributes[rule_details.id] = rule_details;
    }
    else{
      promo_object.promotion.promotion_rules_attributes[val.ref_id] = val.ref_id;
    }
  });
  console.log(promo_object);
  DiscountService.update(promo_object).then(function(data){
    $scope.alerts.push({type: 'success', message: 'Rule updated successfully!'});
  }, function(error){
    $scope.alerts.push({type: 'danger', message: 'Rule updation failed!'});
    console.error(error);
  });
};

$scope.actions = [{id: 0, title: 'Create whole order adjustment',label: 'Create whole order adjustment',
                    redeem_types: [{id: 0, title: '$', value: 100},{id: 1, title: '% Discount', value: 100}],
                    selected_redeem_type: {id: 1, title: '% Discount', value: 100}},
                  {id: 1, title: 'Create line item adjustment',label: 'Create line item adjustment',
                  redeem_types: [{id: 0, title: '$', value: 100},{id: 1, title: '% Discount', value: 100}]},
                  {id: 2, title: 'Free shipping',label: 'Free shipping'}];

$scope.actions_json = {
                      'Spree::Promotion::Actions::CreateAdjustment': {id: 0, title: 'Create whole order adjustment',label: 'Create whole order adjustment',
                                          redeem_types: [{id: 0, title: '$', value: 100},{id: 1, title: '% Discount', value: 100}],
                                          selected_redeem_type: {id: 1, title: '% Discount', value: 100}},
                      'Spree::Promotion::Actions::FreeShipping': {id: 2, title: 'Free shipping',label: 'Free shipping'},
                      'Spree::Promotions::Actions::LineAdjustment': {id: 1, title: 'Create line item adjustment',label: 'Create line item adjustment',
                                                                    redeem_types: [{id: 0, title: '$', value: 100},{id: 1, title: '% Discount', value: 100}]}
          };
$scope.selected_actions_json = {};

$scope.selected_action = $scope.actions[0];
$scope.new_selected_action = $scope.actions[0];
$scope.change_action_type = function(action){
  console.log(action);
  console.log($scope.selected_action_type);
  if(action!==null){
    $scope.selected_action_type = action;
  }
  // $scope.new_selected_action = action;
};
$scope.add_selected_action = function(){
  var action = {action_type: $scope.selected_action_type, promotion_id: $scope.discountObject.promotion.id}
  DiscountService.add_action(action).then(function(data){
    $scope.selected_actions_json[$scope.selected_action_type] = $scope.actions_json[$scope.selected_action_type];
    $scope.selected_actions_json[$scope.selected_action_type].ref_id = data.data.id;
    $scope.selected_actions_json[$scope.selected_action_type].cal_id = data.data.calculator.id;
    delete $scope.actions_json[$scope.selected_action_type];
    var obj_keys = Object.keys($scope.actions_json)
    $scope.selected_action_type = obj_keys.length != 0 ? obj_keys[0] : null;
    console.log(data);
    $scope.alerts.push({type: 'success', message: 'Action added successfully!'});
  }, function(error){
    $scope.alerts.push({type: 'danger', message: 'Failed to add action!'});
    console.error(error);
  });
};
$scope.remove_selected_action = function(event, action_key){
  event.preventDefault();
  var promo_id = $scope.discountObject.promotion.id;
  var action_id = $scope.selected_actions_json[action_key].ref_id;
  var action = {action_type: action_key,promotion_id: promo_id};
  DiscountService.delete_action(promo_id, action_id, action).then(function(data){
    console.log(data);
    $scope.actions_json[action_key] = $scope.selected_actions_json[action_key];
    delete $scope.selected_actions_json[action_key];
    var obj_keys = Object.keys($scope.actions_json)
    $scope.selected_action_type = obj_keys.length != 0 ? obj_keys[0] : null;
    $scope.alerts.push({type: 'success', message: 'Action removed successfully!'});
  }, function(error){
    $scope.alerts.push({type: 'danger', message: 'Failed to remove action!'});
    console.log(error);
  });
};

$scope.update_action = function(){
  angular.forEach($scope.selected_actions_json, function(val, key){
    if(val.label=='Create whole order adjustment'){
        if(val.selected_redeem_type.title==='$'){
            var action = {promotion:{promotion_actions_attributes:{},id:$scope.discountObject.promotion.id}};
            action.promotion.promotion_actions_attributes[val.ref_id] = {id: val.ref_id, calculator_type:"Spree::Calculator::FlatRate"}
            DiscountService.update(action).then(function(data){
              action.promotion.promotion_actions_attributes[val.ref_id].calculator_attributes =
              {preferred_amount: val.selected_redeem_type.value,preferred_currency: 'USD',id: val.cal_id}
              DiscountService.update(action).then(function(data){
                console.log('action', action);
                console.log(data);
                $scope.alerts.push({type: 'success', message: 'Action updated successfully!'});

              }, function(error){
                $scope.alerts.push({type: 'danger', message: 'Failed to update action!'});

                console.error(error);
              });

                console.log(data);
            }, function(error){
              console.error(error);
            });
        }
        else{
          console.log('%');
          var action = {promotion:{promotion_actions_attributes:{},id:$scope.discountObject.promotion.id}}
          action.promotion.promotion_actions_attributes[val.ref_id] = {id: val.ref_id, calculator_type:"Spree::Calculator::FlatPercentItemTotal"};
          DiscountService.update(action).then(function(data){
            console.log(data.data);

            action.promotion.promotion_actions_attributes[val.ref_id].calculator_attributes =
            {preferred_flat_percent: val.selected_redeem_type.value,id: val.cal_id}
            DiscountService.update(action).then(function(data){
              console.log('action', action);
              console.log(data);
            }, function(error){
              console.error(error);
            });
            console.log(data);
          }, function(error){
            console.error(error);
          });
        }
      }
  });

};

$scope.remove_selected_rule = function(event, rule_type){
  event.preventDefault();
  var promo_id = $scope.discountObject.promotion.id;
  var rule_ref_id = $scope.added_rules_json[rule_type].ref_id;
  DiscountService.delete_rule(promo_id, rule_ref_id).then(function(data){
    $scope.rules_json[rule_type] = $scope.added_rules_json[rule_type];
    delete $scope.added_rules_json[rule_type];
    var obj_keys = Object.keys($scope.rules_json)
    $scope.selected_rule_type = obj_keys.length != 0 ? obj_keys[0] : null;
    $scope.alerts.push({type: 'success', message: 'Rule deleted successfully!'});
    console.log(data);
  }, function(error){
    $scope.alerts.push({type: 'danger', message: 'Rule deletion failed!'});
    console.log(error);
  });
};

$scope.loadItems = function(query){
  return products.searchProducts(query);
};

$scope.active_product_tags = {};
$scope.add_product_tag = function (tag) {
  $scope.active_product_tags[tag.id] = {product_name: tag.name,selected_redeem_type: {id: 0, title: '$', value: 100}}
};

$scope.remove_product_tag = function (tag) {
  delete $scope.active_product_tags[tag.id];
};




});
