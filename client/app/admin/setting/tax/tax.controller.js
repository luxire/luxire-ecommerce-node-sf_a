angular.module('luxire')
.controller('TaxHomeController', function($scope, TaxService){
  $scope.taxes = [];
  TaxService.index().then(function(data){
    console.log(data);
    $scope.taxes = data.data;
  }, function(error){
    console.log(error);
  });

})
.controller('AddTaxController', function($scope, TaxService){
  // {"tax_rate":{"name":"EU", "amount":"0.1", "included_in_price":"0", "zone_id":"1", "tax_category_id":"1", "show_rate_in_label":"1", "calculator_type":"Spree::Calculator::DefaultTax"}}
  $scope.tax_rate = {
    tax_rate: {
      name: '',
      amount: '',
      included_in_price: '0',
      zone_id: '',
      tax_category_id: '',
      show_rate_in_label: '1',
      calculator_type: "Spree::Calculator::DefaultTax"
    }
  };

  $scope.calculators = [];
  $scope.tax_categories = [];
  TaxService.new().then(function(data){
    $scope.calculators = data.data.calculators;
    $scope.tax_categories = data.data.spree_tax_categories;
    $scope.zones = data.data.spree_zones;
    console.log(data);
  }, function(error){
    console.error(error);
  })

  $scope.save = function(){
    TaxService.create($scope.tax_rate).then(function(data){
      console.log(data);
    }, function(error){
      console.error(error);
    });
  };
})
