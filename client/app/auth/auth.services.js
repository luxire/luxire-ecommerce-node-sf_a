angular.module('luxire')
.service('$authentication', function($http){
  var _identity = undefined,_authenticated = false;
  this.is_identity_resolved = function(){
    return angular.isDefined(_identity);
  };
  this.is_authenticated = function(){
    return _authenticated;
  };
  this.has_role = function(role){
    //todo
  };
  this.has_roles = function(){
    //todo
  };
  this.authenticate = function(user){
    return $http.post('/api/userManager/login', angular.toJson(user))
  };
  this.login = function(remember_me, token){
    if(remember_me){
      window.localStorage.luxire_token = token;
    }
    else{
      window.sessionStorage.luxire_token = token;
    }
    console.log('login successful');
  };
  this.logout = function(){
    if(window.localStorage.luxire_token != undefined){
      window.localStorage.removeItem('luxire_token');
    }
    else if(window.sessionStorage.luxire_token != undefined){
      window.sessionStorage.removeItem('luxire_token');
    }
  };
  this.identity = function(){

  }
})
.service('$authorization', function($http){

})
