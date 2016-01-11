angular.module('luxire')
.service('TaxService', function($http){
  this.new = function(){
    return $http.get('/api/taxes/new');
  };
  this.index = function(){
    return $http.get('/api/taxes');
  };
  this.create = function(tax){
    return $http.post('/api/taxes', angular.toJson(tax));
  };
  this.show = function(id){
    return $http.get('/api/taxes/'+id);
  };
  this.destroy = function(id){
    return $http.delete('/api/taxes/'+id);
  };
  this.update = function(tax, id){
    return $http.put('/api/taxes/'+id, angular.toJson(tax));
  };
})
