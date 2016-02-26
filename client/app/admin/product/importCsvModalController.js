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
.controller('importCsvModalController',function($scope, $uibModalInstance, importValue, $http){
  console.log("csv file content : \n\n",$scope.fileContent);
  console.log("csv file content : \n\n",$scope.fileContent);
 $scope.fileObj='';
 $scope.$on('fileSelected', function(event, fetchFile) {
       //Receive the object from another scope with emit
        $scope.fileObj = fetchFile;
       console.log("fetch file: ",$scope.fileObj);
       var reader = new FileReader();

       reader.onloadend = function () {
           //Put the object/image in page html with scope
           $scope.content = reader.fetchFile;
           console.log("content: \n",$scope.content);
       };
  });

  $scope.ok = function () {
    console.log("within ok file object is: ",$scope.fileObj);
    $uibModalInstance.close($scope.fileObj);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
