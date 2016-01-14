angular.module('luxire')
.controller('LoginController', function($scope, $authentication, $rootScope, $state){
  $scope.back_office = {
    user: {
      email: '',
      password: ''
    }
  }
  $scope.remember_me = false;
  $scope.error = '';
  $scope.popover_template = 'forgot_password_popover.html';
  /*Login function*/
  $scope.login = function(){
    if($scope.back_office.user.email && $scope.back_office.user.password){
      $authentication.authenticate($scope.back_office)
      .then(function(data){
        $authentication.login($scope.remember_me, data.data);
        $state.go('admin.default');
        $rootScope.alerts.push({type: 'success', message: 'Login successful!'});

        console.log(data);
      },
      function(error){
        $scope.error = '*Invalid user id or password';
        console.error(error);
      });
    }
    else if($scope.back_office.user.email && !$scope.back_office.user.password){
      $scope.error = '*Please enter your password';
    }
    else{
      $scope.error = '*Please enter your email-id';
    }

  }
})
