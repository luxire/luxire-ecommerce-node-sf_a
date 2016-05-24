angular.module('luxire')
.controller('AttributeController', ['$scope', '$state', function($scope, $state){
  var CONST_ATTR_PATH = 'app/customer/attribute_detail/partials/attributes/';
  console.log('attr-type',$state.params.type);
  $scope.attr_template = {
    url: ''
  };
  if(!$state.params.attribute_name || !$state.params.type){
    $state.go('customer.home');
  }
  else{
    $scope.attr_template.url = CONST_ATTR_PATH+$state.params.attribute_name+'.html';
    $scope.template_loaded = function(){
      console.log('ready', $("#"+$state.params.type).length);
      if($("#"+$state.params.type).length){
        $('html, body').animate({ scrollTop:$("#"+$state.params.type).offset().top-80}, 500);
      }
    }
  }

}]);
