angular.module('luxire')

.controller('productsHomeController',function($scope, products, allTaxons, luxireProperties, luxireVendor, fileReader, fileUpload, prototypeObject, $uibModal, $log, createProductModalService, $state, csvFileUpload, ImageHandler){
  $scope.loading = true;
  //Edited on 20/05/16 scroll implementation
  $scope.jsonresponse = [];
   $scope.jsonresponse1 = [];
   $scope.prefetchProducts =[];
  $scope.prefetch = function() {
    $scope.loading = false;
    // console.log($scope.jsonresponse);
    if ($scope.current_page < $scope.pages) {
      $scope.current_page = parseInt($scope.current_page) + 1;
      $scope.prefetchProducts =[];
      products.getProducts('?page=' + $scope.current_page).then(function(data) {
        $scope.prefetchProducts =  data.data.products;
      })
    } else {
      $scope.loading = false;
    }
  }

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  $scope.scrollLoad = function() {
    if ($scope.current_page <= $scope.pages) {
      angular.forEach($scope.prefetchProducts, function(val, key){
        $scope.jsonresponse.push(val);
      });
      $scope.prefetchProducts =[];
      // $scope.jsonresponse.concat($scope.prefetchProducts);
      $scope.prefetch();
        // $scope.jsonresponse.push.apply($scope.jsonresponse ? $scope.jsonresponse : [], $scope.prefetchProducts);
    }else {
      $scope.loading = false;

    }
  }
//*************scroll implementation**************


  $scope.upload_product_image = function(files){
    console.log('product image', files[0]);
    if (files && files.length) {
      $scope.product_image = files[0];
      var reader = new FileReader();
       reader.onload = function (e) {
           $('#product_image').attr('src', e.target.result);
       }

       reader.readAsDataURL(files[0]);
      // fileUpload.upload(files[0]);
          console.log('files to upload',files[0]);
    }
  }

  $scope.post_image = function(){
    products.add_variant_image(24, 34, $scope.product_image)
    .then(function(data){
      console.log(data);
    }, function(error){
      console.error(error);
    });
  };
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();
  $scope.maxDate = new Date(2020, 5, 22);

  $scope.open = function($event) {
    $scope.status.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  $scope.status = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };

  // --------------------------   START ANGULAR ALERT FUNCTIONALITY    -------------------------
  $scope.alerts = [];
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    console.log(index);
    $scope.alerts.splice(index, 1);
  };

  // --------------------------   END ANGULAR ALERT FUNCTIONALITY    -------------------------
  // --------------------------  17th march change-3 START GET ALL PRODUCTS TO SHOW    -------------------------
  $scope.masterSearchJson;
  //$scope.loading = true;
  var totalTaxons;
  products.getProducts().then(function(data) {
      $scope.loading = true;
      $scope.jsonresponse = data.data.products;
      //edited on 18/04/16 scroll implementation
      $scope.current_page = data.data.current_page;
      $scope.pages = data.data.pages;
      //*************
      console.log("***** all product json is:",$scope.jsonresponse);
      $scope.masterSearchJson = $scope.jsonresponse;
      $scope.loading = false;
      allTaxons.getTaxonsPerPage(totalTaxons).then(function(data) {
        $scope.taxonsJson = data.data;
        console.log("all taxons per page: ",$scope.taxonsJson);
        // $scope.loading = false;
        totalTaxons = data.data.count;
        //$scope.loading = false;
        // allTaxons.getTaxonsPerPage(totalTaxons).then(function(data) {
        //   $scope.allTaxonsJson = data.data.taxons;
        //   console.log("total taxons are: ",$scope.allTaxonsJson);
        // }, function(info){
        //   console.log(info);
        // })
      }, function(info){
        console.log(info);
      })

      // luxireProperties.luxirePropertiesIndex().then(function(data) {
      //   console.log('admin luxire properties values are ...');
      //   //console.log(data);
      //   $scope.luxireProperties = data.data;
      //   //$scope.loading = false;
      //   console.log($scope.luxireProperties);
      //   console.log("type of properties: ",typeof($scope.luxireProperties[0]));
      //   var arr=$scope.luxireProperties[0].value.split(',');
      //   console.log("arr\n\n",arr);
      // }, function(info){
      //   console.log(info);
      // })

      luxireVendor.getAllLuxireVendor().then(function(data) {
        console.log('admin luxire vendor values are ...\n\n');
        //console.log(data);
        $scope.luxireVendor = data.data;
        $scope.loading = false;
        console.log($scope.luxireVendor);
      }, function(info){
        console.log(info);
      })

      products.allProductType().then(function(data) {
    		$scope.loading= false;
    		console.log("values of all product type \n\n");
    		$scope.allproductType=data.data;
    		console.log("\n\nall product type values are \n\n",data.data);

    	}, function(info){
    		console.log(info);
    	})

      $scope.loading = false;
      //edited on 20/05/16 scroll implementation
     $scope.prefetch();
     //***********


  }, function(info){
    console.log(info);
  })


  $scope.searchProductsJson;
  $scope.noProductMsg = false; // 18th march
  $scope.searchProductByQuery = function(query,event){

    $scope.loading = true;
    if(event.keyCode == 13){
      products.searchProducts(query).then(function(data){
         $scope.searchProductsByQueryJson = data;
         $scope.masterSearchJson = $scope.searchProductsByQueryJson;
         $scope.loading = false;
         if($scope.masterSearchJson.length == 0){  // 18th march
           $scope.noProductMsg = true;
         }else{
           $scope.noProductMsg = false;
         }
         console.log("====== search products json is=====: ",$scope.masterSearchJson);
       }, function(info){
         console.log("error: ",info);
       })

    }else{
      if(query.length == 0){
        console.log("query: ",query);
        $scope.masterSearchJson = $scope.jsonresponse;
        $scope.loading = false;
      }

    }

  }

  // --------------------------   17TH MARCH change-1 PRODUCT SEARCH FUNCTIONALITY    -------------------------






  // --------------------------   START GET ALL PRODUCTS TO SHOW    -------------------------


  //controller function for file reader
  $scope.uploadSponsorLogo = function(files) {
          if (files && files.length) {
          $scope.sponsorLogoFileName = files[0].name
          fileReader.readAsDataUrl(files[0], $scope).then(function(result) {
          $scope.productImage = result;
					console.log("image-url: "+$scope.productImage);
        })
      }
    }

  $scope.uploadFile = function(files){
    if (files && files.length) {
      fileUpload.upload(files[0]);
          console.log('files to upload',files[0]);
    }
  }

  $scope.deleteProducts = function(id,index) {
    products.deleteProduct(id).then(function(data){
      $scope.alerts.push({type: 'success', message: 'Product deleted successfully!'});
			$scope.jsonresponse.data.products.splice(index,1);
      //alert('Product deleted successfully');
      $scope.activeButton('products')
    }, function(info) {
      console.log(info);
    })
  }

  $scope.swatchPrice=1;
	$scope.modalCount=0;
	$scope.animationsEnabled = true;
	$scope.dummyInventoryData='';
  $scope.pid='';


  $scope.luxireStock='';
	$scope.parentSkuStatus='';
	$scope.parentSkuFalseCount=0;
	var productTypeId='';
	var parentSkuObj='';

  // --------------------------   START CHECK PARENT SKU STATUS   -------------------------

  $scope.checkParentSku=function(sku){
    console.log("checkParentSku fun is calling 1...");
    var parentSku={
      parent_sku: sku,
    }
    createProductModalService.checkParentSku(parentSku).then(function(res){
       //console.log(" parent sku response is: ",res.msg);
       $scope.parentSkuStatus=res.msg;
       if($scope.parentSkuStatus == "false") {
           console.log("parent sku false part");
             $scope.alerts.push({type: 'success', message: 'Inventory Is Not Exists!\nCreate The Inventory! '});
					 console.log("sku status: ",$scope.parentSkuStatus);
					 parentSkuObj = parentSku;
					 $scope.parentSkuFalseCount=0;
					 console.log("perentskuObj: ",parentSkuObj);
           //$scope.alerts.push({type: 'success', message: 'Create the inventory first..!'});


       }else{
				 console.log("parent sku true part..");
				 $scope.parentSkuStatus=true;
         $scope.luxireStock=res;
				 $scope.parentSkuFalseCount=0;
				 console.log("+++++++++++++++++false count: "+$scope.parentSkuFalseCount);
				 parentSkuObj = $scope.luxireStock;
				 console.log("sku status: ",$scope.parentSkuStatus);
					console.log("luxire stock object: ",$scope.luxireStock);
          $scope.alerts.push({type: 'success', message: 'Inventory Exists.'});

       }

     }, function(info) {
       console.log(info);
     })

  }
  // --------------------------   END CHECK PARENT SKU STATUS   -------------------------

  // --------------   START OF OPEN MODAL FUNCTIONALITY TO UPLOAD CSV FILE    ---------------

  $scope.importModal=function(size){
    var importCsvModalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'importCsvModal.html',
      controller: 'importCsvModalController',
      size: size
    });
    importCsvModalInstance.result.then(function (res) {
  }, function () {
    $log.info('Modal dismissed at: ' + new Date());
  });

  }
  // --------------   END OF OPEN MODAL FUNCTIONALITY TO UPLOAD CSV FILE    ---------------

  // --------------   START OF OPEN MODAL FUNCTIONALITY TO SHOW THE INVENTORY    ---------------

  $scope.openModal = function (size) {
    $scope.modalCount++;
    console.log("modal count: "+$scope.modalCount);
    if($scope.modalCount>1){
			console.log("parent sku object: ",parentSkuObj);
      console.log("dummy data is : ",$scope.dummyInventoryData);
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'createProductInventoryModal.html',
        controller: 'createProductInventoryModalController',
        size: size,
        resolve: {
          luxireStock: function () {
            return { count:$scope.modalCount,data:$scope.dummyInventoryData, parent_sku_obj: parentSkuObj, sku_status:$scope.parentSkuStatus, falseCount: $scope.parentSkuFalseCount};
          }
        }
      });
    }else{
			console.log("parent sku object: ",parentSkuObj);
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'createProductInventoryModal.html',
        controller: 'createProductInventoryModalController',
        size: size,
        resolve: {
          luxireStock: function () {
            return {count:$scope.modalCount, data: $scope.luxireStock, parent_sku_obj:parentSkuObj, sku_status:$scope.parentSkuStatus};
          }
        }
      });
    }


    modalInstance.result.then(function (luxireStock) {
      $scope.luxireStock = luxireStock;
      console.log("modal return value is : ",$scope.luxireStock);
			$scope.parentSkuFalseCount++;
      $scope.dummyInventoryData=$scope.luxireStock;
			console.log("dummy result: ",$scope.dummyInventoryData);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  // --------------   END OF OPEN MODAL FUNCTIONALITY TO SHOW THE INVENTORY    ---------------

  // --------------   START OF TAGS INPUT DECLARATION   ---------------

  $scope.colorTags = [];
  $scope.seasonTags = [];
  $scope.tagsarr = [];
  $scope.colorTagsArr = [];

  $scope.dummySeasons = [
    {"text": "Summer"},
    {"text": "Winter"},
    {"text": "Spring"},
    {"text": "Autumn"},
    {"text": "Monsoon"}
  ]

  $scope.loadSeason = function(query) {
    if (query == 'color') {
      return $scope.dummyColors;
    } else if (query == 'season') {
      return $scope.dummySeasons;
    }
   return {};
 }

 // --------------   END OF TAGS INPUT DECLARATION   ---------------

 // start of bind the all taxons value
 $scope.rule=[];
 $scope.taxon_ids=[];

 $scope.loadItems = function(query){
   console.log('load items query', query);
   return $scope.allTaxonsJson;
 };



 // end of bind the all taxons value


 // --------------   START OF CREATING THE PRODUCT STRUCTURE TO POST    ---------------

    $scope.checkShippingCatgoryId = function(shippingId){
      console.log("checkShippingCatgoryId is calling...");
      $scope.shipping_emp_msg = false;
      console.log("checkShippingCatgoryId: ",shippingId);
      if(shippingId == '' || shippingId == undefined){
        $scope.shipping_emp_msg = true;
      }else{
        $scope.shipping_emp_msg = false;
      }
    }
  	$scope.createProduct = function() {
        // start: 18th march change: put validation for mandatory fields
        console.log("product name: "+$scope.product.name);
        if(($scope.product.name == '' || $scope.product.name == undefined )
        || ($scope.luxireProduct.parent_sku == '' || $scope.luxireProduct.parent_sku == undefined)
        || ($scope.product.shipping_category_id == '' || $scope.product.shipping_category_id == undefined)
        || ($scope.product.price == '' || $scope.product.price == undefined)
        || ($scope.luxire_product.luxire_product_type_id == undefined || $scope.luxire_product.luxire_product_type_id == '')
        || ($scope.uxireProduct.luxire_vendor_master_id == undefined || $scope.uxireProduct.luxire_vendor_master_id == '')
      ){
            console.log("need to fill the mandatory fields...");
             $scope.alerts.push({type: 'danger', message: 'Mandatory fields are empty..!'});
            return;
        }else{ // 21st march
        console.log("this should not logged...");
        // end: 18th march change: put validation for mandatory fields


        console.log("inventory obj length: "+(JSON.stringify($scope.luxireStock).length));
        var tagarr=[];
        if( $scope.tagsArr == undefined || $scope.tagsArr.length == 0 ){

        }else{
          for(i=0;i<$scope.tagsarr.length;i++){
            tagarr[i]=$scope.tagsarr[i].text;
          }
          console.log("color tags arr values are: \n",tagarr.toString());
        }

        var colorArr=[];
        if($scope.colorTagsArr == undefined || $scope.colorTagsArr.length == 0 ){

        }else{
          for(i=0;i<$scope.colorTagsArr.length;i++){
            colorArr[i]=$scope.colorTagsArr[i].text;
          }
          console.log("color tags arr values are: \n",colorArr.toString());
        }

        var seasonArr=[];
        if( $scope.seasonTagsArr == undefined || $scope.seasonTagsArr.length == 0){

        }else{
          for(i=0;i<$scope.seasonTagsArr.length;i++){
            seasonArr[i]=$scope.seasonTagsArr[i].text;
          }
          console.log("color tags arr values are: \n",seasonArr.toString());
        }
        for(var i=0;i<$scope.rule.length;i++){
          $scope.taxon_ids[i]=$scope.rule[i].id;
        }
    		$scope.luxireStock["virtual_count_on_hands"]=$scope.luxireStock.physical_count_on_hands;
        $scope.luxireProduct["product_tags"]=tagarr.toString(); // storing the tags input values entered
        $scope.luxireProduct["product_color"]=colorArr.toString();  // storing the color tags input values entered
        $scope.luxireProduct["suitable_climates"]=seasonArr.toString(); // storing the seasons tags input values entered


  		if($scope.parentSkuStatus==true){   // creating product for existing parent_sku
  				console.log("create product true part...");
          // merge all the three product structure
  				$scope.postProductData={};
  				$scope.product["luxire_product_attributes"] = {};
          $scope.product["taxon_ids"] = $scope.taxon_ids;
  				$scope.product["luxire_product_attributes"]=$scope.luxireProduct;
  				$scope.product["luxire_product_attributes"]["luxire_stock_id"] = $scope.luxireStock.id;
  				$scope.product["luxire_product_attributes"]["luxire_product_type_id"] = productTypeId;
  				$scope.postProductData["product"]=$scope.product;
  				console.log("inventory id: "+$scope.luxireStock.id);
  				console.log(" create product true part\n before posting the product data is: ",$scope.postProductData);
          // first create product functionality is invoked
        	products.createProduct($scope.postProductData).then(function(data){

            console.log("\n\ncreated product  is: \n\n",data);
            console.log("\n\ncreated product  id is: \n\n",data.id);
            // creating structure of adding the variants
            $scope.pid=data.id;
            var variants = {
                "variant":{
                "sku": "swt_"+$scope.product.sku,
                "price": $scope.swatchPrice
              }
            };

            console.log("variant object is: ",variants);
            console.log("pid: ",$scope.pid);
            // creating the varints
            products.createVariants(data.id,variants).then(function(data){
              // $scope.alerts.push({type: 'success', message: 'Variant created successfully!'});

              //alert('variant is  successfully added');
              $scope.activeButton('products')
            }, function(info) {
              console.log(info);
            });

            var UpdatedVariantObj = {
              "variant": {
                "track_inventory": true
              }
            }
            console.log("product id: ",data.id);
            console.log("master id: ",data.master.id);
            products.updateVariants(data.id, data.master.id,UpdatedVariantObj).then(function(data){
              // $scope.alerts.push({type: 'success', message: 'Variant created successfully!'});

              //alert('variant is  successfully updated');
              $scope.activeButton('products');
            }, function(info) {
              console.log(info);
            });

            $scope.alerts.push({type: 'success', message: 'Product Created Successfully!'});

  		      $scope.activeButton('products')
  		    }, function(info) {
  		      console.log("creating product error:\n\n",info);
  		    })
          // updating the inventory
  				products.updateStock($scope.luxireStock.id,$scope.luxireStock).then(function(data){
            // $scope.alerts.push({type: 'success', message: 'Stock updated successfully!'});

  		      //alert('inventory successfully updated');

  		      $scope.activeButton('products')
  		    }, function(info) {
  		      console.log(info);
  		    })




  		}else{ // creating product for non existing parent_sku
      console.log("product creation false part is calling...");
      console.log("parent sku: ",$scope.luxireProduct.parent_sku);
      console.log("luxire stock obj: ",$scope.luxireStock);
      //$scope.luxireStock["parent_sku"]=$scope.luxireProduct.parent_sku;
      console.log("luxire stock length: ",JSON.stringify($scope.luxireStock).length);
      if (JSON.stringify($scope.luxireStock).length === 2) {
              console.log("luxire stock is empty...");
              $scope.alerts.push({type: 'success', message: 'Create the inventory first..!'});
              //alert("luxire stock is empty...");
      }else{
  		$scope.postProductData={};
  		// merge all the three product structure
  		$scope.luxireStock["virtual_count_on_hands"]=$scope.luxireStock.physical_count_on_hands;
  		$scope.product["luxire_product_attributes"] = {};
      $scope.product["taxon_ids"] = $scope.taxon_ids;
  		$scope.product["luxire_product_attributes"]=$scope.luxireProduct;
  		$scope.product["luxire_product_attributes"]["luxire_stock_attributes"] = $scope.luxireStock;
  		$scope.product["luxire_product_attributes"]["luxire_product_type_id"] = productTypeId;

  		$scope.postProductData["product"]=$scope.product;

  		$scope.modalCount=0;
      var data=angular.toJson($scope.postProductData);
      console.log(" create product false part \nbefore posting the product data is: ",data);
      products.createProduct($scope.postProductData).then(function(data){
        console.log("after creation the product is ",data);
        // create the variant aftercreating the product

        console.log("\n\ncreated product  is: \n\n",data);
        console.log("\n\ncreated product  id is: \n\n",data.id);
        $scope.pid=data.id;
        var variants = {
            "variant":{
            "sku": "swt_"+$scope.product.sku,
            "price": $scope.swatchPrice
          }
        };
        console.log("variant object is: ",variants);
        console.log("pid: ",$scope.pid);
        products.createVariants(data.id,variants).then(function(data){
          // $scope.alerts.push({type: 'success', message: 'Variant created successfully!'});

          //alert('variant is  successfully added');
          $scope.activeButton('products')
        }, function(info) {
          console.log(info);
        })
          $scope.alerts.push({type: 'success', message: 'Product created successfully!'});
          $scope.activeButton('products');
        }, function(info) {
          console.log(info);
        })

      }
    }
  }// 21st march
}

  // --------------     END OF CREATING THE PRODUCT STRUCTURE TO POST    ---------------

});
