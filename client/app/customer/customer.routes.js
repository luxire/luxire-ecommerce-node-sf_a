
angular.module('luxire')
.config(['$routeProvider','$stateProvider', '$urlRouterProvider', 'CacheFactoryProvider', function($routeProvider, $stateProvider, $urlRouterProvider, CacheFactoryProvider){
	angular.extend(CacheFactoryProvider.defaults, { maxAge: 5 * 60 * 1000 });
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
			"customer": {
				templateUrl: "app/customer/customer_home/partials/customer_home.html",
				controller: "CustomerHomeController"
			},
		},
		cache: true,
		data: {
			require_auth: false
		}
	})
	// .state('customer.product_listing',{
	// 	url:'/products/:taxonomy_name/:taxon_name',
	// 	views: {
	// 		"customer": { templateUrl: "app/customer/product_listing/partials/product_listing.html",
	// 		 controller: "ProductListingController"},
	// 		 params: {taxonomy_name: null,taxon_name: null,taxonomy_id: null, taxon_id: null}
	// 	},
	// 	params: {taxonomy_name: null,taxon_name: null,taxonomy_id: null, taxon_id: null},
	// 	data: {
	// 		require_auth: false
	// 	}
	// })
	.state('customer.collection',{
		url:"/collections/*collection_name?color&price&weave-type&pattern&wrinkle-resistant&thickness&construction&Number-of-Colors&price_start&price_end&currency&price_sort",//white listing of params
		views: {
			"customer": {
				templateUrl: "app/customer/collection/partials/collection.html",
			  controller: "CollectionController"},
			 params: {
				 "collection_name": null
			 }
		},
		params: {
			collection_name: null
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.product_detail',{
		url:'/products/:product_name',
		views: {
			"customer": { templateUrl: "app/customer/product_detail/partials/product_detail.html",
			 controller: "ProductDetailController"},
			 params: {
				 product_name: null
			 }
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.additional_service',{
		url:'/additional_service',
		views: {
			"customer": { templateUrl: "app/customer/additional_service/partials/additional_service.html",
			 controller: "AdditionalServiceController"},
			 params: {
				 product_name: null
			 }
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.attribute_detail',{
		url:'/attributes/:attribute_name?type',
		views: {
			"customer": { templateUrl: "app/customer/attribute_detail/partials/attribute_detail_index.html",
			 controller: "AttributeController"},
			 params: {attribute_name: null}
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
	.state('customer.pre_cart',{
		url:'/added_to_cart',
		views: {
			"customer": { templateUrl: "app/customer/pre_cart/partials/pre_cart.html",
			 							controller: "PreCartController"},
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
			"customer": {
				templateUrl: "app/customer/checkout/partials/checkoutDelivery.html",
				controller: "CustomerCheckoutDeliveryController"
			},
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
	.state('customer.login',{
		url: '/customer/login',
		views: {
			"customer": {
				templateUrl: 'app/customer/customer_auth/partials/customer_login.html',
				controller: 'CustomerLoginController'
			}
		},
		params: {nav_to_state: null},
		data: {
			require_auth: false
		}
	})
	.state('customer.signup',{
		url: '/customer/signup',
		views: {
			"customer": {
				templateUrl: 'app/customer/customer_auth/partials/customer_signup.html',
				controller: 'CustomerSignupController'
			}
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.forgot_password',{
		url: '/customer/forgot_password',
		views: {
			"customer": {
				templateUrl: 'app/customer/customer_auth/partials/customer_forgot_password.html',
				controller: 'CustomerForgotPasswordController'
			}
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.reset_password',{
		url: '/customer/reset_password?token',
		views: {
			"customer": {
				templateUrl: 'app/customer/customer_auth/partials/customer_reset_password.html',
				controller: 'CustomerResetPasswordController'
			}
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.my_account',{
		url: '/my_account',
		views: {
			"customer": {
				templateUrl: 'app/customer/my_account/partials/my_account.html',
				controller: 'MyAccountController'
			}
		},
		params: {nav_to_state: null},
		data: {
			require_auth: true
		}
	})
	.state('customer.search',{
		url:'/search?name_cont&taxonomy&color&price&weave-type&pattern&wrinkle-resistant&thickness&construction&Number-of-Colors&price_start&price_end&currency&price_sort',
		views: {
			"customer": { templateUrl: "app/customer/search/partials/search.html",
			 controller: "SearchController"},
			 params: {
				 name_cont: null,
				 taxonomy: null,
				 page: null,
			 }
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.payment_failed',{
		url:'/payment_failed',
		views: {
			"customer": { templateUrl: "app/customer/payment_failed/partials/payment_failed.html",
			 							controller: "PaymentFailedController"},
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.about_us',{
		url:'/about_us',
		views: {
			"customer": {
				templateUrl: "app/customer/static_content/about_us.html"
			},
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.privacy_policy',{
		url:'/privacy_policy',
		views: {
			"customer": {
				templateUrl: "app/customer/static_content/privacy_policy.html"
			},
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.shipping_returns',{
		url:'/shipping_returns',
		views: {
			"customer": {
				templateUrl: "app/customer/static_content/shipping_returns.html"
			},
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.faqs',{
		url:'/faqs',
		views: {
			"customer": {
				templateUrl: "app/customer/static_content/faqs.html"
			},
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.quality',{
		url:'/quality',
		views: {
			"customer": {
				templateUrl: "app/customer/static_content/quality.html"
			},
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.responsible_manufacturing',{
		url:'/responsible_manufacturing',
		views: {
			"customer": {
				templateUrl: "app/customer/static_content/responsible_manufacturing.html"
			},
		},
		data: {
			require_auth: false
		}
	})
	.state('customer.contact_us',{
		url:'/contact_us',
		views: {
			"customer": {
				templateUrl: "app/customer/static_content/contact_us.html",
				controller: "ClientController"
			},
		},
		data: {
			require_auth: false
		}
	})

}])
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
// .state('customer.product_detail',{
// 	url:'/products/:taxonomy_name/:taxon_name/:product_name',
// 	views: {
// 		"customer": { templateUrl: "app/customer/product_detail/partials/product_detail.html",
// 		 controller: "ProductDetailController"},
// 		 params: {taxonomy_name: null,taxon_name: null,product_name: null}
// 	},
// 	data: {
// 		require_auth: false
// 	}
// })
