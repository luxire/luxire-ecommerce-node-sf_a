angular.module('luxire')
.controller('customizeShirtController', function($scope, products, $location) {

  /*$scope.preSetStyles=[
    "regular": {
        "collar":"semi spread",
        "cuffs": "cuffs1",
        "back" :"back1",
        "pocket": "pocket1",
        "placket": "placket1"
    },
    "regular": {
        "collar":"semi spread",
        "cuffs": "cuffs1",
        "back" :"back1",
        "pocket": "pocket1",
        "placket": "placket1"
    },
    "regular": {
        "collar":"semi spread",
        "cuffs": "cuffs1",
        "back" :"back1",
        "pocket": "pocket1",
        "placket": "placket1"
    }
  ]*/

  $scope.selectedOptions = {
    "collar":"",
    "cuffs": "",
    "back" :"",
    "pocket": "",
    "placket": ""
  }


  $scope.shirtDetails={
    "name": "Grey wool Flannel",
    "alt" : "Grey wool Flannel",
    "imgurl": "lib/filter-img/fabric2.jpg",
    "price": "$99.99",
    "fabric": "blue cotton",
    "fitStyle": [
      {
        "imgurl":"lib/filter-img/fabric1.jpg",
        "text":"Regular",
        "id":1,
      },
      {
        "imgurl":"lib/filter-img/fabric2.jpg",
        "text":"Retro",
        "id":2

      },
      {
        "imgurl":"lib/filter-img/fabric4.jpg",
        "text":"Classic",
        "id":3

      },
      {
        "imgurl":"lib/filter-img/fabric1.jpg",
        "text":"Minimalist",
        "id":4
      },
      {
        "imgurl":"lib/filter-img/fabric2.jpg",
        "text":"Regular",
        "id":5
      },
      {
        "imgurl":"lib/filter-img/fabric4.jpg",
        "text":"Retro",
        "id":6

      },
      {
        "imgurl":"lib/filter-img/fabric1.jpg",
        "text":"Classic",
        "id":7

      },
      {
        "imgurl":"lib/filter-img/fabric2.jpg",
        "text":"Regular",
        "id":8
      },
      {
        "imgurl":"lib/filter-img/fabric4.jpg",
        "text":"Minimalist",
        "id":9

      },
      {
        "imgurl":"lib/filter-img/fabric1.jpg",
        "text":"Retro",
        "id":10

      },
      {
        "imgurl":"lib/filter-img/fabric2.jpg",
        "text":"GMinimalist",
        "id":11
      },
      {
        "imgurl":"lib/filter-img/fabric4.jpg",
        "text":"Regular",
        "id":12
      },
      {
        "imgurl":"lib/filter-img/fabric1.jpg",
        "text":"Classic",
        "id":13

      },
      {
        "imgurl":"lib/filter-img/fabric2.jpg",
        "text":"Retro",
        "id":14

      }
    ],
    "collarStyle": [
      {
        "imgurl":"lib/collar-style/collar1.png",
        "text":"Semi Spread",
        "id":1
      },
      {
        "imgurl":"lib/collar-style/collar2.png",
        "text":"Button Down",
        "id":2

      },
      {
        "imgurl":"lib/collar-style/collar3.png",
        "text":"English Spread",
        "id":3

      },
      {
        "imgurl":"lib/collar-style/collar4.png",
        "text":"Spear Point",
        "id":4
      },
      {
        "imgurl":"lib/collar-style/collar5.png",
        "text":"Custom",
        "id":5
      }
    ],
    "cuffStyle": [
      {
        "imgurl":"lib/cuffs-style/style2.png",
        "text":"collar",
        "id":1
      },
      {
        "imgurl":"lib/cuffs-style/style3.png",
        "text":"cuffs",
        "id":2

      },
      {
        "imgurl":"lib/cuffs-style/style4.png",
        "text":"back",
        "id":3

      },
      {
        "imgurl":"lib/cuffs-style/style5.png",
        "text":"Spear Point",
        "id":4
      },
      {
        "imgurl":"lib/cuffs-style/style6.png",
        "text":"pocket",
        "id":5
      },
      {
        "imgurl":"lib/cuffs-style/style7.png",
        "text":"placket",
        "id":6

      },
      {
        "imgurl":"lib/cuffs-style/style8.png",
        "text":"pocket",
        "id":7
      },
      {
        "imgurl":"lib/cuffs-style/style9.png",
        "text":"Custom",
        "id":8
      }
    ],
    "description": [
      {
        "name" :"fabric",
        "value":"blue cotton"
      },
      {
        "name" :"Fit",
        "value":"Slim"
      },
      {
        "name" :"sleeve",
        "value":"Full"
      },
      {
        "name" :"collar",
        "value":"Semi Spread"
      },
      {
        "name" :"cuffs",
        "value":"Regular"
      },
      {
        "name" :"back",
        "value":"Pleaeted"
      },
    ]
  };
  $scope.selectedOptions=[
    {
      "name" :"fabric",
      "value":"blue cotton"
    },
    {
      "name" :"Fit",
      "value":"Slim"
    },
    {
      "name" :"sleeve",
      "value":"Full"
    },
    {
      "name" :"collar",
      "value":"Semi Spread"
    },
    {
      "name" :"cuffs",
      "value":"Regular"
    },
    {
      "name" :"back",
      "value":"Pleaeted"
    },
  ];
  /*$scope.classicShirtObj=[
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "text":"Regular",
      "id":1
    },
    {
      "imgurl":"lib/filter-img/fabric2.jpg",
      "text":"Retro",
      "id":2

    },
    {
      "imgurl":"lib/filter-img/fabric4.jpg",
      "text":"Classic",
      "id":3

    },
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "text":"Minimalist",
      "id":4
    },
    {
      "imgurl":"lib/filter-img/fabric2.jpg",
      "text":"Regular",
      "id":5
    },
    {
      "imgurl":"lib/filter-img/fabric4.jpg",
      "text":"Retro",
      "id":6

    },
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "text":"Classic",
      "id":7

    },
    {
      "imgurl":"lib/filter-img/fabric2.jpg",
      "text":"Regular",
      "id":8
    },
    {
      "imgurl":"lib/filter-img/fabric4.jpg",
      "text":"Minimalist",
      "id":9

    },
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "text":"Retro",
      "id":10

    },
    {
      "imgurl":"lib/filter-img/fabric2.jpg",
      "text":"GMinimalist",
      "id":11
    },
    {
      "imgurl":"lib/filter-img/fabric4.jpg",
      "text":"Regular",
      "id":12
    },
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "text":"Classic",
      "id":13

    },
    {
      "imgurl":"lib/filter-img/fabric2.jpg",
      "text":"Retro",
      "id":14

    },

  ];
  $scope.fitStyle=[
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "text":"Regular",
      "id":1
    },
    {
      "imgurl":"lib/filter-img/fabric2.jpg",
      "text":"Retro",
      "id":2

    },
    {
      "imgurl":"lib/filter-img/fabric4.jpg",
      "text":"Classic",
      "id":3

    },
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "text":"Minimalist",
      "id":4
    },
    {
      "imgurl":"lib/filter-img/fabric2.jpg",
      "text":"Regular",
      "id":5
    },
    {
      "imgurl":"lib/filter-img/fabric4.jpg",
      "text":"Retro",
      "id":6

    },
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "text":"Classic",
      "id":7

    },
    {
      "imgurl":"lib/filter-img/fabric2.jpg",
      "text":"Regular",
      "id":8
    },
    {
      "imgurl":"lib/filter-img/fabric4.jpg",
      "text":"Minimalist",
      "id":9

    },
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "text":"Retro",
      "id":10

    },
    {
      "imgurl":"lib/filter-img/fabric2.jpg",
      "text":"GMinimalist",
      "id":11
    },
    {
      "imgurl":"lib/filter-img/fabric4.jpg",
      "text":"Regular",
      "id":12
    },
    {
      "imgurl":"lib/filter-img/fabric1.jpg",
      "text":"Classic",
      "id":13

    },
    {
      "imgurl":"lib/filter-img/fabric2.jpg",
      "text":"Retro",
      "id":14

    },

  ];
  $scope.collarStyle=[
    {
      "imgurl":"lib/collar-style/collar1.png",
      "text":"Semi Spread",
      "id":1
    },
    {
      "imgurl":"lib/collar-style/collar2.png",
      "text":"Button Down",
      "id":2

    },
    {
      "imgurl":"lib/collar-style/collar3.png",
      "text":"English Spread",
      "id":3

    },
    {
      "imgurl":"lib/collar-style/collar4.png",
      "text":"Spear Point",
      "id":4
    },
    {
      "imgurl":"lib/collar-style/collar5.png",
      "text":"Custom",
      "id":5
    }
  ];
  $scope.cuffStyle=[
    {
      "imgurl":"lib/cuffs-style/style2.png",
      "text":"collar",
      "id":1
    },
    {
      "imgurl":"lib/cuffs-style/style3.png",
      "text":"cuffs",
      "id":2

    },
    {
      "imgurl":"lib/cuffs-style/style4.png",
      "text":"back",
      "id":3

    },
    {
      "imgurl":"lib/cuffs-style/style5.png",
      "text":"Spear Point",
      "id":4
    },
    {
      "imgurl":"lib/cuffs-style/style6.png",
      "text":"pocket",
      "id":5
    },
    {
      "imgurl":"lib/cuffs-style/style7.png",
      "text":"placket",
      "id":6

    },
    {
      "imgurl":"lib/cuffs-style/style8.png",
      "text":"pocket",
      "id":7
    },
    {
      "imgurl":"lib/cuffs-style/style9.png",
      "text":"Custom",
      "id":8
    }
  ];*/


  // start of slider functionality

  $scope.mainObj=$scope.shirtDetails.fitStyle;
  var tempObj=[];
  var slideStart=2;
  var slideEnd=12;
  $scope.hideNext=false;
  $scope.hidePrev=false;
  $scope.slideNext=function(){
    tempObj=$scope.shirtDetails.fitStyle;
    console.log("slide next is calling");
    slideStart++;
    console.log("slide start: "+slideStart);
    slideEnd++;
    if(slideStart!=0){
      $scope.hidePrev=false;
    }
    console.log("slide end: "+slideEnd);
    $scope.mainObj=tempObj.slice(slideStart,slideEnd);
    if(slideEnd==14){
      $scope.hideNext=true;
    }
    for(i=0;i<10;i++){
      console.log("id : "+$scope.mainObj[i].id);
    }

  }
  $scope.slidePrev=function(){

    tempObj=$scope.shirtDetails.fitStyle;
    console.log("slide prev is calling");
    slideStart--;
    console.log("slide start: "+slideStart);
    slideEnd--;
    console.log("slide end: "+slideEnd);
    if(slideEnd!=14){
      $scope.hideNext=false;
    }
    $scope.mainObj=tempObj.slice(slideStart,slideEnd);
    if(slideStart==0){
      $scope.hidePrev=true;
    }
    for(i=0;i<10;i++){
      console.log("id : "+$scope.mainObj[i].id);
    }
  }
  // end of slider functionality

  //start of onclick functionality
  $scope.selectedCuffsIndex = -1;
  $scope.selectCuffs=function(index,type){
    console.log(" cuff type: "+type);

    $scope.selectedCuffsIndex = index;

  }

  $scope.selectedCollarIndex = -1;
  $scope.selectCollar=function(index,type){
    console.log(" collar type: "+type);
    $scope.selectedCollarIndex = index;

  }
  $scope.selectedFitIndex = -1;
  $scope.selectFit=function(index,type){
    console.log(" fit type: "+type);
    $scope.selectedFitIndex= index;

  }

  //end of onclick functionality



})
