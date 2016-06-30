angular.module('luxire')
.controller('PreCartController', ['$scope', '$rootScope', '$state', 'ImageHandler', 'CustomerProducts', '$uibModal', 'CustomerOrders',function($scope, $rootScope, $state, ImageHandler, CustomerProducts, $uibModal, CustomerOrders){
  window.scrollTo(0, 0);
  $scope.recommended_products = [];
  $scope.loading_cart = true;
  function has_line_items(order){
    if(order.line_items && order.line_items.length){
      $scope.active_line_item = order.line_items[order.line_items.length-1];
      console.log('active_line_item', $scope.active_line_item);
      $scope.order = order;
      CustomerProducts.recommended($scope.active_line_item.variant.product_id)
      .then(function(data){
        $scope.recommended_products = data.data.data;
        console.log('recommended products',data.data.data);
      }, function(error){
        console.log(error);
      });
    }
    else{
      $state.go('customer.cart');
    }
  };
  console.log('luxire cart in recommended', $rootScope.luxire_cart);
  if($rootScope.luxire_cart && $rootScope.luxire_cart.hasOwnProperty('number')){
    console.log('luxire cart in recommended', $rootScope.luxire_cart);
    CustomerOrders.get_order_by_cookie()
    .then(function(data){
      console.log('fetched order', data.data);
      $rootScope.luxire_cart = data.data;
    },
    function(error){
      console.error(error);
    });
    $scope.loading_cart = false;
    has_line_items($rootScope.luxire_cart);
  }
  else{
    $scope.$on('fetched_order_from_cookie', function(event, data){
      $scope.loading_cart = false;
      console.log('successful fetch',data);
      has_line_items(data.data);
    });
  }

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  $scope.quick_view = function(product){
    console.log('quick view', product);
    $scope.active_permalink = product.taxons[0].permalink;
    console.log('active_permalink', $scope.active_permalink);
    $scope.active_taxonomy = $scope.active_permalink.indexOf('/') > -1? $scope.active_permalink.split('/')[0] : $scope.active_permalink;
    $scope.non_fabric_taxonomies = ["accessories", "bags", "shoes", "gift-cards"];
    console.log('quick view product', product);
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
  $scope.select = function(product_name){
    $state.go('customer.product_detail',{product_name: product_name});
  };



}])
