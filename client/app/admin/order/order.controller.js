angular.module('luxire')
.controller('OrderController',function($scope,AdminOrderService, $uibModal, $state, orders){
  $scope.current_page = 1;
  $scope.total_pages = 1;
  $scope.orders = [];
  $scope.loading = false;
  var load_orders = function(page){
    $scope.loading = true;
    console.log('loading orders for page', page);
    AdminOrderService.index(page).then(function(data){
      if($scope.orders.length){
        $scope.orders = $scope.orders.concat(data.data.orders);
      }
      else{
        $scope.orders = data.data.orders;
      }
      $scope.total_pages = data.data.pages;
      $scope.loading = false;
      console.log('orders', data.data);
    }, function(error){
      $scope.loading = false;
      console.error(error);
    });
  }

  $scope.load_more_orders = function(){
    console.log('end of page reached current page', $scope.current_page,'total pages', $scope.total_pages);
    if($scope.current_page<=$scope.total_pages){
      console.log('load more orders for page', $scope.current_page);

      load_orders($scope.current_page);
      $scope.current_page = $scope.current_page + 1;
    }
  };

  $scope.order_tabs = [
    {
      id: 0,
      title: 'All orders'
    },
    {
      id: 1,
      title: 'Abondoned checkouts'
    },
    {
      id: 2,
      title: 'Unpaid'
    },
    {
      id: 3,
      title: 'Unfulfilled'
    },
  ];
  $scope.active_order_tab_id = 0;
  $scope.set_active_order_tab_id = function(id){
    $scope.active_order_tab_id = id;
  };

  $scope.filter_orders = function(order){
    console.log('filtering orders');
    var filtered_orders = [];
    if($scope.active_order_tab_id === 0){
      return order;
    }
    else if($scope.active_order_tab_id === 1 && order.state !== 'complete'){
      return order;
    }
    else if($scope.active_order_tab_id === 2 && order.payment_state !== 'paid'){
      return order;
    }
    else if($scope.active_order_tab_id === 3 && order.shipment_state !== 'ready'){
      return order;
    }

  }
  /*Set order details in $scope.active_order*/
  $scope.show_order_details = function(event, order, index){
    event.preventDefault();
    $scope.active_order = order;
  };

  $scope.show_order = function(event, order){
    event.preventDefault();
    console.log(order);
    orders.get_order_by_id(order.number, order.token).then(function(data){
      console.log(data);
      $state.go('admin.order_sheet',{order_number: order.number,order: data.data});
    }, function(error){
      console.error(error);
    });
  };

  $scope.order_details_popover = {
    title: 'Order'+$scope.active_order,
    templateUrl: 'order_details_popover.html',
    order_obj: $scope.active_order
  };
  // $scope.show_order_details = function(event, order, index){
  //   event.preventDefault();
  //   // window.print();
  //   var modalInstance = $uibModal.open({
  //     animation: true,
  //     templateUrl: 'order_details_modal.html',
  //     controller: 'OrderDetailsModalController',
  //     size: 'sm',
  //     resolve: {
  //       order: function () {
  //         return order;
  //       }
  //     }
  //   });
  //
  //   modalInstance.result.then(function (selectedItem) {
  //     $scope.selected = selectedItem;
  //   }, function () {
  //     console.info('Modal dismissed at: ' + new Date());
  //   });
  // };
})
.controller('OrderDetailsModalController',function($scope, $uibModalInstance, order){
  $scope.order = order;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.print_order_sheet = function(){
    console.log('printing order sheet...');
    window.print();
  };

})
.controller('OrderSheetController', function($scope, $stateParams, ImageHandler, AdminConstants, AdminOrderService, $rootScope){
  $scope.order_id = $stateParams.order_number;
  $scope.luxire_order = $stateParams.order;
  if($scope.luxire_order && $scope.luxire_order.luxire_order && !$scope.luxire_order.luxire_order.fulfillment_status){
    $scope.luxire_order.luxire_order = {};
    $scope.luxire_order.luxire_order.fulfillment_status = ''
  }
  $scope.order_details = $stateParams.order;
  console.log($scope.order_details);
  console.log('luxire_order', $scope.luxire_order);
  $scope.order_states = [
    {
      id: 0,
      title: 'Order sheet generated'
    },
    {
      id: 1,
      title: 'Processing'
    },
    {
      id: 2,
      title: 'Shipped'
    },
    {
      id: 3,
      title: 'Delivered'
    }
  ];
  $scope.change_status = function(state){
    $scope.selected_order_state = state;
    AdminOrderService.update_status($scope.luxire_order, state)
    .then(function(data){
      $scope.luxire_order.luxire_order.fulfillment_status = state.title;
      $rootScope.alerts.push({type: 'success', message: data.data.msg});
      console.log('data', data);
    }, function(error){
      $rootScope.alerts.push({type: 'danger', message: error.data.msg});
      console.error('error', error);
    });
  }
  $scope.order_url = window.location.href+'/'+$stateParams.order_number;
  console.log('order_url', $scope.order_url);
  console.log($scope.order_details.line_items[0].variant.images[0].small_url);
  $scope.prod_image = AdminConstants.api.host +$scope.order_details.line_items[0].variant.images[0].small_url;
  console.log($scope.prod_image);
  $scope.print_sheet = function () {
    console.log('printing sheet');
    window.print();
  }
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  // <td>{{collar_details.points}}</td>
  // <td>{{collar_details.spread}}</td>
  // <td>{{collar_details.tie_space}}</td>
  // <td>{{collar_details.nb_ht_back}}</td>
  // <td>{{collar_details.nb_ht_front}}</td>
  // <td>{{{{collar_details.collar_ht}}</td>
  // <td>{{collar_details.side_curve}}</td>
  // <td>{{collar_details.nb_const}}</td>
  // <td>{{collar_details.collar_const}}</td>
  $scope.collar = [{
                    points: "3.0\"",
                    spread: '5.0\"',
                    tie_space: '0.5\"',
                    nb_ht_back: '1.5\"',
                    nb_ht_front: '1.25\"',
                    collar_ht: '2.0\"',
                    side_curve: "Yes",
                    nb_const: "Fused Stiff",
                    collar_const: 'Unfused soft'
                   }];
})
