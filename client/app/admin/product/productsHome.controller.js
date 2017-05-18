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
  var totalTaxons;
  products.getProducts().then(function(data) {
      $scope.loading = true;
      $scope.jsonresponse = data.data.products;
      //edited on 18/04/16 scroll implementation
      $scope.current_page = data.data.current_page;
      $scope.pages = data.data.pages;
      //*************
      $scope.masterSearchJson = $scope.jsonresponse;
      $scope.loading = false;
      allTaxons.getTaxonsPerPage(totalTaxons).then(function(data) {
        $scope.taxonsJson = data.data;
        totalTaxons = data.data.count;
      }, function(info){
        console.log(info);
      })

      luxireVendor.getAllLuxireVendor().then(function(data) {
        $scope.luxireVendor = data.data;
        $scope.loading = false;
      }, function(info){
        console.log(info);
      })

      products.allProductType().then(function(data) {
    		$scope.loading= false;
    		$scope.allproductType=data.data;
    	}, function(info){

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

//    $scope.loading = true;
    if(event.keyCode == 13){
      $scope.loading = true;
      products.searchProducts(query).then(function(data){
         $scope.searchProductsByQueryJson = data.products;
         $scope.masterSearchJson = $scope.searchProductsByQueryJson;
         $scope.loading = false;
         if($scope.masterSearchJson.length == 0){  // 18th march
           $scope.noProductMsg = true;
         }else{
           $scope.noProductMsg = false;
         }
       }, function(info){
         console.log("error: ",info);
       })

    }else{
      if(query.length == 0){
        $scope.masterSearchJson = $scope.jsonresponse;
        $scope.loading = false;
      }

    }

  }

  // --------------------------   17TH MARCH change-1 PRODUCT SEARCH FUNCTIONALITY    -------------------------

  $scope.deleteProducts = function(id,index) {
    $scope.loading=true;
    products.deleteProduct(id).then(function(data){
      $scope.loading=false;
      $state.go('admin.product');
      $scope.alerts.push({type: 'success', message: 'Product deleted successfully!'});    
    }, function(info) {
      console.log(info);
    })
  }

  $scope.luxireStock='';
	$scope.parentSkuStatus='';
	var productTypeId='';
	var parentSkuObj='';

  // --------------------------   START CHECK PARENT SKU STATUS   -------------------------

  $scope.checkParentSku=function(sku){
    var parentSku={
      parent_sku: sku,
    }
    createProductModalService.checkParentSku(parentSku).then(function(res){
       $scope.parentSkuStatus=res.msg;
       if($scope.parentSkuStatus == "false") {
             $scope.alerts.push({type: 'success', message: 'Inventory Is Not Exists!\nCreate The Inventory! '});
					 parentSkuObj = parentSku;
					 $scope.parentSkuFalseCount=0;
       }else{
				 $scope.parentSkuStatus=true;
         $scope.luxireStock=res;
				 parentSkuObj = $scope.luxireStock;
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
});
