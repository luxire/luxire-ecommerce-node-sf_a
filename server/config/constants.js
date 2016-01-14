'use strict';
//This file contains enviroment variable required for the application
module.exports = {
  /*spree api constants*/
  spree:{
    host: 'http://localhost:3000', //Spree store-Host Url
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
   taxonomie: '/api/taxonomies'
  }
  /*client requests*/

};
