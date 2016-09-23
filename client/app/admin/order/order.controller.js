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
    else if($scope.active_order_tab_id === 2 && order.state == 'complete' && order.payment_state !== 'paid'){
      return order;
    }
    else if($scope.active_order_tab_id === 3 && order.state == 'complete' && order.payment_state == 'paid' && order.shipment_state !== 'ready'){
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
    $state.go('admin.order_sheet', {order_number: order.number});
    // orders.get_order_by_id(order.number, order.token).then(function(data){
    //   console.log(data);
    //   $state.go('admin.order_sheet',{order_number: order.number,order: data.data});
    // }, function(error){
    //   console.error(error);
    // });
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
.controller('OrderSheetController', function($scope, $state, $stateParams, ImageHandler, AdminConstants, AdminOrderService, $rootScope){
  console.log('state', $state);
  $scope.current_state = $state.current.name;
  $scope.isStatePrint = function(){
    if ($state.current.name === "order_sheet_print"){
      return true;
    }
    return false;
  };
  AdminOrderService.show($stateParams.order_number).then(function(data){
    console.log('fetched order', data.data);
    $scope.order = data.data;
    $scope.luxire_order = data.data;

  }, function(error){
    console.log('error', error);
  });
  // if($scope.luxire_order && $scope.luxire_order.luxire_order && !$scope.luxire_order.luxire_order.fulfillment_status){
  //   $scope.luxire_order.luxire_order = {};
  //   $scope.luxire_order.luxire_order.fulfillment_status = ''
  // }

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
  // $scope.order_url = window.location.href+'/'+$stateParams.order_number;

  $scope.preview_order_sheet = function () {
    var new_url = window.location.origin+"/#/order_sheet/"+$scope.order.number;
    console.log('new url', new_url);
    var win = window.open(new_url, '_blank');
    win.focus();
  }

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };
  $scope.checkIsObject = function(val){
    return angular.isObject(val);
  };

})
