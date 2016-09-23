angular.module('luxire')
.controller('CustomerHomeController', function($scope, $state,CustomerConstants, $window, CustomerProducts, ImageHandler, $rootScope, $location, CustomerOrders, $timeout){

  var default_collection = {
    taxonomy_name: CustomerConstants.default.taxonomy_name,
    taxon_name: CustomerConstants.default.taxon_name,
    taxonomy_id: CustomerConstants.default.taxonomy_id,
    taxon_id: CustomerConstants.default.taxon_id,
  };
  $scope.product_taxonomies = [];

  $timeout(function(){
    $('.carousel').carousel();
  }, 0);
  $scope.prev_product_slide = function(index){
    console.log('index', index);
    $('.carousel').carousel('prev');
  };
  $scope.next_product_slide = function(index){
    console.log('index', index);

    $('.carousel').carousel('next');
  };

  CustomerProducts.taxonomy_index()
  .then(function(data){
    $scope.product_taxonomies = data.data.taxonomies;
    console.log('taxonomies', data.data.taxonomies);
  }, function(error){
    console.log('error', error);
  });
  $scope.go_to_product_listing = function(taxonomy_name, taxon_name){
    $state.go('customer.product_listing', default_collection);
  };
  // CustomerOrders.get_order_by_cookie()
  // .then(function(data){
  //   console.log('fetched order', data.data);
  //   $rootScope.luxire_cart = data.data;
  // },
  // function(error){
  //   console.error(error);
  // });

  $scope.go_to_collection = function(permalink){
    console.log('set location for', permalink);
    console.log('location', $location.url());
    $location.url('/collections/'+permalink);
    console.log('changed location', $location.url());

  };

  $scope.product_type_carousels = [
    // {
    //   id: 2,
    //   image: 'assets/images/customer/luxire-banner/jacket.jpg',
    //   link: '',
    //   text: 'Bespoke Suit Jackets',
    //   permalink: 'jackets'
    // }
    // ,
    // {
    //   id: 1,
    //   image: 'assets/images/customer/luxire-banner/shirt.jpg',
    //   link: '',
    //   text: 'Hand-Stitched Luxury Shirts',
    //   permalink: 'shirts'
    //
    // }
    {
      id: 1,
      image: 'assets/images/customer/luxire-banner/slide-01.jpg',
      link: '',
      text: 'Bespoke Suit Jackets',
      permalink: 'jackets'
    }
    ,
    {
      id: 2,
      image: 'assets/images/customer/luxire-banner/slide-02.jpg',
      link: '',
      text: 'Hand-Stitched Luxury Shirts',
      permalink: 'shirts'

    },
    {
      id: 3,
      image: 'assets/images/customer/luxire-banner/slide-03.jpg',
      link: '',
      text: 'Bespoke Suit Jackets',
      permalink: 'jackets'
    }
    ,
    {
      id: 4,
      image: 'assets/images/customer/luxire-banner/slide-04.jpg',
      link: '',
      text: 'Hand-Stitched Luxury Shirts',
      permalink: 'shirts'

    },
    {
      id: 5,
      image: 'assets/images/customer/luxire-banner/slide-05.jpg',
      link: '',
      text: 'Bespoke Suit Jackets',
      permalink: 'jackets'
    }
    ,
    {
      id: 6,
      image: 'assets/images/customer/luxire-banner/slide-06.jpg',
      link: '',
      text: 'Hand-Stitched Luxury Shirts',
      permalink: 'shirts'

    }

  ];

  $scope.active_click_bait = {
    id: -1
  }
  $scope.active_click_bait_detail = {
    id: -1
  }

  $scope.change_active_click_bait = function(id){
    console.log('mouse over', id);
    $scope.active_click_bait.id=id;
    if($scope.active_click_bait_detail.id!==id){
      // $scope.active_click_bait_detail.id = -1;
      $scope.active_click_bait_detail.id = id;
      // $timeout(function () {
      //
      // }, 500);
    }

  };

  $scope.click_baits = [
    {
      id: 1,
      y_pos: '25%',
      x_pos: '48.5%',
      name: 'Suit Style',
      text_line: 'This is a sample text animation for Suit Style'
    },
    {
      id: 2,
      y_pos: '28%',
      x_pos: '48.5%',
      name: 'Monogram',
      text_line: 'This is a sample text animation for Monogram'
    },
    {
      id: 3,
      y_pos: '30.5%',
      x_pos: '49.5%',
      name: 'Pocket Squares',
      text_line: 'This is a sample text animation for Pocket Squares'
    },
    {
      id: 4,
      y_pos: '37.5%',
      x_pos: '49.5%',
      name: 'Fit & Size',
      text_line: 'This is a sample text animation for Fit & Size'
    },
    {
      id: 5,
      y_pos: '44%',
      x_pos: '54.5%',
      name: 'Shirt Cuff Style',
      text_line: 'This is a sample text animation for Shirt Cuff Style'
    },
    {
      id: 6,
      y_pos: '77%',
      x_pos: '53.5%',
      name: 'Shoes',
      text_line: 'This is a sample text animation for Shoes'
    },
    {
      id: 7,
      y_pos: '56%',
      x_pos: '51%',
      name: 'Trousser Fit',
      text_line: 'This is a sample text animation for Trousser Fit'
    },
    {
      id: 8,
      y_pos: '40%',
      x_pos: '45.5%',
      name: 'Button Colour',
      text_line: 'This is a sample text animation for Button Colour'
    },
    {
      id: 9,
      y_pos: '35%',
      x_pos: '44.5%',
      name: 'Shirt Placket',
      text_line: 'This is a sample text animation for Shirt Placket'
    }

  ]



  $scope.active_customer_review_index = 0;

  $scope.customer_reviews = [
    {
      image: 'assets/images/customer/luxire-customer-reviews/customer_review_1.png',
      review: 'When I placed the order for my suit and shirt, i did not expect it to arrive in 10 days.That too, with a perfect finish.',
      name: 'John Williams',
      source: 'Style Forum'
    },
    {
      image: 'assets/images/customer/luxire-customer-reviews/customer_review_1.png',
      review: 'When I placed the order for my suit and shirt, i did not expect it to arrive in 10 days.That too, with a perfect finish.',
      name: 'Lionel Messi',
      source: 'Style Forum'
    },
    {
      image: 'assets/images/customer/luxire-customer-reviews/customer_review_1.png',
      review: 'When I placed the order for my suit and shirt, i did not expect it to arrive in 10 days.That too, with a perfect finish.',
      name: 'Christiano Ronaldo',
      source: 'Style Forum'
    }
  ];

  $scope.number_of_reviews = $scope.customer_reviews.length;
  $scope.review_indexes = [];
  for(var i=0; i<$scope.number_of_reviews; i++){
    $scope.review_indexes.push(i);
  };

  $scope.change_active_review_index = function(index){
    console.log('current active index', $scope.active_customer_review_index);
    console.log('index', index);
    $scope.active_customer_review_index = index;
    console.log('new active index', $scope.active_customer_review_index);

  };

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  }

  $scope.unique_collections = [
    {
        image: 'assets/images/customer/unique-collection/unique_shirt_collection.png',
        uniqueness_text: 'Largest Collection of Shirts',
        unique_features: [{
          count: '235',
          feature: 'Checks'
        },
        {
          count: '543',
          feature: 'Solids'
        },
        {
          count: '140',
          feature: 'Linens'
        }
        ,
        {
          count: '459',
          feature: 'Stripes'
        }
      ]
    }
  ];

  $scope.beginLineAnimation = function(){
    console.log('animate line', document.getElementById('animateLine'));
    document.getElementById('animateLine').beginElement()

  };

  $scope.go_to_listing = function(taxonomy){
    console.log('selected_taxonomy', taxonomy);
    if(taxonomy.root.taxons && taxonomy.root.taxons.length>0){
      var listing = {
        taxonomy_name: taxonomy.name,
        taxonomy_id: taxonomy.id,
        taxon_name: taxonomy.root.taxons[0].name,
        taxon_id: taxonomy.root.taxons[0].id
      };
      $state.go('customer.product_listing',listing);
    }
    else{
      $rootScope.alerts.push({type: 'danger', message: 'No products found'});
    }
  };

});
