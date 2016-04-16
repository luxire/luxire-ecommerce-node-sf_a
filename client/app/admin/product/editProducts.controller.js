angular.module('luxire')
.controller('editProductController',function($scope, products, allTaxons, luxireProperties, luxireVendor, fileReader, prototypeObject, $state, $stateParams, $uibModal, $log, editModalService){
  $scope.luxire_stock='';
  $scope.luxire_product={};
  $scope.parentSkuObj='';
  $scope.swatchPrice=1;
  $scope.tagsarr=[];
  $scope.colorTagsArr = [];
  $scope.seasonTagsArr = [];
  $scope.rule=[];
  $scope.taxon_ids=[];
  $scope.editedAllTaxonsJson=[];
  $scope.seasonData=[];


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


 // ---------------- START OF GET ALL THE PRODUCT DETAILS TO SHOW ---------------------
  console.log("state params : "+$stateParams.id);
  products.getProductByID($stateParams.id).then(function(data) {
    $scope.products = data;
    $scope.luxire_stock = data.luxire_stock;
    $scope.luxire_product = data.luxire_product;
    $scope.parentSkuObj = $scope.luxire_stock;


    if($scope.products.luxire_product.product_tags == undefined){
      console.log("tags field is empty..");
    }else{
      var arr=$scope.products.luxire_product.product_tags.split(','); // converting the tags array of string into tags input object
      var tagsObj={};
      for(i=0;i<arr.length;i++){
        tagsObj={
          "text": arr[i]
        };
          $scope.tagsarr.push(tagsObj);
      }
    }
    if($scope.products.luxire_product.product_color == undefined){
      console.log("color tag is empty..");
    }else{
      var colorArr=$scope.products.luxire_product.product_color.split(','); // converting the array of color string into tags input object
      var colorObj={};
      for(i=0;i<colorArr.length;i++){
        colorObj={
          "text": colorArr[i]
        };
          $scope.colorTagsArr.push(colorObj);
      }
    }
    if($scope.products.luxire_product.suitable_climates == undefined){
      console.log("season tag is empty..");
    }else{
      var seasonArr=$scope.products.luxire_product.suitable_climates.split(','); // converting the array of seasons string into tags input object
      var seasonObj={};
      for(i=0;i<seasonArr.length;i++){
        seasonObj={
          "text": seasonArr[i]
        };
          $scope.seasonTagsArr.push(seasonObj);
      }
    }

    console.log("season tags values: ",$scope.seasonTagsArr);


    console.log("parent sku object",$scope.parentSkuObj);
    //console.log("data: \n",$scope.products);
    console.log(" luxire stock: \n",$scope.luxire_stock);
    console.log("luxire product: \n",$scope.luxire_product);

  }, function(info){
    console.log(info);
  });
  // ---------------- END OF GET ALL THE PRODUCT DETAILS TO SHOW ---------------------


  // --------------------------   START GET ALL LUXIRE PROPERTIES  TO SHOW    -------------------------

  luxireProperties.luxirePropertiesIndex().then(function(data) {
    var tempSeasonData=[];
    console.log('admin luxire properties values are ...');
    console.log(data);
    $scope.luxireProperties = data.data;
    //$scope.loading = false;
    console.log($scope.luxireProperties);
    console.log("type of properties: ",typeof($scope.luxireProperties[0]));
    var arr=$scope.luxireProperties[0].value.split(',');
    for(var i=0; i<$scope.luxireProperties.length; i++){
      if($scope.luxireProperties[i].name == 'season'){
        tempSeasonData = $scope.luxireProperties[i].value.split(',');
        break;
      }
    }
    var seasonTagObj={};
    for(var j=0;j<tempSeasonData.length; j++){
        seasonTagObj = {"text": tempSeasonData[j]}
        $scope.seasonData.push(seasonTagObj);
    }
    console.log("+++season data: \n\n",$scope.seasonData);

    console.log("arr\n\n",arr);
  }, function(info){
    console.log(info);
  })
  // --------------------------   START GET ALL LUXIRE PROPERTIES  TO SHOW    -------------------------

  // --------------------------   START GET ALL LUXIRE VENDORS  TO SHOW    -------------------------

  luxireVendor.getAllLuxireVendor().then(function(data) {
    console.log('admin luxire vendor values are ...\n\n');
    //console.log(data);
    $scope.luxireVendor = data.data;
    //$scope.loading = false;
    console.log($scope.luxireVendor);
  }, function(info){
    console.log(info);
  })
  // --------------------------   END GET ALL LUXIRE VENDORS  TO SHOW    -------------------------

  $scope.modalCount=0;
	$scope.animationsEnabled = true;
	$scope.dummyInventoryData='';
  $scope.selectedType = '';

  $scope.luxireStock='';
	$scope.parentSkuStatus='';
	$scope.parentSkuFalseCount=0;
	var productTypeId='';
	products.allProductType().then(function(data) {
		//$scope.loading= false;
		console.log("values of all product type \n\n");
		$scope.allproductType=data.data;
    $scope.selectedType=1219;
		console.log("\n\nall product type values are \n\n",data.data);
		for(i=0;i<$scope.allproductType.length;i++){
				console.log("product type: "+$scope.allproductType[i].product_type);
		}
	}, function(info){
		console.log(info);
	})

	$scope.showProductType=function(){
		console.log("select product type is calling..");
		 console.log("selected product type is "+$scope.newProductType.type);
		 productTypeId=$scope.newProductType.type;
		 console.log("selected product type id: "+productTypeId);

	}
  // ********************  START OF EDIT INVENTORY MODAL  ************************

  $scope.openModal = function (size) {
    //$scope.parentSkuObj = luxireStock;
    $scope.modalCount++;
    console.log("modal count: "+$scope.modalCount);
    if($scope.modalCount>1){
			console.log("parent sku object: ",$scope.parentSkuObj);
      console.log("dummy data is : ",$scope.dummyInventoryData);
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'editModalContent.html',
        controller: 'editModalInstanceCtrl',
        size: size,
        resolve: {
          luxireStock: function () {
            return { count:$scope.modalCount,data:$scope.dummyInventoryData};
          }
        }
      });
    }else{
      //$scope.parentSkuObj = luxireStock;
			console.log("parent sku object: ",$scope.parentSkuObj);
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'editModalContent.html',
        controller: 'editModalInstanceCtrl',
        size: size,
        resolve: {
          luxireStock: function () {
            return {count:$scope.modalCount, data: $scope.products.luxire_stock};
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

  // ********************  END OF EDIT INVENTORY MODAL  ************************

  // start of bind the all taxons value

  var totalTaxons;
  allTaxons.getTaxonsPerPage(totalTaxons).then(function(data) {
    $scope.taxonsJson = data.data;
    console.log("all taxons per page: ",$scope.taxonsJson);
    $scope.loading = false;
    totalTaxons = data.data.count;
    allTaxons.getTaxonsPerPage(totalTaxons).then(function(data) {
      $scope.allTaxonsJson = data.data.taxons;
      console.log("total taxons are: ",$scope.allTaxonsJson);
      var obj;
      for(var i=0;i<$scope.allTaxonsJson.length;i++){
        for(var j=0; j<$scope.products.taxon_ids.length; j++){
          if($scope.allTaxonsJson[i].id == $scope.products.taxon_ids[j]){
            console.log("taxon id matched with all taxonjson id");
            obj={id:$scope.allTaxonsJson[i].id, name: $scope.allTaxonsJson[i].name };
            $scope.rule.push(obj);
          }
        }
      }

      $scope.loading = false;
    }, function(info){
      console.log(info);
    })
  }, function(info){
    console.log(info);
  })


  $scope.loadItems = function(query){
    return $scope.allTaxonsJson;
  };
  // ---------------- START OF TAGS INPUT FUNCTIONALITY ---------------------
  $scope.loadSeason = function(query) {
    // var tempSeasonData=[];
    // if (query == 'season') {
    //   for(var i=0; i<$scope.luxireProperties.length; i++){
    //     if($scope.luxireProperties[i].name == 'season'){
    //       tempSeasonData = $scope.luxireProperties[i].value.split(',');
    //       break;
    //     }
    //   }
    //   var seasonTagObj={};
    //   for(var j=0;j<tempSeasonData.length; j++){
    //       seasonTagObj = {"text": tempSeasonData[j]}
    //       $scope.seasonData.push(seasonTagObj);
    //   }
    // }
    console.log("season data: ",$scope.seasonData);
    return $scope.seasonData;
   }

 // ---------------- START OF TAGS INPUT FUNCTIONALITY ---------------------


  // end of bind the all taxons value


  // ********************  START  OF FUNCTIONALTY TO UPDATE A PRODUCT  ************************

  $scope.editProduct=function(){
        console.log("------changed product id is: ",$scope.luxire_product.luxire_product_type_id);
        var taxon_ids=[];
        for(var i=0;i<$scope.rule.length;i++){
          taxon_ids[i]=$scope.rule[i].id;
        }
        console.log("before save product taxon ids are: ",$scope.products.taxon_ids);
        var tagarr=[];
        for(i=0;i<$scope.tagsarr.length;i++){
          tagarr[i]=$scope.tagsarr[i].text;
        }
        $scope.luxire_product["product_tags"]=tagarr.toString();
        var colorarr=[];
        for(i=0;i<$scope.colorTagsArr.length;i++){
          colorarr[i]=$scope.colorTagsArr[i].text;
        }
        $scope.luxire_product["product_color"]=colorarr.toString();
        var seasonarr=[];
        for(i=0;i<$scope.seasonTagsArr.length;i++){
          seasonarr[i]=$scope.seasonTagsArr[i].text;
        }
        $scope.luxire_product["suitable_climates"]= seasonarr.toString(); // converting the season tags input values into a array of string
        $scope.luxire_product["product_tags"]=tagarr.toString();   // converting the tags input values into a array of string
        $scope.luxire_product["product_color"]=colorarr.toString();   // converting the color tags input values into a array of string

        // merging the product structure
        $scope.product={};
        $scope.product["name"]=$scope.products.name;
        $scope.product["description"]=$scope.products.description;
        $scope.product["price"]=$scope.products.price;
        $scope.product["display_price"]=$scope.products.display_price;
        $scope.product["shipping_category_id"]=1;

        console.log("in fun edit product : \nproduct object:\n",$scope.product);
        console.log("luxire_product object: \n",$scope.luxire_product);
        console.log("luxire stock obj:\n",$scope.luxireStock);
        $scope.luxireStock["virtual_count_on_hands"]=$scope.luxireStock.physical_count_on_hands;

        console.log("edit product true part...");
        $scope.postProductData={};
        $scope.product["luxire_product_attributes"] = {};
        $scope.product["luxire_product_attributes"]=$scope.luxire_product;
        $scope.product["luxire_product_attributes"]["luxire_stock_id"] = $scope.luxire_stock.id;
        $scope.product["taxon_ids"] = taxon_ids;


        console.log("\n\nproduct type id is: \n\n"+$scope.productTypeId);
        $scope.postProductData["product"]=$scope.product;
        console.log("inventory id: "+$scope.luxire_stock.id);
        console.log(" edit product true part\n before posting the product data is: ",$scope.postProductData);
        var data=JSON.stringify($scope.postProductData);
        console.log("data: \n",data);

        console.log("**** id : ",$scope.products.id);
        console.log("**** object  : ",$scope.postProductData);


        // call the update product functionality
        products.editProduct($scope.products.id,$scope.postProductData).then(function(data){
          console.log($scope.product);
          console.log("node response: ",data);
          alert('Product successfully updated...');
          $scope.activeButton('products')
        }, function(info) {
          console.log(info);
        })
        // var variantObj={
        //   "variant":{
        //     "track_inventory" : true
        //   }
        // }
        // products.updateVariants($scope.products.id,$scope.products.master.id,variantObj).then(function(data){
        //   alert('variants successfully updated...');
        //   $scope.activeButton('products');
        // }, function(info) {
        //   console.log(info);
        // })
        // call the update stock functionality
        products.updateStock($scope.luxire_stock.id,$scope.luxireStock).then(function(data){
          alert('inventory successfully updated...');
          $scope.activeButton('products')
        }, function(info) {
          console.log(info);
        })

  }
  // ******************** END OF FUNCTIONALTY TO UPDATE A PRODUCT  ************************


});
