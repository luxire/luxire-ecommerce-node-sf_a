angular.module('luxire')
.service('luxireProperties',function($http, $q, AdminConstants){


  this.luxirePropertiesIndex = function(){
    var deferred = $q.defer();
    $http.get('/api/luxire_Properties').then(function(data){
      deferred.resolve(data)
    },function(errData, errStatus, errHeaders, errConfig){
      deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
    });
    return deferred.promise;
  }

  this.luxirePropertiesById = function(id){
    var deferred = $q.defer();
    $http.get('/api/luxire_Properties/'+id).then(function(data){
      deferred.resolve(data)
    },function(errData, errStatus, errHeaders, errConfig){
      deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
    });
    return deferred.promise;
  }

  this.luxireProperties_update = function(id, parameters) {
    var deferred = $q.defer();

    $http.put("/api/luxire_Properties/"+id, angular.toJson(parameters)).success(function(data) {
      deferred.resolve(data);
      })
      .error(function(errData, errStatus, errHeaders, errConfig) {
        console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
        deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
      });
      return deferred.promise;
  }
  this.luxireProperties_create = function(parameters) {
    var deferred = $q.defer();

    $http.post("/api/luxire_properties.json", angular.toJson(parameters)).success(function(data) {
      deferred.resolve(data);
      })
      .error(function(errData, errStatus, errHeaders, errConfig) {
        console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
        deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
      });
      return deferred.promise;
  }
  this.deleteProperty = function(id) {
		var deferred = $q.defer();
		$http.delete("/api/luxire_Properties/"+id).success(function(data) {
			console.log(data);
			deferred.resolve(data);
  		})
			.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
  		});
  		return deferred.promise;
	}
})
