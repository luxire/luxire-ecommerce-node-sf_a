angular.module('luxire')
.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                        var fileObj=changeEvent.target.files[0];
                        scope.$emit("fileSelected",fileObj);
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
                //scope.fileObj= changeEvent.target.files[0];
                //scope.fileread = changeEvent.target.files[0];

            });
        }
    }
}])
.controller('importCsvModalController',function($scope, $uibModalInstance,$rootScope, CSV, $sce){
  $scope.buttonDisable = false;
  $scope.show =  false;
  $scope.upload_file = function(files){
    if (files && files.length) {
      $scope.product_csv = files[0];

    }
  }
  $scope.get_buggy_record_count = function(buggy_records){
    return Object.keys(buggy_records).length;
  };
  $scope.upload = function () {
    $scope.show =  false;
    $scope.buttonDisable = true;
    if($scope.product_csv && $scope.product_csv.type==='text/csv'){
      $scope.loading = true;
      CSV.upload($scope.product_csv)
      .then(function(data){
        $scope.buttonDisable = false;
        $scope.response = data.data;
        $scope.loading = false;
        console.log('uploaded',data);
        
      }, function(error){
        $scope.buttonDisable = false;
        $scope.loading = false;
        $scope.show = true;
        console.error(error.data);
      $scope.csvRespone = {
        message : error.data.msg,
        added_column: error.data.added_column,
        removed_column: error.data.removed_columns
      }
      })

    }
    else{
      $rootScope.alerts.push({type: 'danger', message: 'Please upload a valid csv file!'});
    }
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
