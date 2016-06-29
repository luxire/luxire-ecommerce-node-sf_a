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
.directive("whenScrolled", function(){
	return {
		restrict:'A',
		link: function(scope,elem,attrs){
			raw = elem[0];
			elem.bind("scroll", function(){
					if(raw.scrollTop + raw.offsetHeight + 5 >= raw.scrollHeight){
				//		scope.loading = true;
						console.log('Firing next in dir');
						scope.$apply(attrs.whenScrolled);
					}
			});
		}
	}
})
.directive("animateOnChange", function($timeout){
  return function(scope, element, attr){
    console.log('attr in directive', attr.animateOnChange);
    scope.$watch(attr.animateOnChange, function(newVal, oldVal){
      console.log('old val in dir', oldVal);
      console.log('new val in dir', newVal);
      if(newVal!==oldVal){
        element.addClass('attr-changed');
        $timeout(function(){
          element.removeClass('attr-changed');
        }, 1000)
      }

    })

  };
})
