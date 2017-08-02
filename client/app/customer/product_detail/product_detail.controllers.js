angular.module('luxire')
  .controller('ProductDetailController', function ($scope, $sce, CustomerOrders, $state, countries, $stateParams, $rootScope, CustomerProducts, ImageHandler, $location, $anchorScroll, $uibModal, $window, $timeout, $log, $compile, $interval, CustomerUtils) {
    /*Use $rootScope.page.setTitle() to change title*/
    $window.scrollTo(0, 0);
    $scope.loading_product = true;
    // $scope.measurementModal contains the loading flag for the measurement Modal. If true will display the loading spinner
    $scope.measurementModal = {
      loadingFlag: false
    };
    $scope.display_summary = false;
    $scope.is_bespoke_style = false;
    $scope.cart_object_changed = $scope.cart_object_changed ? $scope.cart_object_changed : false;
    $scope.style_display_name = "";
    $scope.getInt = function (val) {
      return parseInt(val);
    };
    $scope.active_product_description_image = {
      product_url: '',
      large_url: '',
      original_url: ''
    };
    $scope.currency_symbols = CustomerUtils.get_currency_with_symbol;
    $scope.get_subheader_top_margin = function () {
      return $(".customer-main-nav-header").innerHeight() + 'px';
    };
    $(window).resize(function () {
      $timeout(function () { }, 0);
    });
    var convert_to_cm = function (product) {
      CustomerUtils.convert_in_to_cm(product['customization_attributes']);
      CustomerUtils.convert_in_to_cm(product['personalization_attributes']);
      $scope.product_in_cm = product;
    };
    CustomerProducts.show($stateParams.product_name).then(function (data) {
      $rootScope.page.setTitle(data.data.name); //set page title to product name
      if (CustomerProducts.is_active_collections(data.data.product_type.product_type.toLowerCase())) {
        $scope.product = data.data;
        $scope.images_array = [];
        $scope.images_array_for_zoom = {};
        angular.forEach($scope.product.master.images, function (val, key) {
          $scope.images_array.push(val.id)
          $scope.images_array_for_zoom[key + 1] = {
            img: $scope.getImage(val.large_url),
            thumb: $scope.getImage(val.mini_url),
            title: key + 'image'
          }
        })
        $scope.active_product_description_image = $scope.product.master.images[0];
        json_array_to_obj("customization_attributes", $scope.product.customization_attributes);
        json_array_to_obj("personalization_attributes", $scope.product.personalization_attributes);
        json_array_to_obj("standard_measurement_attributes", $scope.product.standard_measurement_attributes);
        json_array_to_obj("body_measurement_attributes", $scope.product.body_measurement_attributes);
        $scope.luxire_styles = data.data.luxire_style_masters;
        $scope.cart_object_prototype = angular.copy($scope.cart_object);

        var measurement_unit_sym = angular.element("#measurementUnit")[0].innerText;
        $rootScope.productLoaded = true;
        if (measurement_unit_sym.toLowerCase() === "cm") {
          $scope.selected_measurement_unit = "cm";
          CustomerUtils.convert_in_to_cm($scope.cart_object);
        }

        $scope.active_product_type = $scope.product.product_type.product_type;
        $scope.fabric_product_types = ["shirts", "pants", "jackets"];
        $scope.is_fabric_product = $scope.fabric_product_types.indexOf($scope.active_product_type.toLowerCase()) > -1 ? true : false;
        $scope.loading_product = false;
        if ($scope.product.product_type.product_type.toLowerCase() === 'gift cards') {
          $scope.selected_gift_card_variant = $scope.product.master;
          $scope.product.variants.push($scope.product.master);
        }
        /*Convert to cm */
        convert_to_cm(angular.copy(data.data));
        var product_prices = {};
        angular.forEach($scope.product.master.prices, function (value, currency) {
          if ((currency == "USD") || (currency == "SGD") || (currency == "AUD") || (currency == "CAD")) {
            product_prices[currency] = parseFloat(value.split(",").join("").split("$")[1]);
          }
          else if ((currency == "SEK") || (currency == "NOK") || (currency == "DKK")) {
            product_prices[currency] = parseFloat(value.split(",").join("").split(" kr")[0]);
          }
          else if (currency == "CHF") {
            product_prices[currency] = parseFloat(value.split(",").join("").split("CHF")[1]);
          }
          else if (currency == "EUR") {
            product_prices[currency] = parseFloat(value.split(",").join("").split("\u20ac")[1]);
          }
          else if (currency == "GBP") {
            product_prices[currency] = parseFloat(value.split(",").join("").split("\u20a3")[1]);
          }
          else if (currency == "INR") {
            product_prices[currency] = parseFloat(value.split(",").join("").split("\u20b9")[1]);
          }
        });
        $scope.cart_object.total_cost = $scope.cart_object.total_cost ? $scope.cart_object.total_cost : product_prices;
      }
      else {
        window.history.back();
        $rootScope.alerts[0] = { type: 'warning', message: 'Product belongs to ' + data.data.product_type.product_type + ' Collection, which is in active' };
      }
    }, function (error) {
      $scope.loading_product = false;
      console.log('error fetching product', error);
    });

    $scope.select_gift_card_variant = function (variant) {
      $scope.selected_gift_card_variant = variant;
    };

    /*Unit conversion*/
    $scope.selected_measurement_unit = "in";
    $scope.$on('measurement_unit_change', function (event, data) {
      console.log(data.symbol.toLowerCase(), $scope.cart_object);
      $scope.selected_measurement_unit = data.symbol.toLowerCase();
      $scope.selected_measurement_unit === "cm" ? CustomerUtils.convert_in_to_cm($scope.cart_object) : CustomerUtils.convert_cm_to_in($scope.cart_object);
    });

    /*Multi currency support*/
    $scope.selected_currency = $rootScope.luxire_cart.currency ? $rootScope.luxire_cart.currency : CustomerUtils.get_local_currency_in_app();
    $scope.$on('currency_change', function (event, data) {
      $scope.selected_currency = data;
    });

    /*Get weight icon*/
    var weight_indexes_ref = {
      shirts: {
        min: 50,
        max: 150,
        step: 12.5//150/12
      },
      pants: {
        min: 150,
        max: 500,
        step: 30 //
      }
    };
    var min_weight = 0;
    var max_weight = 0;
    $scope.weight_index = function (variant_weight, product_type) {
      product_type = product_type.toLowerCase();
      if (product_type && product_type.indexOf('pant') !== -1) {
        min_weight = weight_indexes_ref['pants']['min'];
        max_weight = weight_indexes_ref['pants']['max'];
        step = weight_indexes_ref['pants']['step'];
      }
      else if (product_type && product_type.indexOf('pant') == -1) {
        min_weight = weight_indexes_ref['shirts']['min'];
        max_weight = weight_indexes_ref['shirts']['max'];
        step = weight_indexes_ref['shirts']['step'];
      };
      if ((parseFloat(variant_weight)) < min_weight) {
        return 1;
      }
      else if ((parseFloat(variant_weight)) > max_weight) {
        return 12;
      }
      else {
        return parseInt((parseFloat(variant_weight) - min_weight) / step) + 1;
      };
    };

    /*Get Thickness icon*/
    $scope.thickness_index = function (variant_thickness) {
      if (variant_thickness) {
        thicknessInMm = variant_thickness.split('.')[1];
        if (thicknessInMm) {
          thickness = parseInt(thicknessInMm.split('mm')[0]);
          if (thickness / 10 > 5) {
            return 6;
          }
          else {
            return Math.ceil(thickness / 10);
          }
        } else {
          return 0;
        }

      }

    };
    /*Get stiffness icon*/
    $scope.stiffness_index = function (variant_stiffness, stiffness_unit) {
      if (stiffness_unit == 'm') {
        variant_stiffness = parseFloat(variant_stiffness) * 100;
      }
      else if (stiffness_unit == 'cm') {
        variant_stiffness = parseFloat(variant_stiffness);
      }

      if (variant_stiffness / 1.25 > 8) {
        return 8;
      }
      else {
        return Math.ceil(variant_stiffness / 1.25);
      }
    };

    $scope.wash_care = function (variant_wash_care) {
      if (variant_wash_care.toLowerCase().indexOf('machine') > -1) {
        return 'machine';
      }
      else if (variant_wash_care.toLowerCase().indexOf('hand') > -1) {
        return 'hand';
      }
    };

    $scope.get_ounce_weight = function (gram_weight) {
      return (parseFloat(gram_weight) / 28.3).toFixed(2);
    };

    /*Slider*/
    $scope.value3 = 12;
    $scope.value4 = 20;
    $scope.activate_thumbnail = function (thumbnail) {
      $scope.active_product_description_image = thumbnail;
      $('body').scrollTop(0);
    };
    $scope.reg_enlarged_image = function (element) {
      $('#product_description_image_id').ezPlus({
        gallery: 'thumbnail-part',
        galleryActiveClass: 'active-thumbnail',
        easing: true,
        zoomWindowFadeIn: 300,
        zoomWindowFadeOut: 300,
        lensFadeIn: 300,
        lensFadeOut: 300,
        responsive: true,
        borderSize: 1,
        cursor: "crosshair",
        zoomType: "window",
        zoomWindowWidth: 800,
        zoomWindowHeight: 450,
        zoomWindowOffsetX: 80,
        zoomWindowOffsetY: -5,
        zoomWindowPosition: 1,
        loadingIcon: '/client/assets/images/customer/loading.gif'
      });

      $('#product_description_image_id').bind('click', function (e) {
        var ez = $('#product_description_image_id').data('ezPlus');
        $.fancyboxPlus(ez.getGalleryList());
        return false;
      });
    };
    $scope.dereg_enlarged_image = function (element) {
    };

    /*Measurement Slider*/
    /*fn to convert array of object in a object*/
    $scope.cart_object = {};
    $scope.luxire_styles = [];
    $rootScope.customer_alerts = [];
    $scope.product = {};
    var personalisation_cost_init = {
      "INR": 0.00,
      "USD": 0.00,
      "EUR": 0.00,
      "SGD": 0.00,
      "AUD": 0.00,
      "SEK": 0.00,
      "DKK": 0.00,
      "NOK": 0.00,
      "CHF": 0.00,
      "GBP": 0.00,
      "CAD": 0.00
    };

    $scope.cart_object.personalization_cost = $scope.cart_object.personalization_cost ? $scope.cart_object.personalization_cost : personalisation_cost_init;
    var json_array_to_obj = function (parent, arr) {
      $scope[parent] = {};
      $scope[parent + '_all'] = {};
      $scope.cart_object[parent] = {};
      angular.forEach(arr, function (val, key) {
        if (parent !== 'personalization_attributes') {
          if (val.name.toLowerCase().indexOf('fit type') !== -1) {// neutralize fit type for shirt/pant/jacket eg, replacing shirts fit type with Fit type
            val.name = 'Fit Type';
          }
          /*Neutralize attr from product type*/
          if (val.name.indexOf('Shirt') !== -1 && !val.name.split('Shirt')[1]) {
            val.name = val.name.split('Shirt')[0].trim();
          }
          if (val.name.indexOf('Pant') !== -1 && !val.name.split('Pant')[1]) {
            val.name = val.name.split('Pant')[0].trim();
          }
          if (val.name.indexOf('Jacket') !== -1 && !val.name.split('Jacket')[1]) {
            val.name = val.name.split('Jacket')[0].trim();
          }
          /*Neutralize attr from product type*/
          if (angular.isObject(val.value)) {
            $scope.cart_object[parent][val.name] = { value: '', options: {} };
          }
          else {
            $scope.cart_object[parent][val.name] = { value: val.value, options: {} };
          }
        }
        $scope[parent][val.name] = val.value;
        $scope[parent + '_all'][val.name] = val;
      })
      return $scope[parent];
    };
    $scope.close_alert = function (index) {
      $rootScope.customer_alerts.splice(index);
    };

    $scope.send_sample = function (measurement_sample) {
    };

    $scope.invalid_fields = [];

    /*Validations*/
    var has_valid_measurements = function () {
      var mandatory_fields = [];
      var valid_measurements = [];
      $scope.invalid_fields = [];
      var product_type_validations = {
        'shirts': '',//Collar Size,Sleeve Length,Fit Type
        'pants': '',//Waist Size,Inseam,Fit Type
        'jackets': '',//Chest Size,Length,Fit Type
        'gift cards': '',
        'ties': '',//Tie Width,Tie Length
        'belts': '',//Belt Length
        'pocket squares': ''
      };
      var product_type = $scope.product.product_type.product_type;
      if (product_type_validations[product_type.toLowerCase()].indexOf(',') !== -1) {
        mandatory_fields = product_type_validations[product_type.toLowerCase()].split(',');
        angular.forEach(mandatory_fields, function (val, key) {
          if ($scope.cart_object['standard_measurement_attributes'] && $scope.cart_object['standard_measurement_attributes'][val] && $scope.cart_object['standard_measurement_attributes'][val].value && $scope.cart_object['standard_measurement_attributes'][val].value !== '') {
            valid_measurements.push(true);
          }
          else {
            $scope.invalid_fields.push(val);
            valid_measurements.push(false);
          }
        })
        if (valid_measurements.indexOf(false) == -1) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return true;
      }
    };
    $scope.add_to_cart = function (variant) {
      $scope.loading_cart = true;
      if (has_valid_measurements()) {
        if ($rootScope.luxire_cart && $rootScope.luxire_cart.line_items) {
          CustomerOrders.add_line_item($rootScope.luxire_cart, $scope.cart_object, variant, $scope.selected_measurement_id == 4 ? true : false, $scope.selected_currency, $scope.selected_measurement_unit)
            .then(function (data) {
              CustomerOrders.get_order_by_id($rootScope.luxire_cart).then(function (data) {
                $rootScope.luxire_cart = data.data;
                $scope.loading_cart = false;
                $rootScope.alerts.push({ type: 'success', message: 'Item added to cart' });
                $state.go('customer.pre_cart');
              }, function (error) {
                $scope.loading_cart = false;
                console.error(error);
              });
            }, function (error) {
              $scope.loading_cart = false;
              if (error.data && error.data.msg && error.data.msg.includes("out of stock")) {
                $rootScope.alerts.push({ type: 'danger', message: error.data.msg });
              } else {
                $rootScope.alerts.push({ type: 'danger', message: 'Failed to add to cart' });
              }
              console.error(error);
            });
        }
        else {
          CustomerOrders.create_order($scope.cart_object, variant, $scope.selected_measurement_id == 4 ? true : false, $scope.selected_currency, $scope.selected_measurement_unit)
            .then(function (data) {
              $rootScope.luxire_cart = data.data;
              $scope.loading_cart = false;
              $rootScope.alerts.push({ type: 'success', message: 'Item added to cart' });
              $state.go('customer.pre_cart');
            }, function (error) {
              $scope.loading_cart = false;
              if (error.data && error.data.msg && error.data.msg.includes("out of stock")) {
                $rootScope.alerts.push({ type: 'danger', message: error.data.msg });
              } else {
                $rootScope.alerts.push({ type: 'danger', message: 'Failed to add to cart' });
              }
              console.error(error);
            });
        }
      }
      else {
        $rootScope.alerts.push({ type: 'danger', message: 'Please fill mandatory field ' + $scope.invalid_fields[0] });
      }
    };

    var style_iterator = function (style, attribute_type, is_selected) {
      angular.forEach($scope.cart_object[attribute_type], function (value, key) {
        if (!is_selected) {
          if (style[attribute_type][key] && style[attribute_type][key] !== '') {
            $scope.cart_object[attribute_type][key]['value'] = '';
          }
        }
        else {
          if (angular.isDefined(style[attribute_type][key])) {
            $scope.cart_object[attribute_type][key]['value'] = style[attribute_type][key];
          }
          else {
            $scope.cart_object[attribute_type][key]['value'] = '';
          }
        }
      })
      return;
    };

    $scope.style_extractor = function (style, is_selected) {
      $scope.active_style = style;
      $scope.cart_object.selected_style = style;
      style_iterator(style.default_values, "customization_attributes", is_selected);
      style_iterator(style.default_values, "standard_measurement_attributes", is_selected);
      style_iterator(style.default_values, "body_measurement_attributes", is_selected);
      return;
    };

    $scope.revert_style = function () {
      style_iterator();
    };

    var prev_fit_type = '';
    var new_fit_type = '';
    $scope.active_style = {};//Selected style accross modals

    $scope.show_summary = function (summary_type) {
      var modal_instance = $uibModal.open({
        animation: true,
        templateUrl: 'summary.html',
        controller: 'SummaryController',
        size: 'lg',
        windowClass: 'summary-window',
        resolve: {
          product: function () {
            return $scope.product;
          },
          cart_object: function () {
            return angular.copy($scope.cart_object);
          },
          base_style: function () {
            return $scope.active_style;
          },
          summary_type: function () {
            return summary_type;
          },
          selected_measurement_id: function () {
            return $scope.selected_measurement_id
          },
          selected_measurement_unit: function () {
            return $scope.selected_measurement_unit;
          },
          standard_measurement_attributes_all: function () {
            return $scope.standard_measurement_attributes_all;
          },
          selected_currency: function () {
            return $scope.selected_currency;
          }

        }
      });
      modal_instance.result.then(function (selected_style) {
        $scope.active_style = selected_style;
        $scope.style_extractor(selected_style);
        $scope.cart_object.selected_style = selected_style;
      }, function () {
      });
      modal_instance.opened.then(function () {
        $timeout(function () {
          var $body = $(document.body);
          var oldWidth = $body.innerWidth();
          $body.css("overflow", "hidden !important");
          $body.width(oldWidth);
        }, 0);
      });
    }

    $scope.getImage = function (url) {
      return ImageHandler.url(url);
    }

    var index = -1;
    $scope.activate_slide = function (id) {
      index = $scope.images_array.indexOf(id);
      $scope.product.master.images[index].active = true;
    };

    $scope.set_attribute_value = function (attribute_type, attribute_key, attribute_value) {
      $scope.cart_object[attribute_type][attribute_key]['value'] = attribute_value;
      $scope.get_standard_sizes();
    };

    $scope.make_my_own_style = function (event) {
      $scope.is_bespoke_style = !$scope.is_bespoke_style;
    };

    $scope.move_to_choose_fit = function () {
      $('html, body').animate({ scrollTop: $("#choose_fit").offset().top - 120 }, 500);
    };

    $scope.move_to_measurements = function () {
      $('html, body').animate({ scrollTop: $("#choose_measurements").offset().top - 120 }, 500);
    }

    var tempObj = [];
    var slideStart = 0;
    var slideEnd = 5;
    $scope.hideNext = $scope.product.luxire_style_masters != undefined && $scope.product.luxire_style_masters.length > 5 ? false : true;
    $scope.hidePrev = true;
    $scope.slideNext = function () {
      tempObj = $scope.product.luxire_style_masters;
      slideStart++;
      slideEnd++;
      if (slideStart != 0) {
        $scope.hidePrev = false;
      }
      $scope.luxire_styles = tempObj.slice(slideStart, slideEnd);
      if (slideEnd == $scope.product.luxire_style_masters.length) {
        $scope.hideNext = true;
      }
    }
    $scope.slidePrev = function () {
      tempObj = $scope.product.luxire_style_masters;;
      slideStart--;
      slideEnd--;
      if (slideEnd != $scope.product.luxire_style_masters.length) {
        $scope.hideNext = false;
      }
      $scope.luxire_styles = tempObj.slice(slideStart, slideEnd);
      if (slideStart == 0) {
        $scope.hidePrev = true;
      }
    };
    $scope.active_style_index = -1;
    $scope.select_style = function (index, style) {
      if ($scope.active_style.name == style.name) {
        $scope.active_style = {};
        $scope.style_extractor();
      }
      else {
        $scope.active_style = style;
        $scope.style_extractor(style);
      };
    };

    /*New Mockup July 1 changes*/
    $scope.invoke_choose_fit_and_measurement = function () {
      $scope.measurementModal.loadingFlag = true;
      $timeout(function () {
        var modal_instance = $uibModal.open({
          animation: true,
          templateUrl: 'choose_fit_and_measurement.html',
          controller: 'ChooseFitAndMeasurementController',
          size: 'lg',
          windowClass: 'fit-and-measurement-window',
          resolve: {
            product: function () {
              return $scope.product;
            },
            cart_object: function () {
              return angular.copy($scope.cart_object);
            },
            standard_measurement_attributes: function () {
              return $scope.standard_measurement_attributes;
            },
            body_measurement_attributes: function () {
              return $scope.body_measurement_attributes;
            },
            standard_measurement_attributes_all: function () {
              return $scope.standard_measurement_attributes_all;
            },
            body_measurement_attributes_all: function () {
              return $scope.body_measurement_attributes_all;
            },
            selected_measurement_id: function () {
              return $scope.selected_measurement_id;
            },
            selected_measurement_unit: function () {
              return $scope.selected_measurement_unit;
            },
            loading_measurement_modal: function () {
              return $scope.measurementModal;
            }
          }
        });

        modal_instance.result.then(function (measurements_object) {
          $scope.measurementModal.loadingFlag = false;
          $scope.selected_measurement_id = measurements_object.selected_measurement_id;
          if ($scope.selected_measurement_id === 3) {
            $scope.cart_object.body_measurement_attributes = angular.copy(measurements_object.selected_measurements.body);
            $scope.cart_object.standard_measurement_attributes = angular.copy(measurements_object.selected_measurements.standard);
          }
          else if ($scope.selected_measurement_id === 4) {
            $scope.cart_object.body_measurement_attributes = angular.copy($scope.cart_object_prototype.body_measurement_attributes);
            $scope.cart_object.standard_measurement_attributes = angular.copy($scope.cart_object_prototype.standard_measurement_attributes);
          }
          else if ($scope.selected_measurement_id === 1) {//This is to ensure the custom notes details are added to cart object['measurement']property
            $scope.cart_object.body_measurement_attributes = angular.copy(measurements_object.selected_measurements.body);
            $scope.cart_object.standard_measurement_attributes = angular.copy(measurements_object.selected_measurements.standard);
          }
          else {
            $scope.cart_object.body_measurement_attributes = angular.copy($scope.cart_object_prototype.body_measurement_attributes);
            $scope.cart_object.standard_measurement_attributes = angular.copy(measurements_object.selected_measurements.standard);
          }
          if (measurements_object.selected_measurements.body['custom_notes'] && measurements_object.selected_measurements.body['custom_notes']['value']) {
            $scope.cart_object['body_measurement_attributes']['custom_notes'] = measurements_object.selected_measurements.body['custom_notes'];
          }
          $scope.display_summary = true;
        }, function () {
        });

        modal_instance.result.catch(function () {
          $scope.measurementModal.loadingFlag = false;
        });

      }, 0)
    };

    $scope.invoke_choose_a_style = function () {
      var modal_instance = $uibModal.open({
        animation: true,
        templateUrl: 'select_a_style.html',
        controller: 'SelectStyleController',
        size: 'lg',
        windowClass: 'select-style-window',
        resolve: {
          product: function () {
            return $scope.selected_measurement_unit === "in" ? $scope.product : $scope.product_in_cm;
          },
          cart_object: function () {
            return angular.copy($scope.cart_object);
          },
          luxire_styles: function () {
            return $scope.product.luxire_style_masters;
          },
          active_style: function () {
            return $scope.active_style;
          },
          parent_scope: function () {
            return $scope;
          },
          selected_currency: function () {
            return $scope.selected_currency;
          },
          cart_object_changed: function () {
            return $scope.cart_object_changed;
          },
          selectedAtrributeListObj: function () {
            return $scope.selectedAtrributeListObj;
          }
        }
      });
      modal_instance.result.then(function (response_object) {
        console.log('the response object:', response_object);
        $scope.active_style = response_object.active_style;
        $scope.cart_object = response_object.cart_object;
        $scope.selectedAtrributeListObj = response_object.selectedAtrributeListObj;
        $scope.cart_object_changed = response_object.cart_object_changed;
        if ($scope.cart_object_changed && $scope.active_style.name) {
          $scope.style_display_name = "Modified " + $scope.active_style.name;
        }
        else if ($scope.cart_object_changed && !$scope.active_style.name) {
          $scope.style_display_name = "Bespoke";
        }
        else if (!$scope.cart_object_changed && $scope.active_style.name) {
          $scope.style_display_name = $scope.active_style.name;
        }
        else {
          $scope.style_display_name = "";
        }
        $scope.display_summary = true;
      }, function () {
      });
    };

  })
  .controller('ChooseFitAndMeasurementController', ['$scope', '$uibModalInstance', 'product', 'cart_object', 'standard_measurement_attributes', 'body_measurement_attributes', 'standard_measurement_attributes_all', 'body_measurement_attributes_all', 'selected_measurement_id', 'selected_measurement_unit', 'ImageHandler', 'ProductType', 'loading_measurement_modal', function ($scope, $uibModalInstance, product, cart_object, standard_measurement_attributes, body_measurement_attributes, standard_measurement_attributes_all, body_measurement_attributes_all, selected_measurement_id, selected_measurement_unit, ImageHandler, ProductType, loading_measurement_modal) {
    $scope.standard_measurement_attributes = standard_measurement_attributes;
    $scope.standard_measurement_attributes_all = standard_measurement_attributes_all;
    $scope.body_measurement_attributes_all = body_measurement_attributes_all;
    $scope.product = product;
    $scope.measurement_unit = {
      selected: selected_measurement_unit
    };
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };
    var product_type = capitalizeFirstLetter($scope.product.product_type.product_type.slice(0, -1));
    $scope.product_type = product_type;

    $scope.help_popover = {
      template_url: "attribute_help_template.html"
    };

    $scope.body_help_popover = {
      template_url: "body_attribute_help_template.html"
    };

    $scope.collar_help_popover = {
      template_url: "collar_help_template.html"
    };
    $scope.sleeve_help_popover = {
      template_url: "sleeve_help_template.html"
    };
    $scope.waist_help_popover = {
      template_url: "waist_help_template.html"
    };
    $scope.inseam_help_popover = {
      template_url: "inseam_help_template.html"
    };

    var standard_size_chart = {
      "shirts": {
        "Collar Size": {
          "regular": {
            "base": 15.00,
            "step": 0.25
          },
          "slim": {
            "base": 15.00,
            "step": 0.25
          },
          "super slim": {
            "base": 15.00,
            "step": 0.25
          }
        },
        "Chest": {
          "regular": {
            "base": 47.00,
            "step": 1.00
          },
          "slim": {
            "base": 44.50,
            "step": 1.00
          },
          "super slim": {
            "base": 41.50,
            "step": 1.00
          }
        },
        "Waist": {
          "regular": {
            "base": 44.00,
            "step": 1.00
          },
          "slim": {
            "base": 40.00,
            "step": 1.00
          },
          "super slim": {
            "base": 39.00,
            "step": 1.00
          }
        },
        "Bottom": {
          "regular": {
            "base": 47.00,
            "step": 1.00
          },
          "slim": {
            "base": 44.00,
            "step": 1.00
          },
          "super slim": {
            "base": 41.00,
            "step": 1.00
          }

        },
        "Yoke": {
          "regular": {
            "base": 18.00,
            "step": 0.25
          },
          "slim": {
            "base": 18.00,
            "step": 0.25
          },
          "super slim": {
            "base": 18.00,
            "step": 0.25
          }
        },
        "Sleeve Width": {
          "regular": {
            "base": 9.75,
            "step": 0.125
          },
          "slim": {
            "base": 9.00,
            "step": 0.125
          },
          "super slim": {
            "base": 8.50,
            "step": 0.125
          }

        },
        "Cuff Around": {
          "regular": {
            "base": 8.75,
            "step": 0.125
          },
          "slim": {
            "base": 8.75,
            "step": 0.125
          },
          "super slim": {
            "base": 8.75,
            "step": 0.125
          }
        },
        "Shirt Length": {
          "regular": {
            "base": 33.00,
            "step": 0.25
          },
          "slim": {
            "base": 31.00,
            "step": 0.25
          },
          "super slim": {
            "base": 31.00,
            "step": 0.25
          }
        }
      },
      "pants": {
        "Waist": {
          "regular": {
            "base": 28.00,
            "step": 1.00
          },
          "slim": {
            "base": 28.00,
            "step": 1.00
          },
          "super slim": {
            "base": 28.00,
            "step": 1.00
          }
        },
        "Hips": {
          "regular": {
            "base": 36.75,
            "step": 1.00
          },
          "slim": {
            "base": 36.00,
            "step": 1.00
          },
          "super slim": {
            "base": 35.25,
            "step": 1.00
          }

        },
        // "Inseam": {
        //   "regular": {
        //     "base": 32.00,
        //     "step": 1.00
        //   },
        //   "slim": {
        //     "base": 32.00,
        //     "step": null
        //   },
        //   "super slim": {
        //     "base": 32.00,
        //     "step": 1.00
        //   }
        // },
        "Front Rise": {
          "regular": {
            "base": 10.00,
            "step": 0.125
          },
          "slim": {
            "base": 9.50,
            "step": 0.125
          },
          "super slim": {
            "base": 9.00,
            "step": 0.125
          }

        },
        "Back Rise": {
          "regular": {
            "base": 14.50,
            "step": 0.125
          },
          "slim": {
            "base": 13.750,
            "step": 0.125
          },
          "super slim": {
            "base": 13.00,
            "step": 0.125
          }

        },
        "Thigh": {
          "regular": {
            "base": 22.25,
            "step": 0.50
          },
          "slim": {
            "base": 21.750,
            "step": 0.50
          },
          "super slim": {
            "base": 21.25,
            "step": 0.50
          }

        },
        "Knee": {
          "regular": {
            "base": 16.00,
            "step": 0.375
          },
          "slim": {
            "base": 15.00,
            "step": 0.375
          },
          "super slim": {
            "base": 14.00,
            "step": 0.375
          }

        },
        "Bottom": {
          "regular": {
            "base": 13.75,
            "step": 0.25
          },
          "slim": {
            "base": 13.00,
            "step": 0.25
          },
          "super slim": {
            "base": 12.25,
            "step": 0.25
          }
        },
        "Outseam": {
          "regular": {
            "base": 43.00,
            "step": null
          },
          "slim": {
            "base": 42.50,
            "step": null
          },
          "super slim": {
            "base": 42.00,
            "step": null
          }

        }
      }
    }
    $scope.allow_edit = false;
    $scope.measurement_types = [
      {
        id: 1,
        header: "Standard",
        sub_header: "Choose from standard sizes"
      },
      {
        id: 2,
        header: "Custom",
        sub_header: "Customize your fit types"
      },
      {
        id: 3,
        header: "Body Measurements",
        sub_header: "Provide your exact body measurements for the perfect fit type"
      },
      {
        id: 4,
        header: "Send " + product_type + " Sample",
        sub_header: "Send us your " + product_type + " sample to exactly replicate or modify"
      }
    ];
    $scope.active_measurement_type_id = selected_measurement_id || 1;
    $scope.change_measurement_type = function (id) {
      $scope.active_measurement_type_id = id;
    };
    var rounded_pant_attr = ["Waist", "Hips", "Thigh", "Knee", "Bottom"]; 
    var rounded_shirt_attr = ["Chest", "Waist", "Bottom", "Sleeve Width"];//, "Sleeve Width" as per 02 Dec Ashish's email, sleeve width calculated is already for half


    var set_standard_sizes = function () {
      var product_type = $scope.product.product_type.product_type.toLowerCase();
      var fit_type = $scope.cart_object['standard_measurement_attributes']['Fit Type']['value'];
      if (product_type === "shirts") {
        if (fit_type && $scope.cart_object['standard_measurement_attributes']['Collar Size']['value'] && $scope.cart_object['standard_measurement_attributes']['Sleeve Length']['value']) {
          fit_type = fit_type.toLowerCase();
          for (var attr in standard_size_chart['shirts']) {
            if (standard_size_chart['shirts'][attr][fit_type]['step']) {
              if (selected_measurement_unit == "in") {
                $scope.cart_object['standard_measurement_attributes'][attr]['value'] = (($scope.cart_object['standard_measurement_attributes']['Collar Size']['value'] - standard_size_chart['shirts']['Collar Size'][fit_type]['base']) * 4 * standard_size_chart['shirts'][attr][fit_type]['step']) + standard_size_chart['shirts'][attr][fit_type]['base'];
              }
              else if (selected_measurement_unit == "cm") {
                $scope.cart_object['standard_measurement_attributes'][attr]['value'] = ((($scope.cart_object['standard_measurement_attributes']['Collar Size']['value'] ) - standard_size_chart['shirts']['Collar Size'][fit_type]['base']) * 4 * standard_size_chart['shirts'][attr][fit_type]['step']) + standard_size_chart['shirts'][attr][fit_type]['base'];
              }
              if (rounded_shirt_attr.indexOf(attr) != -1) {
                $scope.cart_object['standard_measurement_attributes'][attr]['value'] = $scope.cart_object['standard_measurement_attributes'][attr]['value'] / 2;
              }
            }
            if (selected_measurement_unit == "in") {
              $scope.cart_object['standard_measurement_attributes'][attr]['value'] = (Math.round((parseFloat($scope.cart_object['standard_measurement_attributes'][attr]['value'])) * 100) / 100).toFixed(3);
            }
            else if (selected_measurement_unit == "cm") {
              $scope.cart_object['standard_measurement_attributes'][attr]['value'] = (Math.round(parseFloat($scope.cart_object['standard_measurement_attributes'][attr]['value']) * 10) / 10).toFixed(2);
            }
            $scope.change_dependents('standard_measurement_attributes', attr, $scope.cart_object['standard_measurement_attributes'][attr]['value']);
          }
          if (fit_type == "regular") {
            if (selected_measurement_unit == "in") {
              $scope.cart_object['standard_measurement_attributes']['Armhole']['value'] = (Math.round((parseFloat($scope.cart_object['standard_measurement_attributes']['Sleeve Width']['value']) + 1.5) * 100) / 100).toFixed(3);//since armhole is rounded mnt 1.5->0.75
              // $scope.cart_object['standard_measurement_attributes']['Shoulder Slope(Right)']['value'] = (Math.round((2)*100)/100).toFixed(3);
              // $scope.cart_object['standard_measurement_attributes']['Shoulder Slope(Left)']['value'] = (Math.round((2)*100)/100).toFixed(3);//changed from 0.5->2 after ashish mail on 02 dec, changed for all fit types
              $scope.cart_object['standard_measurement_attributes']['Shoulder Slope']['value'] = (Math.round((2) * 100) / 100).toFixed(3);
            }
            else if (selected_measurement_unit == "cm") {
              $scope.cart_object['standard_measurement_attributes']['Armhole']['value'] = (Math.round((parseFloat($scope.cart_object['standard_measurement_attributes']['Sleeve Width']['value']) + 3.81) * 10) / 10).toFixed(2);//since armhole is rounded mnt 3.81->1.905
              // $scope.cart_object['standard_measurement_attributes']['Shoulder Slope(Right)']['value'] = (Math.round((5.08)*10)/10).toFixed(2);
              // $scope.cart_object['standard_measurement_attributes']['Shoulder Slope(Left)']['value'] = (Math.round((5.08)*10)/10).toFixed(2);//changed from 0.5->2 after ashish mail on 02 dec
              $scope.cart_object['standard_measurement_attributes']['Shoulder Slope']['value'] = (Math.round((5.08) * 10) / 10).toFixed(2);
            }

          }
          else if (fit_type == "slim") {
            if (selected_measurement_unit == "in") {
              $scope.cart_object['standard_measurement_attributes']['Armhole']['value'] = (Math.round((parseFloat($scope.cart_object['standard_measurement_attributes']['Sleeve Width']['value']) + 2.5) * 100) / 100).toFixed(3);//2.5->1.25
              // $scope.cart_object['standard_measurement_attributes']['Shoulder Slope(Right)']['value'] = (Math.round((2)*100)/100).toFixed(3);
              // $scope.cart_object['standard_measurement_attributes']['Shoulder Slope(Left)']['value'] = (Math.round((2)*100)/100).toFixed(3);
              $scope.cart_object['standard_measurement_attributes']['Shoulder Slope']['value'] = (Math.round((2) * 100) / 100).toFixed(3);
            }
            else if (selected_measurement_unit == "cm") {
              $scope.cart_object['standard_measurement_attributes']['Armhole']['value'] = (Math.round((parseFloat($scope.cart_object['standard_measurement_attributes']['Sleeve Width']['value']) + 6.35) * 10) / 10).toFixed(2);//6.35->3.175
              // $scope.cart_object['standard_measurement_attributes']['Shoulder Slope(Right)']['value'] = (Math.round((5.08)*10)/10).toFixed(2);
              // $scope.cart_object['standard_measurement_attributes']['Shoulder Slope(Left)']['value'] = (Math.round((5.08)*10)/10).toFixed(2);
              $scope.cart_object['standard_measurement_attributes']['Shoulder Slope']['value'] = (Math.round((5.08) * 10) / 10).toFixed(2);
            }
          }
          else if (fit_type == "super slim") {
            if (selected_measurement_unit == "in") {
              $scope.cart_object['standard_measurement_attributes']['Armhole']['value'] = (Math.round((parseFloat($scope.cart_object['standard_measurement_attributes']['Sleeve Width']['value']) + 3) * 100) / 100).toFixed(3);//3->1.5
              // $scope.cart_object['standard_measurement_attributes']['Shoulder Slope(Right)']['value'] = (Math.round((2)*100)/100).toFixed(3);
              // $scope.cart_object['standard_measurement_attributes']['Shoulder Slope(Left)']['value'] = (Math.round((2)*100)/100).toFixed(3);
              $scope.cart_object['standard_measurement_attributes']['Shoulder Slope']['value'] = (Math.round((2) * 100) / 100).toFixed(3);
            }
            else if (selected_measurement_unit == "cm") {
              $scope.cart_object['standard_measurement_attributes']['Armhole']['value'] = (Math.round((parseFloat($scope.cart_object['standard_measurement_attributes']['Sleeve Width']['value']) + 7.62) * 10) / 10).toFixed(2);//7.62->3.81
              // $scope.cart_object['standard_measurement_attributes']['Shoulder Slope(Right)']['value'] = (Math.round((5.08)*10)/10).toFixed(2);
              // $scope.cart_object['standard_measurement_attributes']['Shoulder Slope(Left)']['value'] = (Math.round((5.08)*10)/10).toFixed(2);
              $scope.cart_object['standard_measurement_attributes']['Shoulder Slope']['value'] = (Math.round((5.08) * 10) / 10).toFixed(2);
            }
          }
          $scope.change_dependents('standard_measurement_attributes', 'Armhole', $scope.cart_object['standard_measurement_attributes']['Armhole']['value']);
          $scope.change_dependents('standard_measurement_attributes', 'Shoulder Slope', $scope.cart_object['standard_measurement_attributes']['Shoulder Slope']['value']);
        }
      }
      else if (product_type === "pants") {
        if (fit_type && $scope.cart_object['standard_measurement_attributes']['Waist']['value'] && $scope.cart_object['standard_measurement_attributes']['Inseam']['value']) {
          fit_type = fit_type.toLowerCase();
          for (var attr in standard_size_chart['pants']) {
            if (attr !== "Outseam") {
              if (standard_size_chart['pants'][attr][fit_type]['step']) {
                if (selected_measurement_unit == "in") {
                  $scope.cart_object['standard_measurement_attributes'][attr]['value'] = ((($scope.cart_object['standard_measurement_attributes']['Waist']['value'] * 2) - standard_size_chart['pants']['Waist'][fit_type]['base']) * standard_size_chart['pants'][attr][fit_type]['step']) + standard_size_chart['pants'][attr][fit_type]['base'];
                }
                else if (selected_measurement_unit == "cm") {
                  $scope.cart_object['standard_measurement_attributes'][attr]['value'] = (((($scope.cart_object['standard_measurement_attributes']['Waist']['value'] * 2)) - standard_size_chart['pants'][attr][fit_type]['base']) * standard_size_chart['pants'][attr][fit_type]['step']) + standard_size_chart['pants'][attr][fit_type]['base'];
                }
                if (rounded_pant_attr.indexOf(attr) != -1) {
                  $scope.cart_object['standard_measurement_attributes'][attr]['value'] = $scope.cart_object['standard_measurement_attributes'][attr]['value'] / 2;
                }
              }
            }
            else {
              $scope.cart_object['standard_measurement_attributes']['Outseam']['value'] = parseFloat($scope.cart_object['standard_measurement_attributes']['Inseam']['value']) + parseFloat($scope.cart_object['standard_measurement_attributes']['Front Rise']['value']) + 1;
            }
            if (selected_measurement_unit == "in") {
              $scope.cart_object['standard_measurement_attributes'][attr]['value'] = (Math.round((parseFloat($scope.cart_object['standard_measurement_attributes'][attr]['value'])) * 100) / 100).toFixed(3);
            }
            else if (selected_measurement_unit == "cm") {
              $scope.cart_object['standard_measurement_attributes'][attr]['value'] = (Math.round(parseFloat($scope.cart_object['standard_measurement_attributes'][attr]['value'])* 10) / 10).toFixed(2);
            }
            $scope.change_dependents('standard_measurement_attributes', attr, $scope.cart_object['standard_measurement_attributes'][attr]['value']);
          }
        }
      }
    };

    /*This utility method assigns value to attribute & invokes functions to set std sizes and change dependents*/
    $scope.set_attribute_value = function (attribute_type, attribute_key, attribute_value) {
      if (!isNaN(attribute_value)) {
        if (selected_measurement_unit == "in") {
          attribute_value = (Math.round((parseFloat(attribute_value)) * 100) / 100).toFixed(3);
        }
        else if (selected_measurement_unit == "cm") {
          attribute_value = (Math.round((parseFloat(attribute_value)) * 10) / 10).toFixed(2);//attribute_value = (Math.round((parseFloat(attribute_value)*2.54)*10)/10).toFixed(2);
        }
      }
      $scope.cart_object[attribute_type][attribute_key]['value'] = attribute_value;
      set_standard_sizes();
      $scope.change_dependents(attribute_type, attribute_key, attribute_value);
    };

    $scope.change_attribute_value = function (attribute_type, attribute_key, attribute_value) {
      // if(!isNaN(attribute_value)){
      //   if(selected_measurement_unit == "in"){
      //     attribute_value = (Math.round((parseFloat(attribute_value))*100)/100).toFixed(3);
      //   }
      //   else if(selected_measurement_unit == "cm"){
      //     attribute_value = (Math.round((parseFloat(attribute_value)*2.54)*10)/10).toFixed(2);
      //   }
      // }
      $scope.cart_object[attribute_type][attribute_key]['value'] = attribute_value;
      $scope.change_dependents(attribute_type, attribute_key, attribute_value);
    };

    var ProductType = {
      shirts: ProductType["shirts"](),
      pants: ProductType["pants"]()
    };
    /*Order to display attributes shirt measurement*/
    $scope.cloth_measurement_attributes = {};
    if ($scope.product.product_type.product_type === "Shirts" || $scope.product.product_type.product_type === "Pants") {
      $scope.cloth_measurement_attributes = ProductType[$scope.product.product_type.product_type.toLowerCase()].cloth_measurement_attributes;
    }


    var attributes_order = ProductType[$scope.product.product_type.product_type.toLowerCase()].attributes_order;

    /*Check dependents and set dependents*/
    $scope.change_dependents = function (attr_type, attr_name, attr_value) {
      if (attr_name.indexOf('(') !== -1 && key_name_map[attr_name.trim().toLowerCase().split('(')[0].trim()]) {//dependent child
        $scope.cart_object[attr_type][key_name_map[attr_name.trim().toLowerCase().split('(')[0].trim()]]['value'] = "";
      }
      else if (attr_name.indexOf('(') === -1 && dependent_attrs.hasOwnProperty(attr_name.trim().toLowerCase())) {//dependent parent
        angular.forEach(dependent_attrs[attr_name.trim().toLowerCase()], function (val, key) {
          $scope.cart_object[attr_type][key_name_map[val]]['value'] = attr_value;
        });
      }
    };

    $scope.getImage = function (url) {
      return ImageHandler.url(url);
    };

    $scope.getOriginalImage = function (url) {
      if (url) {
        url = url.split("/small/").join("/original/");
        return $scope.getImage(url);
      }
    };
    $scope.cart_object = cart_object;

    $scope.cancel = function () {
      loading_measurement_modal.loadingFlag = false;
      $uibModalInstance.dismiss('cancel');
    };
    $scope.print_cart = function () {
    }
    var body_measurement_rule = {
      "shirts": {
        "Neck Around": {
          "map": "Collar Size",
          "rule": {
            "regular": 0,
            "slim": 0,
            "super slim": 0
          }
        },
        "Sleeve Length": {
          "map": "Sleeve Length",
          "rule": {
            "regular": 0,
            "slim": 0,
            "super slim": 0
          }
        },
        "Shoulder Width": {
          "map": "Yoke",
          "rule": {
            "regular": 0,
            "slim": 0,
            "super slim": 0
          }
        },
         "Shirt Length": {
          "map": "Shirt Length",
          "rule": {
            "regular": 0,
            "slim": 0,
            "super slim": 0
          }
        },
        "Chest Around": {
          "map": "Chest",
          "rule": {
            "regular": 4,
            "slim": 3,
            "super slim": 2
          }
        },
        "Waist Around": {
          "map": "Waist",
          "rule": {
            "regular": 4,
            "slim": 3,
            "super slim": 2
          }
        },
        "Hip Around": {
          "map": "Bottom",
          "rule": {
            "regular": 4,
            "slim": 3,
            "super slim": 2
          }
        },
        "Shoulder Slope": {
          "map": "Shoulder Slope",
          "rule": {
            "regular": 0,
            "slim": 0,
            "super slim": 0
          }
        },
        "Biceps Around": {
          "map": "Sleeve Width",
          "rule": {
            "regular": 4,
            "slim": 3,
            "super slim": 2
          }
        },
        "Wrist Around": {
          "map": "Cuff Around",
          "rule": {
            "regular": 1.5,
            "slim": 1.25,
            "super slim": 1
          }
        }
      },
      "pants": {
        "Body Waist": {
          "map": "Waist",
          "rule": {
            "regular": 0,
            "slim": 0
          }
        },
        "Body Hip": {
          "map": "Hips",
          "rule": {
            "regular": 6,
            "slim": 4
          }
        },
        "Pant Length": {
          "map": "Outseam",
          "rule": {
            "regular": 0,
            "slim": 0,
            "super slim": 0
          }
        },
        "Body Inseam": {
          "map": "Inseam",
          "rule": {
            "regular": -1,
            "slim": -1
          }
        },
        //"Body Rise": {
         // "map": "Front Rise",
          //"rule": {
           // "regular": 4,
            //"slim": 3,
           // "super slim": 2
         // }
       // },
        "Body Thigh": {
          "map": "Thigh",
          "rule": {
            "regular": 3,
            "slim": 2
          }
        },
        "Body Knee": {
          "map": "Knee",
          "rule": {
            "regular": 5,
            "slim": 4
          }
        },
        "Body Ankle": {
          "map": "Bottom",
          "rule": {
            "regular": 7,
            "slim": 5
          }
        }
      }
    }

    $scope.compute_cloth_measurement_from_body = function () {
      if ($scope.cart_object['body_measurement_attributes']['Fit Type']['value']) {
        var fit_type = $scope.cart_object['body_measurement_attributes']['Fit Type']['value'].toLowerCase().trim();
        if ($scope.product.product_type.product_type === "Shirts") {
          if (selected_measurement_unit == "in") {
            angular.forEach(body_measurement_rule['shirts'], function (val, key) {
              if ($scope.cart_object['body_measurement_attributes'][key]['value'] && key !== 'Shoulder Slope') {
                $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = parseFloat($scope.cart_object['body_measurement_attributes'][key]['value']) + val['rule'][fit_type];
                if (rounded_shirt_attr.indexOf(val['map']) != -1) {
                  $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] / 2;
                }
              }
              else if ($scope.cart_object['body_measurement_attributes'][key]['value'] && key == 'Shoulder Slope') {
                if ($scope.cart_object['body_measurement_attributes'][key]['value'] === 'Normal') {
                  $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = 2;
                }
                else if ($scope.cart_object['body_measurement_attributes'][key]['value'] === 'Flat') {
                  $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = 1;
                }
                else if ($scope.cart_object['body_measurement_attributes'][key]['value'] === 'Sloping') {
                  $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = 2.5;
                }
              }
              if ($scope.cart_object['standard_measurement_attributes'][val['map']] && $scope.cart_object['standard_measurement_attributes'][val['map']]['value']) {
                $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = parseFloat($scope.cart_object['standard_measurement_attributes'][val['map']]['value']).toFixed(3);
                $scope.change_dependents('standard_measurement_attributes', val['map'], $scope.cart_object['standard_measurement_attributes'][val['map']]['value']);
              }
            })
            if ($scope.cart_object['standard_measurement_attributes']['Sleeve Width']['value']) {
              if (fit_type == "regular") {
                $scope.cart_object['standard_measurement_attributes']['Armhole']['value'] = parseFloat($scope.cart_object['standard_measurement_attributes']['Sleeve Width']['value']) + 1.5;//1.5->0.75
              }
              else if (fit_type == "slim") {
                $scope.cart_object['standard_measurement_attributes']['Armhole']['value'] = parseFloat($scope.cart_object['standard_measurement_attributes']['Sleeve Width']['value']) + 2.5;//2.5->1.25
              }
              else if (fit_type == "super slim") {
                $scope.cart_object['standard_measurement_attributes']['Armhole']['value'] = parseFloat($scope.cart_object['standard_measurement_attributes']['Sleeve Width']['value']) + 3;//3->1.5
              }
              $scope.cart_object['standard_measurement_attributes']['Armhole']['value'] = parseFloat($scope.cart_object['standard_measurement_attributes']['Armhole']['value']).toFixed(3);
              $scope.change_dependents('standard_measurement_attributes', 'Armhole', $scope.cart_object['standard_measurement_attributes']['Armhole']['value']);
            }
          }
          else if (selected_measurement_unit == "cm") {
            angular.forEach(body_measurement_rule['shirts'], function (val, key) {
              if ($scope.cart_object['body_measurement_attributes'][key]['value'] && key !== 'Shoulder Slope') {
                $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = parseFloat($scope.cart_object['body_measurement_attributes'][key]['value']) + (val['rule'][fit_type] * 2.54 );
                if (rounded_shirt_attr.indexOf(val['map']) != -1) {
                  $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] / 2;
                }
              }
              else if ($scope.cart_object['body_measurement_attributes'][key]['value'] && key == 'Shoulder Slope') {
                if ($scope.cart_object['body_measurement_attributes'][key]['value'] === 'Normal') {
                  $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = (2);
                }
                else if ($scope.cart_object['body_measurement_attributes'][key]['value'] === 'Flat') {
                  $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = (1);
                }
                else if ($scope.cart_object['body_measurement_attributes'][key]['value'] === 'Sloping') {
                  $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = (2.5);
                }
              }
              if ($scope.cart_object['standard_measurement_attributes'][val['map']] && $scope.cart_object['standard_measurement_attributes'][val['map']]['value']) {
                $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = parseFloat($scope.cart_object['standard_measurement_attributes'][val['map']]['value']).toFixed(2);
                $scope.change_dependents('standard_measurement_attributes', val['map'], $scope.cart_object['standard_measurement_attributes'][val['map']]['value']);
              }
            })
            if ($scope.cart_object['standard_measurement_attributes']['Sleeve Width']['value']) {
              if (fit_type == "regular") {
                $scope.cart_object['standard_measurement_attributes']['Armhole']['value'] = parseFloat($scope.cart_object['standard_measurement_attributes']['Sleeve Width']['value']) + (1.50 * 2.54);
              }
              else if (fit_type == "slim") {
                $scope.cart_object['standard_measurement_attributes']['Armhole']['value'] = parseFloat($scope.cart_object['standard_measurement_attributes']['Sleeve Width']['value']) + (2.50 * 2.54);
              }
              else if (fit_type == "super slim") {
                $scope.cart_object['standard_measurement_attributes']['Armhole']['value'] = parseFloat($scope.cart_object['standard_measurement_attributes']['Sleeve Width']['value']) + (3.00 * 2.54);
              }
              $scope.cart_object['standard_measurement_attributes']['Armhole']['value'] = parseFloat($scope.cart_object['standard_measurement_attributes']['Armhole']['value']).toFixed(2);
              $scope.change_dependents('standard_measurement_attributes', 'Armhole', $scope.cart_object['standard_measurement_attributes']['Armhole']['value']);
            }
          }
        }
        else if ($scope.product.product_type.product_type === "Pants") {
          if (selected_measurement_unit == "in") {
            angular.forEach(body_measurement_rule['pants'], function (val, key) {
              if ($scope.cart_object['body_measurement_attributes'][key]['value'] && key.toLowerCase().indexOf('rise') == -1) {
                $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = parseFloat($scope.cart_object['body_measurement_attributes'][key]['value']) + val['rule'][fit_type];
              }
              else if (key.toLowerCase().indexOf('rise') !== -1 && $scope.cart_object['body_measurement_attributes']['Body Rise']['value'] && $scope.cart_object['body_measurement_attributes']['Pant Length']['value'] && $scope.cart_object['body_measurement_attributes']['Body Inseam']['value']) {
                $scope.cart_object['standard_measurement_attributes']['Front Rise']['value'] = parseFloat($scope.cart_object['body_measurement_attributes']['Pant Length']['value']) - parseFloat($scope.cart_object['standard_measurement_attributes']['Inseam']['value']) - 1;
                $scope.cart_object['standard_measurement_attributes']['Back Rise']['value'] = parseFloat($scope.cart_object['body_measurement_attributes']['Body Rise']['value']) - parseFloat($scope.cart_object['standard_measurement_attributes']['Front Rise']['value']) + 2;
                $scope.cart_object['standard_measurement_attributes']['Front Rise']['value'] = parseFloat($scope.cart_object['standard_measurement_attributes']['Front Rise']['value']).toFixed(3);
                $scope.cart_object['standard_measurement_attributes']['Back Rise']['value'] = parseFloat($scope.cart_object['standard_measurement_attributes']['Back Rise']['value']).toFixed(3);
              }
              if (rounded_pant_attr.indexOf(val['map']) != -1) {
                $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] / 2;
              }
              if ($scope.cart_object['standard_measurement_attributes'][val['map']] && $scope.cart_object['standard_measurement_attributes'][val['map']]['value']) {
                $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = parseFloat($scope.cart_object['standard_measurement_attributes'][val['map']]['value']).toFixed(3);
                $scope.change_dependents('standard_measurement_attributes', val['map'], $scope.cart_object['standard_measurement_attributes'][val['map']]['value']);
              }
            })
          }
          else if (selected_measurement_unit == "cm") {
            angular.forEach(body_measurement_rule['pants'], function (val, key) {
              if ($scope.cart_object['body_measurement_attributes'][key]['value'] && key.toLowerCase().indexOf('rise') == -1) {
                $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = parseFloat($scope.cart_object['body_measurement_attributes'][key]['value']) + (val['rule'][fit_type]);
              }
              else if (key.toLowerCase().indexOf('rise') !== -1 && $scope.cart_object['body_measurement_attributes']['Body Rise']['value'] && $scope.cart_object['body_measurement_attributes']['Pant Length']['value'] && $scope.cart_object['body_measurement_attributes']['Body Inseam']['value']) {
                $scope.cart_object['standard_measurement_attributes']['Front Rise']['value'] = parseFloat($scope.cart_object['body_measurement_attributes']['Pant Length']['value']) - parseFloat($scope.cart_object['standard_measurement_attributes']['Inseam']['value']) - 2.54;
                $scope.cart_object['standard_measurement_attributes']['Back Rise']['value'] = parseFloat($scope.cart_object['body_measurement_attributes']['Body Rise']['value']) - parseFloat($scope.cart_object['standard_measurement_attributes']['Front Rise']['value']) + 5.08;
                $scope.cart_object['standard_measurement_attributes']['Front Rise']['value'] = parseFloat($scope.cart_object['standard_measurement_attributes']['Front Rise']['value']).toFixed(2);
                $scope.cart_object['standard_measurement_attributes']['Back Rise']['value'] = parseFloat($scope.cart_object['standard_measurement_attributes']['Back Rise']['value']).toFixed(2);
              }
              if (rounded_pant_attr.indexOf(val['map']) != -1) {
                $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] / 2;
              }
              if ($scope.cart_object['standard_measurement_attributes'][val['map']] && $scope.cart_object['standard_measurement_attributes'][val['map']]['value']) {
                $scope.cart_object['standard_measurement_attributes'][val['map']]['value'] = parseFloat($scope.cart_object['standard_measurement_attributes'][val['map']]['value']).toFixed(2);
                $scope.change_dependents('standard_measurement_attributes', val['map'], $scope.cart_object['standard_measurement_attributes'][val['map']]['value']);
              }
            })
          }
        }
      }
    };
    //To add the custom notes details to the cart object['measurement'] property
    $scope.addMeasurementCustomNote = function () {
      console.log('cart object:', $scope.cart_object);
      if (!$scope.cart_object['body_measurement_attributes'].hasOwnProperty('custom_notes')) {
        $scope.cart_object['body_measurement_attributes']['custom_notes'] = {};
        $scope.cart_object['body_measurement_attributes']['custom_notes']['value'] = '';
      }
      console.log('cart object:', $scope.cart_object);
    }
    $scope.next_step = function () {
      var measurements = {
        body: {},
        standard: {}
      };
      if ($scope.active_measurement_type_id === 3) {
        measurements = {
          body: $scope.cart_object.body_measurement_attributes,
          standard: $scope.cart_object.standard_measurement_attributes
        };
      }
      else if ($scope.active_measurement_type_id === 4) {
        measurements = {
          body: {},
          standard: {}
        };
      }
      else {
        measurements = {
          body: {},
          standard: $scope.cart_object.standard_measurement_attributes
        };
      }
      if ($scope.active_measurement_type_id !== 3 && $scope.cart_object['body_measurement_attributes']['custom_notes'] && $scope.cart_object['body_measurement_attributes']['custom_notes']['value']) {
        measurements.body['custom_notes'] = $scope.cart_object['body_measurement_attributes']['custom_notes'];
      }
      $uibModalInstance.close({
        selected_measurement_id: $scope.active_measurement_type_id,
        selected_measurements: measurements
      });
    };

    $scope.checkIsArray = function (style_value) {
      if (angular.isArray(style_value)) {
        return true;
      }
      else {
        return false;
      }
    };

    var key_name_map = {};
    var dependent_attrs = {};
    angular.forEach(product['standard_measurement_attributes'], function (val, key) {
      key_name_map[val.name.trim().toLowerCase()] = val.name;
      if (val.name.trim().toLowerCase().indexOf('(') !== -1) {
        if (!dependent_attrs.hasOwnProperty(val.name.trim().toLowerCase().split('(')[0].trim())) {
          dependent_attrs[val.name.trim().toLowerCase().split('(')[0].trim()] = [];
        }
        dependent_attrs[val.name.trim().toLowerCase().split('(')[0].trim()].push(val.name.trim().toLowerCase());
      }
    });
  }])
  .controller('SelectStyleController', ['$scope', '$uibModalInstance', 'ImageHandler', 'product', 'cart_object', 'selectedAtrributeListObj', 'luxire_styles', 'active_style', 'parent_scope', '$state', 'CustomerConstants', '$filter', '$timeout', '$uibPosition', '$sce', 'selected_currency', 'CustomerUtils', 'cart_object_changed', function ($scope, $uibModalInstance, ImageHandler, product, cart_object, selectedAtrributeListObj, luxire_styles, active_style, parent_scope, $state, CustomerConstants, $filter, $timeout, $uibPosition, $sce, selected_currency, CustomerUtils, cart_object_changed) {
    /*Bespoke Style Functionality */
    var changeCollarValue = 0;//This is temp to store the back neck band height of each collar options
    var changeCollarBackHeight = 0;//This is temp to store the colar back height of each collar options
    $scope.showGreenTick = [false, false, false, false, false, false, false, false, false, false, false, false, false];
    //$scope.showGreenTickIndex = 0;
    var Back_neck_band_height_Object = function (valueName) {
      if (product.customization_attributes[0].value.hasOwnProperty(valueName)) {
        changeCollarValue = product.customization_attributes[0].value[valueName]['Back neck band height'];
        changeCollarBackHeight = product.customization_attributes[0].value[valueName]['Collar Back Height'];

      }
      else {
        changeCollarValue = 0;
      }
    }

    $scope.product = product;
    if (cart_object_changed) {
      $scope.showImageAccordian = true;
      $scope.showNoteAccordian = true;
      $scope.cart_object = angular.copy(cart_object);
      $scope.showCustomNotesEdit = true;
      $scope.showCustomNotes = false;
      $scope.selectedAtrributeListObj = angular.copy(selectedAtrributeListObj);
    }
    else {
      $scope.showImageAccordian = false;
      $scope.showNoteAccordian = false;
      $scope.showCustomNotes = false;
      $scope.showCustomNotesEdit = false;
    }

    $scope.cart_object = cart_object;
    $scope.product['bespoke_attributes'] = product['customization_attributes'].concat(product['personalization_attributes']);

    $scope.active_style = active_style;
    $scope.selected_currency = selected_currency;

    /*Watcher implemented for as style change*/
    $scope.un_modified_cart_object = angular.copy($scope.cart_object);
    $scope.cart_object_changed = cart_object_changed ? cart_object_changed : false;//track if style is modified
    $scope.are_cart_objects_equal = function () {
      if (angular.equals($scope.un_modified_cart_object, cart_object)) {
        $scope.cart_object_changed = false;
      }
      else {
        $scope.cart_object_changed = true;
      }
    };
    /**/


    $scope.active_style_option = "system_preset";
    $scope.product_customization_attributes = {};
    $scope.product_personalization_attributes = {};

    angular.forEach(product['customization_attributes'], function (val, key) {
      $scope.product_customization_attributes[val.name] = val.value;
    })
    angular.forEach(product['personalization_attributes'], function (val, key) {
      $scope.product_personalization_attributes[val.name] = val.value;
    })
    $scope.change_active_style_option = function (option) {
      $scope.active_style_option = option;
      // $('#prev-attr').click();
      $scope.attibutes_slider_config.method.slickPrev();
      $scope.attibutes_slider_config.method.slickPrev();
      if ($scope.selected_style && $scope.selected_style.name && option == 'bespoke') {
        angular.forEach($scope.cart_object['customization_attributes'], function (val, key) {
          if (!angular.isObject($scope["customization_attributes"])) {
            $scope["customization_attributes"] = {};
          };
          if (angular.isObject($scope["customization_attributes"]) && !angular.isObject($scope["customization_attributes"][key])) {
            $scope["customization_attributes"][key] = {};
          };
          if (angular.isObject($scope["customization_attributes"]) && angular.isObject($scope["customization_attributes"][key]) && !angular.isObject($scope["customization_attributes"][key]["options"])) {
            $scope["customization_attributes"][key]['options'] = {};
          }
          if ($scope.product_customization_attributes[key] && $scope.product_customization_attributes[key][$scope.cart_object['customization_attributes'][key]['value']]) {
            angular.forEach($scope.product_customization_attributes[key][$scope.cart_object['customization_attributes'][key]['value']], function (option_val, option_key) {
              if ($scope.check_unpermitted_customization_params($scope.cart_object["customization_attributes"][key]['value'], option_key)) {
                if (!$scope.cart_object["customization_attributes"][key]['options'][option_key]) {
                  if (angular.isObject(option_val)) {
                    $scope.cart_object["customization_attributes"][key]['options'][option_key] = option_val.default;
                  }
                  else {
                    $scope.cart_object["customization_attributes"][key]['options'][option_key] = option_val;
                  }
                }
              }
            });
            $scope["customization_attributes"][key]['options'] = $scope.product_customization_attributes[key][$scope.cart_object['customization_attributes'][key]['value']];
          }
        });
      }
    };

    $scope.activeStyleCarouselIndex = 2;

    if (active_style && active_style.name) {
      angular.forEach(luxire_styles, function (val, key) {
        if (val.name == active_style.name) {
          $scope.activeStyleCarouselIndex = key;
        }
      });
    }
    /*Select Style functionality */
    $scope.luxire_styles = luxire_styles;
    $scope.selectSliderIndex = -1;
    $scope.selected_style = active_style;
    $scope.hide_active_style_details = true;
    $scope.getImage = function (url) {
      return ImageHandler.url(url);
    };
    $scope.active_detail_style = {};
    $scope.toggle_detailed_style = function (style, toggle) {
      $scope.hide_active_style_details = false;
      $scope.active_detail_style = !toggle ? style : {};
    };

    $scope.init_active_style = function (style) {
      $scope.active_detail_style_image = $scope.getImage(style.images.large_url);
    };
    $scope.change_active_style_image = function (image) {
      $scope.active_detail_style_image = $scope.getImage(image.large);
    };

    $scope.aggregated_style_images = [];
    $scope.set_aggregated_style_images = function (style) {
      if (style && Object.keys(style).length) {
        $scope.aggregated_style_images = [];
        $scope.aggregated_style_images = angular.copy(style.real_images);
        $scope.aggregated_style_images = $scope.aggregated_style_images.concat(style.sketch_images);
        $scope.aggregated_style_images.splice(0, 0, style.images);
      }
    };

    var style_iterator = function (style, attribute_type, is_selected) {
      if (style[attribute_type]) {
        angular.forEach(style[attribute_type], function (value, key) {
          if (!is_selected) { // remove style from cart object
            /*Relocate this code*/
            if (attribute_type == "personalization_attributes") {
              angular.forEach(style[attribute_type][key], function (val, name) {
                if ($scope.cart_object[attribute_type][key][name]) {
                  if ($scope.product_personalization_attributes[key] && $scope.product_personalization_attributes[key][name] && $scope.product_personalization_attributes[key][name].cost) {//(val.cost)Added on 5 jan to remove cost from style object
                    $scope.remove_personalization_cost($scope.product_personalization_attributes[key][name].cost);//val.cost
                  }
                  delete $scope.cart_object[attribute_type][key][name];
                }
              })
            }
            else if (attribute_type == "customization_attributes" && $scope.product_customization_attributes[key]) {
              if (style[attribute_type][key]) {
                $scope.cart_object[attribute_type][key]['value'] = '';
              }
              if ($scope.product_customization_attributes[key][style[attribute_type][key]] && $scope.product_customization_attributes[key][style[attribute_type][key]].cost) {
                $scope.remove_personalization_cost($scope.product_customization_attributes[key][style[attribute_type][key]].cost);
                delete $scope.cart_object["personalization_attributes"][key][style[attribute_type][key]];
              }
            }
            /*Relocate this code*/
          }
          else {
            if (attribute_type == "personalization_attributes") {
              angular.forEach(style[attribute_type][key], function (val, name) {
                if (!$scope.cart_object[attribute_type]) {
                  $scope.cart_object[attribute_type] = {};
                }
                $scope.cart_object[attribute_type][key] = $scope.cart_object[attribute_type][key] ? $scope.cart_object[attribute_type][key] : {};
                $scope.cart_object[attribute_type][key][name] = val;
                // if(val.cost){
                //   $scope.add_personalization_cost(val.cost);
                // }
                if ($scope.product_personalization_attributes[key] && $scope.product_personalization_attributes[key][name] && $scope.product_personalization_attributes[key][name].cost) {//(val.cost)Added on 5 jan to remove cost from style object
                  $scope.add_personalization_cost($scope.product_personalization_attributes[key][name].cost);//val.cost
                }
              })
            }
            else if (attribute_type == "customization_attributes" && $scope.product_customization_attributes[key]) {
              if (!$scope.cart_object[attribute_type][key]) {
                $scope.cart_object[attribute_type][key] = {};
              }
              $scope.cart_object[attribute_type][key]['value'] = style[attribute_type][key];
              if ($scope.cart_object['customization_attributes'][key]['value'] && $scope.product_customization_attributes[key][$scope.cart_object['customization_attributes'][key]['value']]) {
                var style_object = $scope.product_customization_attributes[key][$scope.cart_object['customization_attributes'][key]['value']];
                angular.forEach(style_object, function (val1, key1) {
                  if ($scope.check_unpermitted_customization_params($scope.cart_object['customization_attributes'][key]['value'], key1)) {
                    /*Change 15 March 2015 to set default*/
                    $scope.cart_object["customization_attributes"][key]['options'][key1] = angular.isObject(style_object[key1]) ? style_object[key1].default : style_object[key1];
                  }
                });
              }
              if ($scope.cart_object['customization_attributes'][key]['value'] && $scope.product_customization_attributes[key][$scope.cart_object['customization_attributes'][key]['value']] && $scope.product_customization_attributes[key][$scope.cart_object['customization_attributes'][key]['value']].cost) {
                if (!$scope.cart_object["personalization_attributes"]) {
                  $scope.cart_object["personalization_attributes"] = {};
                }
                if ($scope.cart_object["personalization_attributes"] && !$scope.cart_object["personalization_attributes"][key]) {
                  $scope.cart_object["personalization_attributes"][key] = {};
                }
                if ($scope.cart_object["personalization_attributes"] && $scope.cart_object["personalization_attributes"][key]) {
                  if (!$scope.cart_object["personalization_attributes"][key][$scope.cart_object['customization_attributes'][key]['value']]) {
                    $scope.cart_object["personalization_attributes"][key][$scope.cart_object['customization_attributes'][key]['value']] = {};
                  }
                  if (!$scope.cart_object["personalization_attributes"][key][$scope.cart_object['customization_attributes'][key]['value']]['cost']) {
                    $scope.cart_object["personalization_attributes"][key][$scope.cart_object['customization_attributes'][key]['value']]['cost'] = $scope.product_customization_attributes[key][$scope.cart_object['customization_attributes'][key]['value']].cost;
                    $scope.add_personalization_cost($scope.product_customization_attributes[key][$scope.cart_object['customization_attributes'][key]['value']].cost);
                  }
                }
              }
              // if($scope.product_customization_attributes[key][style[attribute_type][key]].cost){
              //   $scope.add_personalization_cost($scope.product_customization_attributes[key][style[attribute_type][key]].cost);
              // }
            }
          }
        })
      }
    };

    $scope.style_extractor = function (style, is_selected) {
      $scope.active_style = style;
      $scope.cart_object.selected_style = style;
      style_iterator(style.default_values, "customization_attributes", is_selected);
      style_iterator(style.default_values, "personalization_attributes", is_selected);
      // style_iterator(style.default_values, "standard_measurement_attributes", is_selected);
      // style_iterator(style.default_values, "body_measurement_attributes", is_selected);
      return;
    };

    $scope.revert_style = function () {
      style_iterator();
    };

    $scope.get_style_description_as_html = function (description) {
      return $sce.trustAsHtml(description);
    };

    $scope.more_details_on_style = false;

    $scope.style_detail_images = [];
    $scope.activate_style_details = function (style) {
      $scope.more_details_on_style = false;
      if (!$scope.selected_style.name) {
        $scope.style_detail_images = [];
        $scope.hide_active_style_details = false;
        $scope.active_detail_style = style;
        $scope.style_detail_images = $scope.active_detail_style.sketch_images;
        $scope.set_aggregated_style_images(style);
      }
    }

    if (active_style && active_style.name) {
      $scope.more_details_on_style = false;
      $scope.style_detail_images = [];
      $scope.hide_active_style_details = false;
      $scope.active_detail_style = active_style;
      $scope.style_detail_images = $scope.active_detail_style.sketch_images;
      $scope.set_aggregated_style_images(active_style);
    }

    $scope.style_slider_config = {
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 3,
      centerMode: true,
      focusOnSelect: true,
      initialSlide: $scope.activeStyleCarouselIndex,
      method: {},
      event: {
      }
    }

    $scope.selected_bespoke_attribute_index = 0;
    $scope.show_attribute_sync_slide = false;//default at top
    $scope.show_attribute_sync_slide_at_bottom = false;
    var attributes_to_scroll = 5;
    $scope.attibutes_slider_config = {
      infinite: false,
      slidesToShow: attributes_to_scroll,
      slidesToScroll: 1,
      vertical: true,
      method: {},
      event: {
        beforeChange: function (event, slick, currentSlide, nextSlide) {
          if (nextSlide > currentSlide) { //scroll down
            if (!$scope.selected_bespoke_attribute_index || ($scope.selected_bespoke_attribute_index <= currentSlide)) {
              $scope.show_attribute_sync_slide = true;
            }
            else {
              $scope.show_attribute_sync_slide = false;
            }
            if ($scope.selected_bespoke_attribute_index >= currentSlide + attributes_to_scroll) {
              $scope.show_attribute_sync_slide_at_bottom = true;
            }
            else {
              $scope.show_attribute_sync_slide_at_bottom = false;
            }
          }
          else if (nextSlide < currentSlide) {
            if (!$scope.selected_bespoke_attribute_index || ($scope.selected_bespoke_attribute_index <= nextSlide)) {
              $scope.show_attribute_sync_slide = true;
            }
            else {
              $scope.show_attribute_sync_slide = false;
            }
            if ($scope.selected_bespoke_attribute_index >= currentSlide + attributes_to_scroll - 1) {
              $scope.show_attribute_sync_slide_at_bottom = true;
            }
            else {
              $scope.show_attribute_sync_slide_at_bottom = false;
            }
          }
        }
      }
    };


    //This is to add the .5 value to collar back height property while changing Back neck band height of collar
    $scope.changeCollarBackHeight = function (property, object) {
      if (property === 'Back neck band height') {
        if (Number.isNaN(parseFloat($scope.cart_object['customization_attributes']['Collar']['options']['Back neck band height']))) {
          $scope.cart_object['customization_attributes']['Collar']['options']['Collar Back Height'] = changeCollarBackHeight.toString();
        } else {
          $scope.cart_object['customization_attributes']['Collar']['options']['Collar Back Height'] = (parseFloat($scope.cart_object['customization_attributes']['Collar']['options']['Back neck band height']) + 0.5).toString();
        }

      }
    }

    $scope.selectSlider = function (index, selected_style) {
      $scope.selectSliderIndex = index;
      $scope.selected_style = selected_style;
    };
    $scope.select_style = function (index, style) {
      if ($scope.selected_style.name === style.name) {
        $scope.selected_style = {};
        $scope.style_extractor(style, false);
      }
      else {
        $scope.style_slider_config.method.slickGoTo(index, true);
        if ($scope.selected_style && $scope.selected_style.hasOwnProperty('default_values')) {
          $scope.style_extractor($scope.selected_style, false);
        }
        $scope.selected_style = {};//added to disable detail change on style selected
        $scope.activate_style_details(style);//added to disable detail change on style selected
        $scope.selected_style = style;
        $scope.style_extractor(style, true);
      };
      /*log reset style changed flags*/
      $scope.un_modified_cart_object = angular.copy($scope.cart_object);
      $scope.cart_object_changed = false;
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    $scope.edit_style = function () {
      $scope.change_active_style_option("bespoke");
    };

    $scope.getImage = function (url) {
      return ImageHandler.url(url);
    };
    /*Slick wheeler/slider*/

    $scope.more_details = function (attr_name, attr_type) {
      attr_name = attr_name.toLowerCase().split(" ").join("-");
      attr_type = attr_type.toLowerCase().split(" ").join("-");
      window.open('/#/attributes/' + attr_name + '?type=' + attr_type, '_blank')
    };

    $scope.attr_options_key_length = function (options_obj) {
      if (options_obj && angular.isObject(options_obj)) {
        return Object.keys(options_obj).length;
      }
      else {
        return 0;
      }
    };

    $scope.view_measurements = {
      templateUrl: 'view_measurements_popover.html'
    };

    $scope.enlarge_style = function (style, element) {
      $scope.enlarge_image_xpos = element.clientX - 360;
      $scope.enlarge_image_ypos = element.clientY - 30;
      $scope.enlarged_style = style;

    };

    $scope.upload_custom_image = function (files, index) {
      if (files && files.length) {
        ImageHandler.custom_image_upload(files[0])
          .then(function (data) {
            $scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'][index].url = data.data.image;
          }, function (error) {
            console.error(error);
          });
      }
    }

    /*Add custom images*/
    $scope.add_custom_image = function () {
      if (!$scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images']
        || ($scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images']
          && !angular.isArray($scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images']))) {
        $scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'] = [];
      }
      $scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'].push({
        url: '',
        notes: ''
      });
    };

    $scope.delete_custom_image = function (index) {
      $scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'].splice(index, 1);
    };

    /*Add custom notes*/
    $scope.add_custom_note = function () {
      if (!$scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_notes']
        || ($scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_notes']
          && !angular.isArray($scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_notes']))) {
        $scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_notes'] = [];
      }
      $scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_notes'].push({
        content: ''
      });
    };

    $scope.delete_custom_note = function (index) {
      $scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_notes'].splice(index, 1);
    };
    /*This is for adding custom image personalization attributes*/
    $scope.add_personalization_custom_image = function () {
      $scope.showImageAccordian = true;
      if (!$scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options']) {
        $scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options'] = {};
      }
      if (!$scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images']
        || ($scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images']
          && !angular.isArray($scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images']))) {
        $scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'] = [];
      }
      $scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'].push({
        url: '',
        notes: ''
      });
    };

    $scope.delete_personalization_custom_image = function (index) {
      $scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'].splice(index, 1);
    };

    $scope.add_personalization_custom_note = function () {
      $scope.showNoteAccordian = true;
      if (!$scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options']) {
        $scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options'] = {};
      }
      if (!$scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_notes']
        || ($scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_notes']
          && !angular.isArray($scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_notes']))) {
        $scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_notes'] = [];
      }
      $scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_notes'].push({
        content: ''
      });

    };

    $scope.delete_personalization_custom_note = function (index) {
      $scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_notes'].splice(index, 1);
    };

    $scope.upload_personalization_custom_image = function (files, index) {
      $scope.loading = true;
      if (files && files.length) {
        ImageHandler.custom_image_upload(files[0])
          .then(function (data) {
            $scope.loading = false;
            $scope.cart_object['personalization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'][index].url = data.data.image;
          }, function (error) {
            console.error(error);
          });
      }
    }
    /*Check whether to display in view r not*/
    $scope.check_unpermitted_customization_params = function (attribute, key) {
      var unpermitted_params_non_custom = ['image', 'url', 'help', 'help_url', 'help_image', 'cost', 'rule'];
      var unpermitted_params_custom = ['help', 'help_url', 'image', 'rule'];
      if (attribute.toLowerCase() != 'custom') {
        if (unpermitted_params_non_custom.indexOf(key) != -1) {
          return false;
        }
        else {
          return true;
        }
      }
      else {
        if (unpermitted_params_custom.indexOf(key) != -1) {
          return false;
        }
        else {
          return true;
        }
      }
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.next_step = function () {
      $uibModalInstance.close({
        cart_object: $scope.cart_object,
        active_style: $scope.selected_style,
        cart_object_changed: $scope.cart_object_changed,
        selectedAtrributeListObj: $scope.selectedAtrributeListObj
      });
    };


    $scope.currency_symbols = CustomerUtils.get_currency_with_symbol;//accepts (val, currency)

    var personalisation_cost_init = {
      "INR": 0.00,
      "USD": 0.00,
      "EUR": 0.00,
      "SGD": 0.00,
      "AUD": 0.00,
      "SEK": 0.00,
      "DKK": 0.00,
      "NOK": 0.00,
      "CHF": 0.00,
      "CAD": 0.00,
      "GBP": 0.00
    };

    $scope.cart_object.personalization_cost = $scope.cart_object.personalization_cost ? $scope.cart_object.personalization_cost : personalisation_cost_init;

    var product_prices = {};
    angular.forEach($scope.product.master.prices, function (value, currency) {
      if ((currency == "USD") || (currency == "SGD") || (currency == "AUD") || (currency == "CAD")) {
        product_prices[currency] = parseFloat(value.split(",").join("").split("$")[1]);
      }
      else if ((currency == "SEK") || (currency == "NOK") || (currency == "DKK")) {
        product_prices[currency] = parseFloat(value.split(",").join("").split(" kr")[0]);
      }
      else if (currency == "CHF") {
        product_prices[currency] = parseFloat(value.split(",").join("").split("CHF")[1]);
      }
      else if (currency == "EUR") {
        product_prices[currency] = parseFloat(value.split(",").join("").split("\u20ac")[1]);
      }
      else if (currency == "GBP") {
        product_prices[currency] = parseFloat(value.split(",").join("").split("\u00A3")[1]);
      }
      else if (currency == "INR") {
        product_prices[currency] = parseFloat(value.split(",").join("").split("\u20b9")[1]);
      }
    });
    $scope.add_personalization_cost = function (cost) {
      angular.forEach(cost, function (value, currency) {
        $scope.cart_object.personalization_cost[currency] = (parseFloat($scope.cart_object.personalization_cost[currency]) + parseFloat(value)).toFixed(2);
        $scope.cart_object.total_cost[currency] = (parseFloat($scope.cart_object.total_cost[currency]) + parseFloat(value)).toFixed(2);
      });
    };

    $scope.cart_object.total_cost = $scope.cart_object.total_cost ? $scope.cart_object.total_cost : product_prices;
    $scope.remove_personalization_cost = function (cost) {
      angular.forEach(cost, function (value, currency) {
        $scope.cart_object.personalization_cost[currency] = (parseFloat($scope.cart_object.personalization_cost[currency]) - parseFloat(value)).toFixed(2);
        $scope.cart_object.total_cost[currency] = (parseFloat($scope.cart_object.total_cost[currency]) - parseFloat(value)).toFixed(2);
      });
    };


    /*Bespoke attributes*/
    $scope.activate_bespoke_attribute = function (bespoke_attribute, index) {
      $scope.selected_bespoke_attribute = bespoke_attribute;
      $scope.selected_bespoke_attribute_index = index;
      $scope.show_attribute_sync_slide = false;
      $scope.show_attribute_sync_slide_at_bottom = false;
      if ($scope.showCustomNotesEdit && $scope.selected_bespoke_attribute.name.toLowerCase() === 'additional options') {
        $scope.showCustomNotes = true;
      }
    };
    $scope.activate_bespoke_attribute($scope.product['bespoke_attributes'][0]);

    var obj_keys = [];
    $scope.personalization_options = {};
    //activate and deactivate a bespoke style
    $scope.activate_bespoke_style = function (attr_type, style_object, index, style_name, attr_name) {
      Back_neck_band_height_Object(style_name);
      if (attr_type == 'customize') {
        $scope.showCustomNotes = false;
    // Check if the customer has deselected the option. 
    // If yes remove the option
    // If the style  has associated cost, remove it.
        if ($scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['value'] == style_name) {
          if (style_object.cost) {
            $scope.remove_personalization_cost(style_object.cost);
            delete $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name];
          }
          $scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['value'] = '';
          $scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['options'] = {};
          delete $scope["customization_attributes"][$scope.selected_bespoke_attribute.name];
        }
        else {
          if (!style_object.cost && $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]) {
            var attr_to_remove = $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][$scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['value']];
            if (attr_to_remove) {
              $scope.remove_personalization_cost(attr_to_remove['cost']);
            }
            delete $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][$scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['value']];
          };
          if (style_object.cost) {
            if ($scope.cart_object["personalization_attributes"] && !$scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]) {
              $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name] = {};
            }
            if ($scope.cart_object["personalization_attributes"] && $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]) {
              obj_keys = Object.keys($scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]);
              if (obj_keys.length) {
                $scope.remove_personalization_cost($scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][obj_keys[0]]['cost']);
                delete $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][obj_keys[0]];
                $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name] = {};
                $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]['cost'] = style_object.cost;
                $scope.add_personalization_cost(style_object.cost);
              }
              else {
                $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name] = {};
                $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]['cost'] = style_object.cost;
                $scope.add_personalization_cost(style_object.cost);
              }
            }
          }
          $scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['value'] = style_name;
          $scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['options'] = {};
          if (!angular.isObject($scope["customization_attributes"])) {
            $scope["customization_attributes"] = {};
          };
          if (angular.isObject($scope["customization_attributes"]) && !angular.isObject($scope["customization_attributes"][$scope.selected_bespoke_attribute.name])) {
            $scope["customization_attributes"][$scope.selected_bespoke_attribute.name] = {};
          };
          if (angular.isObject($scope["customization_attributes"]) && angular.isObject($scope["customization_attributes"][$scope.selected_bespoke_attribute.name]) && !angular.isObject($scope["customization_attributes"][$scope.selected_bespoke_attribute.name]["options"])) {
            $scope["customization_attributes"][$scope.selected_bespoke_attribute.name]['options'] = {};
          }
          angular.forEach(style_object, function (val, key) {
            if ($scope.check_unpermitted_customization_params($scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['value'], key)) {
              /*Change 15 March 2015 to set default*/
              $scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['options'][key] = angular.isObject(style_object[key]) ? style_object[key].default : style_object[key];
            }
          });
          $scope["customization_attributes"][$scope.selected_bespoke_attribute.name]['options'] = style_object;
        }
      }
      else if (attr_type == 'personalize') {
        $scope.showCustomNotes = false;
        if ($scope.selected_bespoke_attribute.name.toLowerCase() == 'monogram') {
          if (!$scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]) {
            $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name] = {};
            $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]['cost'] = $scope.selected_bespoke_attribute.value['Monogram']['cost']
            $scope.monogram_options = $scope.selected_bespoke_attribute.value;
            $scope.add_personalization_cost($scope.selected_bespoke_attribute.value['Monogram']['cost']);
          }
          else {
            $scope.remove_personalization_cost($scope.selected_bespoke_attribute.value['Monogram']['cost']);
            delete $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name];
          }
        }
        else {
          if (!$scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]) {
            $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name] = {};
          }
          if ($scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]) {
            $scope.remove_personalization_cost($scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]['cost']);
            delete $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name];
          }
          else {
            $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name] = {};
            $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]['cost'] = style_object.cost;
            if (style_object.hasOwnProperty('fabric')) {
              $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]['fabric'] = '';
            }
            $scope.add_personalization_cost(style_object.cost);
          }
        }
      }
      $scope.are_cart_objects_equal()//invoke object check for styles
      //This is to enable the custom notes
      if (style_name.toLowerCase() == 'custom notes') {
        $scope.showCustomNotes = true;
      }
      // This is enable appropirate green tick on the attribute name
      if (!$scope.selectedAtrributeListObj) {
        $scope.selectedAtrributeListObj = {};
      }
      if ($scope.selectedAtrributeListObj.hasOwnProperty(attr_name)) {
        //if($scope.selected_style.default_values.customization_attributes.hasOwnProperty(attr_name) && style_name === $scope.selected_style.default_values.customization_attributes[attr_name]) {
        if ($scope.selectedAtrributeListObj[attr_name].value === style_name) {
          delete $scope.selectedAtrributeListObj[attr_name];
        } else {
          $scope.selectedAtrributeListObj[attr_name].value = style_name;
        }
      } else {
        $scope.selectedAtrributeListObj[attr_name] = {
          name: attr_name,
          value: style_name
        }
      }
    };

    /*Bespoke attributes*/

    /*Load products*/
    // $scope.search_products_url = CustomerConstants.api.products+'/searchByName?name_cont=';

    $scope.generate_url_for_seach = function (attribute) {
      if (attribute && attribute.rule) {
        var query = "";
        angular.forEach(attribute.rule, function (rule_value, rule_key) {
          if (rule_key == 'cost') {
            query = query + "currency=USD&price_start=" + rule_value['USD']['min'] + "&price_end=" + rule_value['USD']['max'] + "&per_page=100&";
          }
          else {
            query = query + rule_key + "=" + rule_value + "&";
          }
        });
        return CustomerConstants.api.products + "/searchByName?" + query + "name=";
      }
      else {
        return CustomerConstants.api.products + '/searchByName?name=';
      }
    };

    $scope.select_contrast_product = function (product) {
      var path = this.$parent.$$childHead.id.split('#');
      $scope.cart_object[path[0]][path[1]][path[2]][path[3]] = product.title;
    };

    $scope.selected_fabric = function (data) {
    };

    $scope.format_data_for_search = function (data) {
    };

    $scope.monogram_options = {};
    $scope.add_remove_monogram = function (value) {
      if (value.selected) {
        $scope.monogram_options = $scope.selected_personalization_attribute.value;
        $scope.add_personalization_cost($scope.monogram_options['cost']);
      }
      else {
        $scope.remove_personalization_cost($scope.monogram_options.cost);
        $scope.monogram_options = {};
      }
    };

    $scope.checkIsArray = function (style_value) {
      if (angular.isArray(style_value)) {
        return true;
      }
      return false;
    };
    $scope.checkIsObject = function (style_value) {
      if (angular.isObject(style_value)) {
        return true;
      }
      return false;
    };

    $scope.selected_customization_attribute_index = 0;
    $scope.selected_customization_style_index = -1;
    $scope.selected_customization_attribute = $scope.product['customization_attributes'][0];
    $scope.activate_customization_attribute = function (customization_attribute, index) {
      $scope.selected_customization_attribute_index = index;
      $scope.selected_customization_style_index = -1;
      $scope.selected_customization_attribute = customization_attribute;
    };

    $scope.activate_customization_style = function (style_object, index, style_name) {
      if ($scope.selected_customization_style_index == index) {
        $scope.selected_customization_style_index = -1;
        $scope.cart_object["customization_attributes"][$scope.selected_customization_attribute.name]['value'] = '';
        $scope.cart_object["customization_attributes"][$scope.selected_customization_attribute.name]['options'] = {};
        delete $scope["customization_attributes"][$scope.selected_customization_attribute.name];
      }
      else {
        $scope.selected_customization_style_index = index;
        $scope.cart_object["customization_attributes"][$scope.selected_customization_attribute.name]['value'] = style_name;
        if (!angular.isObject($scope["customization_attributes"])) {
          $scope["customization_attributes"] = {};
        };
        if (angular.isObject($scope["customization_attributes"]) && !angular.isObject($scope["customization_attributes"][$scope.selected_customization_attribute.name])) {
          $scope["customization_attributes"][$scope.selected_customization_attribute.name] = {};
        };
        if (angular.isObject($scope["customization_attributes"]) && angular.isObject($scope["customization_attributes"][$scope.selected_customization_attribute.name]) && !angular.isObject($scope["customization_attributes"][$scope.selected_customization_attribute.name]["options"])) {
          $scope["customization_attributes"][$scope.selected_customization_attribute.name]['options'] = {};
        }
        angular.forEach(style_object, function (val, key) {
          if ($scope.check_unpermitted_customization_params($scope.cart_object["customization_attributes"][$scope.selected_customization_attribute.name]['value'], key)) {
            /*Change 15 March 2015 to set default*/
            $scope.cart_object["customization_attributes"][$scope.selected_customization_attribute.name]['options'][key] = angular.isObject(style_object[key]) ? style_object[key].default : style_object[key];
          }
        });
        $scope["customization_attributes"][$scope.selected_customization_attribute.name]['options'] = style_object;
      }
    };

    $scope.selected_personalization_attribute = $scope.product["personalization_attributes"][0];
    $scope.selected_personalization_attribute_index = 0;
    $scope.activate_personalization_attribute = function (personalization_attribute, index) {
      $scope.selected_personalization_attribute_index = index;
      $scope.selected_personalization_attribute = personalization_attribute;
    }

  }])

  .controller('SearchFabricController', function ($scope, ImageHandler) {
    $scope.getImage = function (url) {
      return ImageHandler.url(url);
    };
  })

  .controller('SummaryController', ['$scope', 'product', 'cart_object', 'base_style', '$uibModalInstance', 'summary_type', 'selected_measurement_id', 'selected_measurement_unit', 'CustomerUtils', 'selected_currency', 'ProductType', function ($scope, product, cart_object, base_style, $uibModalInstance, summary_type, selected_measurement_id, selected_measurement_unit, CustomerUtils, selected_currency, ProductType) {
    $scope.product = product;
    $scope.cart_object = cart_object;
    $scope.base_style = base_style;
    $scope.summary_type = summary_type;
    $scope.selected_measurement_id = selected_measurement_id;
    $scope.selected_measurement_unit = selected_measurement_unit;
    $scope.currency_symbols = CustomerUtils.get_currency_with_symbol;
    $scope.ProductType = {
      shirts: ProductType.shirts(),
      pants: ProductType.pants()
    }
    $scope.selected_currency = selected_currency;
    var product_type = product.product_type.product_type;
    $scope.measurement_types = [
      {
        id: 1,
        header: "Standard",
        sub_header: "Choose from standard sizes"
      },
      {
        id: 2,
        header: "Custom",
        sub_header: "Customize your fit types"
      },
      {
        id: 3,
        header: "Body Measurements",
        sub_header: "Provide your exact body measurements for the perfect fit type"
      },
      {
        id: 4,
        header: "Send " + product_type + " Sample",
        sub_header: "Send us your " + product_type + " sample to exactly replicate or modify"
      }
    ];
    $scope.summary_bespoke_attributes = cart_object['customization_attributes'];
    angular.forEach(cart_object['personalization_attributes'], function (val, key) {
      $scope.summary_bespoke_attributes[key] = val;
    });
    $scope.total_customizable_attributes = [];
    angular.forEach($scope.summary_bespoke_attributes, function (val, key) {
      if (val.value && val.options && val.value !== '') {
        $scope.total_customizable_attributes.push({ name: key, value: val.value, options: val.options });
      }
      else if ((val.value && val.options && val.value == '') || (!val.value && !val.options)) {//for personalisation
        if (key.toLowerCase() !== 'monogram') {
          angular.forEach(val, function (v, k) {
            $scope.total_customizable_attributes.push({ name: key, value: k, options: v, cost: v.cost });
          })
        }
        else {
          $scope.total_customizable_attributes.push({ name: key, value: 'Monogram', options: val, cost: val.cost });
        }
      }
    });
    $scope.view_measurements = {
      templateUrl: 'view_measurements_popover.html'
    };
    $scope.attr_options_key_length = function (options_obj) {
      if (options_obj && angular.isObject(options_obj)) {
        return Object.keys(options_obj).length;
      }
      else {
        return 0;
      }
    };
    $scope.std_attrs_length = 0;
    $scope.body_attrs_length = 0;
    $scope.filter_attr = function (type, attrs) {
      angular.forEach(attrs, function (val, key) {
        if (!attrs[key]) {
          delete attrs[key];
        }
      })
      $scope[type + '_length'] = Object.keys(attrs).length;
      return attrs;
    }

    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }])
  .controller('EnlargedProductImageController', ['$scope', 'product', '$uibModalInstance', 'ImageHandler', function ($scope, product, $uibModalInstance, ImageHandler) {
    $scope.product = product;
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    $scope.getImage = function (url) {
      return ImageHandler.url(url);
    };
  }])

