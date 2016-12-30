 angular.module('luxire')
 .controller('adminController',function($scope, $stateParams, $rootScope, products, fileReader, prototypeObject,$rootScope,$authentication,$state,$http){
   console.log('state', $state);
   console.log(new prototypeObject.product())
   $scope.navbar = "default";
   $scope.adminConsole = "default";
   $scope.isActive = false;
   $scope.infinityFlag = true;
   $rootScope.showDefaultNav = true;

   $rootScope.page.setTitle("Admin Console")

   $scope.loading = false;

   $scope.customerData = new prototypeObject.customer();

   $scope.user_popover = {
    templateUrl: 'user_popover.html',
  };

  $scope.go_to_crm = function(){
    window.open("http://crm.cloudhop.in/login?data=admin@example.com&data2=admin", "_blank");
  }

  $scope.go_to_state = function(state){
    $state.go(state);
    $rootScope.showDefaultNav = false; //to show state specific sidemenu
  };

   $scope.mouseoverNav = function(){
     $rootScope.showDefaultNav = true;
     $scope.popoverIsOpen = false;
  }
   $scope.mouseleaveNav = function(){
     if($state.current.name !== "admin.default"){
       $rootScope.showDefaultNav = false
     }
   }
   $scope.log_out = function(event){
     event.preventDefault();
     $authentication.logout();
     $state.go('login');
    //  $rootScope.alerts.push({type: 'success', message: 'Logout successful!'});
   }
   /*Global search starts*/
   $rootScope.globalSearch = false;
   $scope.hideNav=true;
   $scope.searchText='';
   $scope.productDesc=[];
   $scope.orderDesc=[];
   $scope.customerDesc=[];
   $scope.showProduct=false;
   $scope.showOrder=false;
   $scope.showCustomer=false;
   $scope.textPart=true;
   $scope.searchAllObject='';
   $scope.dataPart=false;
   $scope.showCollection=false;

   // ----------------  implement webworker to fetch data from redis server --------
   /*var worker=new Worker('worker.js');
   worker.addEventListener('message', function(e) {
     console.log('Worker said: ', e.data);
   }, false);
   worker.postMessage('Hello World'); // Send data to our worker.*/

   // -----------------  end of webworker --------------------------------


   /*$http.get('/products')
   .success(function(data){
     var res = data.data;
     console.log("product description:\n",data);
     //$scope.productDesc=res.product;
     //$scope.result=res.product;
   })
   .error(function(err){
     console.log("error: fetching value from redis server");
   })*/

   $http.get('/api/search')
   .success(function(data){
     console.log("searchAllData:\n",data);
     $scope.productDesc=data.spree_products;
     $scope.orderDesc=data.spree_orders;
     $scope.customerDesc=data.spree_users;
     $scope.showCollection=data.spree_taxons;
     $scope.searchAllObject=data;
   })
   .error(function(err){
     console.log("error: fetching value from redis server");
   })

   $scope.showSearch=function(){
     $scope.globalSearch=false;
   }
   $scope.hideSearch=function(){
     $scope.globalSearch=true;
   }
   $scope.close_search_tab = function(){
     if($scope.globalSearch == true){
       $scope.globalSearch = false;
     }
   };

   $scope.showNav=function(){
     if($scope.search==''){
       $scope.hideNav=true;
     }else{
       $scope.hideNav=false;
     }
   }
   $scope.change = function(){
     console.log("search text: "+$scope.searchText);
     $scope.textPart=false;
     $scope.showProduct=true;
     $scope.showOrder=true;
     $scope.showCustomer=true;
     $scope.showCollection=true;
     $scope.dataPart=true;
     if($scope.searchText.length==0){
       $scope.dataPart=false;
       $scope.textPart=true;
     }
   }
   $scope.showAllData=function(){
     console.log("calling show All data function");
     $scope.textPart=false;
     $scope.showProduct=true;
     $scope.showCustomer=true;
     $scope.showOrder=true;
     $scope.showCollection=true;
     if($scope.searchText.length==0){
      // $scope.dataPart=false;
       $scope.textPart=true;
     }
     //$scope.dataPart=true;
     $scope.productDesc=$scope.searchAllObject.spree_products;
     $scope.orderDesc=$scope.searchAllObject.spree_orders;
     $scope.customerDesc=$scope.searchAllObject.spree_users;
     $scope.showCollection=$scope.searchAllObject.spree_taxons;
     console.log("showAllData product\n",$scope.productDesc);
     console.log("showAllData order\n",$scope.orderDesc);
     console.log("showAllData customer\n",$scope.customerDesc);
     console.log("showAllData collection\n",$scope.collectionDesc);

   }
   $scope.showOrders=function(){
     console.log("calling show orders function");
     $scope.textPart=false;
     $scope.showProduct=false;
     $scope.showCustomer=false;
     $scope.showOrder=true;
     $scope.showCollection=false;
     if($scope.searchText.length==0){
      // $scope.dataPart=false;
       $scope.textPart=true;
     }
     //$scope.dataPart=true;
     $scope.orderDesc=$scope.searchAllObject.spree_orders;
     console.log("show order data\n",$scope.orderDesc);

   }

   $scope.showProducts=function(){
     console.log("calling show product function");
     $scope.textPart=false;
     $scope.showProduct=true;
     $scope.showOrder=false;
     $scope.showCustomer=false;
     $scope.showCollection=false;
     if($scope.searchText.length==0){
      // $scope.dataPart=false;
       $scope.textPart=true;
     }
     //$scope.dataPart=true;
     $scope.productDesc=$scope.searchAllObject.spree_products;
     console.log("show product data\n",$scope.productDesc);
   }

   $scope.showCustomers=function(){
     console.log("calling show customer function");
     $scope.textPart=false;
     $scope.showProduct=false;
     $scope.showOrder=false;
     $scope.showCustomer=true;
     $scope.showCollection=false;
     if($scope.searchText.length==0){
      // $scope.dataPart=false;
       $scope.textPart=true;
     }
     //$scope.dataPart=true;
     $scope.customerDesc=$scope.searchAllObject.spree_users;
     console.log("show customer data\n",$scope.customerDesc);
   }
   $scope.showCollections=function(){
     console.log("calling show collections function");
     $scope.textPart=false;
     $scope.showProduct=false;
     $scope.showOrder=false;
     $scope.showCustomer=false;
     $scope.showCollection=true;
     if($scope.searchText.length==0){
      // $scope.dataPart=false;
       $scope.textPart=true;
     }
     //$scope.dataPart=true;
     $scope.collectionDesc=$scope.searchAllObject.spree_taxons;
     console.log("show collection data\n",$scope.collectionDesc);
   }

   /*$http.get('/query')
   .success(function(data){
     var res = data.data;
     console.log("products\n\n",data.data);

     var end = new Date().getTime();
   })
   .error(function(err){
     console.log("error: fetching value from redis server");
   })*/
   /*Global search ends*/
   /* Moved to discount controller
  $scope.today = function() {
    $scope.discountStart = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.discountStart = null;
  };

  $scope.discountCodeGen = function() {
    var length = 12;
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   var result = '';
   for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
   $scope.discountCode = result;
}
  */

  /* Moved to product controller

  $scope.productData  = new prototypeObject.product();


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
*/
/*Moved Giftcard controller
  $scope.giftCardObj = [
    {
      title: "Rs. 10",
      value: "10"
    },
    {
      title: "Rs. 25",
      value: "25"
    },
    {
      title: "Rs. 50",
      value: "50"
    },
    {
      title: "Rs. 100",
      value: "100"
    },
    {
      title: "Order over Rs. 6000",
      value: "1500"
    }
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
        $scope.productImage = result
      })
    }
  }

  $scope.createProduct = function() {
    console.log($scope.productData);
    products.createProduct($scope.productData).then(function(data){
      alert('Product successfully added');
      $scope.activeButton('products')
    }, function(info) {
      console.log(info);
    })
  }

  $scope.deleteProducts = function(id) {
    products.deleteProduct(id).then(function(data){
      alert('Product deleted successfully');
      $scope.activeButton('products')
    }, function(info) {
      console.log(info);
    })
  }
  */






   $scope.activeButton = function(element) {
    $scope.isActive = !$scope.isActive;
    $scope.navbar = element;
    console.log($scope.navbar);

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



  /*To be moved to customer controller*/


})

.directive('adminHome', function() {
  return {
    templateUrl: 'app/admin/partial_templates/adminHome.html'
  };
})

.directive('productHome', function() {
  return {
    templateUrl: 'app/admin/partial_templates/productsHome.html'
  };
})

.directive('addProduct', function() {
  return {
    templateUrl: 'app/admin/partial_templates/addProducts.html'
  };
})

.directive('customerHome', function() {
  return {
    templateUrl: 'app/admin/partial_templates/customerHome.html'
  };
})

.directive('addCustomer', function() {
  return {
    templateUrl: 'app/admin/partial_templates/addCustomer.html'
  }
})

.directive('discountsHome', function() {
  return {
    templateUrl: 'app/admin/partial_templates/discountsHome.html'
  }
})

.directive('addDiscounts', function() {
  return {
    templateUrl: 'app/admin/partial_templates/addDiscounts.html'
  }
})

.directive('giftCardHome', function() {
  return {
    templateUrl: 'app/admin/partial_templates/giftCardHome.html'
  }
})

.directive('manageGiftCard', function() {
  return {
    templateUrl: 'app/admin/partial_templates/manageGiftCard.html'
  }
})

.directive('addGiftProducts', function() {
  return {
    templateUrl: 'app/admin/partial_templates/addGiftProducts.html'
  }
})

.directive('orderHome', function() {
  return {
    templateUrl: 'app/admin/partial_templates/orderHome.html'
  }
})

.directive('addOrder', function() {
  return {
    templateUrl: 'app/admin/partial_templates/addOrder.html'
  }
})
.directive('defaultSideMenu', function() {
  return {
    templateUrl: 'app/admin/default/partials/sideBarDefault.html'
  }
})
