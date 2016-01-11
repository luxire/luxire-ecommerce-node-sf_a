angular.module('luxire')
.controller('addCollectionController',function($scope, collections,fileReader,products,$http,$interval){
  $scope.hidecon=false;
  $scope.seoform=false;
  $scope.imgshow=true;
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  $scope.showdate=false;
  $scope.publishDate = new Date();
  $scope.flag=0;
  var flag=0;
  $scope.manualCon=false;
  $scope.rule=[];
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  $scope.save_collection_btn=true;
  $scope.tagtitle='';
  $scope.tagdesc='';
  // ------------------------------------------
  $scope.activeSaveCollectionBtn=function(){
      $scope.save_collection_btn=false;
  }

  // ng-init functionality start
  $scope.value = '';
  var query;

$scope.init = function() {
  // Check if we already have an active interval in the scope
  if(angular.isDefined(query))
      return;

  // Setup query interval
  query = $interval(function() {
      // Call the endpoint where you will retrieve data from
      console.time("refreshProducts");
      $http.get('/refreshProducts')
      .success(function(data) {
          console.log("\n\nproduct cashe is refreshed in redis server\n\n ");
          //$scope.value = data;
          var  result= JSON.stringify(data);
          var bytessize=result.length;
          var i = parseInt(Math.floor(Math.log(bytessize) / Math.log(1024)));
          var len = Math.round(bytessize / Math.pow(1024, i), 2) + ' ' + sizes[i];
          console.log("total bytes refreshed: "+ result.length);
          console.log("total size refreshed: "+ len);
          console.timeEnd("refreshProducts");
      })
      .error(function(err) {
          // Handle errors
      });
  }, 30000); // Execute every 100 milliseconds
};

$scope.cancel = function() {
  if(angular.isDefined(query)) {
      $interval.cancel(query);
      query = undefined;
  }
};

$scope.$on('$destroy', function() {
  // Make sure that the interval is destroyed too
  $scope.cancel();
});

  // ---------------------------------



  $scope.loadItems = function(query){
    var tempproduct=products.searchProducts(query);
    console.log("temp producct: \n",tempproduct);
  return products.searchProducts(query);

  }

  $scope.hideCondition=function(){

      $scope.hidecon=false;
      $scope.manualCon=true;
  }
  $scope.showCondition=function(){

      $scope.hidecon=true;
  }
  $scope.showPanel=function(){

      $scope.showpanel=false;
  }
  $scope.seoForm=function(){

      $scope.seoform=true;
  }
  $scope.getselect1=function(val){
    console.log("select1 val: "+val);
  }
  $scope.imgShow=function(){

      $scope.imgshow=false;
  }
  $scope.showDate=function(){
    //if($scope.publishDate != null){
    console.log("dateobj: "+dateObj);
    var dateObj=$scope.publishDate;
    $scope.hrs=dateObj.getHours();
    $scope.mnt=dateObj.getMinutes();
    $scope.sec=dateObj.getSeconds();
    $scope.dt=dateObj.getDate();
    $scope.yr=dateObj.getFullYear();
    $scope.mon=months[dateObj.getMonth()];
    $scope.day=days[dateObj.getDay()];
    console.log("date : "+$scope.day+" "+$scope.dt+" "+$scope.mon+" "+$scope.yr+"\n");
    console.log("time : "+$scope.hrs+" : "+$scope.mnt+" : "+$scope.sec);
  //}
    if(flag==0){
      flag++;
    }else{
      $scope.showdate=true;
    }
  }

  //controller function for file reader
  $scope.uploadSponsorLogo = function(files) {
          if (files && files.length) {
          $scope.sponsorLogoFileName = files[0].name;
          fileReader.readAsDataUrl(files[0], $scope).then(function(result) {
          $scope.productImage = result;

        })
      }
    }


  $scope.addConditionArr=[];

         var condition={
            selected1: null,
             select1: [
                 { opt:"Product title" },
                 { opt:"Product type" },
                 { opt:"Product vendor" },
                 { opt:"Product price" },
                 { opt:"Compare at price" },
                 { opt:"Weight" },
                 { opt:"Inventory stock" },
                 { opt:"variants title" }

             ],
             select2: [
                 { opt:"Is equal to" },
                 { opt:"Is not equal to" },
                 { opt:"Is greater than " },
                 { opt:"is less than" },
                 { opt:"Starts with" },
                 { opt:"Ends with" },
                 { opt:"Contain" },
                 { opt:"Does not contain" }
             ],
             txt:{
                 val:""
             }
         }
         $scope.delCondition=function(index){

            var robj=$scope.addConditionArr.splice(index,1);

         }

         $scope.addCondition=function(){
            $scope.addConditionArr.push(condition);
         }
         // get all the collections

         collections.getCollections().then(function(data) {
           console.log(' from admin collection response is: ');
           console.log(data);

         }, function(err){
           console.log(err);
         })

         $scope.getCollections = function () {
           console.log("get collection function in controller is calling....");
           console.time("taxonTime: ");
           collections.getCollections().then(function(data) {
             console.log(' from admin collection response is: ');
             console.log(data);
         		//$scope.collectionResponse = data;
            console.timeEnd("taxonTime: ");
             //console.log($scope.collectionResponse);
         	}, function(err){
         		console.log(err);
         	})
         }
         // search collections service calling
         $scope.searchCollections = function () {
           console.log("search collection function in controller is calling....");
           collections.searchCollections().then(function(data) {
             console.log(' from admin search collection response is: ');
             //console.log("id value is: ");
             console.log(data);
         		//$scope.collectionResponse = data;
             //console.log($scope.collectionResponse);
         	}, function(err){
         		console.log(err);
         	})
         }

         // search collections by id  service calling
         $scope.searchCollectionsById = function () {
           console.log("search collection by id function in controller is calling....");
           collections.searchCollectionsById().then(function(data) {
             console.log(' from admin search collection by id  response is: ');
             //console.log("id value is: ");
             console.log(data);
         		//$scope.collectionResponse = data;
             //console.log($scope.collectionResponse);
         	}, function(err){
         		console.log(err);
         	})
         }

         // create a taxonomie

         $scope.createCollections = function() {
           $scope.collectionObj={
               "taxonomy":{
                   "id": 10,
                   "name": "park evenue",
                   "root":{
                       "id": 10,
                       "name": "park",
                       "pretty_name": "park",
                       "permalink": "",
                       "taxonomy_id": 10
                   }
             }
           }
           console.log($scope.collectionObj);
          collections.createCollections($scope.collectionObj).then(function(data){
             alert('collection successfully added');
             //$scope.activeButton('products')
           }, function(info) {
             console.log(info);
           })
         }

         // update a collection

         $scope.updateCollections = function() {
           $scope.updated_collObj_id=9;
           $scope.collectionObj={
                 "name": "park and park and park"
             }

           console.log($scope.collectionObj);
          collections.updateCollections($scope.updated_collObj_id, $scope.collectionObj).then(function(data){
             alert('collection updated successfully added');
             //$scope.activeButton('products')
           }, function(info) {
             console.log(info);
           })
         }

         // delete a collection

         $scope.deleteCollections = function() {
           $scope.delete_collObj_id=4;
          collections.deleteCollections($scope.delete_collObj_id).then(function(data){
             alert('collection deleted successfully...');
             //$scope.activeButton('products')
           }, function(info) {
             console.log(info);
           })
         }
        // get taxon index
         $scope.getTaxons = function () {
           $scope.taxonomie_id=1;
           console.log("get taxons function in controller is calling....");
           collections.getTaxons($scope.taxonomie_id).then(function(data) {
             console.log(' from admin taxon response is: ');
             console.log(data);
         		//$scope.collectionResponse = data;
             //console.log($scope.collectionResponse);
         	}, function(err){
         		console.log(err);
         	})
         }

         // get taxon index
          $scope.getTaxonsById = function () {
            $scope.taxonomie_id=1;
            $scope.taxons_id=1;
            console.log("get taxons by id function in controller is calling....");
            collections.getTaxons($scope.taxonomie_id,$scope.taxons_id).then(function(data) {
              console.log(' from admin taxon by id  response is: ');
              console.log(data);
          		//$scope.collectionResponse = data;
              //console.log($scope.collectionResponse);
          	}, function(err){
          		console.log(err);
          	})
          }

          // create a taxons

          $scope.createTaxons = function() {
            $scope.id=1;
            var product_ids=[];
            console.log("title: "+$scope.tagtitle);
            console.log("title: "+$scope.tagdesc);
            angular.forEach($scope.rule, function (product, key) {
              console.log('angularforeach val', product);
              product_ids.push(product.id);
            })
            $scope.taxonObj={
              "taxon":{
                    "name": $scope.tagtitle,
                    "pretty_name": $scope.tagdesc,
                    "description": $scope.tagdesc,
                    "product_ids": product_ids,
                    "parent_id": 1,
                    "taxonomy_id": 1

                  }
              }
            console.log($scope.tid,$scope.taxonObj);
           collections.createTaxons($scope.id,$scope.taxonObj).then(function(data){
              alert('taxon created successfully....');
              //$scope.activeButton('products')
            }, function(info) {
              console.log(info);
            })
          }

          // update a taxons

          $scope.updateTaxons = function() {
            $scope.id=1;
            $scope.tid=21;
            $scope.updatedTaxonObj={
              "taxon":{
                    "id": 6,
                    "name": "reymonds",
                    "pretty_name": "sharees -> bags",
                    "parent_id": 1,
                    "taxonomy_id": 11
                  }
              }

            console.log($scope.collectionObj);
           collections.updateTaxons($scope.id, $scope.tid, $scope.updatedTaxonObj).then(function(data){
              alert('taxons updated successfully added');
              //$scope.activeButton('products')
            }, function(info) {
              console.log(info);
            })
          }

          // delete a taxons

          $scope.deleteTaxons = function() {
            $scope.delTaxonomieId=1;
            $scope.delTaxonsId=6;
           collections.deleteTaxons($scope.delTaxonomieId, $scope.delTaxonsId).then(function(data){
              alert('taxons deleted successfully...');
              //$scope.activeButton('products')
            }, function(info) {
              console.log(info);
            })
          }

    // ________________  calling redis server  ____________________
    $scope.callRedis=function(){
        console.time("taxonCasheTime: ");
        $http.get('/taxoncashe')
          .success(function(data){
            console.log("taxoncashe value from redis server  \n\n",data);
            var  result= JSON.stringify(data);
            var bytessize=result.length;
            var i = parseInt(Math.floor(Math.log(bytessize) / Math.log(1024)));
            var len = Math.round(bytessize / Math.pow(1024, i), 2) + ' ' + sizes[i];
            console.log("total bytes: "+ result.length);
            console.log("total bytes: "+ len);
            console.timeEnd("taxonCasheTime: ");
          })
          .error(function(err){
            console.log("errors occours during redis server calling..");
          })
    }
    $scope.callRails=function(){
        console.time("taxonApiTime: ");
        collections.getCollections().then(function(result) {
          console.log('taxonomie value from rails api  ');
          console.log("name: "+result.data.taxonomies[0].name);
         var  result= JSON.stringify(result);
         var bytessize=result.length;
         var i = parseInt(Math.floor(Math.log(bytessize) / Math.log(1024)));
         var len = Math.round(bytessize / Math.pow(1024, i), 2) + ' ' + sizes[i];
         console.log("total bytes: "+ result.length);
         console.log("total bytes: "+ len);
         console.timeEnd("taxonApiTime: ");
       }, function(err){
         console.log(err);
       })
    }
    $scope.getProductApi=function(){
        console.time("productCasheTime: ");
        $http.get('/productcashe')
          .success(function(data){
            console.log("productcashe value from redis server  \n",data);
            var  result= JSON.stringify(data);
            var bytessize=result.length;
            var i = parseInt(Math.floor(Math.log(bytessize) / Math.log(1024)));
            var len = Math.round(bytessize / Math.pow(1024, i), 2) + ' ' + sizes[i];
            console.log("total bytes: "+ result.length);
            console.log("total size: "+ len);
            console.timeEnd("productCasheTime: ");
          })
          .error(function(err){
            console.log("errors occours during redis server calling..");
          })
    }



  });
