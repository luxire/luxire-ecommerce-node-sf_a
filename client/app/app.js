// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('luxire', ['ui.router','ngRoute','ui.bootstrap','angularFileUpload','ui.bootstrap.datetimepicker','ngTagsInput'])

.run(function($location,$rootScope){
	// $location.path('/collections');

	$rootScope.page = {
        setTitle: function(title) {
            this.title = 'Luxire - ' + title;
        }
    }

    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        $rootScope.page.setTitle(current.$$route.title || 'Home');
    });

})
.config(['$routeProvider','$stateProvider', '$urlRouterProvider',function($routeProvider, $stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/collections');
	$stateProvider
	.state('test',{
		url:'/test',
		templateUrl: 'app/test/test.html',
		controller: 'testController'
	})
	.state('productDetails',{
		url: '/productdetails/:id',
		templateUrl: 'app/productDetails/productDetails.html',
		controller: 'productDetailsController'
	})
	.state('customize',{
		url: '/customize',
		params: {cartObject: {}},
		templateUrl: 'app/customizeGarments/customizeGarments.html',
		controller: 'customizeGarmentsController'
	})
	.state('personalize',{
		url: '/personalize',
		params: {cartObject: {}},
		templateUrl: 'app/personaliseGarments/personaliseGarments.html',
		controller: 'personaliseGarmentsController'
	})
	.state('measurement',{
		url: '/measurement',
		params: {cartObject: {}},
		templateUrl: 'app/measurementGarments/measurementGarments.html',
		controller: 'measurementGarmentsController'
	})
	.state('collection',{
		url: '/collections',
		templateUrl: 'app/collection/collection.html',
		controller: 'collectionController'
	})
	.state('cart',{
		url: '/cart',
		params: {cartObject: {}},
		templateUrl: 'app/cart/partials/cart.html',
		controller: 'CartController'
	})
	.state('checkout_address',{
		url: '/checkout/address',
		params: {checkoutObject: {}},
		templateUrl: 'app/checkout/partials/checkoutAddress.html',
		controller: 'CheckoutAddressController'
	})
	.state('checkout_delivery',{
		url: '/checkout/delivery',
		params: {checkoutObject: {}},
		templateUrl: 'app/checkout/partials/checkoutDelivery.html',
		controller: 'CheckoutDeliveryController'
	})
	.state('checkout_payment',{
		url: '/checkout/payment',
		params: {checkoutObject: {}},
		templateUrl: 'app/checkout/partials/checkoutPayment.html',
		controller: 'checkoutPaymentController'
	})
	.state('checkout_gateway',{
		url: '/checkout/gateway',
		params: {gatewayObject: {}},
		templateUrl: 'app/checkout/partials/checkoutGateway.html',
		controller: 'checkoutGatewayController'
	})


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
