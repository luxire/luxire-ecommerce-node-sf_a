angular.module('luxire')
.service('luxireStocks', function($http, $q, AdminConstants){
  this.luxireStocksIndex = function(){
    return $http.get(AdminConstants.api.inventory);
  }
  this.luxireStocksById = function(id){
    return $http.get(AdminConstants.api.inventory+"/"+id);
  }

  this.luxireStocks_addQuantity = function(quantityObj) {
  	return $http.post(AdminConstants.api.inventory+"/add_stocks", angular.toJson(quantityObj));
	}

  this.luxireStocks_setQuantity = function(quantityObj) {
		return $http.post(AdminConstants.api.inventory+"/set_stocks", angular.toJson(quantityObj));
	}

})
