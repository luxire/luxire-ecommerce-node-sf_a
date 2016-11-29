'use strict';
//This file contains enviroment variable required for the application
module.exports = {
  /*spree api constants*/
  spree:{
    host: 'http://luxire-store.stage.cloudhop.in', //Spree store-Host Url
    jwt_secret: 'Azu531k3n!@#',
    products: '/api/products',     //Spree store-Product API
    users: '/luxire-users',
    countries: '/api/countries',
    orders: '/api/orders',
    checkouts: '/api/checkouts',
    stock_locations: '/api/stock_locations',
    promotions: '/customized_promotions',
    carriers: '/customized_active_shipping_settings',
    zones: '/api/zones',
    shipping_methods: '/customized_shipping_methods',
    taxes: '/customized_tax_rates',
    taxonomie: '/api/taxonomies',
    search: '/api/search',
    payments: '/payments',
    incomplete_order: '/get_order',
    parentSku: '/luxire_stocks/validate_stocks_sku',
    updateStock: '/luxire_stocks',
    myAccount: '/my_account',
    luxireProperties: '/luxire_properties',
    luxireVendor: '/luxire_vendor_masters'
  },
  payment: {
    ebs: {
      account_id: '18449',
      secret_key: 'c08d88e3fa40573b563af7887a7c9852',
      mode: 'TEST',
      return_url: 'https://test.luxire.com/api/checkouts/gateway_response'
    }
  }
  /*client requests*/

};
