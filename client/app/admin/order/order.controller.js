angular.module('luxire')
.controller('OrderController',function($scope,AdminOrderService, $uibModal, $state, orders){

  AdminOrderService.index().then(function(data){
    $scope.orders = data.data.orders;
    console.log(data.data.orders);
  }, function(error){
    console.error(error);
  });

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
.controller('OrderSheetController', function($scope, $stateParams, ImageHandler){
  $scope.order_id = $stateParams.order_number;
  $scope.luxire_order = $stateParams.order;
  $scope.order_details = $stateParams.order;
  console.log($scope.order_details);
  $scope.order_url = window.location.href+'/'+$stateParams.order_number;
  console.log('order_url', $scope.order_url);
  console.log($scope.order_details.line_items[0].variant.images[0].small_url);
  $scope.prod_image = "http://54.169.41.36:3000"+$scope.order_details.line_items[0].variant.images[0].small_url;
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
