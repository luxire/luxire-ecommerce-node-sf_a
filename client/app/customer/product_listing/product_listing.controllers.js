angular.module('luxire')
.controller('ProductListingController', function($scope, CustomerProducts, CustomerConstants, CustomerOrders, $uibModal, $rootScope, ImageHandler, $state, products, $stateParams){
  console.log('state params', $stateParams);
  window.scrollTo(0, 0);
  $('[data-toggle="tooltip"]').tooltip();
  $scope.stateParams = $stateParams;

  $scope.selected_filters = {};
  $scope.filter_properties = [];
  var filter_index = '';
  //weight, brand & material removed, thickness needs to be added in properties
  var required_filters = ['color', 'price', 'weave-type',  'pattern', 'wrinkle-resistant', 'thickness', 'transparency', 'construction'];
  var filter_display_names = ['COLOR', 'PRICE', 'WEAVE TYPE', 'PATTERN', 'WRINKLE RESISTANCE', 'THICKNESS', 'TRANSPARENCY', 'CONSTRUCTION',];
  var filter_db_column_names = ['product_color', 'PRICE', 'product_weave_type', 'pattern', 'wrinkle_resistance', 'thickness', 'transparency', 'construction'];

  $scope.color_variants = {
    white: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
      display_color: '#FFFFFF'
    },
    pink: {
      primary: '#5C0091',
      secondary: '#FE26A1',
      display_color: '#FC26A0'
    },
    blue: {
      primary: '#001683',
      secondary: '#00A7FF',
      display_color: '#00A6FD'

    },
    black: {
      primary: '#000000',
      secondary: '#4F5054',
      display_color: '#000000'
    },
    red: {
      primary: '#880000',
      secondary: '#FE0000',
      display_color: '#FC0000'
    },
    yellow: {
      primary: '#FFF300',
      secondary: '#FEDF85',
      display_color: '#FDF100'
    },
    green: {
      primary: '#005200',
      secondary: '#69BF26',
      display_color: '#68BD26'
    },
    orange: {
      primary: '#613309',
      secondary: '#F36524',
      display_color: '#613309'

    }
  };
  CustomerProducts.filter_properties()
  .then(function(data){
    console.log('Filter Properties', data.data);
    angular.forEach(data.data, function(val, key){
      filter_index = required_filters.indexOf(val.name);
      if(filter_index != -1){
        $scope.selected_filters[val.name] = 'all';
        val.display_name = filter_display_names[filter_index];
        val.value = 'all,'+val.value;
        $scope.filter_properties.push(val);
      }
    });
  }, function(error){
    console.error(error);
  });

  $scope.select_filter_option = function(property, option){
    $scope.selected_filters[property] = option;
  };

  $scope.filter_with_selections = function(product){
    console.log('filter with selections');
    var condition_array = [];
    angular.forEach($scope.selected_filters, function(val, key){
      if(val && val != '' && val != 'all'){
        if(key!='price' && key!='color'){
          if(product['luxire_product'][filter_db_column_names[required_filters.indexOf(key)]] == val){
            condition_array.push(true);
          }
          else{
            condition_array.push(false);
          }
        }
        else if(key == 'color'){
          if(product['luxire_product'][filter_db_column_names[required_filters.indexOf(key)]].toLowerCase().indexOf(val.toLowerCase())>-1){
            condition_array.push(true);
          }
          else{
            condition_array.push(false);
          }
        }
        else if(key == 'price'){
          if(val.toLowerCase().indexOf('under') > -1){
            if(parseFloat(product.price) < parseFloat(val.split('$')[1])){
              condition_array.push(true);
            }
            else{
              condition_array.push(false);
            }
          }
          else if(val.toLowerCase().indexOf('over') > -1){
            if(parseFloat(product.price) > parseFloat(val.split('$')[1])){
              condition_array.push(true);
            }
            else{
              condition_array.push(false);
            }
          }
          else{
            var selected_price = val.split('-');
            if((parseFloat(product.price) > parseFloat(selected_price[0].split('$')[1])) && (parseFloat(product.price) < parseFloat(selected_price[1].split('$')[1]))){
              condition_array.push(true);
            }
            else{
              condition_array.push(false);
            }

          }
        }
     }

    });
    if(condition_array.indexOf(false)>-1){
      return ;
    }
    else{
      return product;
    }
  };

  $scope.reverse_price = false;

  $rootScope.$on('fetched_order_from_cookie', function(event, data){
    console.log('event fired', data);
  });


  /*Search products*/



  $scope.allProductsData=[];

  if($stateParams.taxonomy_id && $stateParams.taxon_id){
    $scope.selected_taxonomy_name = $stateParams.taxonomy_name;
    $scope.selected_taxon_name = $stateParams.taxon_name;

    CustomerProducts.taxon_index($stateParams.taxonomy_id, $stateParams.taxon_id)
    .then(function(data){
      console.log('taxon products', data);
      $scope.allProductsData = data.data.products;
    }, function(error){
      console.error(error);
    });
  }
  else{
    $scope.selected_taxonomy_name = CustomerConstants.default.taxonomy_name;
    $scope.selected_taxon_name = CustomerConstants.default.taxon_name;
    $state.go('customer.product_listing', {
      taxonomy_name: CustomerConstants.default.taxonomy_name,
      taxon_name: CustomerConstants.default.taxon_name,
      taxonomy_id: CustomerConstants.default.taxonomy_id,
      taxon_id: CustomerConstants.default.taxon_id,
    });
  }
  $scope.go_to_product_detail = function(product_name){
    $state.go('customer.product_detail',{taxonomy_name: $scope.selected_taxonomy_name,taxon_name: $scope.selected_taxon_name,product_name: product_name});
  };

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  }

  /*Get weight icon*/
  $scope.weight_index = function(variant_weight){

    if((parseFloat(variant_weight)-50)<0){
      return 1;
    }
    else if((parseFloat(variant_weight)-50)>150){
      return 12;
    }
    else{
      return parseInt((parseFloat(variant_weight)-50)/12.5)+1;
    };
  };
  var thickness = 0;
  /*Get Thickness icon*/
  $scope.thickness_index = function(variant_thickness){
    thickness = parseInt(variant_thickness.split('.')[1].split('mm')[0]);
    if(thickness/10 >5){
      return 6;
    }
    else {
      return Math.ceil(thickness/10);
    }
  };
  /*Get stiffness icon*/
  $scope.stiffness_index = function(variant_stiffness, stiffness_unit){
    if(stiffness_unit=='m'){
      variant_stiffness = parseFloat(variant_stiffness)*100;
    }
    else if(stiffness_unit=='cm'){
      variant_stiffness = parseFloat(variant_stiffness);
    }

    if(variant_stiffness/1.25 >8){
      return 8;
    }
    else{


      return Math.ceil(variant_stiffness/1.25);
    }

  };

  $scope.order_swatch = function(variant){
    console.log(variant);
    if($rootScope.luxire_cart && $rootScope.luxire_cart.line_items){
      CustomerOrders.add_line_item($rootScope.luxire_cart, {}, variant)
      .then(function(data){
        CustomerOrders.get_order_by_id($rootScope.luxire_cart).then(function(data){
          $rootScope.luxire_cart = data.data;
          // $state.go('customer.cart');
          $rootScope.alerts.push({type: 'success', message: 'Item added to cart'});
        }, function(error){
          console.error(error);
        });
        console.log(data);
      },function(error){
        console.error(error);
      });
    }
    else{
      CustomerOrders.create_order({}, variant, false)
      .then(function(data){
        $rootScope.luxire_cart = data.data;
        // $state.go('customer.cart');
        $rootScope.alerts.push({type: 'success', message: 'Item added to cart'});
        console.log(data);
      },function(error){
        console.error(error);
      });
    }

  };



  $scope.productDesc=[];
   $scope.result=[];
   $scope.colorArr = [];
   $scope.priceArr = [];
   $scope.materialArr=[];
   $scope.weightArr=[];
   $scope.topSearchBar=true;
   var topSearchBaeCount=-1;

   $scope.showTopSearchBar=function(){
        //console.log("fun is calling..");
        topSearchBaeCount++;
        if(topSearchBaeCount % 2===0){
           $scope.topSearchBar=false;
        }else {
          $scope.topSearchBar=true;
        }
   }

   /*Selected filters*/
   $scope.selected_weave_type = ""

   $scope.selected_weavetype = function(weave_type, option){
     $scope.selected_weave_type = option;
     console.log('weave_type', weave_type);
     console.log('option', option);
   };


   // start of filteration category
  $scope.toggle=function(item){
    item.value = item.value === false ? true: false;
    console.log("toogle fu is calling...");
    console.log("item value: ",item.value);

  }
 // end of filteration category

 // start of filteration implementation
 $scope.priceArr = [];   //price filteration
 $scope.materialArr=[];
 $scope.patternArr=[];
 $scope.isCheckedPrice = function(id){
     var match = false;
     for(var i=0 ; i < $scope.priceArr.length; i++) {
       if($scope.priceArr[i].id == id){
         match = true;
       }
     }
     return match;
 };
 $scope.syncPrice = function(bool, priceStart, priceEnd){
   if(bool){
     // add item
     $scope.priceArr.push({start: priceStart, end: priceEnd});
   } else {
     // remove item
     for(var i=0 ; i < $scope.priceArr.length; i++) {
       if($scope.priceArr[i].start == priceStart && $scope.priceArr[i].end==priceEnd){
         $scope.priceArr.splice(i,1);
       }
     }
   }
 };
 $scope.minPrice=0;
 $scope.maxPrice=1500;
 $scope.priceRangeFilter=function(min,max){
    console.log("price range filter is calling..");
    $scope.priceArr.push({start: parseInt(min), end: parseInt(max)});
    console.log("price array :",$scope.priceArr);

 }
 $scope.priceFilter=function(product){
  //  console.log("price of product: ",product.price);
   if($scope.priceArr.length==0)
      return product;
  else{
   //var temp=[];
   for(i=0;i<$scope.priceArr.length;i++){
     /*if($scope.priceArr[i]==300){
      if(product.price>=$scope.priceArr[i])
          return product;
     }*/
     if(product.price >= $scope.priceArr[i].start && product.price <= $scope.priceArr[i].end){
     //temp=product;
     console.log("priceFiltered :"+product.id);
     return product;
   }
   }
   return '';
 }
 } // end of price filteration

