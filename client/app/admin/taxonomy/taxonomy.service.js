angular.module('luxire')
.service('TaxonomyService', function($http,$q){

  this.getTaxonomies = function(){
    return $http.get('/api/taxonomies');
  }

  this.createTaxonomy = function(taxonomie) {
    // console.log(taxonomie);
    // console.log('/api/taxonomies');
    // console.log(angular.toJson(taxonomie));
    return $http.post('/api/taxonomies', angular.toJson(taxonomie));
  }

  this.getTaxonomyById= function(id){
    // console.log("id in getTaxonomyById service",id);
    // console.log('/api/taxonomies');
    // console.log('/api/taxonomies'+"/"+id);
    return $http.get('/api/taxonomies'+"/"+id);
  }


  this.deleteTaxonomy= function(id){
  //  console.log("id in service",id);
    return $http.delete('/api/taxonomies'+"/"+id);
  }
  this.updateTaxonomy = function(id,taxonomie) {
    // console.log(id);
    // console.log("taxonomie",taxonomie);
		 return $http.put('/api/taxonomies'+"/"+id, angular.toJson(taxonomie));
	}

})
