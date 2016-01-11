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
    this.get_active_shipping_carriers = function(){
      return $http.get('/api/shipping/carriers');
    };
    this.update_active_shipping_carriers = function(data){
      return $http.put('/api/shipping/carriers', angular.toJson(data));
    };
})
.service('ZoneService', function($http){
  this.index = function(){
    return $http.get('/api/zones');
  }
  this.create = function(zone){
    return $http.post('/api/zones', angular.toJson(zone));
  }
  this.show = function(id){
    return $http.get('/api/zones/'+id);
  }
  this.update = function(id, zone){
    return $http.put('/api/zones/'+id, angular.toJson(zone));
  }
  this.destroy = function(id){
    return $http.delete('/api/zones/'+id);
  }
})
.service('ShippingMethodService', function($http){
  this.index = function(){
    return $http.get('/api/shipping/shipping_methods');
  };
  this.create = function(shipping_method){
    return $http.post('/api/shipping/shipping_methods', angular.toJson(shipping_method));
  };
  this.new = function(){
    return $http.get('/api/shipping/shipping_methods_new');
  };
  this.show = function(id){
    return $http.get('/api/shipping/shipping_methods/'+id);
  };
  this.update = function(id, shipping_method){
    return $http.put('/api/shipping/shipping_methods/'+id, angular.toJson(shipping_method));
  };
  this.destroy = function(id){
    return $http.delete('/api/shipping/shipping_methods/'+id);
  };
})