//-------------------------- MATERIAL FILTERAION  ---------------------------
 $scope.isCheckedMaterial = function(id){
     var match = false;
     for(var i=0 ; i < $scope.materialArr.length; i++) {
       if($scope.materialArr[i].id == id){
         match = true;
       }
     }
     return match;
 };
 $scope.syncMaterial = function(bool, material){
   if(bool){
     // add item
     $scope.materialArr.push(material);
   } else {
     // remove item
     for(var i=0 ; i < $scope.materialArr.length; i++) {
       if($scope.materialArr[i] == material){
         $scope.materialArr.splice(i,1);
       }
     }
   }
 };
 $scope.materialFilter=function(product){
   if($scope.materialArr.length==0)
      return product;
  else{
   console.log("material filter is calling with product price: "+product.luxire_product.material);
   var temp=[];
   for(i=0;i<$scope.materialArr.length;i++){
     if(product.luxire_product.material == $scope.materialArr[i]){
     console.log("materialFiltered :"+product.id);
     return product;
   }
   }
   return '';
 }
 }
 //-------------------------- MATERIAL FILTERAION  ---------------------------

 //-------------------------- PATTERN FILTERAION  ---------------------------
 $scope.isCheckedPattern = function(id){
     var match = false;
     for(var i=0 ; i < $scope.patternArr.length; i++) {
       if($scope.patternArr[i].id == id){
         match = true;
       }
     }
     return match;
 };
 $scope.syncPattern = function(bool, pattern){
   if(bool){
     // add item
     $scope.patternArr.push(pattern);
   } else {
     // remove item
     for(var i=0 ; i < $scope.patternArr.length; i++) {
       if($scope.patternArr[i] == pattern){
         $scope.patternArr.splice(i,1);
       }
     }
   }
 };
 $scope.patternFilter=function(product){
   if($scope.patternArr.length==0)
      return product;
  else{
   console.log("material filter is calling with product price: "+product.luxire_product.pattern);
   var temp=[];
   for(i=0;i<$scope.patternArr.length;i++){
     if(product.luxire_product.pattern == $scope.patternArr[i]){
     console.log("pattern Filtered :"+product.id);
     return product;
   }
   }
   return '';
 }
 }
 //-------------------------- PATTERN FILTERAION  ---------------------------

 //-------------------------- WEIGHT FILTERAION  ---------------------------
 $scope.weightArr=[];
 $scope.isCheckedWeight = function(id){
     var match = false;
     for(var i=0 ; i < $scope.weightArr.length; i++) {
       if($scope.weightArr[i].id == id){
         match = true;
       }
     }
     return match;
 };

 $scope.syncWeight = function(bool, price){
   if(bool){
     // add item
     $scope.weightArr.push(price);
   } else {
     // remove item
     for(var i=0 ; i < $scope.weightArr.length; i++) {
       if($scope.weightArr[i] == price){
         $scope.weightArr.splice(i,1);
       }
     }
   }
 };
 $scope.weightFilter=function(product){
   if($scope.weightArr.length==0)
      return product;
  else{
   console.log("weight filter is calling with product price: "+product.luxire_product.product_tags);
   var temp=[];
   for(i=0;i<$scope.weightArr.length;i++){
     if(product.luxire_product.product_tags == $scope.weightArr[i]){
     console.log("weightFiltered :"+product.id);
     return product;
   }
   }
   return '';
 }
 }

 //-------------------------- WEIGHT FILTERAION  ---------------------------
 //-------------------------- WEAVE FILTERAION  ---------------------------
 $scope.weaveArr=[];
 $scope.isCheckedWeave = function(id){
     var match = false;
     for(var i=0 ; i < $scope.weaveArr.length; i++) {
       if($scope.weaveArr[i].id == id){
         match = true;
       }
     }
     return match;
 };

 $scope.syncWeave = function(bool, weave){
   if(bool){
     // add item
     $scope.weaveArr.push(weave);
   } else {
     // remove item
     for(var i=0 ; i < $scope.weaveArr.length; i++) {
       if($scope.weaveArr[i] == weave){
         $scope.weaveArr.splice(i,1);
       }
     }
   }
 };
 $scope.weaveFilter=function(product){
   if($scope.weaveArr.length==0)
      return product;
  else{
   console.log("weight filter is calling with product price: "+product.luxire_product.product_weave_type);
   var temp=[];
   for(i=0;i<$scope.weaveArr.length;i++){
     if(product.luxire_product.product_weave_type == $scope.weaveArr[i]){
     console.log("weightFiltered :"+product.id);
     return product;
   }
   }
   return '';
 }
 }

 //-------------------------- WEAVE FILTERAION  ---------------------------
 //-------------------------- WEAVE FILTERAION  ---------------------------
 $scope.transparencyArr=[];
 $scope.isCheckedTransparency = function(id){
     var match = false;
     for(var i=0 ; i < $scope.transparencyArr.length; i++) {
       if($scope.transparencyArr[i].id == id){
         match = true;
       }
     }
     return match;
 };

 $scope.syncTransparency = function(bool, weave){
   if(bool){
     // add item
     $scope.transparencyArr.push(weave);
   } else {
     // remove item
     for(var i=0 ; i < $scope.transparencyArr.length; i++) {
       if($scope.transparencyArr[i] == weave){
         $scope.transparencyArr.splice(i,1);
       }
     }
   }
 };
 $scope.transparencyFilter=function(product){
   if($scope.transparencyArr.length==0)
      return product;
  else{
   console.log("weight filter is calling with product price: "+product.luxire_product.transparency);
   var temp=[];
   for(i=0;i<$scope.transparencyArr.length;i++){
     if(product.luxire_product.transparency == $scope.transparencyArr[i]){
     console.log("transparency Filtered :"+product.id);
     return product;
   }
   }
   return '';
 }
 }

 //-------------------------- WEAVE FILTERAION  ---------------------------
 //-------------------------- WRINKLE FILTERAION  ---------------------------
 $scope.wrinkleArr=[];
 $scope.isCheckedWrinkle = function(id){
     var match = false;
     for(var i=0 ; i < $scope.wrinkleArr.length; i++) {
       if($scope.wrinkleArr[i].id == id){
         match = true;
       }
     }
     return match;
 };

 $scope.syncWrinkle = function(bool, weave){
   if(bool){
     // add item
     $scope.wrinkleArr.push(weave);
   } else {
     // remove item
     for(var i=0 ; i < $scope.wrinkleArr.length; i++) {
       if($scope.wrinkleArr[i] == weave){
         $scope.wrinkleArr.splice(i,1);
       }
     }
   }
 };
 $scope.wrinkleFilter=function(product){
   if($scope.wrinkleArr.length==0)
      return product;
  else{
   console.log("product is calling with wrinkle: "+product.luxire_product.wrinkle_resistance);
   for(i=0;i<$scope.wrinkleArr.length;i++){
     if(product.luxire_product.wrinkle_resistance == $scope.wrinkleArr[i].text){
     console.log("wrinkle Filtered :"+product.id);
     return product;
   }
   }
   return '';
 }
 }

 //-------------------------- WRINKLE FILTERAION  ---------------------------



 //--------------------------   COLOR FILTERAION  ---------------------------
 $scope.toggle=function(item){
   item.value = item.value === false ? true: false;
   console.log("toogle fu is calling...");
   console.log("item value: ",item.value);

 }
 $scope.hoverIn = function(item){
   console.log("calling hover in...");
        item.mouse = true;
    };

    $scope.hoverOut = function(item){
      console.log("calling hover out...");
        item.mouse = false;
    };
 $scope.colorArr=[];
 $scope.syncColor=function(colorObj){
   var color=colorObj.name;
   console.log("selected color: "+color);
   if($scope.colorArr.length==0){

     $scope.colorArr.push({color: color});
   }else{
     for(var i=0 ; i < $scope.colorArr.length; i++) {
       if($scope.colorArr[i].color == color){
         $scope.colorArr.splice(i,1);
         console.log("splice color: "+color);
         return '';
       }
     }
     $scope.colorArr.push({color: color});
     console.log("color arr: ",colorArr);
   }
 }

 $scope.colorFilter=function(product){
   if($scope.colorArr.length==0)
      return product;
  else{
   console.log("color filter is calling with product color: "+product.luxire_product.product_color);
   var temp=[];
   for(i=0;i<$scope.colorArr.length;i++){
     if(product.luxire_product.product_color == $scope.colorArr[i].color){
     console.log(" color Filtered :"+product.id);
     return product;
   }
   }
   return '';
 }
 }

 //-------------------------- COLOR FILTERAION  ---------------------------
 $scope.reverse=false;
 $scope.predicate="price";
 $scope.priceSort=function(priceTag){
   console.log("price sort fun is calling...");
   console.log("tag :"+priceTag );
   if(priceTag == "low to high"){
     console.log("low to high is calling...");
     $scope.reverse=false;
   }else if(priceTag == "high to low"){
     console.log("high to low is calling...");
     $scope.reverse=true;
   }
 }



 // end of filteration implementation

 $scope.productObj=$scope.casualFabrics;
 $scope.showCasual=function(){
   $scope.productObj=$scope.casualFabrics;
 }
 $scope.showFormal=function(){
   $scope.productObj=$scope.formalFabrics;
 }
 $scope.showDress=function(){
   $scope.productObj=$scope.dressFabrics;
 }
 //******** start of quick view **********


    $scope.animationsEnabled = true;
    $scope.showQuickView=function(product, size){
      console.log("quick view fun is calling...");
      console.log("product: ",product);
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'quickViewContent.html',
        controller: 'quickViewModalController',
        windowClass: 'quick-view-modal',
        //size: size,
        resolve: {
          product: function () {
            return product;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
        console.log("modal return value is : ",selectedItem);
      }, function () {
        console.info('Modal dismissed at: ' + new Date());
      });

    }


   //******** end of quick view **********
})
.controller('quickViewModalController',function($scope, $uibModalInstance, product, CustomerOrders, $state, ImageHandler){
  $scope.weight_index = function(variant_weight){
    console.log('variant_weight', variant_weight);
    console.log(parseFloat(variant_weight)-50)
    if((parseFloat(variant_weight)-50)<0){
      return 1;
    }
    else if((parseFloat(variant_weight)-50)>150){
      return 12;
    }
    else{
      return parseInt((parseFloat(variant_weight)-50)/12.5)+1;
    };
  };

  var thickness = 0;
  /*Get Thickness icon*/
  $scope.thickness_index = function(variant_thickness){
    thickness = parseInt(variant_thickness.split('.')[1].split('mm')[0]);
    if(thickness/10 >5){
      return 6;
    }
    else {
      return Math.ceil(thickness/10);
    }
  };
  /*Get stiffness icon*/
  $scope.stiffness_index = function(variant_stiffness, stiffness_unit){
    if(stiffness_unit=='m'){
      variant_stiffness = parseFloat(variant_stiffness)*100;
    }
    else if(stiffness_unit=='cm'){
      variant_stiffness = parseFloat(variant_stiffness);
    }

    if(variant_stiffness/1.25 >8){
      return 8;
    }
    else{


      return Math.ceil(variant_stiffness/1.25);
    }

  };

  $scope.wash_care = function(variant_wash_care){
    if(variant_wash_care.toLowerCase().indexOf('machine')>-1){
      return 'machine';
    }
    else if(variant_wash_care.toLowerCase().indexOf('hand')>-1){
      return 'hand';
    }
  };

  $scope.get_ounce_weight = function(gram_weight){
    console.log('gram_weight', gram_weight);
    return (parseFloat(gram_weight)/28.3).toFixed(2);
  };


  $scope.getImage = function(url){
    console.log('url', url);
    return ImageHandler.url(url);
  }

  $scope.quickViewProduct = product;
  $scope.go_to_product_detail = function (product_name) {
    $uibModalInstance.close();
    $state.go('customer.product_detail',{taxonomy_name: $scope.selected_taxonomy_name,taxon_name: $scope.selected_taxon_name,product_name: product_name});


  };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
});


