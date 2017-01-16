angular.module('luxire')
.controller('OrderController',function($scope,AdminOrderService, $uibModal, $state, orders){
  $scope.current_page = 1;
  $scope.total_pages = 1;
  $scope.orders = [];
  $scope.loading = false;
  var search = {
    page: 0
  };
  var load_orders = function(new_orders){
    $scope.loading = true;
    AdminOrderService.index(search).then(function(data){
      if(new_orders){
        $scope.orders = data.data.orders;
      }
      else{
        if($scope.orders.length){
          $scope.orders = $scope.orders.concat(data.data.orders);
        }
        else {
          $scope.orders = data.data.orders;
        }
      }
      $scope.total_pages = data.data.pages;
      $scope.loading = false;
    }, function(error){
      $scope.loading = false;
      console.error(error);
    });
  }

  $scope.load_more_orders = function(){
    if(search.page<$scope.total_pages){
      search.page = search.page + 1;
      load_orders();
    }
  };

  $scope.searchByName  = function(searchText){//email_or_number_cont
    $scope.orders = [];
    search["email_or_number_cont"] = $scope.searchText;
    search.page = 1;
    load_orders(true);
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
      title: 'Open'
    },
    {
      id: 3,
      title: 'Unpaid'
    },
    {
      id: 4,
      title: 'Unfulfilled'
    },
  ];
  $scope.active_order_tab_id = 0;
  function set_states(order_eq, payment_eq, shipment_eq, order_not_eq, payment_not_eq, shipment_not_eq){
    search['state_eq'] = order_eq || "";
    search['payment_state_eq'] = payment_eq || "";
    search['shipment_state_eq'] = shipment_eq || "";
    search['state_not_eq'] = order_not_eq || "";
    search['payment_state_not_eq'] = payment_not_eq || "";
    search['shipment_state_not_eq'] = shipment_not_eq || "";
  };
  $scope.set_active_order_tab_id = function(id){
    $scope.active_order_tab_id = id;
    set_states();
    if(id == 1){
      set_states("","","",'complete');
    }
    else if(id == 2){
      set_states('complete','',"",'','','');
    }
    else if(id == 3){
      set_states("complete","","","","paid","");
    }
    else if(id == 4){
      set_states("complete","paid","","","","shipped");
    }
    $scope.orders = [];
    search.page = 1;
    load_orders(true);
  };

  /*Set order details in $scope.active_order*/
  $scope.show_order_details = function(event, order, index){
    event.preventDefault();
    $scope.active_order = order;
  };

  $scope.show_order = function(event, order){
    event.preventDefault();
    $state.go('admin.order_sheet', {order_number: order.number});
  };

  $scope.order_details_popover = {
    title: 'Order'+$scope.active_order,
    templateUrl: 'order_details_popover.html',
    order_obj: $scope.active_order
  };
})
.controller('OrderDetailsModalController',function($scope, $uibModalInstance, order){
  $scope.order = order;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.print_order_sheet = function(){
    window.print();
  };

})
.controller('OrderSheetController', function($scope, $state, $stateParams, ImageHandler, AdminConstants, AdminOrderService, $rootScope, $timeout){
  $scope.current_state = $state.current.name;
  $scope.line_item_id = isNaN($stateParams.line_item_id) ? null : parseInt($stateParams.line_item_id);
  $scope.getFormattedDate = function(date){
    if(moment(date).format("Z") == "+05:30"){
      return moment(date).format("DD-MM-YYYY hh:mm A") + " IST";
    }
    else{
      return moment(date).format("DD-MM-YYYY hh:mm A Z");
    }
  };
  $scope.isStatePrint = function(){
    if ($state.current.name === "order_sheet_print"){
      return true;
    }
    return false;
  };
  $scope.print = function(){
    $timeout(function(){
      window.print();
    },0)
  };
  function load_order(){
    $scope.loading = true;
    AdminOrderService.show($stateParams.order_number).then(function(data){
      $scope.order = data.data;
      $scope.loading = false;
      $scope.luxire_order = data.data;
    }, function(error){
      $scope.loading = false;
      console.log('error', error);
    });
  }
  load_order();
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

  var fabric_states = ["Order received", "Order sheet generated", "Pattern Making", "Fabric cutting", "Tailoring", "Quality assurance", "Shipped", "Delivered"];
  var pocket_square_states = ["Order received", "Make Printable Image", "Send for Printing", "Hand Rolling", "Quality assurance", "Shipped", "Delivered"];
  var shoes_states = ["Order received", "Trial Pair", "Sent Trial Pair", "Analyze customer feedback", "Modify order", "Make Final Pair", "Quality assurance", "Shipped", "Delivered"];
  var gift_card_states = ["Pending", "Scheduled for Fulfillment", "Fulfilled"];
  var additional_services_states = ["Merged with original order", "Pending", "Fulfilled"];


  $scope.product_type_states = {
    "Shirts": fabric_states,
    "Pants": fabric_states,
    "Jackets": fabric_states,
    "Vests": fabric_states,
    "Ties": fabric_states,
    "Pocket Squares": pocket_square_states,
    "Shoes": shoes_states,
    "Gift Cards": gift_card_states,
    "Additional Services": additional_services_states
  }

  /*Order state change*/
  $scope.change_status = function(state){
    $scope.selected_order_state = state;
    $scope.loading = true;
    AdminOrderService.update_status($scope.luxire_order, state)
    .then(function(data){
      $scope.luxire_order.luxire_order.fulfillment_status = state.title;
      $rootScope.alerts.push({type: 'success', message: data.data.msg});
      load_order();
    }, function(error){
      $rootScope.alerts.push({type: 'danger', message: error.data.msg});
      $scope.loading = false;
      console.error('error', error);
    });
  }

  /*Line Item state change*/
  $scope.change_line_item_status = function(line_item_id, status,index){
    var order_obj = {
      order: {
        number: $scope.luxire_order.number,
        token: $scope.luxire_order.token
      },
      line_item_id: line_item_id,
      state: status
    }
    $scope.loading = true;
    AdminOrderService.update_line_item_status(order_obj)
    .then(function(data){
      load_order();
      $rootScope.alerts.push({type: 'success', message: data.data.msg});
    }, function(error){
      $scope.loading = false;
      $rootScope.alerts.push({type: 'danger', message: error.data.msg});
      console.error('error', error);
    });
  }
  $scope.preview_order_sheet = function (line_item_id) {
    var new_url = $state.href('order_sheet_print', {order_number: $scope.order.number,line_item_id: line_item_id});
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
