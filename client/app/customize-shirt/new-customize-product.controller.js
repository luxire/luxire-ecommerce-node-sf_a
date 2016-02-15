angular.module('luxire')
.controller('newCustomizeProductController', function($scope, products, $location) {

  $scope.preSetStyles={
    "styleTypes":[
       {
            "id": 1,
            "name": "regular",
            "imgurl": "lib/filter-img/fabric2.jpg",
            "alt":"regular",
            "collar":"semi spread",
            "cuffs": "cuffs1",
            "back" :"back1",
            "pocket": "pocket1",
            "placket": "placket1"
        },
         {
            "id": 2,
            "name":"retro",
            "imgurl": "lib/filter-img/fabric1.jpg",
            "alt":"regular",
            "collar":"semi spread",
            "cuffs": "cuffs1",
            "back" :"back1",
            "pocket": "pocket1",
            "placket": "placket1"
        },
        {
            "id": 3,
            "name":"classic",
            "imgurl": "lib/filter-img/fabric4.jpg",
            "alt":"regular",
            "collar":"semi spread",
            "cuffs": "cuffs1",
            "back" :"back1",
            "pocket": "pocket1",
            "placket": "placket1"
        },
        {
            "id": 4,
            "name":"minimalistic",
            "imgurl": "lib/filter-img/fabric2.jpg",
            "alt":"regular",
            "collar":"semi spread",
            "cuffs": "cuffs1",
            "back" :"back1",
            "pocket": "pocket1",
            "placket": "placket1"
        },
         {
            "id": 5,
            "name":"classic",
            "imgurl": "lib/filter-img/fabric1.jpg",
            "alt":"regular",
            "collar":"semi spread",
            "cuffs": "cuffs1",
            "back" :"back1",
            "pocket": "pocket1",
            "placket": "placket1"
        },
        {
            "id": 6,
            "name":"retro",
            "imgurl": "lib/filter-img/fabric4.jpg",
            "alt":"regular",
            "collar":"semi spread",
            "cuffs": "cuffs1",
            "back" :"back1",
            "pocket": "pocket1",
            "placket": "placket1"
        },
        {
            "id": 7,
            "name":"regular",
            "imgurl": "lib/filter-img/fabric2.jpg",
            "alt":"regular",
            "collar":"semi spread",
            "cuffs": "cuffs1",
            "back" :"back1",
            "pocket": "pocket1",
            "placket": "placket1"
        },
        {
            "id": 8,
            "name":"retro",
            "imgurl": "lib/filter-img/fabric1.jpg",
            "alt":"regular",
            "collar":"semi spread",
            "cuffs": "cuffs1",
            "back" :"back1",
            "pocket": "pocket1",
            "placket": "placket1"
        },
        {
            "id": 9,
            "name":"classic",
            "imgurl": "lib/filter-img/fabric4.jpg",
            "alt":"regular",
            "collar":"semi spread",
            "cuffs": "cuffs1",
            "back" :"back1",
            "pocket": "pocket1",
            "placket": "placket1"
        },
        {
            "id": 10,
            "name":"regular",
            "imgurl": "lib/filter-img/fabric2.jpg",
            "alt":"regular",
            "collar":"semi spread",
            "cuffs": "cuffs1",
            "back" :"back1",
            "pocket": "pocket1",
            "placket": "placket1"
        },
        {
            "id": 11,
            "name":"minimalistic",
            "imgurl": "lib/filter-img/fabric1.jpg",
            "alt":"regular",
            "collar":"semi spread",
            "cuffs": "cuffs1",
            "back" :"back1",
            "pocket": "pocket1",
            "placket": "placket1"
        },
        {
            "id": 12,
            "name":"classic",
            "imgurl": "lib/filter-img/fabric4.jpg",
            "alt":"regular",
            "collar":"semi spread",
            "cuffs": "cuffs1",
            "back" :"back1",
            "pocket": "pocket1",
            "placket": "placket1"
        }
    ],
    "collarStyles":[
      {
        "id":1,
        "imgurl":"lib/collar-style/collar1.png",
        "text":"collar1",
        "description":" this is collarstyle 1"
      },
      {
        "id":2,
        "imgurl":"lib/collar-style/collar2.png",
        "text":"collar2",
        "description":" this is collarstyle 2"
      },
      {
        "id":3,
        "imgurl":"lib/collar-style/collar3.png",
        "text":"collar3",
        "description":" this is collarstyle 3"
      },
      {
        "id":4,
        "imgurl":"lib/collar-style/collar4.png",
        "text":"collar4",
        "description":" this is collarstyle 4"
      },
      {
        "id":5,
        "imgurl":"lib/collar-style/collar5.png",
        "text":"collar5",
        "description":" this is collarstyle 5"
      }
    ],
    "cuffStyles":[
      {
        "id":1,
        "imgurl":"lib/collar-style/collar1.png",
        "text":"cuff1",
        "description":" this is cuffstyle 1"

      },
      {
        "id":2,
        "imgurl":"lib/collar-style/collar2.png",
        "text":"cuff2",
        "description":"this is cuffstyle 2"

      },
      {
        "id":3,
        "imgurl":"lib/collar-style/collar3.png",
        "text":"cuff3",
        "description":"this is cuffstyle 3"
      },
      {
        "id":4,
        "imgurl":"lib/collar-style/collar4.png",
        "text":"cuff4",
        "description":"this is cuffstyle 4"
      },
      {
        "id":5,
        "imgurl":"lib/collar-style/collar5.png",
        "text":"cuff5",
        "description":"this is cuffstyle 5"
      }
    ],
    "backStyles":[

    ],
    "spearPointStyles":[

    ],
    "pocketStyles":[

    ]

  }
  console.log("style types: ",$scope.preSetStyles.styleTypes);
  $scope.selectedOptions = {
    "collar":"",
    "cuffs": "",
    "back" :"",
    "pocket": "",
    "placket": ""
  }
  $scope.attributeStyle=[];
  $scope.attributeStyle=$scope.preSetStyles.collarStyles;
  console.log("attributestyle: "+$scope.attributeStyle);

  // start of slider functionality

  $scope.mainObj=  $scope.preSetStyles.styleTypes;
  var tempObj=[];
  var slideStart=2;
  var slideEnd=12;
  $scope.hideNext=false;
  $scope.hidePrev=false;
  $scope.slideNext=function(){
    tempObj=$scope.preSetStyles.styleTypes;
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
    tempObj=$scope.preSetStyles.styleTypes;
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
