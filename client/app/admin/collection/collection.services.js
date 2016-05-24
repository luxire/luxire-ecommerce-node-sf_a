angular.module('luxire')
.service('collections',function($http, $q, AdminConstants){

  //Get all products
  this.getCollections= function(){
    console.log("get collection services is calling...");
    var deferred = $q.defer();
    $http.get('/api/taxonomies').then(function(data){
      deferred.resolve(data)
      console.log(data);
    },function(errData, errStatus, errHeaders, errConfig){
      deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
    });
    return deferred.promise;
  }
  // search taxonomie
  this.searchCollections= function(){
    var taxonomie_obj={
        "taxonomies":{
            "name" : "Brand"
        }
    }
    console.log("search collection services is calling...");
    var deferred = $q.defer();
    $http.get('/api/taxonomies', angular.toJson(taxonomie_obj)).then(function(data){
      deferred.resolve(data)
      console.log(data);
    },function(errData, errStatus, errHeaders, errConfig){
      deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
    });
    return deferred.promise;
  }

  // search taxonomie by taxonomie id
  this.searchCollectionsById= function(){
    var taxonomie_id=1;
    console.log("search collection by id  services is calling...");
    var deferred = $q.defer();
    $http.get('/api/taxonomies/'+taxonomie_id).then(function(data){
      deferred.resolve(data)
      console.log(data);
    },function(errData, errStatus, errHeaders, errConfig){
      deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
    });
    return deferred.promise;
  }

  // create a collections (taxonomie)
  this.createCollections = function(collectionObj) {
		var deferred = $q.defer();
    console.log("create collection services is calling with collection obj: \n"+collectionObj);
		$http.post("/api/taxonomies", angular.toJson(collectionObj)).success(function(res) {
			console.log(res);
			deferred.resolve(res.data);
  		})
  		.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
  		});
  		return deferred.promise;
	}
  // update a collection (taxonomie)
  this.updateCollections = function(id, collectionObj) {
    console.log("update collection services is calling with collection obj: \n"+collectionObj);
    console.log("update collection services is calling with collection id: \n"+id);

		var deferred = $q.defer();
		var parameters = {
      "taxonomy": collectionObj
		}
		$http.put("/api/taxonomies/"+id,angular.toJson(parameters)).success(function(data) {
			deferred.resolve(data);
  		})
			.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
  		});
  		return deferred.promise;
	}
  // update a collection (taxonomie)
  this.deleteCollections = function(id) {
    console.log("delete collection services is calling with collection obj: \n"+id);
		var deferred = $q.defer();
		$http.delete("/api/taxonomies/"+ id).success(function(data) {
			deferred.resolve(data);
  		})
			.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
  		});
  		return deferred.promise;
	}

  //Get all products
  this.getTaxons= function(id){
    console.log("get taxon services is calling...");
    var deferred = $q.defer();
    $http.get('/api/taxonomies/'+id+'/taxons').then(function(data){
      deferred.resolve(data)
      console.log(data);
    },function(errData, errStatus, errHeaders, errConfig){
      deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
    });
    return deferred.promise;
  }

  //Get all products
  this.getTaxonsById= function(id,tid){
    console.log("get taxon by id services is calling...");
    var deferred = $q.defer();
    $http.get('/api/taxonomies/'+id+'/taxons/'+tid).then(function(data){
      deferred.resolve(data)
      console.log(data);
    },function(errData, errStatus, errHeaders, errConfig){
      deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
    });
    return deferred.promise;
  }


    // create a collections (taxonomie)
    this.createTaxons = function(id,taxonsObj) {
  		var deferred = $q.defer();
      console.log("create taxons services is calling with collection obj: \n"+taxonsObj);
      console.log("create taxons services is calling with collection tid: \n"+id);
  		$http.post("/api/taxonomies/"+id+"/taxons", angular.toJson(taxonsObj)).success(function(res) {
  			console.log(res);
  			deferred.resolve(res);
    		})
    		.error(function(errData, errStatus, errHeaders, errConfig) {
  				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
    			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
    		});
    		return deferred.promise;
  	}

    // update a taoxons (taxonomie)
    this.updateTaxons = function(id,tid,taxonObj) {
      console.log("update collection services is calling with taxon obj: \n"+taxonObj);
      console.log("update collection services is calling with taxon id: \n"+id);
      console.log("update collection services is calling with taxon tid: \n"+tid);
  		var deferred = $q.defer();
  		var parameters = {
        "taxonomy": taxonObj
  		}
  		$http.put("/api/taxonomies/"+id+"/taxons/"+tid,angular.toJson(taxonObj)).success(function(data) {
  			deferred.resolve(data);
    		})
  			.error(function(errData, errStatus, errHeaders, errConfig) {
  				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
    			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
    		});
    		return deferred.promise;
  	}

    // update a collection (taxonomie)
    this.deleteTaxons = function(id, tid) {
      console.log("delete taxons services is calling with collection obj: \n"+id);
      console.log("delete taxons services is calling with collection obj: \n"+tid);
      var deferred = $q.defer();
      $http.delete("/api/taxonomies/"+id+'/taxons/'+tid).success(function(data) {
        deferred.resolve(data);
        })
        .error(function(errData, errStatus, errHeaders, errConfig) {
          console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
          deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
        });
        return deferred.promise;
    }

    this.update_image = function(image, taxonomy_id,taxon_id){
      console.log("taxon image upload url: ",'/taxonomies/'+taxonomy_id+'/customized_taxons/'+taxon_id);
     console.log('image', image);
     var fd = new FormData();
     fd.append('image', image);
     console.log("value appended");
     return $http.put('/api/taxonomies/'+taxonomy_id+'/customized_taxons/'+taxon_id, fd, {
         transformRequest: angular.identity,
         headers: {'Content-Type': undefined}
      });
      console.log("end of update service");
    };



})

.service('taxonImageUpload', function($http, $q){

  this.update_image = function(image, taxonomy_id,taxon_id){
    console.log("taxon image upload url: ",'/taxonomies/'+taxonomy_id+'/customized_taxons/'+taxon_id);
   console.log('image', image);
   var fd = new FormData();
   fd.append('image', image);
   console.log("value appended");
   return $http.put('/taxonomies/'+taxonomy_id+'/customized_taxons/'+taxon_id, fd, {
       transformRequest: angular.identity,
       headers: {'Content-Type': undefined}
    });
    console.log("end of update service");
  };

})
.service('allTaxons', function($http,AdminConstants){

	this.getTaxonsPerPage= function(totalTaxons){
		if(totalTaxons == undefined){
			return $http.get(AdminConstants.api.allTaxons+'?without_children=true');
		}else{
			return $http.get(AdminConstants.api.allTaxons+'?without_children=true&per_page='+totalTaxons);
		}
	}


	this.searchTaxons= function(query){
		return $http.get(AdminConstants.api.allTaxons+'?q[name_cont]='+query);
	}

})
