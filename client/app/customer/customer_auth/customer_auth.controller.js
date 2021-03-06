angular.module('luxire')
.controller('CustomerLoginController', function($scope, CustomerAuthentication, $state, $rootScope, CustomerOrders, CustomerConstants){
  window.scrollTo(0, 0);
  if(CustomerAuthentication.isLoggedIn()){
    $state.go('customer.home');
    $rootScope.alerts.push({type: 'success', message: 'You\'re already logged in'});

  }
  $scope.customer = {
    user: {
      email: '',
      password: ''
    }
  };
  $scope.remember_me = false;
  $scope.error = '';
  $scope.popover_template = 'forgot_password_popover.html';
  $scope.nav_to_state = $state.params.nav_to_state;
  /*Login function*/
  $scope.login = function(){
    $scope.error = '';
    if($scope.customer.user.email && $scope.customer.user.password){
      $scope.loading = true;
      CustomerAuthentication.authenticate($scope.customer)
      .then(function(data){
        CustomerAuthentication.login($scope.remember_me, data.data);
        $scope.loading = false;
        if($state.params.nav_to_state === 'customer.checkout_address'){

          CustomerOrders.get_order_by_cookie($rootScope.luxire_cart)
          .then(function(data){
            $rootScope.luxire_cart = data.data;
            $state.go('customer.checkout_address');
          },
          function(error){
            // $state.params ? $state.go($state.params.nav_to_state) : $state.go('customer.product_listing');
            console.error(error);
          });
        }
        else if ($state.params.nav_to_state == null){
          $state.go('customer.home');
          CustomerOrders.get_order_by_cookie($rootScope.luxire_cart)
          .then(function(data){
            $rootScope.luxire_cart = data.data;
          },
          function(error){
            console.error(error);
          });
        }
        $rootScope.alerts.push({type: 'success', message: 'Login successful!'});
      },
      function(error){
        $scope.loading = false;
        $scope.error = '*Invalid user id or password';
        console.error(error);
      });
    }
    else if($scope.customer.user.email && !$scope.customer.user.password){
      $scope.error = '*Please enter your password';
    }
    else{
      $scope.error = '*Please enter your email-id';
    }

  }
})
.controller('CustomerSignupController', function($scope, CustomerAuthentication, $state, $rootScope, CustomerOrders, CustomerConstants){
  $scope.new_user = {
    user: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
  }
  $scope.loading = false;
  $scope.error_reg = '';
  $scope.register = function(){
    $scope.error_reg = '';
    if($scope.new_user.user.email!="" && $scope.new_user.user.password!="" && $scope.new_user.user.password_confirmation!=""){
      $scope.loading = true;
      CustomerAuthentication.signup($scope.new_user)
      .then(function(data){
        $scope.loading = false;
        CustomerAuthentication.authenticate($scope.new_user)
        .then(function(data){
          CustomerAuthentication.login(false, data.data);
          $state.go('customer.home');
          $rootScope.alerts.push({type: 'success', message: 'Signup successful!'});
        }, function(error){
          $rootScope.alerts.push({type: 'success', message: 'Signup failed!'});
        })
      }, function(error){
        $scope.loading = false;
        console.log(error);
        $scope.error_reg = "*"+error.data.statusText;
      });
    }
    else{
      $scope.error_reg = "*Please fill in the mandotory fields";
    }
  };

})
.controller('CustomerForgotPasswordController', function($scope, CustomerAuthentication, $state, $rootScope, CustomerOrders, CustomerConstants){
  $scope.customer = {
    user: {
      email: ''
    }
  };
  $scope.error = '';
  $scope.loading = false;
  $scope.forgot_password = function(){
    $scope.loading = true;
    if($scope.customer.user.email!=''){
      CustomerAuthentication.forgot_password($scope.customer)
      .then(function(data){
        $scope.loading = false;
        if(data.data && data.data.statusCode == 404){
          $scope.error = "*User doesn't exist";
        }
        else{
          $rootScope.alerts.push({type: 'success',message: 'Link to reset password is sent to your email'});
          var default_collection = {
            taxonomy_name: CustomerConstants.default.taxonomy_name,
            taxon_name: CustomerConstants.default.taxon_name,
            taxonomy_id: CustomerConstants.default.taxonomy_id,
            taxon_id: CustomerConstants.default.taxon_id,
          };
          $state.go('customer.home');
        }
      }, function(error){
        $scope.loading = false;
        console.error(error);
      });
    }
    else{
      $scope.error = "*Please enter your email";
    }
  };
})
.controller('CustomerResetPasswordController', function($scope, CustomerAuthentication, $state, $rootScope, CustomerOrders, CustomerConstants){
  $scope.validating_token = true;
  $scope.customer = {
    new_password: '',
    new_password_confirmation: ''
 };
  $scope.error = {
    type: 'success',
    message: 'validating token...'
  };
  CustomerAuthentication.reset_token_validation($state.params.token)
  .then(function(data){
    if(data.data.statusCode == 200){
      $scope.validating_token = false;
      $scope.error = {
        type: '',
        message: ''
      };
    }
    else{
      $scope.validating_token = false;
      $rootScope.alerts.push({type: 'danger',message: 'Invalid reset password link'});
      $state.go('customer.home');
    }
  }, function(error){
    $rootScope.alerts.push({type: 'danger',message: 'Invalid reset password link'});
    $state.go('customer.home');
    console.error(error);
  });
  $scope.loading = false;
  $scope.reset = function(){
    $scope.loading = true;
    if($scope.customer.new_password!=''&&$scope.customer.new_password_confirmation!=''){
      CustomerAuthentication.reset_password($state.params.token, $scope.customer)
      .then(function(data){
        $scope.loading = false;
        if(data.data.statusCode == 200){
          $state.go('customer.home');
          $rootScope.alerts.push({type: 'success', message: 'Password reset successful!'});
        }
        else{
          $scope.error = {
            type: 'danger',
            message: data.data.statusText
          };
        }
      }, function(error){
        console.error(error);
      });
    }
    else{
      $scope.error = {
        type: 'danger',
        message: '*Please fill mandatory fields'
      };
    }
  };
});
