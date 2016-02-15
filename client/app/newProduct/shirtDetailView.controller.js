angular.module('luxire')
.controller('shirtDetailViewController', function($scope, products, $location) {
  $scope.imgThumnails=[
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "alt":"fabric1"
    },
    {
      "imgurl":"lib/filter-img/fabric2.jpg",
      "alt":"fabric2"
    },
  ];
  /*$scope.classicShirtObj=[
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "alt":"fabric1"
    },
    {
      "imgurl":"lib/filter-img/fabric2.jpg",
      "alt":"fabric2"
    },
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "alt":"fabric1"
    },
    {
      "imgurl":"lib/filter-img/fabric2.jpg",
      "alt":"fabric2"
    },
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "alt":"fabric1"
    },
    {
      "imgurl":"lib/filter-img/fabric2.jpg",
      "alt":"fabric2"
    },
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "alt":"fabric1"
    },
    {
      "imgurl":"lib/filter-img/fabric2.jpg",
      "alt":"fabric2"
    },
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "alt":"fabric1"
    },

  ];*/
  $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  var slides = $scope.slides = [];
  var currIndex = 0;

  $scope.addSlide = function() {
    var newWidth = 600 + slides.length + 1;
    slides.push({
      image: '//lorempixel.com/' + newWidth + '/300',
      text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
      id: currIndex++
    });
  };

  $scope.randomize = function() {
    var indexes = generateIndexesArray();
    assignNewIndexesToSlides(indexes);
  };

  for (var i = 0; i < 4; i++) {
    $scope.addSlide();
  }

  // Randomize logic below

  function assignNewIndexesToSlides(indexes) {
    for (var i = 0, l = slides.length; i < l; i++) {
      slides[i].id = indexes.pop();
    }
  }

  function generateIndexesArray() {
    var indexes = [];
    for (var i = 0; i < currIndex; ++i) {
      indexes[i] = i;
    }
    return shuffle(indexes);
  }

  // http://stackoverflow.com/questions/962802#962890
  function shuffle(array) {
    var tmp, current, top = array.length;

    if (top) {
      while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
    }

    return array;
  }
  $scope.imgThumnails=[
    {
      "imgurl":"lib/filter-img/luxire_prod1.jpg",
      "text":"Grey wool Flannel",
      "price":"$100"
    },
    {
      "imgurl":"lib/filter-img/luxire_prod2.jpg",
      "text":"Grey wool Flannel",
      "price":"$100"

    },
    {
      "imgurl":"lib/filter-img/luxire_prod3.jpeg",
      "text":"Grey wool Flannel",
      "price":"$100"

    }
  ];
  $scope.images=[
    {
      "imgurl":"lib/filter-img/luxire_prod1.jpg",
      "text":"Grey wool Flannel",
      "id":1
    },
    {
      "imgurl":"lib/filter-img/luxire_prod2.jpg",
      "text":"Grey wool Flannel",
      "id":2

    },
    {
      "imgurl":"lib/filter-img/febric1.jpg",
      "text":"Grey wool Flannel",
      "id":3

    },
    {
      "imgurl":"lib/filter-img/luxire_prod1.jpg",
      "text":"Grey wool Flannel",
      "id":4
    },
    {
      "imgurl":"lib/filter-img/luxire_prod1.jpg",
      "text":"Grey wool Flannel",
      "id":5
    },
    {
      "imgurl":"lib/filter-img/luxire_prod2.jpg",
      "text":"Grey wool Flannel",
      "id":6

    },
  ];
  $scope.classicShirtObj=[
    {
      "imgurl":"lib/filter-img/luxire_prod1.jpg",
      "text":"Grey wool Flannel",
      "id":1
    },
    {
      "imgurl":"lib/filter-img/luxire_prod2.jpg",
      "text":"Grey wool Flannel",
      "id":2

    },
    {
      "imgurl":"lib/filter-img/luxire_prod3.jpeg",
      "text":"Grey wool Flannel",
      "id":3

    },
    {
      "imgurl":"lib/filter-img/luxire_prod1.jpg",
      "text":"Grey wool Flannel",
      "id":4
    },
    {
      "imgurl":"lib/filter-img/luxire_prod1.jpg",
      "text":"Grey wool Flannel",
      "id":5
    },
    {
      "imgurl":"lib/filter-img/luxire_prod2.jpg",
      "text":"Grey wool Flannel",
      "id":6

    },
    {
      "imgurl":"lib/filter-img/luxire_prod3.jpeg",
      "text":"Grey wool Flannel",
      "id":7

    },
    
  ];


})
