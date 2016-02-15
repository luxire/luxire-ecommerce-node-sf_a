angular.module('luxire')
.controller('ProductDetailController', function($scope, $stateParams, ProductDetailService, ImageHandler,  $location, $anchorScroll, $uibModal){
  /*fn to convert array of object in a object*/
  $scope.cart_object = {};
  $scope.luxire_styles = [];
  $scope.product = {};
  var json_array_to_obj = function(parent, arr){
    $scope[parent] = {};
    $scope.cart_object[parent] = {};
    angular.forEach(arr, function(val, key){
      $scope.cart_object[parent][val.name] = {name: '',options: {}};
      $scope[parent][val.name] = val.value;
    })
    console.log('after_conv',$scope[parent]);
    return $scope[parent];
  };


  ProductDetailService.showProduct($stateParams.product_name).then(function(data){
    console.log(data);
    $scope.product = data.data;
    $scope.images_array = [];
    angular.forEach($scope.product.master.images, function(val, key){
      $scope.images_array.push(val.id)
    })
    json_array_to_obj("customization_attributes", $scope.product.customization_attributes);
    json_array_to_obj("personalization_attributes", $scope.product.personalization_attributes);
    json_array_to_obj("measurement_std_attributes", $scope.product.measurement_std_attributes);
    json_array_to_obj("measurement_body_attributes", $scope.product.measurement_body_attributes);
    $scope.luxire_styles = data.data.luxire_style_masters;
    $scope.hideNext= $scope.product.luxire_style_masters.length>6 ? false : true;

  }, function(error){
    console.log(error);
  });

  $scope.choose_style = function(){
    var modal_instance = $uibModal.open({
      animation: true,
      templateUrl: 'choose_style.html',
      controller: 'ChooseStyleController',
      size: 'md',
      windowClass: 'choose-style-window',
      resolve: {
        luxire_styles: function () {
          return $scope.product.luxire_style_masters;
        }
      }
    });
    modal_instance.result.then(function (selected_style) {
      console.log(selected_style);
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.bespoke_style = function(){
    var modal_instance = $uibModal.open({
      animation: true,
      templateUrl: 'bespoke_style.html',
      controller: 'BespokeStyleController',
      size: 'lg',
      windowClass: 'bespoke-style-window',
      resolve: {
        product: function () {
          return $scope.product;
        },
        cart_object: function(){
          return $scope.cart_object;
        }
      }
    });
    modal_instance.result.then(function (cart_object) {
      console.log(cart_object);
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });

  };

  console.log($stateParams);
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  }
  var index = -1;
  $scope.activate_slide = function (id){
    index = $scope.images_array.indexOf(id);
    $scope.product.master.images[index].active = true;
  };

  $scope.set_attribute_value = function(attribute_type, attribute_key, attribute_value){
    $scope.cart_object[attribute_type][attribute_key]['name'] = attribute_value;
    console.log($scope.cart_object);
  };


  $scope.make_my_own_style = function(event){
    $anchorScroll.yOffset = angular.element(document.getElementById('product_detail')).prop('offsetTop') - 35;
    console.log('pos',angular.element(document.getElementById('product_detail')).prop('offsetTop'));
    $location.hash('make_my_own_style');
    $anchorScroll();
  };

  var tempObj=[];
  var slideStart=0;
  var slideEnd=6;
  $scope.hideNext= $scope.product.luxire_style_masters != undefined && $scope.product.luxire_style_masters.length>6 ? false : true;
  $scope.hidePrev=true;
  $scope.slideNext=function(){
    tempObj=$scope.product.luxire_style_masters;
    console.log("slide next is calling");
    slideStart++;
    console.log("slide start: "+slideStart);
    slideEnd++;
    if(slideStart!=0){
      $scope.hidePrev=false;
    }
    console.log("slide end: "+slideEnd);
    $scope.luxire_styles = tempObj.slice(slideStart,slideEnd);
    if(slideEnd==$scope.product.luxire_style_masters.length){
      $scope.hideNext=true;
    }

  }
  $scope.slidePrev=function(){

    tempObj=$scope.product.luxire_style_masters;;
    console.log("slide prev is calling");
    slideStart--;
    console.log("slide start: "+slideStart);
    slideEnd--;
    console.log("slide end: "+slideEnd);
    if(slideEnd!=$scope.product.luxire_style_masters.length){
      $scope.hideNext=false;
    }
    $scope.luxire_styles = tempObj.slice(slideStart,slideEnd);
    if(slideStart==0){
      $scope.hidePrev=true;
    }

  };
  $scope.selectSliderIndex=-1;
  $scope.selectSlider=function(index){
    console.log("index: "+index);
    //$(event.target).addClass('selectSlider');
    $scope.selectSliderIndex=index;

  };

})
.controller('ChooseStyleController', function($scope, $uibModalInstance, luxire_styles){
  console.log(luxire_styles);
  $scope.luxire_styles = luxire_styles;
  $scope.selectSliderIndex=-1;
  $scope.selected_style = {};
  $scope.selectSlider=function(index, selected_style){
    console.log("index: "+index);
    //$(event.target).addClass('selectSlider');
    $scope.selectSliderIndex=index;
    $scope.selected_style = selected_style;
  };

  $scope.done = function(){
    $uibModalInstance.close($scope.selected_style);
  };

  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };


})
.controller('BespokeStyleController', function($scope, $uibModalInstance, ImageHandler, product, cart_object){
  console.log('product', product);
  console.log('cart', cart_object);
  $scope.product = product;
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };
  $scope.selected_customization_attribute_index = 0;
  $scope.selected_customization_style_index = -1;
  $scope.selected_customization_attribute = $scope.product['customization_attributes'][0];
  $scope.activate_customization_attribute = function(customization_attribute, index){
    $scope.selected_customization_attribute_index = index;
    $scope.selected_customization_style_index = -1;
    $scope.selected_customization_attribute = customization_attribute;
    console.log(index);
    console.log($scope.selected_customization_attribute_index);
  };

  $scope.activate_customization_style  = function(style_object, index){
    $scope.selected_customization_style_index = index;
    console.log(style_object);
  };

  $scope.selectedOptions = {
    "collar":"",
    "cuffs": "",
    "back" :"",
    "pocket": "",
    "placket": ""
  }


  $scope.shirtDetails={
    "name": "Grey wool Flannel",
    "alt" : "Grey wool Flannel",
    "imgurl": "lib/filter-img/fabric2.jpg",
    "price": "$99.99",
    "fabric": "blue cotton",
    "fitStyle": [
      {
        "imgurl":"lib/filter-img/fabric1.jpg",
        "text":"Regular",
        "id":1,
      },
      {
        "imgurl":"lib/filter-img/fabric2.jpg",
        "text":"Retro",
        "id":2

      },
      {
        "imgurl":"lib/filter-img/fabric4.jpg",
        "text":"Classic",
        "id":3

      },
      {
        "imgurl":"lib/filter-img/fabric1.jpg",
        "text":"Minimalist",
        "id":4
      },
      {
        "imgurl":"lib/filter-img/fabric2.jpg",
        "text":"Regular",
        "id":5
      },
      {
        "imgurl":"lib/filter-img/fabric4.jpg",
        "text":"Retro",
        "id":6

      },
      {
        "imgurl":"lib/filter-img/fabric1.jpg",
        "text":"Classic",
        "id":7

      },
      {
        "imgurl":"lib/filter-img/fabric2.jpg",
        "text":"Regular",
        "id":8
      },
      {
        "imgurl":"lib/filter-img/fabric4.jpg",
        "text":"Minimalist",
        "id":9

      },
      {
        "imgurl":"lib/filter-img/fabric1.jpg",
        "text":"Retro",
        "id":10

      },
      {
        "imgurl":"lib/filter-img/fabric2.jpg",
        "text":"GMinimalist",
        "id":11
      },
      {
        "imgurl":"lib/filter-img/fabric4.jpg",
        "text":"Regular",
        "id":12
      },
      {
        "imgurl":"lib/filter-img/fabric1.jpg",
        "text":"Classic",
        "id":13

      },
      {
        "imgurl":"lib/filter-img/fabric2.jpg",
        "text":"Retro",
        "id":14

      }
    ],
    "collarStyle": [
      {
        "imgurl":"lib/collar-style/collar1.png",
        "text":"Semi Spread",
        "id":1
      },
      {
        "imgurl":"lib/collar-style/collar2.png",
        "text":"Button Down",
        "id":2

      },
      {
        "imgurl":"lib/collar-style/collar3.png",
        "text":"English Spread",
        "id":3

      },
      {
        "imgurl":"lib/collar-style/collar4.png",
        "text":"Spear Point",
        "id":4
      },
      {
        "imgurl":"lib/collar-style/collar5.png",
        "text":"Custom",
        "id":5
      }
    ],
    "cuffStyle": [
      {
        "imgurl":"lib/cuffs-style/style2.png",
        "text":"collar",
        "id":1
      },
      {
        "imgurl":"lib/cuffs-style/style3.png",
        "text":"cuffs",
        "id":2

      },
      {
        "imgurl":"lib/cuffs-style/style4.png",
        "text":"back",
        "id":3

      },
      {
        "imgurl":"lib/cuffs-style/style5.png",
        "text":"Spear Point",
        "id":4
      },
      {
        "imgurl":"lib/cuffs-style/style6.png",
        "text":"pocket",
        "id":5
      },
      {
        "imgurl":"lib/cuffs-style/style7.png",
        "text":"placket",
        "id":6

      },
      {
        "imgurl":"lib/cuffs-style/style8.png",
        "text":"pocket",
        "id":7
      },
      {
        "imgurl":"lib/cuffs-style/style9.png",
        "text":"Custom",
        "id":8
      }
    ],
    "description": [
      {
        "name" :"fabric",
        "value":"blue cotton"
      },
      {
        "name" :"Fit",
        "value":"Slim"
      },
      {
        "name" :"sleeve",
        "value":"Full"
      },
      {
        "name" :"collar",
        "value":"Semi Spread"
      },
      {
        "name" :"cuffs",
        "value":"Regular"
      },
      {
        "name" :"back",
        "value":"Pleaeted"
      },
    ]
  };
  $scope.selectedOptions=[
    {
      "name" :"fabric",
      "value":"blue cotton"
    },
    {
      "name" :"Fit",
      "value":"Slim"
    },
    {
      "name" :"sleeve",
      "value":"Full"
    },
    {
      "name" :"collar",
      "value":"Semi Spread"
    },
    {
      "name" :"cuffs",
      "value":"Regular"
    },
    {
      "name" :"back",
      "value":"Pleaeted"
    },
  ];
    // start of slider functionality
  $scope.luxire_styles = $scope.product.luxire_style_masters;

  console.log('luxire_styles length', $scope.luxire_styles.length);
    var tempObj=[];
    var slideStart=0;
    var slideEnd=8;
    $scope.hideNext= $scope.product.luxire_style_masters.length>9 ? false : true;
    $scope.hidePrev= slideStart==0? true: false;
    $scope.slideNext=function(){
      tempObj=$scope.product.luxire_style_masters;
      console.log("slide next is calling");
      slideStart++;
      console.log("slide start: "+slideStart);
      slideEnd++;
      if(slideStart!=0){
        $scope.hidePrev=false;
      }
      console.log("slide end: "+slideEnd);
      $scope.luxire_styles = tempObj.slice(slideStart,slideEnd);
      if(slideEnd==$scope.product.luxire_style_masters.length){
        $scope.hideNext=true;
      }

    }
    $scope.slidePrev=function(){

      tempObj=$scope.product.luxire_style_masters;;
      console.log("slide prev is calling");
      slideStart--;
      console.log("slide start: "+slideStart);
      slideEnd--;
      console.log("slide end: "+slideEnd);
      if(slideEnd!=$scope.product.luxire_style_masters.length){
        $scope.hideNext=false;
      }
      $scope.luxire_styles = tempObj.slice(slideStart,slideEnd);
      if(slideStart==0){
        $scope.hidePrev=true;
      }

    };
    $scope.selectSliderIndex=-1;
    $scope.selectSlider=function(index){
      console.log("index: "+index);
      //$(event.target).addClass('selectSlider');
      $scope.selectSliderIndex=index;

    };


  // $scope.mainObj=$scope.shirtDetails.fitStyle;
  // var tempObj=[];
  // var slideStart=2;
  // var slideEnd=12;
  // $scope.hideNext=false;
  // $scope.hidePrev=false;
  // $scope.slideNext=function(){
  //   tempObj=$scope.shirtDetails.fitStyle;
  //   console.log("slide next is calling");
  //   slideStart++;
  //   console.log("slide start: "+slideStart);
  //   slideEnd++;
  //   if(slideStart!=0){
  //     $scope.hidePrev=false;
  //   }
  //   console.log("slide end: "+slideEnd);
  //   $scope.mainObj=tempObj.slice(slideStart,slideEnd);
  //   if(slideEnd==14){
  //     $scope.hideNext=true;
  //   }
  //   for(i=0;i<10;i++){
  //     console.log("id : "+$scope.mainObj[i].id);
  //   }
  //
  // }
  // $scope.slidePrev=function(){
  //
  //   tempObj=$scope.shirtDetails.fitStyle;
  //   console.log("slide prev is calling");
  //   slideStart--;
  //   console.log("slide start: "+slideStart);
  //   slideEnd--;
  //   console.log("slide end: "+slideEnd);
  //   if(slideEnd!=14){
  //     $scope.hideNext=false;
  //   }
  //   $scope.mainObj=tempObj.slice(slideStart,slideEnd);
  //   if(slideStart==0){
  //     $scope.hidePrev=true;
  //   }
  //   for(i=0;i<10;i++){
  //     console.log("id : "+$scope.mainObj[i].id);
  //   }
  // }
  // end of slider functionality

  //start of onclick functionality
  $scope.selectedCuffsIndex = -1;
  $scope.selectCuffs=function(index,type){
    console.log(" cuff type: "+type);

    $scope.selectedCuffsIndex = index;

  }

  $scope.selectedCollarIndex = -1;
  $scope.selectCollar=function(index,type){
    console.log(" collar type: "+type);
    $scope.selectedCollarIndex = index;

  }
  $scope.selectedFitIndex = -1;
  $scope.selectFit=function(index,type){
    console.log(" fit type: "+type);
    $scope.selectedFitIndex= index;

  }

  //end of onclick functionality


})
