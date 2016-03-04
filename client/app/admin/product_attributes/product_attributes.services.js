angular.module('luxire')
.run(function($http){
  $http.defaults.headers.common['x-luxire-token'] = window.localStorage.luxire_token || window.sessionStorage.luxire_token;
})
.service('ProductAttributes', function($http){
  this.index = function(){
    return $http.get('api/v1/admin/measurement_types');
  };
  this.create = function(measurement_type){
    console.log(measurement_type);
    return $http.post('api/v1/admin/measurement_types', angular.toJson(measurement_type));
  };
  this.show = function(id){
    return $http.get('api/v1/admin/measurement_types/'+id);
  };
  this.delete = function(id){
    return $http.delete('api/v1/admin/measurement_types/'+id);
  };
  this.update = function(measurement_type,id){
    return $http.put('api/v1/admin/measurement_types/'+id, angular.toJson(measurement_type));
  };

  this.add_image = function(image){
    console.log('image', image);
    var fd = new FormData();
    fd.append('source', 'measurement type');
    fd.append('image', image);
    console.log('fd', fd);
    return $http.post('api/v1/admin/measurement_types/images', fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
     });
  };

  

})
