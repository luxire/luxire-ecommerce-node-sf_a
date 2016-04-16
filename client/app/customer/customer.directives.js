angular.module('luxire')
.directive('ifLoading',['$http', function($http){
  return {
      restrict: 'A',
      link: function(scope, elem, attr) {
        console.log('attributes', attr.ifLoading);
        scope.isLoading = isLoading;
        scope.$watch(scope.isLoading, toggleElement);
        function toggleElement(loading) {
          if (loading) {
            if(attr.ifLoading=="show"){
              elem.show();
            }
            else if(attr.ifLoading=="hide"){
              elem.hide();

            }
          } else {
            if(attr.ifLoading=="show"){
              elem.hide();
            }
            else if(attr.ifLoading=="hide"){
              elem.show();
            }
          }
        }

        function isLoading() {
          return $http.pendingRequests.length > 0;
        }
      }
    };
}])
