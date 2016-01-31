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
.controller('ForgotPasswordController', function($scope, $authentication){
  $scope.error = '';
  $scope.back_office = {
    user: {
      email: ''
    }
  };
  $scope.submit_email = function () {
    if($scope.back_office.user.email == ''){
      $scope.error = 'Please enter your email-id'
    }
    else{
      $authentication.forgot_password($scope.back_office)
      .then(function(data){
        console.log(data);
        alert('Reset link has been sent to your mail');
      },function(error){
        console.error(error);
      });
    }
  }
})
.controller('ResetPasswordController', function($scope, $authentication, $state, $stateParams){
  $scope.error = '';
  $scope.passwords = {
    new_password: '',
    new_password_confirmation: ''
  };
  console.log('stateParams', $stateParams);
  if($stateParams.reset_token == "" ||$stateParams.reset_token == undefined ){
    $state.go('login');
  }
  else{
    $authentication.reset_token_validation($stateParams.reset_token)
    .then(function(data){
      console.log(data);
    },function(error){
      console.error(error);
    })
  };
  $scope.submit = function(){
    if(!$scope.passwords.new_password && ($scope.passwords.new_password_confirmation || !$scope.passwords.new_password_confirmation)){
      $scope.error = "Please enter your new password"
    }
    else if($scope.passwords.new_password && !$scope.passwords.new_password_confirmation){
      $scope.error = "Please confirm your new password"
    }
    else{
      $authentication.reset_password($stateParams.reset_token, $scope.passwords)
      .then(function(data){
        console.log(data);
        alert('password change successful');
        $state.go('login');
      },function(error){
        alert('password change failed');
        console.error(error);
      })
    }
  };
})
