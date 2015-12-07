angular.module('luxire')
.service('shipping_service',function($http){
  	this.countries = function(){
  		return $http.get('/api/countries');
  	};
    this.update_stock_location = function(update_address){
      var stock_location = {
        stock_location: update_address
      }
      return $http.put('/api/shipping/1/99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058', angular.toJson(stock_location))
    };
    this.get_stock_location = function(){
      return $http.get('/api/shipping/1/99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058')
    };
})
