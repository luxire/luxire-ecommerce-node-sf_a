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

                console.log("file object is: ",changeEvent.target.files[0]);
            });
        }
    }
}])
.controller('importCsvModalController',function($scope, $uibModalInstance,$rootScope, CSV, $sce){
  $scope.upload_file = function(files){
    if (files && files.length) {
      $scope.product_csv = files[0];
      console.log('product csv', $scope.product_csv);
      console.log('file type', $scope.product_csv.type);

    }
  }
  $scope.get_buggy_record_count = function(buggy_records){
    return Object.keys(buggy_records).length;
  };
  $scope.upload = function () {
    if($scope.product_csv && $scope.product_csv.type==='text/csv'){
      $scope.loading = true;
      CSV.upload($scope.product_csv)
      .then(function(data){
        console.log('response', data.data);
        $scope.response = data.data;
        $scope.loading = false;
        // $scope.getUploadStatus = $sce.trustAsHtml(data.data);
        console.log('uploaded',data);
      }, function(error){
        $scope.loading = false;
        console.error(error.data);
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
