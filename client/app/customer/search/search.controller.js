angular.module('luxire')
.controller('SearchController', function($scope, CustomerProducts, CustomerConstants, CustomerOrders, $uibModal, $rootScope, ImageHandler, $state, products, $stateParams, $location, $cacheFactory, CustomerUtils){

  /*Filters-start*/
  /*filters*/
  $scope.selected_filters = {}; //for DOM Manipulation
  $scope.filter_properties = [];
  var filter_index = '';
  //weight, brand & material removed, thickness needs to be added in properties
  var required_filters = ['color', 'price', 'weave-type',  'pattern', 'wrinkle-resistant', 'thickness', 'transparency', 'construction', 'No of Colors'];
  var filter_display_names = ['COLOR', 'PRICE', 'WEAVE TYPE', 'PATTERN', 'WRINKLE RESISTANCE', 'THICKNESS', 'TRANSPARENCY', 'CONSTRUCTION','No of Colors'];
  var filter_db_column_names = ['color', 'display_price', 'weave_type', 'pattern', 'wrinkle_resistance', 'thickness', 'transparency', 'construction', 'no_of_color'];

  $scope.color_variants = {
    white: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
      display_color: '#FFFFFF'
    },
    pink: {
      primary: '#5C0091',
      secondary: '#FE26A1',
      display_color: '#FC26A0'
    },
    blue: {
      primary: '#001683',
      secondary: '#00A7FF',
      display_color: '#00A6FD'

    },
    black: {
      primary: '#000000',
      secondary: '#4F5054',
      display_color: '#000000'
    },
    red: {
      primary: '#880000',
      secondary: '#FE0000',
      display_color: '#FC0000'
    },
    yellow: {
      primary: '#FFF300',
      secondary: '#FEDF85',
      display_color: '#FDF100'
    },
    green: {
      primary: '#005200',
      secondary: '#69BF26',
      display_color: '#68BD26'
    },
    orange: {
      primary: '#613309',
      secondary: '#F36524',
      display_color: '#613309'

    }
  };

  $scope.loading_filters = true;
  CustomerProducts.filter_properties()
  .then(function(data){
    console.log('Filter Properties', data.data);
    angular.forEach(data.data, function(val, key){
      filter_index = required_filters.indexOf(val.name);
      if(filter_index != -1){
        $scope.selected_filters[val.name] = 'all';
        val.display_name = filter_display_names[filter_index];
        val.db_name = filter_db_column_names[filter_index];
        val.value = 'all,'+val.value; //available option for filters
        $scope.filter_properties.push(val);
      }
    });
    $scope.loading_filters = false;
  }, function(error){
    console.error(error);
    $scope.loading_filters = false;
  });

  $scope.selected_redis_filters = {
    sort: 'asc',
    page: 1,
    name: $stateParams.name_cont,
    price_start: $scope.price_start,
    price_end: $scope.price_end,
  };

  var price_range = function(price_string){
    var range = price_string.split(',');
    var prices = [];
    var total_range = [];
    for(var i=0;i<range.length;i++){
      if(range[i].indexOf(' - ')!==-1){
        prices.push(parseFloat(range[i].toLowerCase().split(' - ')[0].split('$')[1]));
        prices.push(parseFloat(range[i].toLowerCase().split(' - ')[1].split('$')[1]));
      }
      else{
        if(range[i].toLowerCase().indexOf('under')!==-1){
          prices.push(0);
          prices.push(parseFloat(range[i].toLowerCase().split('under ')[1].split('$')[1]));
        }
        if(range[i].toLowerCase().indexOf('over')!==-1){
          prices.push(9999);
          prices.push(parseFloat(range[i].toLowerCase().split('over ')[1].split('$')[1]));
        }
      }
    }
    total_range.push(Math.min.apply(null, prices));
    total_range.push(Math.max.apply(null, prices));
    return total_range.toString();
  }
  $scope.select_filter_option = function(property, option, db_field){
    console.log('property', property, 'option', option, 'db_field', db_field);
    if(!$scope.selected_filters[property] || option === 'all'){
      $scope.selected_filters[property] = option;
      /*For redis post*/
      if(option !== 'all'){
        if(property !== 'price'){
          $scope.selected_redis_filters[db_field] = option;
        }
        else{
          // $scope.selected_redis_filters[db_field] = price_range(option);
        }
      }
      else if($scope.selected_filters[property] && option === 'all'){
        delete $scope.selected_redis_filters[db_field];
        if(property == 'price'){
          $scope.selected_redis_filters.page = 1;
          $scope.allProductsData = [];
          load_products();
        }
      }
      /*For redis post*/
    }
    else{
      var selected_filters_arr = $scope.selected_filters[property].split(',');
      if(selected_filters_arr.indexOf('all')!==-1){
        selected_filters_arr.splice(selected_filters_arr.indexOf('all'), 1);
        $scope.selected_filters[property] = selected_filters_arr.toString();
      }
      if(selected_filters_arr.indexOf(option)!==-1){
        selected_filters_arr.splice(selected_filters_arr.indexOf(option), 1);
        $scope.selected_filters[property] = selected_filters_arr.toString();
        $scope.selected_filters[property] = $scope.selected_filters[property] === "" ? "all" : $scope.selected_filters[property];
      }
      else{
        $scope.selected_filters[property] = $scope.selected_filters[property] === "" ? option : $scope.selected_filters[property]+','+option;
      }
      /*For redis post*/
      if($scope.selected_filters[property] === "" || $scope.selected_filters[property] === "all"){
        if($scope.selected_redis_filters[db_field]){
          delete $scope.selected_redis_filters[db_field];
        }
      }
      else{
        if(property !== 'price'){
          $scope.selected_redis_filters[db_field] = $scope.selected_filters[property];
        }
        else{
          // $scope.selected_redis_filters[db_field] = price_range($scope.selected_filters[property]);
        }
      }
    }
    $scope.allProductsData=[];
    $scope.selected_redis_filters.page = 1;
    console.log('selected filters', $scope.selected_filters);
    console.log('output to redis', $scope.selected_redis_filters);

    load_products();

  };

  $scope.reverse_price = false;//predicate for sorting products by price

  /*Filters-end*/

  /*Redis Filters-start*/
  $scope.allProductsData=[];
  $scope.total_collection_pages = 1;


  /*Redis caching mechanism*/
    var active_res_page = 1;
    $scope.sort_by_price = function(is_desc){
      $scope.reverse_price = is_desc;
      var price_sort_order = is_desc === true ? 'desc' : 'asc';
      $scope.selected_redis_filters.sort = price_sort_order;
      $scope.selected_redis_filters.page = 1;
      $scope.allProductsData = [];
      load_products();
      $('html, body').animate({ scrollTop: 0}, 500);
    };

    $scope.filter_by_price = function(price_start, price_end){
      $scope.allProductsData = [];
      $scope.selected_redis_filters.price_start = price_start;
      $scope.selected_redis_filters.price_end = price_end;
      $scope.selected_redis_filters.page = 1;

      load_products();
    }
  /**/

  /*Redis Filter-end*/

  console.log('state params', $stateParams);
  $scope.non_fabric_taxonomies = ["accessories", "bags", "shoes", "gift-cards"];


  $scope.get_taxonomy_details = function(permalink){
    if(permalink){
      var active_taxonomy = permalink.indexOf('/') > -1? permalink.split('/')[0] : permalink;
      return {
        is_fabric_taxonomy: $scope.non_fabric_taxonomies.indexOf(active_taxonomy)===-1 ? true : false,
        is_gift_card: active_taxonomy.toLowerCase() === "gift-cards" ? true : false
      };
    }


  };

    /*Multi currency support*/
  $scope.selected_currency = CustomerUtils.get_local_currency_in_app();
  $scope.selected_redis_filters.currency = $scope.selected_currency;
  $scope.$on('currency_change', function(event, data){
    console.log('currency changed', data)
    $scope.selected_currency = data;
    $scope.selected_redis_filters.currency = $scope.selected_currency;
  });


  window.scrollTo(0, 0);
  $('[data-toggle="tooltip"]').tooltip();
  $scope.stateParams = $stateParams;


  $scope.reverse_price = false;//predicate for sorting products by price

  $rootScope.$on('fetched_order_from_cookie', function(event, data){
    console.log('event fired', data);
  });

  $scope.allProductsData=[];

  var load_products = function(){
    $scope.loading_products = true;
    console.log('filters before post', $scope.selected_redis_filters);
    CustomerProducts.search_products_in_redis($scope.selected_redis_filters)
    .then(function(data){
      $scope.loading_products = false;
      $scope.total_collection_pages = data.data.pages;
      $scope.taxonomy_counts = data.data.taxonomies;
      console.log('fetched products', data.data);
      $scope.allProductsData = $scope.allProductsData.concat(data.data.products);
    }, function(error){
      $scope.loading_products = false;
      console.error(error);
    });
    $scope.selected_redis_filters.page++;// Moved out of sucess block to resolve product duplication
  };



  /*Redis caching mechanism*/
    $scope.total_collection_pages = 1;
    $scope.load_more = function(){
      console.log('load more');
      console.log('total pages', $scope.total_collection_pages);
      if($scope.selected_redis_filters.page == 1 || $scope.selected_redis_filters.page<=$scope.total_collection_pages){
        load_products();
      }
      console.log('scrolling');
    };

  /**/





  $scope.go_to_product_detail = function(product_name){
    $state.go('customer.product_detail',{taxonomy_name: $scope.selected_taxonomy_name,taxon_name: $scope.selected_taxon_name,product_name: product_name});
  };

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  }

  /*Get weight icon*/
  $scope.weight_index = function(variant_weight){

    if((parseFloat(variant_weight)-50)<0){
      return 1;
    }
    else if((parseFloat(variant_weight)-50)>150){
      return 12;
    }
    else{
      return parseInt((parseFloat(variant_weight)-50)/12.5)+1;
    };
  };
  var thickness = 0;
  /*Get Thickness icon*/
  $scope.thickness_index = function(variant_thickness){
    if(variant_thickness != undefined){
      thickness = parseInt(variant_thickness.split('.')[1].split('mm')[0]);
      if(thickness/10 >5){
        return 6;
      }
      else {
        return Math.ceil(thickness/10);
      }
    }

  };
  /*Get stiffness icon*/
  $scope.stiffness_index = function(variant_stiffness, stiffness_unit){
    if(stiffness_unit=='m'){
      variant_stiffness = parseFloat(variant_stiffness)*100;
    }
    else if(stiffness_unit=='cm'){
      variant_stiffness = parseFloat(variant_stiffness);
    }

    if(variant_stiffness/1.25 >8){
      return 8;
    }
    else{


      return Math.ceil(variant_stiffness/1.25);
    }

  };

  $scope.order_swatch = function(variant){
    console.log(variant);
    if($rootScope.luxire_cart && $rootScope.luxire_cart.line_items){
      CustomerOrders.add_line_item($rootScope.luxire_cart, {}, variant)
      .then(function(data){
        CustomerOrders.get_order_by_id($rootScope.luxire_cart).then(function(data){
          $rootScope.luxire_cart = data.data;
          // $state.go('customer.cart');
          $rootScope.alerts.push({type: 'success', message: 'Item added to cart'});
          $state.go('customer.pre_cart');
        }, function(error){
          console.error(error);
        });
        console.log(data);
      },function(error){
        console.error(error);
      });
    }
    else{
      CustomerOrders.create_order({}, variant, false)
      .then(function(data){
        $rootScope.luxire_cart = data.data;
        // $state.go('customer.cart');
        $rootScope.alerts.push({type: 'success', message: 'Item added to cart'});
        $state.go('customer.pre_cart');
        console.log(data);
      },function(error){
        console.error(error);
      });
    }

  };

 //******** start of quick view **********


    $scope.animationsEnabled = true;
    $scope.showQuickView=function(product, size){
      console.log("quick view fun is calling...");
      console.log("product: ",product);
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'quickViewContent.html',
        controller: 'quickViewModalController',
        windowClass: 'quick-view-modal',
        //size: size,
        resolve: {
          product: function () {
            return product;
          },
          is_fabric_taxonomy: function(){
            return $scope.get_taxonomy_details(product.taxons[0].permalink).is_fabric_taxonomy;
          },
          is_gift_card: function(){
            return $scope.get_taxonomy_details(product.taxons[0].permalink).is_gift_card;
          },
          selected_currency: function(){
            return $scope.selected_currency;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
        console.log("modal return value is : ",selectedItem);
      }, function () {
        console.info('Modal dismissed at: ' + new Date());
      });

    }


   //******** end of quick view **********
})
