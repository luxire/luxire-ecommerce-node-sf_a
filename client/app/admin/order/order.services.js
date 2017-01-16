angular.module('luxire')
.service('AdminOrderService', function($http, AdminConstants){
  this.index = function(search){
    var query = "";
    angular.forEach(search, function(val, key){
      if(val){
        query = query + key +"="+ val + "&";
      }
    });
    return $http.get(AdminConstants.api.orders+'?'+query);
  };
  this.update_status = function(order, status){
    var order_obj = {
      order: {
        id: order.id,
        status: status.title
      }
    }
    return $http.put(AdminConstants.api.orders+'/update_status', angular.toJson(order_obj));
  };
  this.update_line_item_status = function(order_obj){
    return $http.put(AdminConstants.api.orders+'/update_line_item_status', angular.toJson(order_obj));
  };
  this.show = function(number){
    return $http.get(AdminConstants.api.orders+'/'+number);
  };

})
