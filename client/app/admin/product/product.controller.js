angular.module('luxire')

.controller('ProductController',function($scope, products, luxireProperties, luxireVendor, fileReader, fileUpload, prototypeObject, $uibModal, $log, createProductModalService, $state, csvFileUpload){

  $scope.productData  = new prototypeObject.product();


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


  /*Loading all products*/
  $scope.loading = true;
  products.getProducts().then(function(data) {
    console.log('admin');
    console.log(data);
    $scope.jsonresponse = data;
    $scope.loading = false;
    console.log($scope.jsonresponse);
  }, function(info){
    console.log(info);
  })

  $scope.colorTags = []
  $scope.seasonTags = []

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

  $scope.dummyColors = [
    {"text": "Red"},
    {"text": "White"},
     {"text": "Black"},
     {"text": "Gray"},
     {"text": "Powder Blue"},
     {"text": "Navy Blue"},
     {"text": "Royal Blue"},
     {"text": "Green"},
     {"text": "Light Green"},
     {"text": "Yellow"},
     {"text": "Orange"},
     {"text": "Crimson"},
     {"text": "Vermilion"},
     {"text": "Dark Red"},
     {"text": "Light Gray"},
     {"text": "Light Blue"}
  ]

  $scope.dummySeasons = [
    {"text": "Summer"},
    {"text": "Winter"},
    {"text": "Spring"},
    {"text": "Autumn"},
    {"text": "Monsoon"}
  ]

  $scope.loadTags = function(query) {
    if (query == 'color') {
      return $scope.dummyColors;
    } else if (query == 'season') {
      return $scope.dummySeasons;
    }
   return {};
 }

  $scope.getAllProducts = function (data) {
    $scope.loading = true;
    products.getProducts().then(function(data) {
  		console.log('admin');
      console.log(data);
  		$scope.jsonresponse = data;
      $scope.loading = false;
      console.log($scope.jsonresponse);
  	}, function(info){
  		console.log(info);
  	})
  }


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

  luxireProperties.getAllLuxireProperties().then(function(data) {
    console.log('admin luxire properties values are ...');
    console.log(data);
    $scope.luxireProperties = data.data;
    //$scope.loading = false;
    console.log($scope.luxireProperties);
    console.log("type of properties: ",typeof($scope.luxireProperties[0]));
    var arr=$scope.luxireProperties[0].value.split(',');
    console.log("arr\n\n",arr);
  }, function(info){
    console.log(info);
  })

  luxireVendor.getAllLuxireVendor().then(function(data) {
    console.log('admin luxire vendor values are ...\n\n');
    //console.log(data);
    $scope.luxireVendor = data.data;
    //$scope.loading = false;
    console.log($scope.luxireVendor);
  }, function(info){
    console.log(info);
  })

  $scope.alerts = [];
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    console.log(index);
    $scope.alerts.splice(index, 1);
  };

  // ******************* start inventory modal part *****************

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
	products.allProductType().then(function(data) {
		//$scope.loading= false;
		console.log("values of all product type \n\n");
		$scope.allproductType=data.data;
		console.log("\n\nall product type values are \n\n",data.data);

	}, function(info){
		console.log(info);
	})

	$scope.showProductType=function(){
		console.log("select product type is calling..");
		 console.log("selected product type is "+$scope.newProductType.type);
		 productTypeId=$scope.newProductType.type;
		 console.log("selected product type id: "+productTypeId);

	}


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
					 console.log("sku status: ",$scope.parentSkuStatus);
					 parentSkuObj = parentSku;
					 $scope.parentSkuFalseCount=0;
					 console.log("perentskuObj: ",parentSkuObj);
					 //$scope.parentSkuFalseCount++;
					 //$scope.luxireStock={};

       }else{
				 console.log("parent sku true part..");
				 $scope.parentSkuStatus=true;
         $scope.luxireStock=res;
				 $scope.parentSkuFalseCount=0;
				 console.log("+++++++++++++++++false count: "+$scope.parentSkuFalseCount);
				 parentSkuObj = $scope.luxireStock;
				 console.log("sku status: ",$scope.parentSkuStatus);
					console.log("luxire stock object: ",$scope.luxireStock);
       }

     }, function(info) {
       console.log(info);
     })

  }
	function bytesToSize(bytes) {
	 var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	 if (bytes == 0) return '0 Byte';
	 var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	 return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	};
	function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
}
	function CSV2JSON(csv) {
	    var array = CSVToArray(csv);
	    var objArray = [];
	    for (var i = 1; i < array.length; i++) {
	        objArray[i - 1] = {};
	        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
	            var key = array[0][k];
	            objArray[i - 1][key] = array[i][k]
	        }
	    }

	    var json = JSON.stringify(objArray);
	    var str = json.replace(/},/g, "},\r\n");

	    return str;
	}
	$scope.importModal=function(size){
		var importCsvModalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'importCsvModal.html',
			controller: 'importCsvModalController',
			size: size,
			resolve: {
				importValue: function () {
					return {name: "rajib" };
				}
			}
		});
		importCsvModalInstance.result.then(function (res) {
		$scope.importModalValue = res;

		//console.log("modal return value is : \n\n",$scope.importModalValue);
		var len=JSON.stringify($scope.importModalValue).length;
		console.log("length: "+$scope.importModalValue.length);
		console.log("len: "+bytesToSize(len));
		var csvToJsonData = CSV2JSON($scope.importModalValue);
		console.log("csv to json file is: \n\n"+typeof(csvToJsonData));
		//console.log("file content: ",csvToJsonData);
		console.log("csv to json file is: \n\n"+typeof(JSON.parse(csvToJsonData)));
		var data=JSON.parse(csvToJsonData);

		csvFileUpload.uploadCsvFile(res).then(function(data) {
	    console.log("in import modal controller response is: ",data);

	  }, function(info){
	    console.log(info);
	  })


	}, function () {
		$log.info('Modal dismissed at: ' + new Date());
	});

	}


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


	$scope.createProduct = function() {
    console.log("in fun create product : \nproduct object:\n",$scope.product);
		console.log("luxire_product object: \n",$scope.luxireProduct);
		console.log("luxire stock obj:\n",$scope.luxireStock);

		$scope.luxireStock["virtual_count_on_hands"]=$scope.luxireStock.physical_count_on_hands;
		if($scope.parentSkuStatus==true){
				console.log("create product true part...");
				$scope.postProductData={};
				$scope.product["luxire_product_attributes"] = {};
				$scope.product["luxire_product_attributes"]=$scope.luxireProduct;
				$scope.product["luxire_product_attributes"]["luxire_stock_id"] = $scope.luxireStock.id;
				$scope.product["luxire_product_attributes"]["luxire_product_type_id"] = productTypeId;
				$scope.postProductData["product"]=$scope.product;
				console.log("inventory id: "+$scope.luxireStock.id);
				console.log(" create product true part\n before posting the product data is: ",$scope.postProductData);
				products.createProduct($scope.postProductData).then(function(data){
          //$scope.alerts.push({type: 'success', message: 'Product created successfully!'});
          products.add_variant_image(data.data.id, data.data.master.id, $scope.product_image)
          .then(function(data){
            console.log(data);
            //$scope.alerts.push({type: 'success', message: 'Product created successfully!'});
          }, function(error){
            console.error(error);
          });

          console.log("\n\ncreated product  is: \n\n",data);
          console.log("\n\ncreated product  id is: \n\n",data.id);
          $scope.pid=data.id;
          var variants = {
              "variant":{
              "sku": "swt_"+$scope.product.sku,
              "price": $scope.swatchPrice
            }
          };
          // variants["variant"]["sku"] = "swt_"+$scope.product.sku;
          // variants["variant"]["price"] = $scope.swatchPrice;
          console.log("variant object is: ",variants);
          console.log("pid: ",$scope.pid);
          products.createVariants(data.id,variants).then(function(data){
            // $scope.alerts.push({type: 'success', message: 'Variant created successfully!'});

            //alert('variant is  successfully added');
            $scope.activeButton('products')
          }, function(info) {
            console.log(info);
          })

		      alert('Product successfully added');
		      $scope.activeButton('products')
		    }, function(info) {
		      console.log("creating product error:\n\n",info);
		    })

				products.updateStock($scope.luxireStock.id,$scope.luxireStock).then(function(data){
          // $scope.alerts.push({type: 'success', message: 'Stock updated successfully!'});

		      //alert('inventory successfully updated');
		      $scope.activeButton('products')
		    }, function(info) {
		      console.log(info);
		    })




		}else{

		$scope.postProductData={};
		//$scope.postProductData["product"]={};
		$scope.luxireStock["virtual_count_on_hands"]=$scope.luxireStock.physical_count_on_hands;
		$scope.product["luxire_product_attributes"] = {};
		$scope.product["luxire_product_attributes"]=$scope.luxireProduct;
		//$scope.product["luxire_product_attributes"]["luxire_stock_attributes"] = {};
		$scope.product["luxire_product_attributes"]["luxire_stock_attributes"] = $scope.luxireStock;
		$scope.product["luxire_product_attributes"]["luxire_product_type_id"] = productTypeId;

		$scope.postProductData["product"]=$scope.product;

		$scope.modalCount=0;
    console.log(" create product false part \nbefore posting the product data is: ",$scope.postProductData);
    products.createProduct($scope.postProductData).then(function(data){
      products.add_variant_image(data.data.id, data.data.master.id, $scope.product_image)
      .then(function(data){
        console.log(data);
      }, function(error){
        console.error(error);
      });
      console.log("after creation the product is ",data);
      $scope.alerts.push({type: 'success', message: 'Product created successfully!'});

      //alert('Product successfully added');
      $scope.activeButton('products')
    }, function(info) {
      console.log(info);
    })


  }
}

	$scope.showEditProducts=function(id){
	  console.log("selected inventory id:  "+id);
	  $state.go("admin.edit_product",{id :id});
	}


  /*$scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };*/

  // ******************* end inventory modal part *****************

});
