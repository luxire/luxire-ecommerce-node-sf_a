angular.module('luxire')
.controller('styleMasterHomeController',function($scope,styleMasterService,$state, ImageHandler, $uibModal){
  /*Image*/
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };
  function load_all_style_masters(){
    $scope.loading= true;
    styleMasterService.getAllStyleMaster().then(function(data) {
      $scope.loading= true;
      $scope.allStyleMasterType=data.data;
      $scope.loading= false;
    }, function(error){
      $scope.loading= false;
      console.log(error);
    })
  }
  load_all_style_masters();
  $scope.deleteStyleMaster=function(product_style,index){
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'delete_style.html',
      controller: 'DeleteProductStyleController',
      size: 'md',
      backdrop: 'static',
      resolve: {
        product_style: function () {
          return product_style;
        }
      }
    });
    modalInstance.result.then(function (product_style) {
      load_all_style_masters();
      $scope.alerts.push({type: 'success', message: 'Deleted Product style '+product_style.name+' successfully!'});
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  }
})
.controller('DeleteProductStyleController', function($scope, $uibModalInstance, product_style, styleMasterService){
  $scope.product_style = product_style;
  $scope.delete = function () {
    $scope.loading = true;
    styleMasterService.deleteStyleMaster(product_style.id).then(function(data){
      $scope.loading = false;
      $uibModalInstance.close(product_style);
    }, function(error) {
      console.log(error);
      $scope.loading = false;
      $scope.alerts.push({type: 'danger', message: 'Deletion failed!'});
    })
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})
