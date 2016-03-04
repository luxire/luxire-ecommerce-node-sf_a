angular.module('luxire')
.service('invoiceService', function($http,$q){

  this.getInvoice = function(id){
       console.log("service");
  		return $http.get('/api/myAccount/'+id);

  	}

});
