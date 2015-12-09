angular.module('luxire')
.controller('DiscountController',function($scope, products){

  products.searchProducts('spr').then(function(data){
    console.log(data);
  }, function(error){
    console.error(error);
  });

  $scope.today = function() {
    $scope.discountStart = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.discountStart = null;
  };

  $scope.discountCodeGen = function() {
    var length = 12;
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   var result = '';
   for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
   $scope.discountCode = result;
}

$scope.disabled = function(date, mode) {
  return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
};

$scope.toggleMin = function() {
  $scope.minDate = $scope.minDate ? null : new Date();
};
$scope.toggleMin();
$scope.maxDate = new Date(2020, 5, 22);

$scope.open = function($event) {
  $scope.status.opened = true;
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
$scope.discount_types = [{id: 1, title: 'Rs.'},
                        {id: 2, title: '% Discount'},
                         {id: 3, title: 'Free Shipping'}];

/*zones*/
var zones = [{id: 1,title: 'India'},{id: 2 ,title: 'United States'}];


/*Discount object prototype*/
var Discount = function(){
  this.redeem_types = [{id: 0, title: 'Rs.', value: 100},
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

$scope.added_rules = [];

$scope.added_products_to_rule = [];

var rules_indexes_map =[0,1,2,3,4,5,6];
var added_rules_indexes_map = [];

$scope.selected_rule = $scope.rules[0];

$scope.select_rule = function(selected_rule){
  console.log('selected_rule', selected_rule);
};

$scope.add_selected_rule = function(){
  var index = rules_indexes_map.indexOf($scope.selected_rule.id);
  $scope.added_rules.push($scope.rules[index]);
  added_rules_indexes_map.push($scope.rules[index].id);
  $scope.rules.splice(index, 1);
  rules_indexes_map.splice(index, 1);
  $scope.selected_rule = $scope.rules.length != 0 ? $scope.rules[0] : {}
};

$scope.remove_selected_rule = function(event, rule){
  event.preventDefault();
  var index = added_rules_indexes_map.indexOf(rule.id);
  rules_indexes_map.push(rule.id);
  $scope.rules.push(rule);
  $scope.added_rules.splice(index, 1);
  added_rules_indexes_map.splice(index, 1);
  $scope.selected_rule = $scope.rules.length != 0 ? $scope.rules[0] : {}


};

$scope.loadItems = function(query){
  return products.searchProducts(query);
};

$scope.add_product_tag = function () {
  console.log($scope.added_products_to_rule);
};

});
