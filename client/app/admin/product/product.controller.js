angular.module('luxire')
.controller('ProductController',function($scope, products, fileReader, prototypeObject){

  $scope.productData  = new prototypeObject.product();

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





















});
