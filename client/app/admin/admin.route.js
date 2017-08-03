// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('luxire')
	.config(['$routeProvider', '$stateProvider', '$urlRouterProvider', function ($routeProvider, $stateProvider, $urlRouterProvider) {
		// $urlRouterProvider.when('/','/admin/');
		$urlRouterProvider.when('/admin', '/admin/');
		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: 'app/auth/partials/login.html',
				controller: 'LoginController',
				data: {
					require_auth: false
				}
			})
			.state('forgot_password', {
				url: '/forgot_password',
				templateUrl: 'app/auth/partials/forgot_password.html',
				controller: 'ForgotPasswordController',
				data: {
					require_auth: false
				}
			})
			.state('reset_password', {
				url: '/reset_password/:reset_token',
				templateUrl: 'app/auth/partials/reset_password.html',
				controller: 'ResetPasswordController',
				params: { reset_token: '' },
				data: {
					require_auth: false
				}
			})

			.state('admin', {
				url: '/admin',
				abstract: true,
				templateUrl: 'app/admin/admin.html',
				controller: 'adminController',
				params: { id: null },
				data: {
					require_auth: true
				}
			})
			.state('admin.default', {
				url: '/',
				views: {
					"sideContent": { templateUrl: 'app/admin/default/partials/sideBarDefault.html' },
					"mainContent": { templateUrl: 'app/admin/default/partials/adminHome.html' }
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.customer', {
				url: '/customers',
				views: {
					"sideContent": { templateUrl: 'app/admin/default/partials/sideBarDefault.html' },
					"mainContent": { templateUrl: 'app/admin/customer/partials/customerHome.html', controller: 'CustomerController' },
					data: {
						require_auth: true
					}
				}
			})
			.state('admin.new_customer', {
				url: '/customers/new',
				views: {
					"sideContent": { templateUrl: 'app/admin/default/partials/sideBarDefault.html' },
					"mainContent": { templateUrl: 'app/admin/customer/partials/addCustomer.html', controller: 'CustomerController' },
					data: {
						require_auth: true
					}
				}
			})
			.state('admin.product', {
				url: '/products',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/product/partials/productsHome.html', controller: 'productsHomeController' },
					data: {
						require_auth: true
					}
				}
			})
			.state('admin.new_product', {
				url: '/products/new',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/product/partials/addProducts.html', controller: 'addProductController' },
					data: {
						require_auth: true
					}
				}

			})
			.state('admin.edit_product', {
				url: '/products/:id/edit',
				params: {},
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/product/partials/editProducts.html', controller: 'editProductController' },
					data: {
						require_auth: true
					}
				}

			})
			.state('admin.inventory', {
				url: '/inventory',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/inventory/partials/inventoryHome.html', controller: 'inventoryHomeController' },
					data: {
						require_auth: true
					}
				}
			})

			.state('admin.inventoryProductEdit', {
				url: '/inventory_product_edit/:id',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/inventory/partials/inventoryProductEdit.html', controller: 'inventoryProductEditController' },
					data: {
						require_auth: true
					}
				}
			})

			.state('admin.inventoryModal', {
				url: '/inventory-modal',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/inventory/partials/inventoryModal.html', controller: 'inventoryModalTestController' },
					data: {
						require_auth: true
					}
				}
			})
			// .state('admin.product',{
			// 	url:'/products',
			// 	views: {
			// 		"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html'},
			// 		"mainContent": { templateUrl: 'app/admin/product/partials/productsHome.html',controller: 'ProductController'},
			// 		data: {
			// 			require_auth: true
			// 		}
			// 	}
			// })
			// .state('admin.new_product',{
			// 	url:'/products/new',
			// 	views: {
			// 		"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html'},
			// 		"mainContent": { templateUrl: 'app/admin/product/partials/addProducts.html',controller: 'ProductController'},
			// 		data: {
			// 			require_auth: true
			// 		}
			// 	}
			// })
			.state('admin.product_attributes', {
				url: '/product_attributes',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/product_attributes/partials/product_attributes_home.html', controller: 'ProductAttributesController' },
					data: {
						require_auth: true
					}
				}
			})
			.state('admin.product_attributes_new', {
				url: '/product_attributes/new',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/product_attributes/partials/product_attributes_create.html', controller: 'AddProductAttributesController' },
					data: {
						require_auth: true
					}
				}
			})
			.state('admin.product_attributes_edit', {
				url: '/product_attributes/:id/edit',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/product_attributes/partials/product_attributes_edit.html', controller: 'EditProductAttributesController' },
					params: { id: null },
					data: {
						require_auth: true
					}
				}
			})
			.state('admin.productTypes', {
				url: '/product_types',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/productTypes/partials/productTypeHome.html', controller: 'ProductTypeController' },
					data: {
						require_auth: true
					}
				}
			})
			.state('admin.new_productTypes', {
				url: '/product_types/new',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/productTypes/partials/addProductType.html', controller: 'ProductTypeController' },
					data: {
						require_auth: true
					}
				}

			})

			.state('admin.editProductType', {
				url: '/product_types/:id/edit',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/productTypes/partials/editProductType.html', controller: 'editProductTypeController' }
				},
				data: {
					require_auth: true
				}
			})

			.state('admin.styleMasterCreate', {
				url: '/product_styles/new',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/styleMaster/partials/styleMasterCreate.html', controller: 'styleMasterCreateController' }
				}
			})
			.state('admin.styleMasterHome', {
				url: '/product_styles',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/styleMaster/partials/styleMasterHome.html', controller: 'styleMasterHomeController' }
				}
			})
			.state('admin.styleMasterEdit', {
				url: '/product_styles/:id/edit',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/styleMaster/partials/styleMasterEdit.html', controller: 'styleMasterEditController' }
				}
			})


			.state('admin.discount', {
				url: '/discounts',
				views: {
					"sideContent": { templateUrl: 'app/admin/default/partials/sideBarDefault.html' },
					"mainContent": { templateUrl: 'app/admin/discount/partials/discountsHome.html', controller: 'DiscountHomeController' },
					data: {
						require_auth: true
					}
				}
			})
			.state('admin.new_discount', {
				url: '/discounts/new',
				views: {
					"sideContent": { templateUrl: 'app/admin/default/partials/sideBarDefault.html' },
					"mainContent": { templateUrl: 'app/admin/discount/partials/addDiscounts.html', controller: 'AddDiscountController' },
					data: {
						require_auth: true
					}
				}
			})
			.state('admin.edit_discount', {
				url: '/discounts/:id/edit/',
				views: {
					"sideContent": { templateUrl: 'app/admin/default/partials/sideBarDefault.html' },
					"mainContent": {
						templateUrl: 'app/admin/discount/partials/addDiscounts.html',
						controller: 'EditDiscountController',
					}
				},
				params: { promo_object: null },
				data: {
					require_auth: true
				}
			})
			.state('admin.giftcard', {
				url: '/giftcards',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/giftcard/partials/giftCardHome.html', controller: 'GiftCardController' }
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.new_giftcard', {
				url: '/giftcards/new',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/giftcard/partials/addGiftProducts.html', controller: 'GiftCardController' }
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.manage_giftcard', {
				url: '/giftcards/manage',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/giftcard/partials/manageGiftCard.html', controller: 'GiftCardController' }
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.order', {
				url: '/orders',
				views: {
					"sideContent": { templateUrl: 'app/admin/order/partials/sidebarOrders.html' },
					"mainContent": { templateUrl: 'app/admin/order/partials/orderHome.html', controller: 'OrderController' }
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.new_order', {
				url: '/orders/new',
				views: {
					"sideContent": { templateUrl: 'app/admin/order/partials/sideBarOrders.html' },
					"mainContent": { templateUrl: 'app/admin/order/partials/addOrder.html', controller: 'OrderController' }
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.order_sheet', {
				url: '/orders/:order_number?line_item_id',
				views: {
					"sideContent": { templateUrl: 'app/admin/order/partials/sidebarOrders.html' },
					"mainContent": { templateUrl: 'app/admin/order/partials/order_sheet.html', controller: 'OrderSheetController' }
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.print', {
				url: '/order_sheet/:order_number/print?line_item_id',
				views: {
					"mainContent": { templateUrl: 'app/admin/order/partials/printOrder.html', controller: 'OrderSheetController' }
				},
				data: {
					require_auth: true
				}
			})
			/*Setting*/
			.state('admin.shipping_setting', {
				url: '/settings/shipping',
				views: {
					"sideContent": { templateUrl: 'app/admin/setting/partials/sidebarSettings.html' },
					"mainContent": { templateUrl: 'app/admin/setting/shipping/partials/shippingHome.html', controller: 'ShippingController' }
				},
				params: { prev_state_status: null },
				data: {
					require_auth: true
				}
			})
			/*shipping carriers*/
			.state('admin.shipping_setting_realtime_carriers', {
				url: '/settings/shipping/carrier_services',
				views: {
					"sideContent": { templateUrl: 'app/admin/setting/partials/sidebarSettings.html' },
					"mainContent": { templateUrl: 'app/admin/setting/shipping/partials/shipping_carriers.html', controller: 'ShippingCarrierController' }
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.shipping_setting_zones_new', {
				url: '/settings/shipping/shipping_zones/new',
				views: {
					"sideContent": { templateUrl: 'app/admin/setting/partials/sidebarSettings.html' },
					"mainContent": { templateUrl: 'app/admin/setting/shipping/partials/shipping_zones.html', controller: 'AddZoneController' }
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.shipping_setting_shipping_method_new', {
				url: '/settings/shipping/shipping_methods',
				views: {
					"sideContent": { templateUrl: 'app/admin/setting/partials/sidebarSettings.html' },
					"mainContent": { templateUrl: 'app/admin/setting/shipping/partials/shipping_methods.html', controller: 'ShippingMethodController' }
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.tax_setting', {
				url: '/settings/tax',
				views: {
					"sideContent": { templateUrl: 'app/admin/setting/partials/sidebarSettings.html' },
					"mainContent": { templateUrl: 'app/admin/setting/tax/partials/taxHome.html', controller: 'TaxHomeController' }
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.tax_setting_new', {
				url: '/settings/tax/new',
				views: {
					"sideContent": { templateUrl: 'app/admin/setting/partials/sidebarSettings.html' },
					"mainContent": { templateUrl: 'app/admin/setting/tax/partials/addTax.html', controller: 'AddTaxController' }
				},
				data: {
					require_auth: true
				}
			})

			//admin collection start
			.state('admin.collectionHome', {
				url: '/collection',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/collection/partials/collectionHome.html', controller: 'collectionHomeController' }
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.addCollections', {
				url: '/collections/new',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/collection/partials/addCollections.html', controller: 'addCollectionController' }
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.editCollections', {
				url: '/collection/:id/:taxonomy_id/edit',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/collection/partials/editCollections.html', controller: 'editCollectionController' }
				},
				params: {
					id: null,
					taxonomy_id: null
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.manualSaveCollections', {
				url: '/collections/save',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/collection/partials/manualSaveCollections.html', controller: 'manualSaveCollectionController' }
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.tagSearch', {
				url: '/collections/tag',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/collection/partials/collectionsTag.html', controller: 'collectionsTagController' }
				},
				data: {
					require_auth: true
				}
			})

			/*Luxire properties*/
			.state('admin.luxirePropertiesHome', {
				url: '/product_properties',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/luxireProperties/partials/luxirePropertiesHome.html', controller: 'luxirePropertiesHomeController' }
				}
			})
			.state('admin.addluxireProperties', {
				url: '/product_properties/new',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/luxireProperties/partials/addLuxireProperties.html', controller: 'addluxirePropertiesController' }
				}
			})
			.state('admin.editluxireProperties', {
				url: '/product_properties/:id/edit',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/luxireProperties/partials/editLuxireProperties.html', controller: 'editLuxirePropertiesController' }
				}
			})
			.state('admin.taxonomy', {
				url: '/taxonomy',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/taxonomy/partials/taxonomyHome.html', controller: 'TaxonomyController' },
					data: {
						require_auth: true
					}
				}
			})
			.state('admin.helpPage', {
				url: '/helpPage',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/helpPage/partials/helpPage.html', controller: 'HelpPageController' },
					data: {
						require_auth: true
					}
				}
			})
			.state('admin.addTaxonomy', {
				url: '/taxonomy/new',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/taxonomy/partials/addTaxonomy.html', controller: 'TaxonomyController' },
					data: {
						require_auth: true
					}
				}
			})
			.state('admin.editTaxonomy', {
				url: '/taxonomy/:id/edit',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/taxonomy/partials/editTaxonomy.html', controller: 'editTaxonomyController' }
				},
				data: {
					require_auth: true
				}
			})
			.state('admin.standard_sizes', {
				url: '/standard_sizes',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/standard_sizes/partials/standardSizeHome.html', controller: 'standardSizeController' },
					data: {
						require_auth: true
					}
				}
			})
			.state('admin.addStandardSize', {
				url: '/standard_sizes/new',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/standard_sizes/partials/addStandardSize.html', controller: 'standardSizeController' },
					data: {
						require_auth: true
					}
				}
			})
			.state('admin.editStandardSize', {
				url: '/standard_sizes/:id/edit',
				views: {
					"sideContent": { templateUrl: 'app/admin/product/partials/sidebarProducts.html' },
					"mainContent": { templateUrl: 'app/admin/standard_sizes/partials/editStandardSize.html', controller: 'editStandardSizeController' },
					data: {
						require_auth: true
					}
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
