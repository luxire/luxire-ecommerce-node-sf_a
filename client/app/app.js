// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('luxire', ['ui.router','ngRoute',
													'ui.bootstrap','angularFileUpload',
													'ui.bootstrap.datetimepicker','ngTagsInput',
													 'ngMessages', 'ngAnimate',
													 'AngularPrint', 'monospaced.qrcode',
												   'ui.tree','infinite-scroll', 'ngAside',
													  'angucomplete-alt', 'angularAwesomeSlider', 'angular-cache'])


.run(function($location,$rootScope, $state){
	// $location.path('/collections');
	$rootScope.alerts = [];

  $rootScope.close_alert = function(index){
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
			console.log('toStateParams', toStateParams);
			if(toState.name == 'test'){
				window.sessionStorage.luxire_token = toStateParams.id;
				console.log('state.go to admin');
				event.preventDefault();

				$state.go('admin.default');
			}
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
.run(function($http){
  $http.defaults.headers.common['x-luxire-token'] = window.localStorage.luxire_token || window.sessionStorage.luxire_token;
})
.directive("whenScrolled", function(){
	return {
		restrict:'A',
		link: function(scope,elem,attrs){
			raw = elem[0];
			elem.bind("scroll", function(){
					if(raw.scrollTop + raw.offsetHeight + 5 >= raw.scrollHeight){
				//		scope.loading = true;
						console.log('Firing next in dir');
						scope.$apply(attrs.whenScrolled);
					}
			});
		}
	}
})
.config(['$routeProvider','$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($routeProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
	$httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
	/*Set Default route*/
	$urlRouterProvider.otherwise('/');

	$urlRouterProvider.otherwise('/');
	$stateProvider
	// .state('test',{
	// 	url:'/test/:id',
	// 	templateUrl: 'app/test/test.html',
	// 	controller: 'testController',
	// 	params: {id: null},
	// 	data: {
	// 		require_auth: false
	// 	}
	// })
	// .state('filter',{
	// 	url: '/filter',
	// 	params: {filterObject: {}},
	// 	templateUrl: 'app/filter/partials/filter1.html',
	// 	controller: 'filterController',
	// 	data: {
	// 		require_auth: false
	// 	}
	// })
	// .state('productDetails',{
	// 	url: '/productdetails/:id',
	// 	templateUrl: 'app/productDetails/productDetails.html',
	// 	controller: 'productDetailsController',
	// 	data: {
	// 		require_auth: false
	// 	}
	// })
	// .state('customize',{
	// 	url: '/customize',
	// 	params: {cartObject: {}},
	// 	templateUrl: 'app/customizeGarments/customizeGarments.html',
	// 	controller: 'customizeGarmentsController',
	// 	data: {
	// 		require_auth: false
	// 	}
	// })
	// .state('personalize',{
	// 	url: '/personalize',
	// 	params: {cartObject: {}},
	// 	templateUrl: 'app/personaliseGarments/personaliseGarments.html',
	// 	controller: 'personaliseGarmentsController',
	// 	data: {
	// 		require_auth: false
	// 	}
	// })
	// .state('measurement',{
	// 	url: '/measurement',
	// 	params: {cartObject: {}},
	// 	templateUrl: 'app/measurementGarments/measurementGarments.html',
	// 	controller: 'measurementGarmentsController',
	// 	data: {
	// 		require_auth: false
	// 	}
	// })
	// .state('collection',{
	// 	url: '/collections',
	// 	templateUrl: 'app/collection/collection.html',
	// 	controller: 'collectionController',
	// 	data: {
	// 		require_auth: false
	// 	}
	// })
	//

	/*Invoices*/
	.state('invoices',{
		url: '/invoice/:number?token',
		params: {param	: {}},
		templateUrl: 'app/customer/invoices/partials/invoicePage.html',
		controller: 'invoiceController',
		data: {
			require_auth: false
		},
		// reloadOnSearch: true
	})
	// .state('cart',{
	// 	url: '/cart',
	// 	params: {cartObject: {}},
	// 	templateUrl: 'app/cart/partials/cart.html',
	// 	controller: 'CartController',
	// 	data: {
	// 		require_auth: false
	// 	}
	// })
	// .state('checkout_address',{
	// 	url: '/checkout/address',
	// 	params: {checkoutObject: {}},
	// 	templateUrl: 'app/checkout/partials/checkoutAddress.html',
	// 	controller: 'CheckoutAddressController',
	// 	data: {
	// 		require_auth: false
	// 	}
	// })
	// .state('checkout_delivery',{
	// 	url: '/checkout/delivery',
	// 	params: {checkoutObject: {}},
	// 	templateUrl: 'app/checkout/partials/checkoutDelivery.html',
	// 	controller: 'CheckoutDeliveryController',
	// 	data: {
	// 		require_auth: false
	// 	}
	// })
	// .state('checkout_payment',{
	// 	url: '/checkout/payment',
	// 	params: {checkoutObject: {}},
	// 	templateUrl: 'app/checkout/partials/checkoutPayment.html',
	// 	controller: 'checkoutPaymentController',
	// 	data: {
	// 		require_auth: false
	// 	}
	// })
	// .state('checkout_gateway',{
	// 	url: '/checkout/gateway',
	// 	params: {gatewayObject: {}},
	// 	templateUrl: 'app/checkout/partials/checkoutGateway.html',
	// 	controller: 'checkoutGatewayController',
	// 	data: {
	// 		require_auth: false
	// 	}
	// })
// 	.state('productListing',{
// 		url: '/product-listing',
// 		params: {filterObject: {}},
// 		templateUrl: 'app/newProduct/partials/productListing.html',
// 		controller: 'productListingController',
// 		css: 'app/newProduct/css/productListing.css',
// 		data: {
// 			require_auth: false
// 		}
// 	})
//
//
// .state('shirtDetailedView',{
// 		url: '/shirt-detailed-view',
// 		params: {filterObject: {}},
// 		templateUrl: 'app/newProduct/partials/shirtDetailView.html',
// 		controller: 'shirtDetailedViewController',
// 		css: 'app/newProduct/css/shirtDetailView.css',
// 		data: {
// 			require_auth: false
// 		}
// 	})
//
//
//
// .state('customizeShirt',{
// 		url: '/customize-shirt',
// 		params: {filterObject: {}},
// 		templateUrl: 'app/customize-shirt/partials/customize-shirt.html',
// 		controller: 'customizeShirtController',
// 		css: 'app/customize-shirt/css/customize-shirt.css',
// 		data: {
// 			require_auth: false
// 		}
// 	})

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
