angular.module('luxire')
.service('DiscountService', function($http){
  this.index = function(){
    return $http.get('/api/promotions');
  };
  this.create = function(promo_object){
    return $http.post('/api/promotions', angular.toJson(promo_object));
  };
  this.update = function(promo_object){
    console.log(promo_object);
    return $http.put('/api/promotions/'+promo_object.promotion.id, angular.toJson(promo_object));
  };
  this.delete = function(id){
    console.log(id);
    return $http.delete('/api/promotions/'+id);
  };
  this.add_rule = function(rule){
    console.log(rule);
    return $http.post('/api/promotions/'+rule.promotion_id+'/rules', angular.toJson(rule));
  };
  this.add_action = function(action){
    return $http.post('/api/promotions/'+action.promotion_id+'/actions', angular.toJson(action));
  };
  this.delete_rule = function(promo_id, id){
    console.log("promo id is %s and rule id is %s",promo_id,id);
    return $http.delete('/api/promotions/'+promo_id+'/rules/'+id);
  };

});
