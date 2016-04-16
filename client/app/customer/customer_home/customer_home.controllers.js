angular.module('luxire')
.controller('CustomerHomeController', function($scope, $state,CustomerConstants, $window, CustomerProducts, ImageHandler, $rootScope, $location){

  var default_collection = {
    taxonomy_name: CustomerConstants.default.taxonomy_name,
    taxon_name: CustomerConstants.default.taxon_name,
    taxonomy_id: CustomerConstants.default.taxonomy_id,
    taxon_id: CustomerConstants.default.taxon_id,
  };
  $scope.product_taxonomies = [];

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

  $scope.go_to_collection = function(permalink){
    console.log('set location for', permalink);
    console.log('location', $location.url());
    $location.url('/collections/'+permalink);
    console.log('changed location', $location.url());

  };

  $scope.product_type_carousels = [
    {
      id: 2,
      image: 'assets/images/customer/luxire-banner/jacket.jpg',
      link: '',
      text: 'Bespoke Suit Jackets',
      selected_collection: {
        taxonomy_name: 'Jackets & Coats',
        taxonomy_id: 5,
        taxon_name: 'Leather',
        taxon_id: 23
      },
      permalink: 'jackets'
    }
    ,
    {
      id: 1,
      image: 'assets/images/customer/luxire-banner/shirt.jpg',
      link: '',
      text: 'Hand-Stitched Luxury Shirts',
      selected_collection: {
        taxonomy_name: 'Shirts',
        taxonomy_id: 3,
        taxon_name: 'Casual',
        taxon_id: 13
      },
      permalink: 'shirts'

    }

  ];

  

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
