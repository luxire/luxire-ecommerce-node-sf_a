// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('luxire')
.config(['$routeProvider','$stateProvider', '$urlRouterProvider',function($routeProvider, $stateProvider, $urlRouterProvider){
	$urlRouterProvider.when('/customer','/customer/');
	$stateProvider
	.state('customer',{
		url:'',
		templateUrl: 'app/customer/customer.html',
		controller: 'ClientController',
		abstract: true,
		data: {
			require_auth: false
		}
	})
	.state('customer.home',{
		url:'/',
		views: {
			"customer": { templateUrl: "app/customer/customer_home/partials/customer_home.html", controller: "CustomerHomeController"},
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.product_listing',{
		url:'/products/:taxonomy_name/:taxon_name',
		views: {
			"customer": { templateUrl: "app/customer/product_listing/partials/product_listing.html",
			 controller: "ProductListingController"},
			 params: {taxonomy_name: null,taxon_name: null}
		},
		data: {
			require_auth: false
		}
	})
	// .state('customer.invoice',{
	// 	url:'/invoice/:number?id',
	// 	views: {
	// 		"customer": {
	// 			templateUrl: "app/customer/invoices/partials/invoicePage.html",
	// 		 	controller: "invoiceController"
	// 		},
	// 	},
	// 	data: {
	// 		require_auth: false
	// 	}
	// })

	// .state('customer.productListing',{
	// 	url: '/product-listing',
	// 	params: {filterObject: {}},
	// 	templateUrl: 'app/customer/newProduct/partials/productListing.html',
	// 	controller: 'productListingController',
	// 	css: 'app/customer/newProduct/css/productListing.css'
	// 	})
	.state('customer.product_detail',{
		url:'/products/:taxonomy_name/:taxon_name/:product_name',
		views: {
			"customer": { templateUrl: "app/customer/product_detail/partials/product_detail.html",
			 controller: "ProductDetailController"},
			 params: {taxonomy_name: null,taxon_name: null,product_name: null}
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.cart',{
		url:'/cart',
		views: {
			"customer": { templateUrl: "app/customer/cart/partials/cart.html",
			 							controller: "CustomerCartController"},
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.checkout_address',{
		url: '/checkout/address',
		views: {
			"customer": { templateUrl: "app/customer/checkout/partials/checkoutAddress.html",
										controller: "CustomerCheckoutAddressController"},
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.checkout_delivery',{
		url: '/checkout/delivery',
		views: {
			"customer": { templateUrl: "app/customer/checkout/partials/checkoutDelivery.html",
										controller: "CustomerCheckoutDeliveryController"},
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.checkout_payment',{
		url: '/checkout/payment',
		views: {
			"customer": {
				templateUrl: 'app/customer/checkout/partials/checkoutPayment.html',
				controller: 'CustomerCheckoutPaymentController'
			}
		},
		data: {
			require_auth: false
		}
	})
	// .state('customer.checkout_gateway',{
	// 	url: '/checkout/gateway',
	// 	params: {gatewayObject: {}},
	// 	templateUrl: 'app/checkout/partials/checkoutGateway.html',
	// 	controller: 'checkoutGatewayController',
	// 	data: {
	// 		require_auth: false
	// 	}
	// })





}])
