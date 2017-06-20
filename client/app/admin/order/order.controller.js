var luxire = angular.module('luxire');
luxire.controller('OrderController', function ($scope, AdminOrderService, AdminConstants,$uibModal, $state,$http, orders) {
  $scope.total_pages = 1;
  var flag = true;
  $scope.orders = [];
  $scope.loading = false;
  var search = {
    page: 0
  };
  //This function is used to load the order details
  var load_orders = function (new_orders) {
    $scope.loading = true;
    AdminOrderService.index(search).then(function (data) {
      if (new_orders) {
        $scope.orders = data.data.orders;
      }
      else {
        if ($scope.orders.length) {
          $scope.orders = $scope.orders.concat(data.data.orders);
        }
        else {
          $scope.orders = data.data.orders;
        }
      }
      $scope.total_pages = data.data.pages;
      $scope.loading = false;
      $scope.busy = false;
    }, function (error) {
      $scope.loading = false;
      console.error(error);
    });
  }

  $scope.busy = false;
//This is the scroll loading function to get the next set of order details while scrolling
  $scope.load_more_orders = function () {
    if (!$scope.busy && search.page < $scope.total_pages) {
      $scope.busy = true;
      search.page = search.page + 1;
      load_orders();
    }
  };
//Searching functionality and the keys used for searching email_or_number_cont
  $scope.searchByName = function (searchText) {
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
    {
      id : 5,
      title: 'Recently Completed Orders'
    }
  ];
  $scope.active_order_tab_id = 0;
  function set_states(order_eq, payment_eq, shipment_eq, order_not_eq, payment_not_eq, shipment_not_eq) {
    search['state_eq'] = order_eq || "";
    search['payment_state_eq'] = payment_eq || "";
    search['shipment_state_eq'] = shipment_eq || "";
    search['state_not_eq'] = order_not_eq || "";
    search['payment_state_not_eq'] = payment_not_eq || "";
    search['shipment_state_not_eq'] = shipment_not_eq || "";
  };
  $scope.set_active_order_tab_id = function (id) {
    $scope.active_order_tab_id = id;
    set_states();
    if (id == 1) {
      set_states("", "", "", 'complete');
    }
    else if (id == 2) {
      set_states('complete', '', "", '', '', '');
    }
    else if (id == 3) {
      set_states("complete", "", "", "", "paid", "");
    }
    else if (id == 4) {
      set_states("complete", "paid", "", "", "", "shipped");
    }
    else if (id == 5) {
      load_recent_orders(true);
      flag = false;
    }
    $scope.orders = [];
    search.page = 1;
    if(flag === true){
      load_orders(true);
    }
  };

  var load_recent_orders = function(new_orders){
     $scope.loading = true;
     $http.get(AdminConstants.api.orders+'/getRecentlyCompletedOrder').then(function(data){
      if (new_orders) {
        $scope.orders = data.data.orders;
      }
      else {
        if ($scope.orders.length) {
          $scope.orders = $scope.orders.concat(data.data.orders);
        }
        else {
          $scope.orders = data.data.orders;
        }
      }
      $scope.total_pages = data.data.pages;
      $scope.loading = false;
     },function(error){
      $scope.loading = false;
      console.error(error);
     })
  }

  /*Set order details in $scope.active_order*/
  $scope.show_order_details = function (event, order, index) {
    event.preventDefault();
    $scope.active_order = order;
  };
//used to redirect to the order detail 
  $scope.show_order = function (event, order) {
    event.preventDefault();
    $state.go('admin.order_sheet', { order_number: order.number });
  };

  $scope.order_details_popover = {
    title: 'Order' + $scope.active_order,
    templateUrl: 'order_details_popover.html',
    order_obj: $scope.active_order
  };
});
luxire.controller('OrderDetailsModalController', function ($scope, $uibModalInstance, order) {
  $scope.order = order;
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.print_order_sheet = function () {
    window.print();
  };

});
luxire.controller('OrderSheetController', function ($scope,$window, $http,$state, $stateParams, ImageHandler, AdminConstants, AdminOrderService, $rootScope, $uibModal, $timeout) {
  $scope.current_state = $state.current.name;
  $scope.line_item_id = isNaN($stateParams.line_item_id) ? null : parseInt($stateParams.line_item_id);
  $scope.getFormattedDate = function (date) {
    if (moment(date).format("Z") == "+05:30") {
      return moment(date).format("DD-MM-YYYY hh:mm A") + " IST";
    }
    else {
      return moment(date).format("DD-MM-YYYY hh:mm A Z");
    }
  };
  $scope.isStatePrint = function () {
    if ($state.current.name === "admin.print") {
      return true;
    }
    return false;
  };
  //print functionality
  $scope.print = function () {
    $timeout(function () {
      window.print();
    }, 0)
  };
  //This function is used to load the line item details of the order
  function load_order() {
    $scope.loading = true;
    AdminOrderService.show($stateParams.order_number).then(function (data) {
      $rootScope.order = data.data;
      $scope.order = data.data;
      $scope.loading = false;
      $scope.luxire_order = data.data;
      //This is used to set the status of the order
      if ($scope.luxire_order.payment_state === "paid") {
        $scope.paymentState = "PAYMENT OF " + $scope.luxire_order.display_total + " WAS RECIEVED";
        $scope.fulfillmentStatus = "Fulfilled";
      }
      else {
        $scope.paymentState = "PAYMENT OF " + $scope.luxire_order.display_total + " WAS NOT RECIEVED";
        $scope.fulfillmentStatus = "Unfulfilled";
      }
      if($scope.luxire_order.shipment_state === 'ready'){
        $scope.notifyCustomer = true;
      }
      else{
        $scope.notifyCustomer = false;
      }
      if($scope.luxire_order.state === 'complete'){
        $scope.refund = true;
        $scope.cancel_order  = true;
      }
      else{
        $scope.refund = false;
        $scope.cancel_order = false;
      }

    }, function (error) {
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
  $scope.change_status = function (state) {
    $scope.selected_order_state = state;
    $scope.loading = true;
    AdminOrderService.update_status($scope.luxire_order, state)
      .then(function (data) {
        $scope.luxire_order.luxire_order.fulfillment_status = state.title;
        $scope.loading = false;
        $rootScope.alerts.push({ type: 'success', message: data.data.msg });
        load_order();
      }, function (error) {
        $rootScope.alerts.push({ type: 'danger', message: error.data.msg });
        $scope.loading = false;
        console.error('error', error);
      });
  }

  /*Line Item state change*/
  $scope.change_line_item_status = function (line_item_id, status, index) {
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
      .then(function (data) {
        load_order();
        $rootScope.alerts.push({ type: 'success', message: data.data.msg });
      }, function (error) {
        $scope.loading = false;
        $rootScope.alerts.push({ type: 'danger', message: error.data.msg });
        console.error('error', error);
      });
  }
  $scope.preview_order_sheet = function (line_item_id) {
    var new_url = window.location.origin + "/#/admin/order_sheet/" + $scope.order.number + "/print?line_item_id=" + line_item_id;
    var win = window.open(new_url, '_blank');
    win.focus();
  }

  $scope.getImage = function (url) {
    return ImageHandler.url(url);
  };
  $scope.checkIsObject = function (val) {
    return angular.isObject(val);
  };

  $scope.save = function () {
    var element = document.getElementById("order_sheet_data");
  }
  $scope.tabTitle = ['Home'];//contains the tab name
  $scope.tabIndex = 0;//maintains the tab index
  $scope.count = 0;
  //creating the tabs
  $scope.addTab = function (a) {
    if (($scope.count < $scope.luxire_order.line_items.length) && ($scope.tabTitle.indexOf(a) == -1)) {
      $scope.tabTitle.push("Line Item " + a);
      $scope.indexValue = a - 1;//To maintain the indexValue of the line item detail to be shown in the active tab
      $scope.tabIndex += 1;//To maintain the current tab_index value
      $scope.showTab = $scope.tabIndex;//To activate the tab
      $scope.count += 1;
    }
    else {
      if ($scope.tabIndex === a) {
        $scope.showTab = $scope.tabIndex;
      }
      else {
        $scope.indexValue = a - 1;
        $scope.showTab = a;
      }

    }

  }
  //used to track the title selected by user
  $scope.trackTitle = function (a) {
    if ($scope.tabTitle[a] != 'Home') {
      $scope.indexValue = a - 1;
      $scope.showTab = a;
    }
    else {
      $scope.showTab = a;
    }
  }

  //This is used to invoke the refund modal
  $scope.openModal =  function(){
    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'refundModal.html',
      controller: 'orderRefundController',
      size: 'lg',
      resolve: {
        luxireOrder: function () {
          return $scope.luxire_order;
        }
      }
    });
    modalInstance.result.then(function(data){
      $scope.loading=true;
      var refundData = {
        order_number : $scope.luxire_order.number,
        refund_amount : data.refundAmount,
        refund_reason_id : data.reasonId
      }
      var putData = angular.toJson(refundData);
      $http.put('api/v1/admin/orders/refund',putData).then(function(data){
        $scope.loading =false;
        $scope.alerts.push({type: 'success', message: 'Refund is successfull!'});
    },function(error){
      $scope.loading =false;
       $scope.alerts.push({type: 'warning', message: error.data.msg});
        console.log('error',error);

      })
    })
  }
  //This function is used to cancel the order
  $scope.cancelOrder = function(){
    $scope.loading =true;
    $http.put('/api/v1/admin/orders/cancel/'+$scope.luxire_order.number).then(function(data){
      $scope.loading =false;
      $scope.alerts.push({type: 'success', message: 'Order is cancelled successfully!'});
    },function(error){
      $scope.loading =false;
      $scope.alerts.push({type: 'warning', message: error.data.msg||error.data.exception});
      console.log('error:',error);
    })
  }

  //This function is used to notify the customer 
  $scope.notify = function(){
    $scope.loading =true;
    $http.put('/api/v1/admin/orders/ship/'+$scope.luxire_order.shipments[0].number).then(function(data){
      $scope.loading =false;
      $scope.alerts.push({type: 'success', message: 'Shipping notification sent successfully!'});
      $window.location.reload();
    },function(error){
      $scope.loading =false;
      $scope.alerts.push({type: 'warning', message: error.data.msg});
      console.log('error:',error);
    })
  }
});

//this is the controller of the refundModal.html
luxire.controller('orderRefundController',function($scope,$uibModalInstance,luxireOrder){
  $scope.refund = false;
  $scope.luxireOrder = luxireOrder;//This contains the entier order details
  $scope.quantity = 0; //Initial value 
  $scope.subTotal = 0; //Initial value
  $scope.luxireTotal = luxireOrder.total; //contains the total amount for the paticular order
  $scope.temp= []; //Temp array for calculation
  $scope.price=[];//This shows the price of the each line item
  $scope.line_item_id = []; //This contains line item ids
  $scope.price.push(0);
  //This function is used to manipulate the price of the each line item based on the quantity 
  $scope.setQuantity = function(item,quantity,index){
    var display_total = parseFloat(item.total);
    $scope.price[index+1]=(display_total * quantity);
    if(quantity == 1){
      for(var i=1;i<$scope.price.length;i++){
        $scope.temp[i-1] = $scope.price[i];
      }
    }
    var value  = index+1;
    $scope.calculateSubTotal($scope.price,value);
  }
  //this function is used to calculate the subTotal of the entier order
  $scope.calculateSubTotal = function(value,index){
  $scope.subTotal += value[index];
  if(value[index] == 0){
    $scope.subTotal -=$scope.temp[index-1];
  }
  $scope.refundTotal = $scope.subTotal;
  $scope.refund = true;
}
//This function is to set the refundTotal amount
$scope.manualRefund = function(value){
  $scope.refundTotal = value;
}
  for(var i=0;i<$scope.luxireOrder.line_items.length;i++){
    $scope.line_item_id.push($scope.luxireOrder.line_items[i].id);
  }
//This contatins the refund reasons
$scope.reasons = ['Return Processing','Technical Problem'];
//This function is used to set the id for the selected reason 
$scope.selectReason = function(){
if($scope.refundReason == 'Return Processing'){
  $scope.refundReasonId = 1;
}
else{
  $scope.refundReasonId = 2;
}
}
  $scope.ok = function () {
    $uibModalInstance.close({ refundAmount : $scope.refundTotal,reasonId : $scope.refundReasonId});
  }
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  }
})


