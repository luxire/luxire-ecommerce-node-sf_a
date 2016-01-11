'use strict';
//This file contains enviroment variable required for the application
module.exports = {
  /*spree api constants*/
  spree:{
    host: 'http://54.169.41.36:3000', //Spree store-Host Url
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
   taxonomie: '/api/taxonomies'
  }
  /*client requests*/

};
