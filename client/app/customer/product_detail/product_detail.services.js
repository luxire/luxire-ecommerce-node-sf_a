angular.module('luxire')
.service('ProductDetailService', function($http, CustomerConstants){
  this.showProduct = function(product_name){
    return $http.get(CustomerConstants.api.products+'/'+product_name);
  };
  this.styles = function(product_type_id){
    return $http.get(CustomerConstants.api.style_masters+'/'+product_type_id);
  };
  this.product_types = function(){
    return $http.get(CustomerConstants.api.products+'/'+product_name);
  };
})
