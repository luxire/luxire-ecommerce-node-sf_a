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
    host: 'http://luxire-store.cloudhop.in', //Spree store-Host Url
    jwt_secret: 'Azu531k3n!@#',
    products: '/api/products',     //Spree store-Product API
    adminProducts: '/api/admin/products',
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
    taxonomy: '/api/taxonomies?set=nested',
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
    collections: '/customized_taxons/get_taxon_details.json',
    get_currency_by_country_code: '/api/get_currency_based_on_country_code?country_code='
  },
  payment: {
    ebs: {
      account_id: '18449',
      secret_key: 'c08d88e3fa40573b563af7887a7c9852',
      mode: 'TEST',
      return_url: 'https://test.luxire.com/api/checkouts/gateway_response'
    }
  },
  prediction: {
    host: 'http://137.116.155.7:8000',
    customer_bought: '/queries.json',
    sample_product_ids: [313, 315, 301, 297, 306, 1, 310, 298, 317, 314],
    expected_res_len: 5,
    feed_host: 'http://137.116.155.7:7070',
    feed_url: '/events.json?accessKey=',
    feed_access_key: 'QRblQvAr2lZ2IwP2fD85LixUKPqg7Tf2Y56jYEUIaUwWA80nfA1q6iFwKwrHt4fd'
  },
  redis: {
    host: 'http://localhost:9090',
    products: '/api/redis/products',
    products_filter: '/api/redis/customer/products/filter',
    collections: '/api/redis/collection',//change to plural
    search: {
      products: '/api/redis/customer/search/products'
    }
  },
  location_by_ip: {
    host: 'http://freegeoip.net/json'
  },
  location_by_city: {
    host: 'http://getcitydetails.geobytes.com/GetCityDetails?fqcn='
  }

};
