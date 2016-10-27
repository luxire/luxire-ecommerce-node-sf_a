angular.module('luxire')
.controller('CollectionController', function($scope, CustomerProducts, CustomerConstants, CustomerOrders, $uibModal, $rootScope, ImageHandler, $state, products, $stateParams, $location, $cacheFactory, CustomerUtils){


  $scope.active_permalink = $location.url().split('/collections/')[1];
  console.log('active_permalink', $scope.active_permalink);
  $scope.active_taxonomy = $scope.active_permalink.indexOf('/') > -1? $scope.active_permalink.split('/')[0] : $scope.active_permalink;
  $scope.non_fabric_taxonomies = ["accessories", "bags", "shoes", "gift-cards"];
  $scope.is_fabric_taxonomy = $scope.non_fabric_taxonomies.indexOf($scope.active_taxonomy)===-1 ? true : false;
  $scope.is_gift_card = $scope.active_taxonomy.toLowerCase() === "gift-cards" ? true : false;
  /*Max permalink array length =2*/
  if($scope.active_permalink != ""){
    $scope.collection_bread_crumbs = [];
    var permalink_array = $scope.active_permalink.split('/');
    var effective_permalink = "";
    for(var i=0; i<permalink_array.length;i++){
      effective_permalink = i? effective_permalink + "/" + permalink_array[i] : permalink_array[i];
      $scope.collection_bread_crumbs.push({
        name: permalink_array[i],
        permalink: effective_permalink
      });
    }
  };
  $scope.go_to_collection = function(permalink){
    $location.url('/collections/'+permalink);
  };
  window.scrollTo(0, 0);
  $('[data-toggle="tooltip"]').tooltip();
  $scope.stateParams = $stateParams;

  /*Filters-start*/
  /*filters*/
  $scope.selected_filters = {}; //for DOM Manipulation
  $scope.filter_properties = [];
  var filter_index = '';
  //weight, brand & material removed, thickness needs to be added in properties
  var required_filters = ['color', 'price', 'weave-type',  'pattern', 'wrinkle-resistant', 'thickness', 'construction', 'No of Colors'];
  var filter_display_names = ['COLOR', 'PRICE', 'WEAVE TYPE', 'PATTERN', 'WRINKLE RESISTANCE', 'THICKNESS', 'CONSTRUCTION','No of Colors'];
  var filter_db_column_names = ['color', 'display_price', 'weave_type', 'pattern', 'wrinkle_resistance', 'thickness','construction', 'no_of_color'];

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

  $scope.allProductsData=[];

  $scope.reverse_price = false;//predicate for sorting products by price


  var load_products = function(){
    $scope.loading_products = true;
    console.log('filters before post', $scope.selected_redis_filters);
    if($scope.selected_redis_filters["wrinkle_resistance"]){
      $scope.selected_redis_filters["wrinkle_resistance"] = "True";
    }
    CustomerProducts.search_products_in_redis($scope.selected_redis_filters)
    .then(function(data){
      $scope.loading_products = false;
      $scope.total_collection_pages = data.data.pages;
      $scope.taxonomy_counts = data.data.taxonomies;
      console.log('fetched products', data.data);
      $scope.allProductsData = $scope.allProductsData.concat(data.data.products);
      if(!$scope.allProductsData.length && $rootScope.alerts.length !== 1){
        $rootScope.alerts.push({type: 'warning', message: 'No products found!'});
      }
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


  $scope.selected_redis_filters = {
    sort: 'asc',
    page: 1,
    taxonomy: $scope.active_permalink,
    price_start: $scope.price_start,
    price_end: $scope.price_end,
    currency: CustomerUtils.get_local_currency_in_app()
  };

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
      $scope.selected_redis_filters.page = 1;
      $scope.allProductsData = [];
      console.log('sort by price load products');
      load_products();
      $('html, body').animate({ scrollTop: 0}, 500);
    };

    $scope.filter_by_price = function(price_start, price_end, currency){
      $scope.allProductsData = [];
      $scope.selected_redis_filters.price_start = price_start;
      $scope.selected_redis_filters.price_end = price_end;
      $scope.selected_redis_filters.page = 1;
      $scope.selected_redis_filters.currency = currency;
      console.log('filter by price load products');
      load_products();
    }
  /**/

  function init_slider(low, high, currency){
    console.log('low', low, 'high', high, 'currency', currency);
    // $scope.filter_by_price(low, high, currency);
    $("#priceSlider").remove();
    $scope.slider = {
      low_value: isNaN(low) ? 0 : low,
      high_value: isNaN(high) ? 10000 : high,
      options: {
        floor: isNaN(low) ? 0 : low,
        ceil: isNaN(high) ? 10000 : high,
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
    console.log('currency changed init', currency);
    var one_to_one_currencies = ["USD", "CHF", "EUR", "GBP", "CAD"];
    var one_to_two_currencies = ["AUD", "SGD"];
    var one_to_ten_currencies = ["NOK", "DKK", "SEK"];
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
  };

  console.log('in app currency', CustomerUtils.get_local_currency_in_app());
  $scope.selected_currency = CustomerUtils.get_local_currency_in_app();
  init_price_range_sliders($scope.selected_currency);
  $scope.$on('currency_change', function(event, data){
    console.log('currency changed', data)
    $scope.selected_currency = data;
    $scope.selected_redis_filters.currency = $scope.selected_currency;
    $scope.select_filter_option('price', 'all', 'display_price');
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
    console.log('selected filters', $scope.selected_filters);
    console.log('output to redis', $scope.selected_redis_filters);

    load_products();

  };

  $scope.reverse_price = false;//predicate for sorting products by price

  /*Filters-end*/

  $rootScope.$on('fetched_order_from_cookie', function(event, data){
    console.log('event fired', data);
  });


  /*Filters from redis*/

  /*Redis Filters-start*/
  $scope.allProductsData=[];
  $scope.total_collection_pages = 1;




  /*Redis Filter-end*/




  $scope.go_to_product_detail = function(product_name){
    $state.go('customer.product_detail',{taxonomy_name: $scope.selected_taxonomy_name,taxon_name: $scope.selected_taxon_name,product_name: product_name});
  };

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  }

  $scope.weight_help_template = {
    url: 'weight-help.html'
  };
  $scope.weight_help_texts = [
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
  ]

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
    else{


      return Math.ceil(variant_stiffness/1.25);
    }

  };

  $scope.order_swatch = function(variant){
    $scope.loading_products = true;
    console.log(variant);
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



  $scope.productDesc=[];
   $scope.result=[];
   $scope.colorArr = [];
   $scope.priceArr = [];
   $scope.materialArr=[];
   $scope.weightArr=[];
   $scope.topSearchBar=true;
   var topSearchBaeCount=-1;

   $scope.showTopSearchBar=function(){
        //console.log("fun is calling..");
        topSearchBaeCount++;
        if(topSearchBaeCount % 2===0){
           $scope.topSearchBar=false;
        }else {
          $scope.topSearchBar=true;
        }
   }

   /*Selected filters*/
   $scope.selected_weave_type = ""

   $scope.selected_weavetype = function(weave_type, option){
     $scope.selected_weave_type = option;
     console.log('weave_type', weave_type);
     console.log('option', option);
   };


   // start of filteration category
  $scope.toggle=function(item){
    item.value = item.value === false ? true: false;
    console.log("toogle fu is calling...");
    console.log("item value: ",item.value);

  }
 // end of filteration category

 // start of filteration implementation
 $scope.priceArr = [];   //price filteration
 $scope.materialArr=[];
 $scope.patternArr=[];
 $scope.isCheckedPrice = function(id){
     var match = false;
     for(var i=0 ; i < $scope.priceArr.length; i++) {
       if($scope.priceArr[i].id == id){
         match = true;
       }
     }
     return match;
 };
 $scope.syncPrice = function(bool, priceStart, priceEnd){
   if(bool){
     // add item
     $scope.priceArr.push({start: priceStart, end: priceEnd});
   } else {
     // remove item
     for(var i=0 ; i < $scope.priceArr.length; i++) {
       if($scope.priceArr[i].start == priceStart && $scope.priceArr[i].end==priceEnd){
         $scope.priceArr.splice(i,1);
       }
     }
   }
 };
 $scope.minPrice=0;
 $scope.maxPrice=1500;
 $scope.priceRangeFilter=function(min,max){
    console.log("price range filter is calling..");
    $scope.priceArr.push({start: parseInt(min), end: parseInt(max)});
    console.log("price array :",$scope.priceArr);

 }
 $scope.priceFilter=function(product){
  //  console.log("price of product: ",product.price);
   if($scope.priceArr.length==0)
      return product;
  else{
   //var temp=[];
   for(i=0;i<$scope.priceArr.length;i++){
     /*if($scope.priceArr[i]==300){
      if(product.price>=$scope.priceArr[i])
          return product;
     }*/
     if(product.price >= $scope.priceArr[i].start && product.price <= $scope.priceArr[i].end){
     //temp=product;
     console.log("priceFiltered :"+product.id);
     return product;
   }
   }
   return '';
 }
 } // end of price filteration

//-------------------------- MATERIAL FILTERAION  ---------------------------
 $scope.isCheckedMaterial = function(id){
     var match = false;
     for(var i=0 ; i < $scope.materialArr.length; i++) {
       if($scope.materialArr[i].id == id){
         match = true;
       }
     }
     return match;
 };
 $scope.syncMaterial = function(bool, material){
   if(bool){
     // add item
     $scope.materialArr.push(material);
   } else {
     // remove item
     for(var i=0 ; i < $scope.materialArr.length; i++) {
       if($scope.materialArr[i] == material){
         $scope.materialArr.splice(i,1);
       }
     }
   }
 };
 $scope.materialFilter=function(product){
   if($scope.materialArr.length==0)
      return product;
  else{
   console.log("material filter is calling with product price: "+product.luxire_product.material);
   var temp=[];
   for(i=0;i<$scope.materialArr.length;i++){
     if(product.luxire_product.material == $scope.materialArr[i]){
     console.log("materialFiltered :"+product.id);
     return product;
   }
   }
   return '';
 }
 }
 //-------------------------- MATERIAL FILTERAION  ---------------------------

 //-------------------------- PATTERN FILTERAION  ---------------------------
 $scope.isCheckedPattern = function(id){
     var match = false;
     for(var i=0 ; i < $scope.patternArr.length; i++) {
       if($scope.patternArr[i].id == id){
         match = true;
       }
     }
     return match;
 };
 $scope.syncPattern = function(bool, pattern){
   if(bool){
     // add item
     $scope.patternArr.push(pattern);
   } else {
     // remove item
     for(var i=0 ; i < $scope.patternArr.length; i++) {
       if($scope.patternArr[i] == pattern){
         $scope.patternArr.splice(i,1);
       }
     }
   }
 };
 $scope.patternFilter=function(product){
   if($scope.patternArr.length==0)
      return product;
  else{
   console.log("material filter is calling with product price: "+product.luxire_product.pattern);
   var temp=[];
   for(i=0;i<$scope.patternArr.length;i++){
     if(product.luxire_product.pattern == $scope.patternArr[i]){
     console.log("pattern Filtered :"+product.id);
     return product;
   }
   }
   return '';
 }
 }
 //-------------------------- PATTERN FILTERAION  ---------------------------

 //-------------------------- WEIGHT FILTERAION  ---------------------------
 $scope.weightArr=[];
 $scope.isCheckedWeight = function(id){
     var match = false;
     for(var i=0 ; i < $scope.weightArr.length; i++) {
       if($scope.weightArr[i].id == id){
         match = true;
       }
     }
     return match;
 };

 $scope.syncWeight = function(bool, price){
   if(bool){
     // add item
     $scope.weightArr.push(price);
   } else {
     // remove item
     for(var i=0 ; i < $scope.weightArr.length; i++) {
       if($scope.weightArr[i] == price){
         $scope.weightArr.splice(i,1);
       }
     }
   }
 };
 $scope.weightFilter=function(product){
   if($scope.weightArr.length==0)
      return product;
  else{
   console.log("weight filter is calling with product price: "+product.luxire_product.product_tags);
   var temp=[];
   for(i=0;i<$scope.weightArr.length;i++){
     if(product.luxire_product.product_tags == $scope.weightArr[i]){
     console.log("weightFiltered :"+product.id);
     return product;
   }
   }
   return '';
 }
 }

 //-------------------------- WEIGHT FILTERAION  ---------------------------
 //-------------------------- WEAVE FILTERAION  ---------------------------
 $scope.weaveArr=[];
 $scope.isCheckedWeave = function(id){
     var match = false;
     for(var i=0 ; i < $scope.weaveArr.length; i++) {
       if($scope.weaveArr[i].id == id){
         match = true;
       }
     }
     return match;
 };

 $scope.syncWeave = function(bool, weave){
   if(bool){
     // add item
     $scope.weaveArr.push(weave);
   } else {
     // remove item
     for(var i=0 ; i < $scope.weaveArr.length; i++) {
       if($scope.weaveArr[i] == weave){
         $scope.weaveArr.splice(i,1);
       }
     }
   }
 };
 $scope.weaveFilter=function(product){
   if($scope.weaveArr.length==0)
      return product;
  else{
   console.log("weight filter is calling with product price: "+product.luxire_product.product_weave_type);
   var temp=[];
   for(i=0;i<$scope.weaveArr.length;i++){
     if(product.luxire_product.product_weave_type == $scope.weaveArr[i]){
     console.log("weightFiltered :"+product.id);
     return product;
   }
   }
   return '';
 }
 }

 //-------------------------- WEAVE FILTERAION  ---------------------------
 //-------------------------- WEAVE FILTERAION  ---------------------------
 $scope.transparencyArr=[];
 $scope.isCheckedTransparency = function(id){
     var match = false;
     for(var i=0 ; i < $scope.transparencyArr.length; i++) {
       if($scope.transparencyArr[i].id == id){
         match = true;
       }
     }
     return match;
 };

 $scope.syncTransparency = function(bool, weave){
   if(bool){
     // add item
     $scope.transparencyArr.push(weave);
   } else {
     // remove item
     for(var i=0 ; i < $scope.transparencyArr.length; i++) {
       if($scope.transparencyArr[i] == weave){
         $scope.transparencyArr.splice(i,1);
       }
     }
   }
 };
 $scope.transparencyFilter=function(product){
   if($scope.transparencyArr.length==0)
      return product;
  else{
   console.log("weight filter is calling with product price: "+product.luxire_product.transparency);
   var temp=[];
   for(i=0;i<$scope.transparencyArr.length;i++){
     if(product.luxire_product.transparency == $scope.transparencyArr[i]){
     console.log("transparency Filtered :"+product.id);
     return product;
   }
   }
   return '';
 }
 }

 //-------------------------- WEAVE FILTERAION  ---------------------------
 //-------------------------- WRINKLE FILTERAION  ---------------------------
 $scope.wrinkleArr=[];
 $scope.isCheckedWrinkle = function(id){
     var match = false;
     for(var i=0 ; i < $scope.wrinkleArr.length; i++) {
       if($scope.wrinkleArr[i].id == id){
         match = true;
       }
     }
     return match;
 };

 $scope.syncWrinkle = function(bool, weave){
   if(bool){
     // add item
     $scope.wrinkleArr.push(weave);
   } else {
     // remove item
     for(var i=0 ; i < $scope.wrinkleArr.length; i++) {
       if($scope.wrinkleArr[i] == weave){
         $scope.wrinkleArr.splice(i,1);
       }
     }
   }
 };
 $scope.wrinkleFilter=function(product){
   if($scope.wrinkleArr.length==0)
      return product;
  else{
   console.log("product is calling with wrinkle: "+product.luxire_product.wrinkle_resistance);
   for(i=0;i<$scope.wrinkleArr.length;i++){
     if(product.luxire_product.wrinkle_resistance == $scope.wrinkleArr[i].text){
     console.log("wrinkle Filtered :"+product.id);
     return product;
   }
   }
   return '';
 }
 }

 //-------------------------- WRINKLE FILTERAION  ---------------------------



 //--------------------------   COLOR FILTERAION  ---------------------------
 $scope.toggle=function(item){
   item.value = item.value === false ? true: false;
   console.log("toogle fu is calling...");
   console.log("item value: ",item.value);

 }
 $scope.hoverIn = function(item){
   console.log("calling hover in...");
        item.mouse = true;
    };

    $scope.hoverOut = function(item){
      console.log("calling hover out...");
        item.mouse = false;
    };
 $scope.colorArr=[];
 $scope.syncColor=function(colorObj){
   var color=colorObj.name;
   console.log("selected color: "+color);
   if($scope.colorArr.length==0){

     $scope.colorArr.push({color: color});
   }else{
     for(var i=0 ; i < $scope.colorArr.length; i++) {
       if($scope.colorArr[i].color == color){
         $scope.colorArr.splice(i,1);
         console.log("splice color: "+color);
         return '';
       }
     }
     $scope.colorArr.push({color: color});
     console.log("color arr: ",colorArr);
   }
 }

 $scope.colorFilter=function(product){
   if($scope.colorArr.length==0)
      return product;
  else{
   console.log("color filter is calling with product color: "+product.luxire_product.product_color);
   var temp=[];
   for(i=0;i<$scope.colorArr.length;i++){
     if(product.luxire_product.product_color == $scope.colorArr[i].color){
     console.log(" color Filtered :"+product.id);
     return product;
   }
   }
   return '';
 }
 }

 //-------------------------- COLOR FILTERAION  ---------------------------
 $scope.reverse=false;
 $scope.predicate="price";
 $scope.priceSort=function(priceTag){
   console.log("price sort fun is calling...");
   console.log("tag :"+priceTag );
   if(priceTag == "low to high"){
     console.log("low to high is calling...");
     $scope.reverse=false;
   }else if(priceTag == "high to low"){
     console.log("high to low is calling...");
     $scope.reverse=true;
   }
 }



 // end of filteration implementation

 $scope.productObj=$scope.casualFabrics;
 $scope.showCasual=function(){
   $scope.productObj=$scope.casualFabrics;
 }
 $scope.showFormal=function(){
   $scope.productObj=$scope.formalFabrics;
 }
 $scope.showDress=function(){
   $scope.productObj=$scope.dressFabrics;
 }
 //******** start of quick view **********


    $scope.animationsEnabled = true;
    $scope.showQuickView=function(product, size){
      console.log("quick view fun is calling...");
      console.log("product: ",product);
      console.log('is fabric', $scope.non_fabric_taxonomies.indexOf($scope.active_taxonomy)===-1 ? true : false);
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
            return $scope.non_fabric_taxonomies.indexOf($scope.active_taxonomy)===-1 ? true : false;
          },
          is_gift_card: function(){
            return $scope.is_gift_card;
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


//    $scope.priceTagOption=[
//      {
//        "id": 1,
//        "name": 'Most Popular',
//        "value": "most popular",
//        "selected":true
//      },
//      {
//        "id": 2,
//        "name": 'New Arrival',
//        "value": "new arrival",
//        "selected":false
//      },
//      {
//        "id": 3,
//        "name": 'Price <Low to High>',
//        "value": "low to high",
//        "selected":false
//      },
//      {
//        "id": 4,
//        "name": 'Price <High to Low>',
//        "value": "high to low",
//        "selected":false
//      },
//    ];
//
//    $scope.allOptions = [
//      {
//        "id": 1,
//        "color1": {name:"green", value: false, mouse: false},
//        "color2": {name:"black", value: false, mouse: false},
//        "color3": {name:"Fuchsia ", value: false, mouse:false}
//      },
//      {
//        "id": 2,
//        "color1": {name:"DarkOliveGreen", value: false, mouse: false},
//        "color2": {name:"Maroon", value: false, mouse: false},
//        "color3": {name:"GreenYellow", value: false}
//      },
//      {
//        "id": 3,
//        "color1": {name:"yellow", value: false, mouse:false},
//        "color2": {name:"Cyan", value: false, mouse:false},
//        "color3": {name:"LightSteelBlue", value: false, mouse:false}
//      },
//      {
//        "id": 4,
//        "color1": {name:"blue", value: false, mouse:false},
//        "color2": {name:"grey", value: false, mouse:false},
//        "color3": {name:"red", value: false, mouse:false},
//      },
//
//    ];
//
//    $scope.priceRange = [
//      {
//        "id": 1,
//        "priceStart": 0,
//        "priceEnd": 100,
//        "text":"Rs. $100 and below"
//      },
//      {
//        "id": 2,
//        "priceStart": 100,
//        "priceEnd": 150,
//        "text":"Rs. $100 - Rs. $150"
//      },
//      {
//        "id": 3,
//        "priceStart": 150,
//        "priceEnd": 200,
//        "text":"Rs. $150 - Rs. $200"
//      },
//      {
//        "id": 4,
//        "priceStart": 200,
//        "priceEnd": 250,
//        "text":"Rs. $200 - Rs. $250"
//      },
//      {
//        "id": 5,
//        "priceStart": 250,
//        "priceEnd": 300,
//        "text":"Rs. $250 - Rs. $300"
//      },
//      {
//        "id": 6,
//        "priceStart": 300,
//        "priceEnd": 1000,
//        "text":"Above Rs. $300"
//      },
//
//    ];
//    $scope.materialOption=[
//      {
//      "id": 1,
//      "text": "cotton"
//      },
//      {
//      "id": 2,
//      "text": "linen"
//      },
//      {
//      "id": 3,
//      "text": "wool"
//      },
//      {
//      "id": 4,
//      "text": "silk"
//      }
//  ];
//  $scope.patternOption=[
//    {
//    "id": 1,
//    "text": "plain"
//    },
//    {
//    "id": 2,
//    "text": "checks"
//    },
//    {
//    "id": 3,
//    "text": "stripes"
//    },
//    {
//    "id": 4,
//    "text": "printed"
//    }
// ];
//  $scope.weightOption=[
//    {
//    "id": 1,
//    "text": "light weight"
//    },
//    {
//    "id": 2,
//    "text": "medium weight"
//    },
//    {
//    "id": 3,
//    "text": "heavy weight"
//    },
//    {
//    "id": 4,
//    "text": "0thers"
//    }
//  ];
//  $scope.weaveOption=[
//    {
//    "id": 1,
//    "text": "plain"
//    },
//    {
//    "id": 2,
//    "text": "twill"
//    },
//    {
//    "id": 3,
//    "text": "satin"
//    },
//    {
//    "id": 4,
//    "text": "basket"
//    }
//  ];
//
//  $scope.transparencyOption=[
//    {
//    "id": 1,
//    "text": "opaque"
//    },
//    {
//    "id": 2,
//    "text": "see through"
//    }
//  ];
//  $scope.wrinkleOption=[
//    {
//    "id": 1,
//    "text": "true",
//    "value": "Yes"
//    },
//    {
//    "id": 2,
//    "text": "false",
//    "value": "No"
//    }
//  ];
//
