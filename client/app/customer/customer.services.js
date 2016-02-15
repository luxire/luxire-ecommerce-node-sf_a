angular.module('luxire')
.service('CustomerConstants', function(){
  this.api = {
    host: 'http://54.169.41.36:3000',
    products: '/api/v1/products',
    product_types: '/api/v1/product_types',
    style_masters: '/api/v1/style_masters'
  };
})
.service('ImageHandler', function(CustomerConstants){
  this.url = function(path){
    if(path.indexOf('http')>-1){
      return path;
    }
    else{
      return CustomerConstants.api.host+path;
    }
  };
})
