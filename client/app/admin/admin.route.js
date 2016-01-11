// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('luxire')

.config(['$routeProvider','$stateProvider', '$urlRouterProvider',function($routeProvider, $stateProvider, $urlRouterProvider){
	$urlRouterProvider.when('/admin','/admin/');
	$stateProvider
	.state('admin',{
		url:'/admin',
		templateUrl: 'app/admin/admin.html',
		controller: 'adminController'
	})
	.state('admin.default',{
		url:'/',
		views: {
			"sideContent": { templateUrl: 'app/admin/default/partials/sideBarDefault.html'},
			"mainContent": { templateUrl: 'app/admin/default/partials/adminHome.html' }
		}
	})
  .state('admin.customer',{
		url:'/customers',
		views: {
			"sideContent": { templateUrl: 'app/admin/default/partials/sideBarDefault.html'},
			"mainContent": { templateUrl: 'app/admin/customer/partials/customerHome.html',controller: 'CustomerController' }
		}
	})
  .state('admin.new_customer',{
		url:'/customers/new',
		views: {
			"sideContent": { templateUrl: 'app/admin/default/partials/sideBarDefault.html'},
			"mainContent": { templateUrl: 'app/admin/customer/partials/addCustomer.html',controller: 'CustomerController' }
		}
	})
	.state('admin.product',{
		url:'/products',
		views: {
			"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html'},
			"mainContent": { templateUrl: 'app/admin/product/partials/productsHome.html',controller: 'ProductController'}
		}
	})
  .state('admin.new_product',{
		url:'/products/new',
		views: {
			"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html'},
			"mainContent": { templateUrl: 'app/admin/product/partials/addProducts.html',controller: 'ProductController'}
		}

	})
	.state('admin.discount',{
		url:'/discounts',
		views: {
			"sideContent": { templateUrl: 'app/admin/default/partials/sideBarDefault.html'},
			"mainContent": { templateUrl: 'app/admin/discount/partials/discountsHome.html',controller: 'DiscountHomeController' }
		}
	})
	.state('admin.new_discount',{
		url:'/discounts/new',
		views: {
			"sideContent": { templateUrl: 'app/admin/default/partials/sideBarDefault.html'},
			"mainContent": { templateUrl: 'app/admin/discount/partials/addDiscounts.html',controller: 'AddDiscountController' }
		}
	})
	.state('admin.edit_discount',{
		url: '/discounts/:id/edit/',
		views: {
			"sideContent": { templateUrl: 'app/admin/default/partials/sideBarDefault.html'},
			"mainContent": { templateUrl: 'app/admin/discount/partials/addDiscounts.html',
											 controller: 'EditDiscountController',
										   }
		},
		params: {promo_object: null}
	})
	.state('admin.giftcard',{
		url:'/giftcards',
		views: {
			"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html'},
			"mainContent": { templateUrl: 'app/admin/giftcard/partials/giftCardHome.html',controller: 'GiftCardController'}
		}
	})
	.state('admin.new_giftcard',{
		url:'/giftcards/new',
		views: {
			"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html'},
			"mainContent": { templateUrl: 'app/admin/giftcard/partials/addGiftProducts.html',controller: 'GiftCardController' }
		}
	})
	.state('admin.manage_giftcard',{
		url:'/giftcards/manage',
		views: {
			"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html'},
			"mainContent": { templateUrl: 'app/admin/giftcard/partials/manageGiftCard.html',controller: 'GiftCardController' }
		}
	})
	.state('admin.order',{
		url:'/orders',
		views: {
			"sideContent": { templateUrl: 'app/admin/order/partials/sidebarOrders.html'},
			"mainContent": { templateUrl: 'app/admin/order/partials/orderHome.html',controller: 'OrderController' }
		}
	})
	.state('admin.new_order',{
		url:'/orders/new',
		views: {
			"sideContent": { templateUrl: 'app/admin/order/partials/sideBarOrders.html'},
			"mainContent": { templateUrl: 'app/admin/order/partials/addOrder.html',controller: 'OrderController' }
		}
	})
	.state('admin.order_sheet',{
		url:'/orders/:order_number',
		views: {
			"sideContent": { templateUrl: 'app/admin/order/partials/sidebarOrders.html'},
			"mainContent": { templateUrl: 'app/admin/order/partials/order_sheet.html',controller: 'OrderSheetController' }
		},
		params: {order: null}
	})
	/*Setting*/
	.state('admin.shipping_setting',{
		url:'/settings/shipping',
		views: {
			"sideContent": { templateUrl: 'app/admin/setting/partials/sidebarSettings.html'},
			"mainContent": { templateUrl: 'app/admin/setting/shipping/partials/shippingHome.html', controller: 'ShippingController' }
		},
		params: {prev_state_status: null}
	})
	/*shipping carriers*/
	.state('admin.shipping_setting_realtime_carriers',{
		url:'/settings/shipping/carrier_services',
		views: {
			"sideContent": { templateUrl: 'app/admin/setting/partials/sidebarSettings.html'},
			"mainContent": { templateUrl: 'app/admin/setting/shipping/partials/shipping_carriers.html', controller: 'ShippingCarrierController' }
		}
	})
	.state('admin.shipping_setting_zones_new',{
		url:'/settings/shipping/shipping_zones/new',
		views: {
			"sideContent": { templateUrl: 'app/admin/setting/partials/sidebarSettings.html'},
			"mainContent": { templateUrl: 'app/admin/setting/shipping/partials/shipping_zones.html', controller: 'AddZoneController' }
		}
	})
	.state('admin.shipping_setting_shipping_method_new',{
		url:'/settings/shipping/shipping_methods',
		views: {
			"sideContent": { templateUrl: 'app/admin/setting/partials/sidebarSettings.html'},
			"mainContent": { templateUrl: 'app/admin/setting/shipping/partials/shipping_methods.html', controller: 'ShippingMethodController' }
		}
	})
	.state('admin.tax_setting',{
		url:'/settings/tax',
		views: {
			"sideContent": { templateUrl: 'app/admin/setting/partials/sidebarSettings.html'},
			"mainContent": { templateUrl: 'app/admin/setting/tax/partials/taxHome.html', controller: 'TaxHomeController' }
		}
	})
	.state('admin.tax_setting_new',{
		url:'/settings/tax/new',
		views: {
			"sideContent": { templateUrl: 'app/admin/setting/partials/sidebarSettings.html'},
			"mainContent": { templateUrl: 'app/admin/setting/tax/partials/addTax.html', controller: 'AddTaxController' }
		}
	})

	//admin collection start
	.state('admin.collectionHome',{
		url:'/collection',
		views: {
			"sideContent": { templateUrl: 'app/admin/collection/partials/sidebarcollection.html'},
			"mainContent": { templateUrl: 'app/admin/collection/partials/collectionHome.html', controller: 'collectionHomeController'}
		}
	})
	.state('admin.addCollections',{
		url:'/collections/new',
		views: {
			"sideContent": { templateUrl: 'app/admin/collection/partials/sidebarCollections.html'},
			"mainContent": { templateUrl: 'app/admin/collection/partials/addCollections.html', controller: 'addCollectionController' }
		}
	})
	.state('admin.editCollections',{
		url:'/collection/:id/edit',
		views: {
			"sideContent": { templateUrl: 'app/admin/collection/partials/sidebarcollection.html'},
			"mainContent": { templateUrl: 'app/admin/collection/partials/editCollections.html', controller: 'editCollectionController'}
		}
	})
	.state('admin.manualSaveCollections',{
		url:'/collections/save',
		views: {
			"sideContent": { templateUrl: 'app/admin/collection/partials/sideBarCollections.html'},
			"mainContent": { templateUrl: 'app/admin/collection/partials/manualSaveCollections.html', controller: 'manualSaveCollectionController' }
		}
	})
	.state('admin.tagSearch',{
		url:'/collections/tag',
		views: {
			"sideContent": { templateUrl: 'app/admin/collection/partials/sideBarCollections.html'},
			"mainContent": { templateUrl: 'app/admin/collection/partials/collectionsTag.html', controller: 'collectionsTagController' }
		}
	})

	// .state('admin',{
	// 	url:'/admin',
	// 	templateUrl: 'app/admin/admin.html',
	// 	controller: 'adminController'
	// })
	// .state('admin.default',{
	// 	url:'/admin',
	// 	templateUrl: 'app/admin/default/partials/adminHome.html',
	// 	controller: 'adminController'
	// })
  // .state('admin.customer',{
	// 	url:'/customer',
	// 	templateUrl: 'app/admin/customer/partials/customerHome.html',
	// 	controller: 'adminController'
	// })
  // .state('admin.newCustomer',{
	// 	url:'/customer/new',
	// 	templateUrl: 'app/admin/customer/partials/addCustomer.html',
	// 	controller: 'adminController'
	// })

}])
