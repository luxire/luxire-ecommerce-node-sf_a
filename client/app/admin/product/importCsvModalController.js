angular.module('luxire')
.controller('importCsvModalController',function($scope, $uibModalInstance,$rootScope, CSV, $sce){
  $scope.upload_file = function(files){
    if (files && files.length) {
      $scope.product_csv = files[0];
      console.log('product csv', $scope.product_csv);
      console.log('file type', $scope.product_csv.type);

    }
  }
  $scope.upload = function () {
    if($scope.product_csv && $scope.product_csv.type==='text/csv'){
      $scope.loading = true;
      CSV.upload($scope.product_csv)
      .then(function(data){
        $scope.loading = false;
        $scope.getUploadStatus = $sce.trustAsHtml(data.data);
        console.log('uploaded',data);
      }, function(error){
        console.error(error);
      })

    }
    else{
      $rootScope.alerts.push({type: 'danger', message: 'Please upload a valid csv file!'});
    }
        // $uibModalInstance.close($scope.product_csv);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
