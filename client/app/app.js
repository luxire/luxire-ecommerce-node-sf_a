// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('luxire', ['ui.router','ngRoute',
													'ui.bootstrap','angularFileUpload',
													'ui.bootstrap.datetimepicker','ngTagsInput',
													'ngAnimate', 'ngMessages',
													 'AngularPrint', 'monospaced.qrcode'])

.run(function($location,$rootScope, $state){
	$rootScope.spree_host = 'http://localhost:3000';
	// $location.path('/collections');
	$rootScope.alerts = [];

  $rootScope.close_alert = function(index){
    console.log(index);
    $rootScope.alerts.splice(index, 1);
  };
	$rootScope.page = {
        setTitle: function(title) {
            this.title = 'Luxire - ' + title;
        }
    }

    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        $rootScope.page.setTitle(current.$$route.title || 'Home');
    });
		$rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
				console.log('tostate', toState);
				if(toState.data.require_auth){
					if(window.localStorage.luxire_token == undefined && window.sessionStorage.luxire_token == undefined ){
						event.preventDefault();
						$state.go('login');
					}
				}
				if(toState.name == 'login'){
					console.log('token', window.sessionStorage.luxire_token);
					if(window.localStorage.luxire_token != undefined || window.sessionStorage.luxire_token != undefined ){
						event.preventDefault();
						$rootScope.alerts.push({type: 'warning', message: 'You are already logged in!'});

					}
				}

        // // track the state the user wants to go to; authorization service needs this
        // $rootScope.toState = toState;
        // $rootScope.toStateParams = toStateParams;
        // // if the principal is resolved, do an authorization check immediately. otherwise,
        // // it'll be done when the state it resolved.
        // if (principal.isIdentityResolved()) authorization.authorize();
  	});

})
.config(['$routeProvider','$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($routeProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
	$httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
	$urlRouterProvider.otherwise('/collections');
	$stateProvider
	.state('test',{
		url:'/test',
		templateUrl: 'app/test/test.html',
		controller: 'testController',
		data: {
			require_auth: false
		}
	})
	.state('filter',{
		url: '/filter',
		params: {filterObject: {}},
		templateUrl: 'app/filter/partials/filter1.html',
		controller: 'filterController',
		data: {
			require_auth: false
		}
	})
	.state('luxire_product',{
		url: '/luxire_product',
		templateUrl: 'app/newProduct/partials/newProduct.html',
		controller: 'newProductController',
		data: {
			require_auth: false
		}
	})
	.state('productDetails',{
		url: '/productdetails/:id',
		templateUrl: 'app/productDetails/productDetails.html',
		controller: 'productDetailsController',
		data: {
			require_auth: false
		}
	})
	.state('customize',{
		url: '/customize',
		params: {cartObject: {}},
		templateUrl: 'app/customizeGarments/customizeGarments.html',
		controller: 'customizeGarmentsController',
		data: {
			require_auth: false
		}
	})
	.state('personalize',{
		url: '/personalize',
		params: {cartObject: {}},
		templateUrl: 'app/personaliseGarments/personaliseGarments.html',
		controller: 'personaliseGarmentsController',
		data: {
			require_auth: false
		}
	})
	.state('measurement',{
		url: '/measurement',
		params: {cartObject: {}},
		templateUrl: 'app/measurementGarments/measurementGarments.html',
		controller: 'measurementGarmentsController',
		data: {
			require_auth: false
		}
	})
	.state('collection',{
		url: '/collections',
		templateUrl: 'app/collection/collection.html',
		controller: 'collectionController',
		data: {
			require_auth: false
		}
	})
	.state('cart',{
		url: '/cart',
		params: {cartObject: {}},
		templateUrl: 'app/cart/partials/cart.html',
		controller: 'CartController',
		data: {
			require_auth: false
		}
	})
	.state('checkout_address',{
		url: '/checkout/address',
		params: {checkoutObject: {}},
		templateUrl: 'app/checkout/partials/checkoutAddress.html',
		controller: 'CheckoutAddressController',
		data: {
			require_auth: false
		}
	})
	.state('checkout_delivery',{
		url: '/checkout/delivery',
		params: {checkoutObject: {}},
		templateUrl: 'app/checkout/partials/checkoutDelivery.html',
		controller: 'CheckoutDeliveryController',
		data: {
			require_auth: false
		}
	})
	.state('checkout_payment',{
		url: '/checkout/payment',
		params: {checkoutObject: {}},
		templateUrl: 'app/checkout/partials/checkoutPayment.html',
		controller: 'checkoutPaymentController',
		data: {
			require_auth: false
		}
	})
	.state('checkout_gateway',{
		url: '/checkout/gateway',
		params: {gatewayObject: {}},
		templateUrl: 'app/checkout/partials/checkoutGateway.html',
		controller: 'checkoutGatewayController',
		data: {
			require_auth: false
		}
	})

	// $locationProvider.html5Mode({
  //      enabled: true,
  //      requireBase: false
  // });


	// $routeProvider.
	// when('/test',{
	// 	templateUrl: 'app/test/test.html',
	// 	controller: 'testController'
	// }).
	// when('/productdetails/:id',{
	// 	templateUrl: 'app/productDetails/productDetails.html',
	// 	controller: 'productDetailsController'
	// }).
	// when('/customize',{
	// 	templateUrl: 'app/customizeGarments/customizeGarments.html',
	// 	controller: 'customizeGarmentsController'
	// }).
	// when('/personalize',{
	// 	templateUrl: 'app/personaliseGarments/personaliseGarments.html',
	// 	controller: 'personaliseGarmentsController'
	// }).
	// when('/measurement',{
	// 	templateUrl: 'app/measurementGarments/measurementGarments.html',
	// 	controller: 'measurementGarmentsController'
	// }).
	// when('/admin',{
	// 	templateUrl: 'app/admin/admin.html',
	// 	controller: 'adminController'
	// }).
	// when('/collections',{
	// 	templateUrl: 'app/collection/collection.html',
	// 	controller: 'collectionController'
	// })

}])