//    $scope.priceTagOption=[
//      {
//        "id": 1,
//        "name": 'Most Popular',
//        "value": "most popular",
//        "selected":true
//      },
//      {
//        "id": 2,
//        "name": 'New Arrival',
//        "value": "new arrival",
//        "selected":false
//      },
//      {
//        "id": 3,
//        "name": 'Price <Low to High>',
//        "value": "low to high",
//        "selected":false
//      },
//      {
//        "id": 4,
//        "name": 'Price <High to Low>',
//        "value": "high to low",
//        "selected":false
//      },
//    ];
//
//    $scope.allOptions = [
//      {
//        "id": 1,
//        "color1": {name:"green", value: false, mouse: false},
//        "color2": {name:"black", value: false, mouse: false},
//        "color3": {name:"Fuchsia ", value: false, mouse:false}
//      },
//      {
//        "id": 2,
//        "color1": {name:"DarkOliveGreen", value: false, mouse: false},
//        "color2": {name:"Maroon", value: false, mouse: false},
//        "color3": {name:"GreenYellow", value: false}
//      },
//      {
//        "id": 3,
//        "color1": {name:"yellow", value: false, mouse:false},
//        "color2": {name:"Cyan", value: false, mouse:false},
//        "color3": {name:"LightSteelBlue", value: false, mouse:false}
//      },
//      {
//        "id": 4,
//        "color1": {name:"blue", value: false, mouse:false},
//        "color2": {name:"grey", value: false, mouse:false},
//        "color3": {name:"red", value: false, mouse:false},
//      },
//
//    ];
//
//    $scope.priceRange = [
//      {
//        "id": 1,
//        "priceStart": 0,
//        "priceEnd": 100,
//        "text":"Rs. $100 and below"
//      },
//      {
//        "id": 2,
//        "priceStart": 100,
//        "priceEnd": 150,
//        "text":"Rs. $100 - Rs. $150"
//      },
//      {
//        "id": 3,
//        "priceStart": 150,
//        "priceEnd": 200,
//        "text":"Rs. $150 - Rs. $200"
//      },
//      {
//        "id": 4,
//        "priceStart": 200,
//        "priceEnd": 250,
//        "text":"Rs. $200 - Rs. $250"
//      },
//      {
//        "id": 5,
//        "priceStart": 250,
//        "priceEnd": 300,
//        "text":"Rs. $250 - Rs. $300"
//      },
//      {
//        "id": 6,
//        "priceStart": 300,
//        "priceEnd": 1000,
//        "text":"Above Rs. $300"
//      },
//
//    ];
//    $scope.materialOption=[
//      {
//      "id": 1,
//      "text": "cotton"
//      },
//      {
//      "id": 2,
//      "text": "linen"
//      },
//      {
//      "id": 3,
//      "text": "wool"
//      },
//      {
//      "id": 4,
//      "text": "silk"
//      }
//  ];
//  $scope.patternOption=[
//    {
//    "id": 1,
//    "text": "plain"
//    },
//    {
//    "id": 2,
//    "text": "checks"
//    },
//    {
//    "id": 3,
//    "text": "stripes"
//    },
//    {
//    "id": 4,
//    "text": "printed"
//    }
// ];
//  $scope.weightOption=[
//    {
//    "id": 1,
//    "text": "light weight"
//    },
//    {
//    "id": 2,
//    "text": "medium weight"
//    },
//    {
//    "id": 3,
//    "text": "heavy weight"
//    },
//    {
//    "id": 4,
//    "text": "0thers"
//    }
//  ];
//  $scope.weaveOption=[
//    {
//    "id": 1,
//    "text": "plain"
//    },
//    {
//    "id": 2,
//    "text": "twill"
//    },
//    {
//    "id": 3,
//    "text": "satin"
//    },
//    {
//    "id": 4,
//    "text": "basket"
//    }
//  ];
//
//  $scope.transparencyOption=[
//    {
//    "id": 1,
//    "text": "opaque"
//    },
//    {
//    "id": 2,
//    "text": "see through"
//    }
//  ];
//  $scope.wrinkleOption=[
//    {
//    "id": 1,
//    "text": "true",
//    "value": "Yes"
//    },
//    {
//    "id": 2,
//    "text": "false",
//    "value": "No"
//    }
//  ];
//
