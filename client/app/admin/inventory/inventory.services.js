angular.module('luxire')
.service('luxireStocks', function($http, $q, AdminConstants){
  this.luxireStocksIndex = function(data){
    if(data == undefined || data == null){
      var getData = 1;
    }
    else{
      var getData = data;
    }
    return $http.get(AdminConstants.api.inventory+'?page_count='+getData);
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
