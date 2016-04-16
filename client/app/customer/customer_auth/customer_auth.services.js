angular.module('luxire')
.service('CustomerAuthentication', function($http){
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
    return $http.post('/api/userManager/login', angular.toJson(user));
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
  this.signup = function(user){
    return $http.post('/api/userManager/signup', angular.toJson(user));
  };
  this.logout = function(){
    if(window.localStorage.luxire_token != undefined){
      window.localStorage.removeItem('luxire_token');
    }
    else if(window.sessionStorage.luxire_token != undefined){
      window.sessionStorage.removeItem('luxire_token');
    }
  };
  this.isLoggedIn = function(){
    if(window.localStorage.luxire_token || window.sessionStorage.luxire_token){
      return true;
    }
    else{
      return false;
    }
  };
  this.identity = function(){

  };
  this.forgot_password = function(user){
    return $http.post('/api/userManager/forgot_password', angular.toJson(user))
  };
  this.reset_token_validation = function(token){
    var reset_token = {token: token};
    return $http.post('/api/userManager/reset_password_token_validation?token='+token, {});
  };
  this.reset_password = function(token, passwords){
    return $http.post('/api/userManager/reset_password_with_token?token='+token, angular.toJson(passwords));
  };

});
