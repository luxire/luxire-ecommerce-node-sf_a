angular.module('luxire')
.service('luxireStocks', function($http, $q){

  this.luxireStocksIndex = function(){
    var deferred = $q.defer();
    $http.get('/api/luxire_stocks').then(function(data){
      deferred.resolve(data)
    },function(errData, errStatus, errHeaders, errConfig){
      deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
    });
    return deferred.promise;
  }
  this.luxireStocksById = function(id){
    var deferred = $q.defer();
    $http.get('/api/luxire_stocks/'+id).then(function(data){
      deferred.resolve(data)
    },function(errData, errStatus, errHeaders, errConfig){
      deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
    });
    return deferred.promise;
  }

  this.luxireStocks_addQuantity = function(quantityObj) {
		var deferred = $q.defer();
		$http.post("/api/luxire_stocks/add_stocks", angular.toJson(quantityObj)).success(function(res) {
			console.log(res);
			deferred.resolve(res.data);
  		})
  		.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
  		});
  		return deferred.promise;
	}

  this.luxireStocks_setQuantity = function(quantityObj) {
		var deferred = $q.defer();
		$http.post("/api/luxire_stocks/set_stocks", angular.toJson(quantityObj)).success(function(res) {
			console.log(res);
			deferred.resolve(res.data);
  		})
  		.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
  		});
  		return deferred.promise;
	}




})
