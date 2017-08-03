angular.module('luxire')
.controller('AttributeController', ['$scope', '$state', '$timeout','$http',function($scope, $state, $timeout, $http){
  var CONST_ATTR_PATH = 'app/customer/attribute_detail/partials/attributes/';
  $scope.attr_template = {
    url: ''
  };
  $scope.attr_template.url = "app/customer/attribute_detail/partials/attribute_detail.html";


  console.log('attribute params', $state.params.type);
  $scope.id_generator = function(val, attr_type_name){
    console.log('val', val, 'attr name', attr_type_name);
    console.log('generated str', (val.toLowerCase().split(" ").join("-")) + '-'+attr_type_name.toLowerCase().split(" ").join("-"));
    return (val.toLowerCase().split(" ").join("-")) + '-'+attr_type_name.toLowerCase().split(" ").join("-");
  };
  console.log('attr-type',$state.params.type);
  var attributes_map = {
    "back": "pleats",
    "left-pocket": "pocket",
    "right-pocket": "pocket",
    "yoke-style": "yoke"
  }


  if(!$state.params.attribute_name || !$state.params.type){
    $state.go('customer.home');
  }
  else{

    var nav_str = "";
    if(attributes_map[$state.params.attribute_name]){
      nav_str = "#"+$state.params.type + '-' +attributes_map[$state.params.attribute_name];
    }
    else{
      nav_str = "#"+$state.params.type + '-' +$state.params.attribute_name;
    }
    console.log('nav_str', nav_str);
    console.log('state params', $state.params);
    // $(document).ready(function(){
    //
    //   console.log('nav str', nav_str);
    //   if($(nav_str).length){
    //       $('html, body').animate({ scrollTop:$(nav_str).offset().top-80}, 500);
    //   }
    // });
    // $scope.$on('$viewContentLoaded', function(){
    //   if($(nav_str).length){
    //       $('html, body').animate({ scrollTop:$(nav_str).offset().top-80}, 500);
    //   }
    // });


    $scope.template_loaded = function(){
      console.log('content loaded',$("#"+$state.params.type).length );
      // if($("#"+$state.params.type).length){
      //   $('html, body').animate({ scrollTop:$("#"+$state.params.type).offset().top-80}, 500);
      // }
    }
  }

  var getAttributeDetails = function(){
     $http.get("assets/attributeHelpDetails.json").then(function(data){
       $scope.product_types = data.data;
       $timeout(function(){
         console.log('timeout fired');
         console.log('content loaded', $("#"+$state.params.type).length);
         if($(nav_str).length){
         $('html, body').animate({ scrollTop:$(nav_str).offset().top-80}, 500);
        }

      }, 1000);

      }, function(error){
        console.error("Error fetching attribute help details and the reason is ", error);
     })
  }

  getAttributeDetails();
  $scope.isArray = function(value){
    return angular.isArray(value) ? true : false;
  };
 
}]);
