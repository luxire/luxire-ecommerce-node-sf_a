'use strict';
//This file contains enviroment variable required for the application
module.exports = {
  /*spree api constants*/
  api: {
    version: 1,
    base_url: {
      admin: '/api/v1/admin',
      customer: '/api/v1/customer',
      generic: '/api/v1/generic'
    }
  },
  spree:{
    host: 'http://104.215.254.150:3000', //Spree store-Host Url
    jwt_secret: 'Azu531k3n!@#',
    products: '/api/products',     //Spree store-Product API
    users: '/luxire-users',
    countries: '/api/countries',
    orders: '/api/orders',
    line_items: '/line_items',
    payments: '/payments',
    my_account: '/my_account',
    checkouts: '/api/checkouts',
    stock_locations: '/api/stock_locations',
    promotions: '/customized_promotions',
    carriers: '/customized_active_shipping_settings',
    zones: '/api/zones',
    shipping_methods: '/customized_shipping_methods',
    taxes: '/customized_tax_rates',
    taxonomy: '/api/taxonomies',
    search: '/api/search',
    measurement_types: '/measurement_types',
    product_types: '/luxire_product_types',
    style_masters: '/luxire_style_masters',
    incomplete_order: '/get_order',
    luxireProperties: '/luxire_properties.json',
    alltaxons: '/api/taxons',
    standard_sizes: '/standard_sizes',
    json: '.json',
    product_csv_import: '/luxire_product_data/imports',
    collections: '/customized_taxons/get_taxon_details.json'
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
