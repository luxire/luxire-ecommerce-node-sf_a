angular.module('luxire')
.controller('SearchController', function($scope, CustomerProducts, CustomerConstants, CustomerOrders, $uibModal, $rootScope, ImageHandler, $state, products, $stateParams, $location, $cacheFactory, CustomerUtils){

  console.log('state params', $stateParams);
  $scope.non_fabric_taxonomies = ["accessories", "bags", "shoes", "gift-cards"];


  $scope.get_taxonomy_details = function(permalink){
    var active_taxonomy = permalink.indexOf('/') > -1? permalink.split('/')[0] : permalink;
    return {
      is_fabric_taxonomy: $scope.non_fabric_taxonomies.indexOf(active_taxonomy)===-1 ? true : false,
      is_gift_card: active_taxonomy.toLowerCase() === "gift-cards" ? true : false
    };

  };
  
    /*Multi currency support*/
  $scope.selected_currency = CustomerUtils.get_local_currency_in_app();
  $scope.$on('currency_change', function(event, data){
    console.log('currency changed', data)
    $scope.selected_currency = data;
  });


  window.scrollTo(0, 0);
  $('[data-toggle="tooltip"]').tooltip();
  $scope.stateParams = $stateParams;


  $scope.reverse_price = false;//predicate for sorting products by price

  $rootScope.$on('fetched_order_from_cookie', function(event, data){
    console.log('event fired', data);
  });

  var query_object = {
    name_cont: $stateParams.name_cont || '',
    taxonomy: $stateParams.taxonomy || '*',
    page: parseInt($stateParams.page) || 1
  };

  $scope.allProductsData=[];

  var load_products = function(){
    $scope.loading_products = true;
    CustomerProducts.search_products_in_redis(query_object)
    .then(function(data){
      $scope.loading_products = false;
      $scope.total_collection_pages = data.data.pages;
      $scope.taxonomy_counts = data.data.taxonomies;
      console.log('fetched products', data.data);
      $scope.allProductsData = $scope.allProductsData.concat(data.data.products);
      query_object.page++;
    }, function(error){
      $scope.loading_products = false;
      console.error(error);
    });
  };


  /*Redis caching mechanism*/
    $scope.total_collection_pages = 1;
    $scope.load_more = function(){
      console.log('load more');
      console.log('total pages', $scope.total_collection_pages);
      if(query_object.page == 1 || query_object.page<=$scope.total_collection_pages){
        load_products();
      }
      console.log('scrolling');
    };
    $scope.sort_by_price = function(is_desc){
      $scope.reverse_price = is_desc;
      var price_sort_order = is_desc === true ? 'desc' : 'asc';
      $scope.selected_redis_filters.sort = price_sort_order;
      active_res_page = 1;
      $scope.selected_redis_filters.page = 1;
      $scope.load_more();
      $scope.allProductsData = [];
      $('html, body').animate({ scrollTop: 0}, 500);
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
