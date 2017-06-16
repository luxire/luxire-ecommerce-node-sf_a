angular.module('luxire')
.controller('SearchController', function($scope, CustomerProducts, CustomerConstants, CustomerOrders, $uibModal, $rootScope, ImageHandler, $state, products, $stateParams, $location, $cacheFactory, CustomerUtils, $timeout){
  console.log('state params', $stateParams);
  $scope.reverse_price = false;//predicate for sorting products by price
  var filter_mapping = {
    'color': {
      'display_name': 'COLOR',
      'db_column_name': 'color'
    },
    'price': {
      'display_name': 'PRICE',
      'db_column_name': 'display_price'
    },
    'weave-type': {
      'display_name': 'WEAVE TYPE',
      'db_column_name': 'weave_type'
    },
    'pattern': {
      'display_name': 'PATTERN',
      'db_column_name': 'pattern'
    },
    'wrinkle-resistant': {
      'display_name': 'WRINKLE RESISTANCE',
      'db_column_name': 'wrinkle_resistance'
    },
    'thickness': {
      'display_name': 'THICKNESS',
      'db_column_name': 'thickness'
    },
    'construction': {
      'display_name': 'CONSTRUCTION',
      'db_column_name': 'construction'
    },
    'Number-of-Colors': {
      'display_name': 'No of Colors',
      'db_column_name': 'no_of_color'
    },
    'collection_name': {
      'display_name': 'collection',
      'db_column_name': 'taxonomy'
    }
  };
  $scope.selected_redis_filters = {
    sort: 'asc',
    page: 1,
    name: $stateParams.name_cont,
    price_start: $scope.price_start,
    price_end: $scope.price_end,
  };

  /*filters reflecting in url*/    /**generating url with filters**/
  var generate_url_for_filters = function(selected_filters){
    /*To handle situation of changing price filter*/
    // $scope.selected_filters.currency = CustomerUtils.get_local_currency_in_app();
    /*To handle situation of changing price filter*/
    $state.go('customer.search', $scope.selected_filters);
  };

  function read_filters_from_url(property){ //set values in view
    return $stateParams[property];
  };

  function filter_by_url(selected_filters){
    $scope.allProductsData=[];
    $scope.selected_redis_filters.page = 1;
    angular.forEach(selected_filters, function(val, key){
      if(filter_mapping[key] && val && val !== 'all'){
        $scope.selected_redis_filters[filter_mapping[key]['db_column_name']] = val;
      }
    });
    if(read_filters_from_url("price_sort")){
      $scope.reverse_price = read_filters_from_url("price_sort") == "desc" ? true : false;//predicate for sorting products by price
      $scope.selected_redis_filters["sort"] = read_filters_from_url("price_sort");
    }
    if((read_filters_from_url("price_start") || read_filters_from_url("price_start")==0) && read_filters_from_url("price_end") && read_filters_from_url("currency")){
      $scope.selected_redis_filters["price_start"] = read_filters_from_url("price_start");
      $scope.selected_redis_filters["price_end"] = read_filters_from_url("price_end");
      $scope.selected_redis_filters["currency"] = read_filters_from_url("currency");
    }
    /*To handle situation of changing price filter*/
    $scope.selected_filters.currency = read_filters_from_url("currency") || CustomerUtils.get_local_currency_in_app();
    /*To handle situation of changing price filter*/
    load_products();
  };

  $scope.get_subheader_top_margin = function(){
    return $(".customer-main-nav-header").innerHeight() + 'px';

  };
  $(window).resize(function(){
      $timeout(function(){}, 0);
  });

  $scope.selected_filters = {}; //for DOM Manipulation
  $scope.filter_properties = [];
  var filter_index = '';
    //weight, brand & material removed, thickness needs to be added in properties
  var required_filters = ['color', 'price', 'weave-type',  'pattern', 'wrinkle-resistant', 'thickness', 'construction', 'Number-of-Colors'];//filter name in properties
  var filter_display_names = ['COLOR', 'PRICE', 'WEAVE TYPE', 'PATTERN', 'WRINKLE RESISTANCE', 'THICKNESS', 'CONSTRUCTION','No of Colors']; //filter display name in ui
  var filter_db_column_names = ['color', 'display_price', 'weave_type', 'pattern', 'wrinkle_resistance', 'thickness','construction', 'no_of_color']; //filter name as db column



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
    green: {
      primary: '#005200',
      secondary: '#69BF26',
      display_color: '#68BD26'
    },
    orange: {
      primary: '#613309',
      secondary: '#F36524',
      display_color: '#613309'
    },
    brown: {
      primary: '',
      secondary: '',
      display_color: 'brown'
    }
  };


  $scope.loading_filters = true;
  CustomerProducts.filter_properties()
  .then(function(data){
    console.log('filters', data.data);
    angular.forEach(data.data, function(val, key){
      filter_index = required_filters.indexOf(val.name);
      if(filter_index != -1){
        $scope.selected_filters[val.name] = read_filters_from_url(val.name) || 'all';
        val.display_name = filter_display_names[filter_index];
        val.db_name = filter_db_column_names[filter_index];
        val.value = 'all,'+val.value; //available option for filters
        $scope.filter_properties.push(val);
      }
    });
    filter_by_url($scope.selected_filters);
    $scope.loading_filters = false;
  }, function(error){
    console.error(error);
    $scope.loading_filters = false;
  });

  $scope.allProductsData=[];




  var load_products = function(){
    $scope.loading_products = true;
    if($scope.selected_redis_filters["wrinkle_resistance"]){
      $scope.selected_redis_filters["wrinkle_resistance"] = "True";
    }
    CustomerProducts.search_products_in_redis($scope.selected_redis_filters)
    .then(function(data){
      $scope.loading_products = false;
      $scope.total_collection_pages = data.data.pages;
      $scope.taxonomy_counts = data.data.taxonomies;
      $scope.allProductsData = $scope.allProductsData.concat(data.data.products);
      if(!$scope.allProductsData.length && $rootScope.alerts.length !== 1){
        $rootScope.alerts.push({type: 'warning', message: 'No products found!'});
      }
      $scope.busy = false;
    }, function(error){
      $scope.loading_products = false;
      console.error(error);
    });
    $scope.selected_redis_filters.page++;// Moved out of sucess block to resolve product duplication

  };

    $scope.busy = false;
  /*Redis caching mechanism*/
    $scope.load_more = function(){
      if(!$scope.busy && $scope.selected_redis_filters.page<=$scope.total_collection_pages){
         $scope.busy = true;
         load_products();
      }
    };
  /**/

  /*Multi currency support*/
  $scope.currency_symbols = function(val ,currency){
    if(currency == "INR"){
      return '&#8377;'+val;
    }
    else if(currency == "USD"){
      return '&#36;'+val;
    }
    else if(currency == "EUR"){
      return '&euro;'+val;
    }
    else if(currency == "SGD"){
      return '&#36;'+val;
    }
    else if(currency == "AUD"){
      return '&#36;'+val;//$
    }
    else if(currency == "SEK"){
      return val+' kr';
    }
    else if(currency == "DKK"){
      return val+' kr';
    }
    else if(currency == "CHF"){
      return 'CHF'+val;
    }
    else if(currency == "NOK"){
      return val+' kr';
    }
    else if(currency == "GBP"){
      return '&pound;'+val;
    }
    else if(currency == "CAD"){
      return '&#36;'+val;
    }
  };

  /*Redis caching mechanism*/
  $scope.sort_by_price = function(is_desc){
    $scope.reverse_price = is_desc;
    var price_sort_order = is_desc === true ? 'desc' : 'asc';
    $scope.selected_redis_filters.sort = price_sort_order;
    $scope.selected_filters.price_sort = price_sort_order;
    $scope.selected_redis_filters.page = 1;
    $scope.allProductsData = [];
    generate_url_for_filters($scope.selected_filters);
    // load_products();

    $('html, body').animate({ scrollTop: 0}, 500);
  };

  $scope.filter_by_price = function(price_start, price_end, currency){
    $scope.allProductsData = [];
    $scope.selected_redis_filters.price_start = price_start;
    $scope.selected_redis_filters.price_end = price_end;
    $scope.selected_redis_filters.page = 1;
    $scope.selected_redis_filters.currency = currency;
    /*To handle situation of changing price filter*/
    $scope.selected_filters.currency = currency;
    $scope.selected_filters.price_start = price_start;
    $scope.selected_filters.price_end = price_end;
    /*To handle situation of changing price filter*/

    console.log('filter by price load products');
    generate_url_for_filters($scope.selected_filters);
    // load_products();
  }
  /**/

  function init_slider(floor, ceil, currency, low, high){
    $("#priceSlider").remove();
    $scope.slider = {
      low_value: isNaN(low) ? floor : low,
      high_value: isNaN(high) ? ceil : high,
      options: {
        floor: isNaN(floor) ? 0 : floor,
        ceil: isNaN(ceil) ? 10000 : ceil,
        step: 10,
        translate: function(value) {
          return $scope.currency_symbols(value, currency);
        },
        noSwitching: true,
        getPointerColor: function(value){
            return '#DD9FDF'
        },
        onEnd: function(sliderId, modelValue, highValue, pointerType){
          console.log('min', modelValue, 'max', highValue);
          $scope.filter_by_price(modelValue, highValue, currency)
        }
      }
    };
  };
  function init_price_range_sliders(currency){
    var one_to_one_currencies = ["USD", "CHF", "EUR", "GBP", "CAD"];
    var one_to_two_currencies = ["AUD", "SGD"];
    var one_to_ten_currencies = ["NOK", "DKK", "SEK"];
    if(currency == read_filters_from_url("currency")){
      if(one_to_one_currencies.indexOf(currency) != -1){
        init_slider(0, 500, currency, read_filters_from_url("price_start"), read_filters_from_url("price_end"));
      }
      else if(one_to_two_currencies.indexOf(currency) != -1){
        init_slider(0, 10000, currency, read_filters_from_url("price_start"), read_filters_from_url("price_end"));
      }
      else if(one_to_ten_currencies.indexOf(currency) != -1){
        init_slider(0,100000, currency, read_filters_from_url("price_start"), read_filters_from_url("price_end"));
      }
      else if(currency == "INR"){
        init_slider(0,100000, currency, read_filters_from_url("price_start"), read_filters_from_url("price_end"));
      }
    }
    else{
      if(one_to_one_currencies.indexOf(currency) != -1){
        init_slider(0, 500, currency);
      }
      else if(one_to_two_currencies.indexOf(currency) != -1){
        init_slider(0, 10000, currency);
      }
      else if(one_to_ten_currencies.indexOf(currency) != -1){
        init_slider(0,100000, currency);
      }
      else if(currency == "INR"){
        init_slider(0,100000, currency);
      }
    }

  };

  $scope.selected_currency = CustomerUtils.get_local_currency_in_app();
  init_price_range_sliders($scope.selected_currency);
  $scope.$on('currency_change', function(event, data){
    if($scope.selected_currency){
      $scope.selected_filters.price_start = null;
      $scope.selected_filters.price_end = null;
      $scope.selected_filters.currency = CustomerUtils.get_local_currency_in_app();
      $scope.select_filter_option('price', 'all', 'display_price');
    }
    $scope.selected_currency = data;
    $scope.selected_redis_filters.currency = $scope.selected_currency;
    init_price_range_sliders($scope.selected_currency);
  });


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
          // $scope.selected_redis_filters.page = 1;
          // $scope.allProductsData = [];
          // console.log('load products test - all prices');
          // load_products();// fixing duplicates
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
    // console.log('selected filters', btoa(angular.toJson($scope.selected_filters)));
    console.log('selected filters', $scope.selected_filters);

    console.log('output to redis', $scope.selected_redis_filters);


    generate_url_for_filters($scope.selected_filters);

    // load_products();

  };


  /*Filters-end*/

  $rootScope.$on('fetched_order_from_cookie', function(event, data){
    console.log('event fired', data);
  });
  /*Filters from redis*/

  /*Redis Filters-start*/
  $scope.allProductsData=[];
  /*Redis Filter-end*/




  $scope.go_to_product_detail = function(product_name){
    $state.go('customer.product_detail',{taxonomy_name: $scope.selected_taxonomy_name,taxon_name: $scope.selected_taxon_name,product_name: product_name});
  };

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  }

  $scope.help_template = {
    weight_url: 'weight-help.html',
    thickness_url: 'thickness-help.html',
    stiffness_url: 'stiffness-help.html'
  };
  $scope.weight_help_texts = {
    "shirts": [
      {
        id: 1,
        label: '< 50 gsm'
      },{
        id: 2,
        label: '50-60 gsm'
      },{
        id: 3,
        label: '60-70 gsm'
      },{
        id: 4,
        label: '70-80 gsm'
      },{
        id: 5,
        label: '80-90 gsm'
      },{
        id: 6,
        label: '90-100 gsm'
      },{
        id: 7,
        label: '100-110 gsm'
      },{
        id: 8,
        label: '110-120 gsm'
      },{
        id: 9,
        label: '120-130 gsm'
      },{
        id: 10,
        label: '130-140 gsm'
      },{
        id: 11,
        label: '140-150 gsm'
      },{
        id: 12,
        label: '150< gsm'
      }
    ],
    "pants": [
      {
        id: 1,
        label: '< 150 gsm'
      },{
        id: 2,
        label: '150-185 gsm'
      },{
        id: 3,
        label: '185-220 gsm'
      },{
        id: 4,
        label: '220-255 gsm'
      },{
        id: 5,
        label: '255-290 gsm'
      },{
        id: 6,
        label: '290-325 gsm'
      },{
        id: 7,
        label: '325-360 gsm'
      },{
        id: 8,
        label: '360-395 gsm'
      },{
        id: 9,
        label: '395-430 gsm'
      },{
        id: 10,
        label: '430-465 gsm'
      },{
        id: 11,
        label: '465-500 gsm'
      },{
        id: 12,
        label: '500< gsm'
      }
    ]


  }

  $scope.thickness_help_texts = [
    {
      label: '0-0.10'
    },
    {
      label: '0.10-0.20'
    },
    {
      label: '0.20-0.30'
    },
    {
      label: '0.30-0.40'
    },
    {
      label: '0.40-0.50'
    },
    {
      label: '0.50<'
    }

  ];

  $scope.stiffness_help_texts = [
    {
      label: '0.00-1.25'
    },
    {
      label: '1.25-2.50'
    },
    {
      label: '2.50-3.75'
    },
    {
      label: '3.75-5.00'
    },
    {
      label: '5.00-6.25'
    },
    {
      label: '6.25-7.50'
    },
    {
      label: '7.50-8.75'
    },
    {
      label: '8.75-10.00'
    }
  ];

  var weight_indexes_ref = {
    shirts: {
      min: 50,
      max: 150,
      step: 10//150/12
    },
    pants: {
      min: 150,
      max: 500,
      step: 35 //(500-150)/10
    }
  };

  /*Get weight icon*/
  var min_weight = 0;
  var max_weight = 0;
  $scope.weight_index = function(variant_weight, product_type){
    product_type = product_type.toLowerCase();
    if(product_type && product_type.indexOf('pant') !== -1){
      min_weight = weight_indexes_ref['pants']['min'];
      max_weight = weight_indexes_ref['pants']['max'];
      step = weight_indexes_ref['pants']['step'];
    }
    else if(product_type && product_type.indexOf('pant') == -1){
      min_weight = weight_indexes_ref['shirts']['min'];
      max_weight = weight_indexes_ref['shirts']['max'];
      step = weight_indexes_ref['shirts']['step'];
    };


    if((parseFloat(variant_weight))<min_weight){
      return 1;
    }
    else if((parseFloat(variant_weight))>max_weight){
      return 12;
    }
    else{
      return parseInt(Math.ceil((parseFloat(variant_weight)-min_weight)/step))+1;
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
    else if(variant_stiffness == 0.0){
      return 1;
    }
    else{


      return Math.ceil(variant_stiffness/1.25);
    }

  };


  $scope.order_swatch = function(variant){
    console.log(variant);
    $scope.loading_products = true;
    if($rootScope.luxire_cart && $rootScope.luxire_cart.line_items){
      CustomerOrders.add_line_item($rootScope.luxire_cart, {}, variant)
      .then(function(data){
        CustomerOrders.get_order_by_id($rootScope.luxire_cart).then(function(data){
          $rootScope.luxire_cart = data.data;
          $scope.loading_products = false;
          // $state.go('customer.cart');
          $rootScope.alerts.push({type: 'success', message: 'Item added to cart'});
          // $state.go('customer.pre_cart');
        }, function(error){
          $scope.loading_products = false;
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
        $scope.loading_products = false;
        // $state.go('customer.cart');
        $rootScope.alerts.push({type: 'success', message: 'Item added to cart'});
        // $state.go('customer.pre_cart');
        console.log(data);
      },function(error){
        $scope.loading_products = false;
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
