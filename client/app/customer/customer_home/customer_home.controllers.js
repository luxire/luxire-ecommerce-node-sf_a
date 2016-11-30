angular.module('luxire')
.controller('CustomerHomeController', function($scope, $state,CustomerConstants, $window, CustomerProducts, ImageHandler, $rootScope, $location, CustomerOrders, $timeout, $sce){

  $scope.sce = $sce;
  $scope.loading = true;
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
  function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
  $scope.available_collections = ['shirts', 'pants'];

  $scope.go_to_collection = function(permalink){
    var is_active_collection = CustomerProducts.is_active_collections(permalink);
    if(!is_active_collection){
      $rootScope.alerts[0] = {type: 'warning', message: capitalizeFirstLetter(permalink)+ ' Collection coming soon!'};
    }
    else{
      $location.url('/collections/'+permalink);
    }

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

  $scope.get_display_width = function(){
    // console.log('area', $("#activeReviewArea").innerWidth());
    // console.log('img', $("#activeReviewImage").innerWidth());
    // $timeout(function(){
    // },0)
  };

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
      y_pos: '48%',
      x_pos: '23.5%',
      name: 'Shirt',
      text_line: 'This is a sample text animation for Shirt Style',
      active: true,
      permalink: 'shirts'
    },
    {
      id: 2,
      y_pos: '58%',
      x_pos: '19.5%',
      name: 'Pant',
      text_line: 'This is a sample text animation for Pant Style',
      active: true,
      permalink: 'pants'
    },
    {
      id: 3,
      y_pos: '32.5%',
      x_pos: '68.5%',
      name: 'Jacket',
      text_line: 'This is a sample text animation for Jacket Style'
    },
    {
      id: 4,
      y_pos: '35.5%',
      x_pos: '43%',
      name: 'Tie',
      text_line: 'This is a sample text animation for Tie'
    },
    {
      id: 5,
      y_pos: '73%',
      x_pos: '56.5%',
      name: 'Socks',
      text_line: 'This is a sample text animation for Socks'
    },
    {
      id: 6,
      y_pos: '79%',
      x_pos: '53.5%',
      name: 'Shoes',
      text_line: 'This is a sample text animation for Shoes'
    },
    {
      id: 7,
      y_pos: '34%',
      x_pos: '40%',
      name: 'Outerwear',
      text_line: 'This is a sample text animation for Trousser Fit'
    },
    {
      id: 8,
      y_pos: '43%',
      x_pos: '26.5%',
      name: 'Pocket Square',
      text_line: 'This is a sample text animation for Pocket Square'
    }


  ]


  // $scope.click_baits = [
  //   {
  //     id: 1,
  //     y_pos: '25%',
  //     x_pos: '48.5%',
  //     name: 'Suit Style',
  //     text_line: 'This is a sample text animation for Suit Style'
  //   },
  //   {
  //     id: 2,
  //     y_pos: '28%',
  //     x_pos: '48.5%',
  //     name: 'Monogram',
  //     text_line: 'This is a sample text animation for Monogram'
  //   },
  //   {
  //     id: 3,
  //     y_pos: '30.5%',
  //     x_pos: '49.5%',
  //     name: 'Pocket Squares',
  //     text_line: 'This is a sample text animation for Pocket Squares'
  //   },
  //   {
  //     id: 4,
  //     y_pos: '37.5%',
  //     x_pos: '49.5%',
  //     name: 'Fit & Size',
  //     text_line: 'This is a sample text animation for Fit & Size'
  //   },
  //   {
  //     id: 5,
  //     y_pos: '44%',
  //     x_pos: '54.5%',
  //     name: 'Shirt Cuff Style',
  //     text_line: 'This is a sample text animation for Shirt Cuff Style'
  //   },
  //   {
  //     id: 6,
  //     y_pos: '77%',
  //     x_pos: '53.5%',
  //     name: 'Shoes',
  //     text_line: 'This is a sample text animation for Shoes'
  //   },
  //   {
  //     id: 7,
  //     y_pos: '56%',
  //     x_pos: '51%',
  //     name: 'Trousser Fit',
  //     text_line: 'This is a sample text animation for Trousser Fit'
  //   },
  //   {
  //     id: 8,
  //     y_pos: '40%',
  //     x_pos: '45.5%',
  //     name: 'Button Colour',
  //     text_line: 'This is a sample text animation for Button Colour'
  //   },
  //   {
  //     id: 9,
  //     y_pos: '35%',
  //     x_pos: '44.5%',
  //     name: 'Shirt Placket',
  //     text_line: 'This is a sample text animation for Shirt Placket'
  //   }
  //
  // ]

  $scope.loading = false;


  $scope.active_customer_review_index = 0;

  $scope.customer_reviews = [
    {
      image: 'assets/images/customer/luxire-customer-reviews/customer_review_1.jpg',
      review: 'Editor Andreas Weinas wearing Luxire pants to Pitti Uomo 88',
      name: 'Andreas Weinas',
      source: 'vogue',
      sourceRef: 'http://www.vogue.com/13370947/pitti-uomo-january-2016-events/'
    },
    {
      image: 'assets/images/customer/luxire-customer-reviews/customer_review_2.jpeg',
      review: 'Just in case anyone\'s still not clear on the whole \"Luxire can do anything\" mantra: I asked them to make a knit top for a young woman with built-in fingerless gloves so that she can roll like a Dickensian street urchin. Nailed it.',
      name: 'CruzAzul',
      source: 'Style Forum',
      sourceRef: 'http://www.styleforum.net/t/304965/luxire-custom-clothing-official-affiliate-thread/23600_100#post_8553315'
    },
    {
      image: 'http://cdn.styleforum.net/5/5c/900x900px-LL-5c99b818_image.jpeg',
      review: 'I ordered this shirt with the NOBDII collar and a "medium" wash. I wear a lot of sportcoats and odd trousers so the collar type made sense for me. It\'s honestly my favorite Luxire shirt along with the Blue Denim Slubby Chambray.',
      name: 'patliean1',
      source: 'Style Forum',
      sourceRef: 'http://www.styleforum.net/t/304965/luxire-custom-clothing-official-affiliate-thread/21700_100#post_8338716'
    },
    {
      image: 'http://www.styleforum.net/image/id/11288434',
      review: '',
      name: 'NOTWITHIT',
      source: 'Style Forum',
      sourceRef: 'http://www.styleforum.net/t/518949/luxire-and-styleforum-leather-jackets-official-thread/0_100#post_8510168'
    },
    {
      image: 'http://cdn.styleforum.net/9/97/97d28283_DSC02722.jpeg',
      review: 'A little project Luxire did for me in Dugdale black plain linen',
      name: 'Frank Cowperwood',
      source: 'Style Forum',
      sourceRef: 'http://www.styleforum.net/t/304965/luxire-custom-clothing-official-affiliate-thread/19600_100#post_8088795'
    },
    {
      image: 'https://parisiangentleman.fr/wp-content/uploads/2015/02/paulcollarstanding.jpg',
      review: 'Hi Paul, I really like the collar on the Luxire shirt you’re wearing on your most recent posts.  I’m a Luxire customer as well. I’d appreciate it if you can provide me with some details on the collar. What collar is it?<br>Thanks in advance.<br>~periodicreview<br>Dear periodicreview,This is probably the most reoccurring question that I\’ve had for months !To get directly to the point, I only use two types of collars with the Luxire brand:1. An English spread with 3.5” collar wings:2. A button-down with 3.5” collar wings based on the “Barba shirt” button-down collar. Sometimes, I like a nice S-shape roll on my button-down with a slightly longer collar wings. Other times, I prefer a perfectly straight button down collar',
      name: 'Paul LUX',
      source: 'Parisian Gentleman',
      sourceRef: 'https://parisiangentleman.co.uk/2015/02/23/q-a-with-pg-editors-what-type-of-shirt-collar-should-i-buy/',
      font_size: '88'
    },
    {
      image: 'http://blueloafers.com/wp-content/uploads/2015/01/IMG_1652-1024x668.jpg',
      review: 'Every time I asked for or specified details Luxire followed them flawlessly and delivered a product which I was very happy with. This time was no exception. They did a great job and I already ordered the exact same copy of this shirt but in darker shade of blue.',
      name: 'Anonymous',
      source: 'Blue Loafers',
      sourceRef: 'http://blueloafers.com/quality-products/mtm-denim-shirt/'
    },
    {
      image: 'http://cdn.styleforum.net/c/c9/500x1000px-LL-c9bc6145_interior-torso-2.jpeg',
      review: 'Holland & Sherry Tweed, fully lined. This is the first I\'ve had made from wool. Ashish, to his credit, tried to give me a less expensive option by showing me a bunch of lovely Campore plaids. And so I had them make a pair of magnificent pants from one of the Campore light tweeds. They\'re obviously beautiful and I\'d recommend that fabric line to anyone. But ultimately I decided the Holland & Sherry I chose was something special, with a unique richness of colour and complexity of pattern, and life is short so I might as well go for it.',
      name: 'CruzAzul',
      source: 'Style Forum',
      sourceRef: 'http://www.styleforum.net/t/304965/luxire-custom-clothing-official-affiliate-thread/22200_100#post_8390415',
      font_size: '100'
    },
    {
      image: 'http://d2ihp3fq52ho68.cloudfront.net/YTo2OntzOjI6ImlkIjtpOjEyMTk2Nzg7czoxOiJ3IjtpOjQzODtzOjE6ImgiO2k6MzIwMDtzOjE6ImMiO2k6MDtzOjE6InMiO2k6MDtzOjE6ImsiO3M6NDA6IjcyNTliZmFmMWZjMTc4MWI0MTMzZmUzNzQzMzQ0MWFlOTVjMzg5ODciO30=',
      review: 'Det kanske mest intressanta bortsett från priserna är att man kan välja mellan otroligt mycket intressanta detaljer och val på byxorna. Man kan göra närmare 5 olika sorters plisséringar, mängder med olika knäppningar, detaljer som uppknäppning av slag m.m som även exklusiva tillverkare inte alltid erbjuder. Man kan exempelvis beställa olika längd på knäsiden eller om man vill undvika det helt. Vårt råd är att om man vill testa tjänsten gör man så med någon av de lite billigare tygkvaliteterna i exempelvis bomull eller linne först. Även om man kan korrigera resultatet hos en ändringsskräddare är det klart bättre att vänta till andra eller t om tredje byxan innan man beställer i exempelvis flanell från Fox eller Dugdale som ligger något högre i pris. ',
      name: 'Anonymous',
      source: 'manolo.se',
      sourceRef: 'http://www.manolo.se/artiklar/artikel/20160107/basta-budgetkopen-luxire',
      font_size: '85'
    }
  ];

  $scope.number_of_reviews = $scope.customer_reviews.length;
  $scope.review_indexes = [];
  for(var i=0; i<$scope.number_of_reviews; i++){
    $scope.review_indexes.push(i);
  };
  $scope.get_review_width = function(){
    $timeout(function(){
      $scope.review_description_width = (($("#activeReviewArea").innerWidth() - $("#activeReviewImage").innerWidth())-20)+'px';
    })
  };
  $(window).resize(function(){
    $scope.get_review_width();
    console.log('window resized');
  });

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
