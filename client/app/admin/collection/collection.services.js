angular.module('luxire')
  .service('collections', function ($http, $q, AdminConstants) {
    var luxireToken = window.localStorage.luxire_token || window.sessionStorage.luxire_token;
    //Get all products
    this.getCollections = function () {
      var deferred = $q.defer();
      $http.get('/api/taxonomies').then(function (data) {
        deferred.resolve(data)
      }, function (errData, errStatus, errHeaders, errConfig) {
        deferred.reject({ data: errData, status: errData.status, headers: errData.headers, config: errData.config });
      });
      return deferred.promise;
    }
    // search taxonomie
    this.searchCollections = function () {
      var taxonomie_obj = {
        "taxonomies": {
          "name": "Brand"
        }
      }
      var deferred = $q.defer();
      $http.get('/api/taxonomies', angular.toJson(taxonomie_obj)).then(function (data) {
        deferred.resolve(data)
      }, function (errData, errStatus, errHeaders, errConfig) {
        deferred.reject({ data: errData, status: errData.status, headers: errData.headers, config: errData.config });
      });
      return deferred.promise;
    }

    // search taxonomie by taxonomie id
    this.searchCollectionsById = function () {
      var taxonomie_id = 1;
      var deferred = $q.defer();
      $http.get('/api/taxonomies/' + taxonomie_id).then(function (data) {
        deferred.resolve(data)
      }, function (errData, errStatus, errHeaders, errConfig) {
        deferred.reject({ data: errData, status: errData.status, headers: errData.headers, config: errData.config });
      });
      return deferred.promise;
    }

    // create a collections (taxonomie)
    this.createCollections = function (collectionObj) {
      var deferred = $q.defer();
      $http.post("/api/taxonomies", angular.toJson(collectionObj)).success(function (res) {
        deferred.resolve(res.data);
      })
        .error(function (errData, errStatus, errHeaders, errConfig) {
          console.log({ data: errData, status: errStatus, headers: errHeaders, config: errConfig })
          deferred.reject({ data: errData, status: errStatus, headers: errHeaders, config: errConfig });
        });
      return deferred.promise;
    }
    // update a collection (taxonomie)
    this.updateCollections = function (id, collectionObj) {
      var deferred = $q.defer();
      var parameters = {
        "taxonomy": collectionObj
      }
      $http.put("/api/taxonomies/" + id, angular.toJson(parameters)).success(function (data) {
        deferred.resolve(data);
      })
        .error(function (errData, errStatus, errHeaders, errConfig) {
          console.log({ data: errData, status: errStatus, headers: errHeaders, config: errConfig })
          deferred.reject({ data: errData, status: errStatus, headers: errHeaders, config: errConfig });
        });
      return deferred.promise;
    }
    // update a collection (taxonomie)
    this.deleteCollections = function (id) {
      var deferred = $q.defer();
      $http.delete("/api/taxonomies/" + id).success(function (data) {
        deferred.resolve(data);
      })
        .error(function (errData, errStatus, errHeaders, errConfig) {
          console.log({ data: errData, status: errStatus, headers: errHeaders, config: errConfig })
          deferred.reject({ data: errData, status: errStatus, headers: errHeaders, config: errConfig });
        });
      return deferred.promise;
    }

    //Get all products
    this.getTaxons = function (id) {
      var deferred = $q.defer();
      $http.get('/api/taxonomies/' + id + '/taxons').then(function (data) {
        deferred.resolve(data)
      }, function (errData, errStatus, errHeaders, errConfig) {
        deferred.reject({ data: errData, status: errData.status, headers: errData.headers, config: errData.config });
      });
      return deferred.promise;
    }

    // Pass all product ids and fetch all product names for the corresponding ids
    this.getAllProductNames = function (product_ids) {
      var deferred = $q.defer();
      $http(
        {
          method: 'GET',
          url: '/api/v1/admin/products/getAllProducts',
          params: { 'ids[]': product_ids }
        }).then(function (data) {
          deferred.resolve(data);
        }, function (errData, errStatus, errHeaders, errConfig) {
          deferred.reject({ data: errData, status: errData.status, headers: errData.headers, config: errData.config });
        });
      return deferred.promise;
    }

    // Fetch all taxon data
    this.getTaxonsById = function (taxon, taxonomyId) {
      var deferred = $q.defer();
      $http.get('/api/taxonomies/' + taxonomyId + '/taxons/' + taxon).then(function (data) {
        deferred.resolve(data)
      }, function (errData, errStatus, errHeaders, errConfig) {
        deferred.reject({ data: errData, status: errData.status, headers: errData.headers, config: errData.config });
      });
      return deferred.promise;
    }

    // create a collections (taxonomie)
    this.createTaxons = function (id, taxonsObj) {
      var deferred = $q.defer();
      var taxonObj = taxonsObj.taxon;
      // form data to help with image
      var fd = new FormData();
      fd.append("name", taxonObj.name);
      fd.append("pretty_name", taxonObj.pretty_name);
      fd.append("description", taxonObj.description);
      fd.append("taxonomy_id", taxonObj.taxonomy_id);
      if (taxonObj.icon) {
        fd.append("icon", taxonObj.icon);
      }

      // for (var i = 0; i < taxonObj.product_ids.length; i++) { fd.append('product_ids', taxonObj.product_ids[i]); }
      fd.append("product_ids",JSON.stringify(taxonObj.product_ids));
      $http.post("/api/v1/admin/taxonomies/" + id + "/taxons?token=" + luxireToken + "", fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      }).success(function (res) {
        deferred.resolve(res);
    		})
        .error(function (errData, errStatus, errHeaders, errConfig) {
          console.log({ data: errData, status: errStatus, headers: errHeaders, config: errConfig })
          deferred.reject({ data: errData, status: errStatus, headers: errHeaders, config: errConfig });
        });
    		return deferred.promise;
    }

    // call for creating taxons automatically on the rules
    this.createTaxonsAutomatic = function (id, taxonsObj) {
      var deferred = $q.defer();
      var taxonObj = taxonsObj.taxon;
      var taxon = {};
      var fd = new FormData();
      fd.append("name", taxonObj.name);
      fd.append("pretty_name", taxonObj.pretty_name);
      fd.append("description", taxonObj.description);
      fd.append("taxonomy_id", taxonObj.taxonomy_id);
      fd.append("rules", JSON.stringify(taxonObj.rules));
      fd.append("match", taxonObj.match);
      if (taxonObj.icon) {
        fd.append("icon", taxonObj.icon);
      }

      $http.post("/api/v1/admin/taxonomies/createRuleBasedCollection?token=" + luxireToken + "", fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      }).success(function (res) {
        deferred.resolve(res);
    		})
        .error(function (errData, errStatus, errHeaders, errConfig) {
          console.log({ data: errData, status: errStatus, headers: errHeaders, config: errConfig })
          deferred.reject({ data: errData, status: errStatus, headers: errHeaders, config: errConfig });
        });
    		return deferred.promise;
    }
    // update a taxons (taxonomie)
    this.updateTaxons = function (taxonomyId, taxonId, taxonObj) {
      var deferred = $q.defer();
      var parameters = {
        "taxonomy": taxonObj
      }
      var taxonObj = taxonObj.taxon;
      var fd = new FormData();
      fd.append("name", taxonObj.name);
      fd.append("pretty_name", taxonObj.pretty_name);
      fd.append("description", taxonObj.description);
      fd.append("taxonomy_id", taxonObj.taxonomy_id);
      if (taxonObj.icon) {
        fd.append("icon", taxonObj.icon);
      }
      $http.put("/api/v1/admin/taxonomies/" + taxonomyId + "/taxons/" + taxonId + "?token=" + luxireToken + "", fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      }).success(function (data) {
        deferred.resolve(data);

    		})
        .error(function (errData, errStatus, errHeaders, errConfig) {
          console.log({ data: errData, status: errStatus, headers: errHeaders, config: errConfig })
          deferred.reject({ data: errData, status: errStatus, headers: errHeaders, config: errConfig });
        });
    		return deferred.promise;
    }

    // update a collection (taxonomie)
    this.deleteTaxons = function (id, tid) {
      var deferred = $q.defer();
      $http.delete("/api/taxonomies/" + tid + '/taxons/' + id).success(function (data) {
        deferred.resolve(data);
      })
        .error(function (errData, errStatus, errHeaders, errConfig) {
          console.log({ data: errData, status: errStatus, headers: errHeaders, config: errConfig })
          deferred.reject({ data: errData, status: errStatus, headers: errHeaders, config: errConfig });
        });
      return deferred.promise;
    }

    this.update_image = function (image, taxonomy_id, taxon_id) {
      var fd = new FormData();
      fd.append('image', image);
      return $http.put('/api/taxonomies/' + taxonomy_id + '/taxons/' + taxon_id, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      }).success(function (data) {
      }).error(function (data) {
      })
    };
  })

  .service('taxonImageUpload', function ($http, $q) {
    this.update_image = function (image, taxonomy_id, taxon_id) {
      var fd = new FormData();
      fd.append('image', image);
      return $http.put('/api/taxonomies/' + taxonomy_id + '/taxons/' + taxon_id, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      });
    };
  })

  .service('allTaxons', function ($http, AdminConstants) {
    this.getTaxonsPerPage = function (totalTaxons) {
      if (totalTaxons == undefined) {
        return $http.get(AdminConstants.api.allTaxons + '?without_children=true');
      } else {
        return $http.get(AdminConstants.api.allTaxons + '?without_children=true&per_page=' + totalTaxons);
      }
    }

    this.searchTaxons = function (query) {
      return $http.get(AdminConstants.api.allTaxons + '?q[name_cont]=' + query);
    }
  })
