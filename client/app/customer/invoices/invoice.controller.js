
angular.module('luxire')
.controller('invoiceController', function($scope) {


	$scope.invoiceDetailedJson =
		{
  "id": 60,
  "number": "R765287585",
  "item_total": "19.99",
  "total": "25.99",
  "ship_total": "5.0",
  "state": "complete",
  "adjustment_total": "1.0",
  "user_id": null,
  "created_at": "2016-02-11T09:43:28.556Z",
  "updated_at": "2016-02-11T09:45:03.172Z",
  "completed_at": "2016-02-11T09:45:03.172Z",
  "payment_total": "0.0",
  "shipment_state": "pending",
  "payment_state": "balance_due",
  "email": "ashwini.rvce@azureiken.com",
  "special_instructions": null,
  "channel": "spree",
  "included_tax_total": "0.0",
  "additional_tax_total": "1.0",
  "display_included_tax_total": "$0.00",
  "display_additional_tax_total": "$1.00",
  "tax_total": "1.0",
  "currency": "USD",
  "display_item_total": "$19.99",
  "total_quantity": 1,
  "display_total": "$25.99",
  "display_ship_total": "$5.00",
  "display_tax_total": "$1.00",
  "token": "asc1f8dVI2sG1AVR_PL0SA",
  "checkout_steps": [
    "address",
    "delivery",
    "payment",
    "complete"
  ],
  "permissions": {
    "can_update": true
  },
  "bill_address": {
    "id": 61,
    "firstname": "Ashwini",
    "lastname": "Patil",
    "full_name": "Ashwini Patil",
    "address1": "Banhsagdh",
    "address2": "swbxd",
    "city": "snbxs",
    "zipcode": "02108",
    "phone": "90234457728",
    "company": null,
    "alternative_phone": null,
    "country_id": 232,
    "state_id": 7321,
    "state_name": null,
    "state_text": "MA",
    "country": {
      "id": 232,
      "iso_name": "UNITED STATES",
      "iso": "US",
      "iso3": "USA",
      "name": "United States",
      "numcode": 840
    },
    "state": {
      "id": 7321,
      "name": "Massachusetts",
      "abbr": "MA",
      "country_id": 232
    }
  },
  "ship_address": {
    "id": 62,
    "firstname": "Ashwini",
    "lastname": "Patil",
    "full_name": "Ashwini Patil",
    "address1": "Banhsagdh",
    "address2": "swbxd",
    "city": "snbxs",
    "zipcode": "02108",
    "phone": "90234457728",
    "company": null,
    "alternative_phone": null,
    "country_id": 232,
    "state_id": 7321,
    "state_name": null,
    "state_text": "MA",
    "country": {
      "id": 232,
      "iso_name": "UNITED STATES",
      "iso": "US",
      "iso3": "USA",
      "name": "United States",
      "numcode": 840
    },
    "state": {
      "id": 7321,
      "name": "Massachusetts",
      "abbr": "MA",
      "country_id": 232
    }
  },
  "luxire_order": null,
  "line_items": [
    {
      "id": 54,
      "quantity": 1,
      "price": "19.99",
      "variant_id": 4,
      "single_display_amount": "$19.99",
      "display_amount": "$19.99",
      "total": "20.99",
      "variant": {
        "id": 4,
        "name": "Ruby on Rails Jr. Spaghetti",
        "sku": "ROR-00013",
        "price": "19.99",
        "weight": "0.0",
        "height": null,
        "width": null,
        "depth": null,
        "is_master": true,
        "slug": "ruby-on-rails-jr-spaghetti",
        "description": "Voluptatem sint et a repellendus tempore necessitatibus quia. Dolorem quibusdam corporis amet non totam voluptate. Sit dolor est est dolores et dolores fuga hic. Ut officiis sit sunt nemo. Aut qui ducimus iste qui cumque.",
        "track_inventory": true,
        "cost_price": "17.0",
        "display_price": "$19.99",
        "options_text": "",
        "in_stock": true,
        "is_backorderable": false,
        "total_on_hand": 9,
        "is_destroyed": false,
        "option_values": [],
        "images": [
          {
            "id": 26,
            "position": 1,
            "attachment_content_type": "image/jpeg",
            "attachment_file_name": "ror_jr_spaghetti.jpeg",
            "type": "Spree::Image",
            "attachment_updated_at": "2016-01-05T11:07:53.405Z",
            "attachment_width": 360,
            "attachment_height": 360,
            "alt": null,
            "viewable_type": "Spree::Variant",
            "viewable_id": 4,
            "mini_url": "/spree/products/26/mini/ror_jr_spaghetti.jpeg?1451992073",
            "small_url": "/spree/products/26/small/ror_jr_spaghetti.jpeg?1451992073",
            "product_url": "/spree/products/26/product/ror_jr_spaghetti.jpeg?1451992073",
            "large_url": "/spree/products/26/large/ror_jr_spaghetti.jpeg?1451992073"
          }
        ],
        "product_id": 4
      },
      "adjustments": [
        {
          "id": 8,
          "source_type": "Spree::TaxRate",
          "source_id": 1,
          "adjustable_type": "Spree::LineItem",
          "adjustable_id": 54,
          "amount": "1.0",
          "label": "North America 5.0%",
          "mandatory": null,
          "eligible": true,
          "created_at": "2016-02-11T09:44:57.602Z",
          "updated_at": "2016-02-11T09:45:03.054Z",
          "display_amount": "$1.00"
        }
      ],
      "luxire_line_item": null
    }
  ],
  "payments": [
    {
      "id": 3,
      "source_type": null,
      "source_id": null,
      "amount": "25.99",
      "display_amount": "$25.99",
      "payment_method_id": 2,
      "response_code": null,
      "state": "checkout",
      "avs_response": null,
      "created_at": "2016-02-11T09:45:02.985Z",
      "updated_at": "2016-02-11T09:45:02.985Z",
      "payment_method": {
        "id": 2,
        "name": "Check"
      },
      "source": null
    }
  ],
  "shipments": [
    {
      "id": 73,
      "tracking": null,
      "number": "H85623175713",
      "cost": "5.0",
      "shipped_at": null,
      "state": "pending",
      "order_id": "R765287585",
      "stock_location_name": "default",
      "shipping_rates": [
        {
          "id": 121,
          "name": "UPS Ground (USD)",
          "cost": "5.0",
          "selected": true,
          "shipping_method_id": 1,
          "shipping_method_code": null,
          "display_cost": "$5.00"
        },
        {
          "id": 122,
          "name": "UPS Two Day (USD)",
          "cost": "10.0",
          "selected": false,
          "shipping_method_id": 2,
          "shipping_method_code": null,
          "display_cost": "$10.00"
        },
        {
          "id": 123,
          "name": "UPS One Day (USD)",
          "cost": "15.0",
          "selected": false,
          "shipping_method_id": 3,
          "shipping_method_code": null,
          "display_cost": "$15.00"
        }
      ],
      "selected_shipping_rate": {
        "id": 121,
        "name": "UPS Ground (USD)",
        "cost": "5.0",
        "selected": true,
        "shipping_method_id": 1,
        "shipping_method_code": null,
        "display_cost": "$5.00"
      },
      "shipping_methods": [
        {
          "id": 1,
          "code": null,
          "name": "UPS Ground (USD)",
          "zones": [
            {
              "id": 2,
              "name": "North America",
              "description": "USA + Canada"
            }
          ],
          "shipping_categories": [
            {
              "id": 1,
              "name": "Default"
            }
          ]
        },
        {
          "id": 2,
          "code": null,
          "name": "UPS Two Day (USD)",
          "zones": [
            {
              "id": 2,
              "name": "North America",
              "description": "USA + Canada"
            }
          ],
          "shipping_categories": [
            {
              "id": 1,
              "name": "Default"
            }
          ]
        },
        {
          "id": 3,
          "code": null,
          "name": "UPS One Day (USD)",
          "zones": [
            {
              "id": 2,
              "name": "North America",
              "description": "USA + Canada"
            }
          ],
          "shipping_categories": [
            {
              "id": 1,
              "name": "Default"
            }
          ]
        }
      ],
      "manifest": [
        {
          "quantity": 1,
          "states": {
            "on_hand": 1
          },
          "variant_id": 4
        }
      ],
      "adjustments": []
    }
  ],
  "adjustments": [],
  "credit_cards": []
};














})
