angular.module('luxire')
.service('AdminOrderService', function($http){
  this.index = function(page){
    return $http.get('/api/orders?page='+page);
  };
  this.update_status = function(order, status){
    var order_obj = {
      order: {
        id: order.id,
        status: status.title
      }
    }
    return $http.put('/api/orders/update_status', angular.toJson(order_obj));
  };
  this.show = function(number){
    return $http.get('/api/orders/'+number);
  };

})
