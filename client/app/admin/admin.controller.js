 angular.module('luxire')
 .controller('adminController',function($scope, products, fileReader, prototypeObject){
   console.log(new prototypeObject.product())
   $scope.navbar = "default";
   $scope.adminConsole = "default";
   $scope.isActive = false;
   $scope.infinityFlag = true;

   $scope.page.setTitle("Admin Console")

   $scope.loading = false;

   $scope.productData  = new prototypeObject.product();
   $scope.customerData = new prototypeObject.customer();

   $scope.colorTags = []
   $scope.seasonTags = []

  $scope.today = function() {
    $scope.discountStart = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.discountStart = null;
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

   $scope.discountCodeGen = function() {
     var length = 12;
     var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    $scope.discountCode = result;
}

   $scope.loadTags = function(query) {
     if (query == 'color') {
       return $scope.dummyColors;
     } else if (query == 'season') {
       return $scope.dummySeasons;
     }
    return {};
  }

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
