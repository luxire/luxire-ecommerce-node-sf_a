angular.module('luxire')
.controller('AttributeController', ['$scope', '$state', '$timeout',function($scope, $state, $timeout){
  var CONST_ATTR_PATH = 'app/customer/attribute_detail/partials/attributes/';
  $scope.attr_template = {
    url: ''
  };
  $scope.attr_template.url = "app/customer/attribute_detail/partials/attribute_detail.html";


  console.log('attribute params', $state.params.type);
  $scope.id_generator = function(val){
    return val.toLowerCase().split(" ").join("-");
  };
  console.log('attr-type',$state.params.type);

  if(!$state.params.attribute_name || !$state.params.type){
    $state.go('customer.home');
  }
  else{

    console.log('state params', $state.params);
    $(document).ready(function(){
      console.log('content loaded',$("#"+$state.params.type).length);

      if($("#"+$state.params.type).length){
          $('html, body').animate({ scrollTop:$("#"+$state.params.type).offset().top-80}, 500);
      }
    });
    $scope.$on('$viewContentLoaded', function(){
      if($("#"+$state.params.type).length){
          $('html, body').animate({ scrollTop:$("#"+$state.params.type).offset().top-80}, 500);
      }
    });


    $scope.template_loaded = function(){
      console.log('content loaded',$("#"+$state.params.type).length );
      // if($("#"+$state.params.type).length){
      //   $('html, body').animate({ scrollTop:$("#"+$state.params.type).offset().top-80}, 500);
      // }
    }
  }
  $timeout(function(){
    console.log('timeout fired');
    console.log('content loaded', $("#"+$state.params.type).length);
    if($("#"+$state.params.type).length){
      $('html, body').animate({ scrollTop:$("#"+$state.params.type).offset().top-80}, 500);
    }

  }, 1000);

  $scope.product_types = {
    "shirts": {
      "collar": {
        "One Piece Hidden Button": {
          "title": "One Piece Hidden Button Collar (one piece dress collar)",
          "images": [
            {
              "ref": "One_Piece_Hidden_Button_1.png",
              "url": "Images/Shirts/Collar/One_Piece_Hidden_Button_1.png"
            },
            {
              "ref": "One_Piece_Hidden_Button_2.png",
              "url": "Images/Shirts/Collar/One_Piece_Hidden_Button_2.png"
            }
          ],
          "description": "Look- As the name says it, the collar does not have a collar brand and it is a gives a very relaxed look. It is a single piece and can be worn both with or without tie. The buttons are hidden and gives a smooth and soft look.",
          "properties": {
            "Collar Point Length": "4\"",
            "Front Collar Band Height": "1 1/2\"",
            "Rear Collar Band Height": "1 ¾\"",
            "Collar Back Height": "2 ¼\"",
            "Tie Space": "1/4\"",
            "Spread": "6 ½\""
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "Yes",
                "Fused/Unfused": "Un-fused",
                "Construction": "Soft"
              },
              "Band": {
                "Interlining": "No",
                "Fused/Unfused": "-",
                "Construction": "-"
              }
            }
          }
        },
        "English Spread": {
          "title": "English Spread Collar",
          "images": [
            {
              "ref": "English_Spread_1.png",
              "url": "Images/Shirts/Collar/English_Spread_1.png"
            },
            {
              "ref": "English_Spread_1.png",
              "url": "Images/Shirts/Collar/English_Spread_2.png"
            }
          ],
          "description": "Look – Business collar with wider spread. The collar goes well with professional and formal look. Apt for both small and large tie knots. The points slide below the jacket and lets the tie shine.",
          "properties": {
            "Collar Point Length": "3\"",
            "Front Collar Band Height": "1 1/4\"",
            "Rear Collar Band Height": "1 1/2\"",
            "Collar Back Height": "2\"",
            "Front Neck Band Shape": "Round",
            "Tie Space": "1/4\"",
            "Spread": "6 ½\""
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Medium"
              },
              "Band": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Soft"
              }
            }
          }
        },
        "Classic Polo Button Down": {
          "title": "Classic Polo Button Down Collar",
          "images": [
            {
              "ref": "Classic_Polo_Button_Down_1.png",
              "url": "Images/Shirts/Collar/Classic_Polo_Button_Down_1.png"
            },
            {
              "ref": "Classic_Polo_Button_Down_2.png",
              "url": "Images/Shirts/Collar/Classic_Polo_Button_Down_2.png"
            }
          ],
          "description": "Look – Holds an iconic statement. Commnly a sporty collar, square shaped front neck band, worn with or without tie. The button down avoids flapping of collar.",
          "properties": {
            "Collar Point Length": "3 1/4\"",
            "Front Collar Band Height": "1\"",
            "Rear Collar Band Height": "1 1/2\"",
            "Collar Back Height": "2\"",
            "Front Neck Band Shape": "Square Shaped End",
            "Tie Space": "1/4\"",
            "Spread": "3 ½\""
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "No",
                "Fused/Unfused": "-",
                "Construction": "-"
              },
              "Band": {
                "Interlining": "No",
                "Fused/Unfused": "-",
                "Construction": "-"
              }
            }
          }
        },
        "Luxire Button Down": {
          "title": "Luxire Button Down Collar",
          "images": [
            {
              "ref": "Luxire_Button_Down_1.png",
              "url": "Images/Shirts/Collar/Luxire_Button_Down_1.png"
            },
            {
              "ref": "Luxire_Button_Down_2.png",
              "url": "Images/Shirts/Collar/Luxire_Button_Down_2.png"
            }
          ],
          "description": "Look- Our most popular collar after multiple iteration, we think we have perfected the right balance of point length, spread and roll. Commonly gives a sporty look to the collar with its wide spread, can be worn with or without tie.",
          "properties": {
            "Collar Point Length": "3 1/4\"",
            "Front Collar Band Height": "1 1/4\"",
            "Rear Collar Band Height": "1 1/2\"",
            "Collar Back Height": "2\"",
            "Front Neck Band Shape": "Round",
            "Tie Space": "1/4\"",
            "Spread": "3 ½\""
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "No",
                "Fused/Unfused": "-",
                "Construction": "-"
              },
              "Band": {
                "Interlining": "No",
                "Fused/Unfused": "-",
                "Construction": "-"
              }
            }
          }
        },
        "Semi-spread": {
          "title": "Semi-spread Collar",
          "images": [
            {
              "ref": "Semi_Spread_1.png",
              "url": "Images/Shirts/Collar/Semi_Spread_1.png"
            },
            {
              "ref": "Semi_Spread_2.png",
              "url": "Images/Shirts/Collar/Semi_Spread_2.png"
            }
          ],
          "description": "Look-  A very classic and versatile collar.  Goes well with a medium knot tie as well as open collar.  The collar stands by a very polished and confident look.",
          "properties": {
            "Collar Point Length": "3\"",
            "Front Collar Band Height": "1 1/4\"",
            "Rear Collar Band Height": "1 1/2\"",
            "Collar Back Height": "2\"",
            "Front Neck Band Shape": "Round",
            "Tie Space": "1/4\"",
            "Spread": "4 ½\""
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Medium"
              },
              "Band": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Soft"
              }
            }
          }
        },
        "NOBD-2": {
          "title": "NOBD-2 Collar",
          "images": [
            {
              "ref": "Milano_Button_Down_1.png",
              "url": "Images/Shirts/Collar/Milano_Button_Down_1.png"
            },
            {
              "ref": "Milano_Button_Down_2.png",
              "url": "Images/Shirts/Collar/Milano_Button_Down_2.png"
            }
          ],
          "description": "Look- Like our Florentine collar , it is classic and enhances your formal look. Suited both with or without tie. The fuse keeps the collar stiff and restricts from flapping. Alter collar works well with wide variety of ties.",
          "properties": {
            "Collar Point Length": "3 1/4\"",
            "Front Collar Band Height": "1 1/4\"",
            "Rear Collar Band Height": "1 1/2\"",
            "Collar Back Height": "1 3/4\"",
            "Front Neck Band Shape": "Round",
            "Tie Space": "1/4\"",
            "Spread": "5 1/4\""
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Medium"
              },
              "Band": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Soft"
              }
            }
          }
        },
        "Osaka Button Down": {
          "title": "Osaka Button Down Collar",
          "images": [
            {
              "ref": "Osaka_Button_Down_1.png",
              "url": "Images/Shirts/Collar/Osaka_Button_Down_1.png"
            },
            {
              "ref": "Osaka_Button_Down_2.png",
              "url": "Images/Shirts/Collar/Osaka_Button_Down_2.png"
            }
          ],
          "description": "Look- Slant- squared neck band front shape, the point length is longer and gives a nice roll. Collar spread is slightly wider.",
          "properties": {
            "Collar Point Length": "3 1/2\"",
            "Front Collar Band Height": "1 1/4\"",
            "Rear Collar Band Height": "1 5/8\"",
            "Collar Back Height": "2\"",
            "Front Neck Band Shape": "Square",
            "Tie Space": "1/4\"",
            "Spread": "5\""
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "-",
                "Fused/Unfused": "Un-fused",
                "Construction": "Medium"
              },
              "Band": {
                "Interlining": "-",
                "Fused/Unfused": "Un-fused",
                "Construction": "Medium"
              }
            }
          }
        },
        "Spear Point": {
          "title": "Spear Point Collar",
          "images": [
            {
              "ref": "Spear_Point_1.png",
              "url": "Images/Shirts/Collar/Spear_Point_1.png"
            },
            {
              "ref": "Spear_Point_2.png",
              "url": "Images/Shirts/Collar/Spear_Point_2.png"
            }
          ],
          "description": "Look –  Elongated collar points. Suited with a small tie knot and gives a formal look. Goes well with a formal day event.",
          "properties": {
            "Collar Point Length": "4\"",
            "Front Collar Band Height": "1\"",
            "Rear Collar Band Height": "1 1/4\"",
            "Collar Back Height": "1 3/4\"",
            "Front Neck Band Shape": "Round",
            "Tie Space": "1/4\"",
            "Spread": "2 1/2\""
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "Yes",
                "Fused/Unfused": "Un-fused",
                "Construction": "Medium"
              },
              "Band": {
                "Interlining": "Yes",
                "Fused/Unfused": "Un-fused",
                "Construction": "Medium"
              }
            }
          }
        },
        "Cutaway": {
          "title": "Cutaway Collar",
          "images": [
            {
              "ref": "Cutaway_1.png",
              "url": "Images/Shirts/Collar/Cutaway_1.png"
            },
            {
              "ref": "Cutaway_2.png",
              "url": "Images/Shirts/Collar/Cutaway_2.png"
            }
          ],
          "description": "Look-  Good choice of collar when unbuttoned. The collar makes you stand out in a crowed making a style statement. The spread of the collar drives attention towards your tie.",
          "properties": {
            "Collar Point Length": "3 3/4\"",
            "Front Collar Band Height": "1 1/4\"",
            "Rear Collar Band Height": "1 1/2\"",
            "Collar Back Height": "2\"",
            "Front Neck Band Shape": "Round",
            "Tie Space": "1/4\"",
            "Spread Shoulder Back": ""
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Medium"
              },
              "Band": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Soft"
              }
            }
          }
        },
        "Extreme Spread": {
          "title": "Extreme Spread Collar",
          "images": [
            {
              "ref": "Extreme_Spread_1.png",
              "url": "Images/Shirts/Collar/Extreme_Spread_1.png"
            },
            {
              "ref": "Extreme_Spread_2.png",
              "url": "Images/Shirts/Collar/Extreme_Spread_2.png"
            }
          ],
          "description": "Look-  Good choice of collar when unbuttoned. The collar is cut to the back to its extreme which gives a statement look and makes you stand out in a crowd. A sleek and small knot tie is apt for the extreme spread",
          "properties": {
            "Collar Point Length": "3 3/4\"",
            "Front Collar Band Height": "",
            "Rear Collar Band Height": "1 1/2\"",
            "Collar Back Height": "1 7/8\"",
            "Front Neck Band Shape": "",
            "Tie Space": "",
            "Spread Shoulder Back": "6 1/4\""
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Medium"
              },
              "Band": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Medium"
              }
            }
          }
        },
        "Italian Collar": {
          "title": "Italian Collar",
          "images": [
            {
              "ref": "Italian_1.png",
              "url": "Images/Shirts/Collar/Italian_1.png"
            },
            {
              "ref": "Italian_2.png",
              "url": "Images/Shirts/Collar/Italian_2.png"
            }
          ],
          "description": "Look- One of the classics and very traditional style. Goes well with medium to small tie knots.  Smart and widely spread in Italy.",
          "properties": {
            "Collar Point Length": "3 1/2\"",
            "Front Collar Band Height": "1 1/4\"",
            "Rear Collar Band Height": "1 1/2\"",
            "Collar Back Height": "2 1/4\"",
            "Front Neck Band Shape": "Round",
            "Tie Space": "1/4\"",
            "Spread": "6 1/4\""
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Medium"
              },
              "Band": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Soft"
              }
            }
          }
        },
        "Club Collar": {
          "title": "Club Collar",
          "images": [
            {
              "ref": "Club_1.png",
              "url": "Images/Shirts/Collar/Club_1.png"
            },
            {
              "ref": "Club_2.png",
              "url": "Images/Shirts/Collar/Club_2.png"
            }
          ],
          "description": "Look- A stylish man’s collar, redefines the word classic. Also known as Golf collar or round collar. The name signifies ‘exclusive membership’. Best suited on thin and straight face.",
          "properties": {
            "Collar Point Length": "2 1/2\"",
            "Front Collar Band Height": "1 1/4\"",
            "Rear Collar Band Height": "1 1/2\"",
            "Collar Back Height": "2\"",
            "Front Neck Band Shape": "Round",
            "Tie Space": "1/4\"",
            "Spread": "2 1/2\""
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Medium"
              },
              "Band": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Soft"
              }
            }
          }
        },
        "Florentine Collar": {
          "title": "Florentine Collar( Milano Cutaway collar)",
          "images": [
            {
              "ref": "Florentine_1.png",
              "url": "Images/Shirts/Collar/Florentine_1.png"
            },
            {
              "ref": "Florentine_2.png",
              "url": "Images/Shirts/Collar/Florentine_2.png"
            }
          ],
          "description": "Look- The collar is wide spread as the name says it. It goes well with a larger tie knot. The collar gives attraction to the overall look. It has a slight roll.",
          "properties": {
            "Collar Point Length": "3 3/4\"",
            "Front Collar Band Height": "1 1/2\"",
            "Rear Collar Band Height": "1 7/8\"",
            "Collar Back Height": "2 1/4\"",
            "Front Neck Band Shape": "Round",
            "Tie Space": "1/4\"",
            "Spread": "6 1/4\""
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Medium"
              },
              "Band": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Medium"
              }
            }
          }
        },
        "Broke and Bespoke Collar": {
          "title": "Broke and Bespoke Collar",
          "images": [
            {
              "ref": "BrokeAndBespoke_1.png",
              "url": "Images/Shirts/Collar/BrokeAndBespoke_1.png"
            },
            {
              "ref": "BrokeAndBespoke_2.png",
              "url": "Images/Shirts/Collar/BrokeAndBespoke_2.png"
            }
          ],
          "description": "Look-  The collar point is more and makes it look longer from other button down collars.",
          "properties": {
            "Collar Point Length": "3 5/8\"",
            "Front Collar Band Height": "1 1/4\"",
            "Rear Collar Band Height": "1 1/2\"",
            "Collar Back Height": "2 1/4\"",
            "Front Neck Band Shape": "Round",
            "Tie Space": "1/4\"",
            "Spread": "3 1/2\""
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "No",
                "Fused/Unfused": "-",
                "Construction": "-"
              },
              "Band": {
                "Interlining": "No",
                "Fused/Unfused": "-",
                "Construction": "-"
              }
            }
          }
        },
        "NOBD-1 Collar": {
          "title": "NOBD-1 Collar",
          "images": [
            {
              "ref": "NOBD_1_1.png",
              "url": "Images/Shirts/Collar/NOBD_1_1.png"
            },
            {
              "ref": "NOBD_1_2.png",
              "url": "Images/Shirts/Collar/NOBD_1_2.png"
            }
          ],
          "description": "Look- A formal collar, has a soft curve when worn with a tie. Consists of wide spread and suited with medium tie knots.",
          "properties": {
            "Collar Point Length": "3 1/4\"",
            "Front Collar Band Height": "1 3/8\"",
            "Rear Collar Band Height": "1 1/2\"",
            "Collar Back Height": "1 7/8\"",
            "Tie Space": "1/4\"",
            "Spread": "6\"",
            "Lining": "No",
            "Fusing": "Yes"
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Medium"
              },
              "Band": {
                "Interlining": "Yes",
                "Fused/Unfused": "Fused",
                "Construction": "Soft"
              }
            }
          }
        },
        "Trad Button Down": {
          "title": "Trad Button Down Collar(Mercer Button Down Collar)",
          "images": [
            {
              "ref": "Trad_Button_Down_1.png",
              "url": "Images/Shirts/Collar/Trad_Button_Down_1.png"
            },
            {
              "ref": "Trad_Button_Down_2.png",
              "url": "Images/Shirts/Collar/Trad_Button_Down_2.png"
            }
          ],
          "description": "Look-  A traditionally used button down collar, soft and consists of nice roll.",
          "properties": {
            "Collar Point Length": "3 3/8\"",
            "Front Collar Band Height": "1 1/4\"",
            "Rear Collar Band Height": "1 1/2\"",
            "Collar Back Height": "2 1/4\"",
            "Tie Space": "1/4\"",
            "Spread": "3 1/2\""
          },
          "table-view": {
            "header": [
              "Interlining",
              "Fused/Unfused",
              "Construction"
            ],
            "body": {
              "Collar": {
                "Interlining": "No",
                "Fused/Unfused": "-",
                "Construction": "-"
              },
              "Band": {
                "Interlining": "No",
                "Fused/Unfused": "-",
                "Construction": "-"
              }
            }
          }
        }
      },
      "cuff": {
        "One-Button Rounded": {
          "title": "One-Button Rounded Barrel Cuff",
          "images": [
            {
              "ref": "One_Button_Rounded_Barrel_1.png",
              "url": "Images/Shirts/Cuff/One_Button_Rounded_Barrel_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- Constructed to match the collar. If collar is fused, cuff is made fused too and vice versa. Our most desired cuff with more casual and relaxed look. It is considered as classic and less formal. Generally compliments well with button down collar.",
          "properties": {
            "Cuff Height": "2 1/2\""
          }
        },
        "Two-Button Rounded": {
          "title": "Two-Button Rounded Barrel Cuff",
          "images": [
            {
              "ref": "Two_Button_Rounded_Barrel_1.png",
              "url": "Images/Shirts/Cuff/Two_Button_Rounded_Barrel_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- Constructed to match the collar. If collar is fused, cuff is made fused too and vice versa. Two buttons vertically aligned tightens the cuff well. Compliments with suits but less formal compared to 2 button mitered barrel cuff.",
          "properties": {
            "Cuff Height": "3\""
          }
        },
        "French Cuff": {
          "title": "French Cuff",
          "images": [
            {
              "ref": "French_cuff_1.png",
              "url": "Images/Shirts/Cuff/French_cuff_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- Constructed to match the collar. If collar is fused, cuff is made fused too and vice versa. French cuffs known for its fold back style that is twice longer than regular cuffs. Fastened with ease using cufflinks. It coordinates excellently with tuxedo shirts as well as formal shirts. Your  oppurtunity to wear an accessory.",
          "properties": {}
        },
        "One-Button Mitered": {
          "title": "One-Button Mitered Cuff",
          "images": [
            {
              "ref": "One_Button_Mitered_Cuff_1.png",
              "url": "Images/Shirts/Cuff/One_Button_Mitered_Cuff_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look – Constructed to match the collar. It collar is fused cuff is made fused too and vice versa. Considered to be a dressy cuff that has a modish mitered angle. This gives a very sharp professional look. The attractive cut to the button closure compliments well with formal occasions.",
          "properties": {
            "Cuff Height": "2 1/2\""
          }
        },
        "Two-Button Mitered": {
          "title": "Two-Button Mitered Cuff",
          "images": [
            {
              "ref": "Two_Button_Mitered_Cuff_1.png",
              "url": "Images/Shirts/Cuff/Two_Button_Mitered_Cuff_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- Constructed to match the collar. It collar is fused cuff is made fused too and vice versa. A very elegant cuff and appears more dressy. The sharp angle gives a very professional look. Offers  leaveway to wear with a wristwatch.",
          "properties": {
            "Cuff Height": "3\""
          }
        },
        "Single Cuff for Cufflink": {
          "title": "Single Cuff for Cufflink",
          "images": [
            {
              "ref": "Single_French_Cuff_1.png",
              "url": "Images/Shirts/Cuff/Single_French_Cuff_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- Constructed to match the collar. It collar is fused cuff is made fused too and vice versa. Single French cuff is sublte and shorter in length. Its element is simplicity and considered versetile. Your opportuninty to wear an accessory.",
          "properties": {
              "Cuff Height": ""
          }
        },
        "One-Button Square": {
          "title": "One-Button Square Cuff",
          "images": [
            {
              "ref": "One_Button_Square_Cuff_1.png",
              "url": "Images/Shirts/Cuff/One_Button_Square_Cuff_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- Constructed to match the collar. It collar is fused cuff is made fused too and vice versa. Usually used for casual shirts, very sharp and the ends are squared differing from other cuffs.",
          "properties": {
              "Cuff Height": ""
          }
        },
        "Three button": {
          "title": "Three button Cuff",
          "images": [
            {
              "ref": "Three_Button_Cuff_1.png",
              "url": "Images/Shirts/Cuff/Three_Button_Cuff_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- Constructed to match the collar. It collar is fused cuff is made fused too and vice versa. Gives a smart look to the attire. 3 button cuffs are longer than two button cuffs.  This cuff is slightly tilted.",
          "properties": {
            "Cuff Height": ""
          }
        },
        "Cocktail Cuff": {
          "title": "Cocktail Cuff",
          "images": [
            {
              "ref": "Cocktail_Cuff_1.png",
              "url": "Images/Shirts/Cuff/Cocktail_Cuff_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- Aesthetically the cuff is attractive and desired.  Apt for both formal and dressy shirts. Two button folded turn back gives a typical gallant finish. Look appears to be double cuff, practically stands single cuff.",
          "properties": {
            "Cuff Width": "2 1/2\"(with fold),5 1/2\"(without fold)"
          }
        }
      },
      "placket": {
        "Standard Placket": {
          "title": "Standard Placket",
          "images": [
            {
              "ref": "Standard_Placket_1.png",
              "url": "Images/Shirts/Placket/Standard_Placket_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look – this is the most common placket style used in dress shirts. Standard placket adds stability to the front and it is aesthetically symmetrical. Constructed with a light interlining can be made for a crisp and dressy look.",
          "properties": {
            "Width": "1 3/8\""
          }
        },
        "Hidden": {
          "title": "Hidden Placket",
          "images": [
            {
              "ref": "Hidden_Placket_1.png",
              "url": "Images/Shirts/Placket/Hidden_Placket_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- It covers the placket, hiding the buttons. This type of placket gives very professional and formal look. Apt for dressy shirts and oftenly used in tuxedo shirts.",
          "properties": {
            "Width": "1 3/8\""
          }
        },
        "Placket No": {
          "title": "No Placket/French Placket",
          "images": [
            {
              "ref": "French_Placket_1.png",
              "url": "Images/Shirts/Placket/French_Placket_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- Best suited with a fashionable classic casual shirt. Gives a very polished look as the front is smooth and clean without any stitches.  Commonly used in business and casual shirts.",
          "properties": {
            "Width": ""
          }
        },
        "Pullover Placket": {
          "title": "Pullover Placket",
          "images": [
            {
              "ref": "Pullover_Placket_1.png",
              "url": "Images/Shirts/Placket/Pullover_Placket_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- Constructed mainly on relaxed shirts and popovers. This placket gives an interesting appearance as it is different from other common plackets. Stands out and gains attention. It ends with a pointed shape and generally has 3 to 4 buttons.",
          "properties": {
            "Width": "1 3/8\""
          }
        },
        "Edge Stitch": {
          "title": "Edge Stitch Placket",
          "images": [
            {
              "ref": "Edge_Stitch_Placket_1.png",
              "url": "Images/Shirts/Placket/Edge_Stitch_Placket_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- A French placket that consists of an edge stitch. Gives  a very casual feel. Not that commonly used placket but can be a good style that works for you.",
          "properties": {
            "Width": ""
          }
        },
        "Plain Front With Side Stitch": {
          "title": "Plain Front With Side Stitch",
          "images": [
            {
              "ref": "Side_Stitch_Placket_1.png",
              "url": "Images/Shirts/Placket/Side_Stitch_Placket_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- A French placket with a side stitch on top, giving an illusion of a plain placket. Used casually and not very commonly chosen.",
          "properties": {
            "Width": ""
          }
        }
      },
      "back": {
        "Inverted Box": {
          "title": "Inverted Box pleat",
          "images": [
            {
              "ref": "Inverted_Box_Pleat_1.png",
              "url": "Images/Shirts/Pleat/Inverted_Box_Pleat_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- It is much same as box pleat just inverted. Rare demanded compared to other pleats. This pleat is also studied as scissor pleat. It is considered as formal, also stands best with smart casual shirt.",
          "properties": {

          }
        },
        "Center Box Pleats": {
          "title": "Center Box Pleats",
          "images": [
            {
              "ref": "Center_Box_Pleat_1.png",
              "url": "Images/Shirts/Pleat/Center_Box_Pleat_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look-  Regarded as classic design and stands best with formals. Used generally to give ease for hand movementss. The style enhances the slope shoulders.",
          "properties": {

          }
        },
        "Side Pleats": {
          "title": "Side Pleats",
          "images": [
            {
              "ref": "Side_Pleat_1.png",
              "url": "Images/Shirts/Pleat/Side_Pleat_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- Considered as most stylish pleat, gives a cleaner look to a shirt. This pleat is also known as knife pleat. Looks great for slightly sloping shoulders.",
          "properties": {

          }
        },
        "Shirred Pleat": {
          "title": "Shirred Pleat",
          "images": [
            {
              "ref": "Shirred_Pleat_1.png",
              "url": "Images/Shirts/Pleat/Shirred_Pleat_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- Basically placed at the center of the back. Gives elastic feeling which makes the hand movement more ease than the other pleats. This provides great fit to the body.",
          "properties": {

          }
        },
        "Plain(No) Pleats": {
          "title": "Plain(No) Pleats",
          "images": [
            {
              "ref": ".png",
              "url": "Images/Shirts/Pleat/One_Piece_Hidden_Button_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- Constructed to match the collar. If collar is fused, cuff is made fused too and vice versa. Our most desired cuff with more casual and relaxed look. It is considered as classic and less formal. Generally compliments well with button down collar.",
          "properties": {

          }
        }
      },
      "bottom": {
        "Boat Curve": {
          "title": "Boat Curve Bottom",
          "images": [
            {
              "ref": "Boat_Curve_Bottom_1.png",
              "url": "Images/Shirts/Bottom/Boat_Curve_Bottom_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- the boat curve bottom is most commonly used for formal shirts. Boat bottom are usually tucked in. The higher curve towards the side seam gives more ease to the pant pockets when the shirt is tucked.",
          "properties": {

          }
        },
        "Straight": {
          "title": "Straight Bottom",
          "images": [
            {
              "ref": "Straight_Bottom_1.png",
              "url": "Images/Shirts/Bottom/Straight_Bottom_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look – commonly used for casual shirts. Straight bottom sometimes consists of side slits. They are usually not tucked and length may be little shorter compared to formal tuck in shirt.",
          "properties": {

          }
        },
        "Curved Bottom": {
          "title": "Curved Bottom",
          "images": [
            {
              "ref": "Curved_Bottom_1.png",
              "url": "Images/Shirts/Bottom/Curved_Bottom_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- consists of a continuous and smooth curve, like a moon curve. Best suited with Smart casual look.",
          "properties": {

          }
        },
        "Deep Curved Bottom": {
          "title": "Deep Curved Bottom",
          "images": [
            {
              "ref": "Deep_Curved_Bottom_1.png",
              "url": "Images/Shirts/Bottom/Deep_Curved_Bottom_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "ook – A deeper curved shirt giving a stylish look at the bottom. A good choice for who like untucked.",
          "properties": {

          }
        },
        "Long Tail Shirt": {
          "title": "Long Tail Shirt",
          "images": [
            {
              "ref": "Long_Tail_Shirt_1.png",
              "url": "Images/Shirts/Bottom/Long_Tail_Shirt_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Look- The back of the shirt is slightly longer than the front. This allows a bit more play, preventing the shirt from untucking durning the day.",
          "properties": {

          }
        }
      },
      "left pocket": {
        "Work Shirt": {
          "title": "Work Shirt Style Pockets",
          "images": [
            {
              "ref": "Work_Shirt_Pocket_1.png",
              "url": "Images/Shirts/Pocket/Work_Shirt_Pocket_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "ook – pocket apt for work shirts with double stitches giving more detailing. Left pocket consist of a pocket with and button. Right pocket has a button closure and a pen slot.",
          "properties": {

          }
        },
        "No Pocket": {
          "title": "No Pocket",
          "images": [
            {
              "ref": "No_Pocket_1.png",
              "url": "Images/Shirts/Pocket/No_Pocket_1.png"
            },
            {
              "ref": "No_Pocket_1",
              "url": "Images/Shirts/Pocket/No_Pocket_1.png"
            }
          ],
          "description": "Look – A shirt with no chest pocket is usually a man’s choice for a clean and smooth.",
          "properties": {

          }
        },
        "Pocket(Yes)": {
          "title": "Pocket(Yes)",
          "images": [
            {
              "ref": "Pocket_Yes_1.png",
              "url": "Images/Shirts/Pocket/Pocket_Yes_1.png"
            },
            {
              "ref": "Pocket_Yes_1.png",
              "url": "Images/Shirts/Pocket/Pocket_Yes_1.png"
            }
          ],
          "description": "This pocket is both used for formal and casual shirts. Most common choice of pocket.",
          "properties": {

          }
        },
        "Flap Pocket with button": {
          "title": "Flap Pocket With Button",
          "images": [
            {
              "ref": "Flap_Pocket_With_Button_1.png",
              "url": "Images/Shirts/Pocket/Flap_Pocket_With_Button_1.png"
            },
            {
              "ref": "Flap_Pocket_With_Button_1.png",
              "url": "Images/Shirts/Pocket/Flap_Pocket_With_Button_1.png"
            }
          ],
          "description": "Look- Most commonly used pockets for work shirts. Consists of a flap with a button for closure.",
          "properties": {

          }
        },
        "Flap Pocket without button": {
          "title": "Flap Pocket Without Button",
          "images": [
            {
              "ref": "Flap_Pocket_Without_Button_1.png",
              "url": "Images/Shirts/Pocket/Flap_Pocket_Without_Button_1.png"
            },
            {
              "ref": "Flap_Pocket_Without_Button_1.png",
              "url": "Images/Shirts/Pocket/Flap_Pocket_Without_Button_1.png"
            }
          ],
          "description": "Look- A pocket that is best suited with casual shirts. A pocket with flap but has no button for closure.",
          "properties": {

          }
        }
      },
      "right pocket": {
        "Work Shirt": {
          "title": "Work Shirt Style Pockets",
          "images": [
            {
              "ref": "Work_Shirt_Pocket_1.png",
              "url": "Images/Shirts/Pocket/Work_Shirt_Pocket_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "ook – pocket apt for work shirts with double stitches giving more detailing. Left pocket consist of a pocket with and button. Right pocket has a button closure and a pen slot.",
          "properties": {

          }
        },
        "No Pocket": {
          "title": "No Pocket",
          "images": [
            {
              "ref": "No_Pocket_1.png",
              "url": "Images/Shirts/Pocket/No_Pocket_1.png"
            },
            {
              "ref": "No_Pocket_1",
              "url": "Images/Shirts/Pocket/No_Pocket_1.png"
            }
          ],
          "description": "Look – A shirt with no chest pocket is usually a man’s choice for a clean and smooth.",
          "properties": {

          }
        },
        "Pocket(Yes)": {
          "title": "Pocket(Yes)",
          "images": [
            {
              "ref": "Pocket_Yes_1.png",
              "url": "Images/Shirts/Pocket/Pocket_Yes_1.png"
            },
            {
              "ref": "Pocket_Yes_1.png",
              "url": "Images/Shirts/Pocket/Pocket_Yes_1.png"
            }
          ],
          "description": "This pocket is both used for formal and casual shirts. Most common choice of pocket.",
          "properties": {

          }
        },
        "Flap Pocket with button": {
          "title": "Flap Pocket With Button",
          "images": [
            {
              "ref": "Flap_Pocket_With_Button_1.png",
              "url": "Images/Shirts/Pocket/Flap_Pocket_With_Button_1.png"
            },
            {
              "ref": "Flap_Pocket_With_Button_1.png",
              "url": "Images/Shirts/Pocket/Flap_Pocket_With_Button_1.png"
            }
          ],
          "description": "Look- Most commonly used pockets for work shirts. Consists of a flap with a button for closure.",
          "properties": {

          }
        },
        "Flap Pocket without button": {
          "title": "Flap Pocket Without Button",
          "images": [
            {
              "ref": "Flap_Pocket_Without_Button_1.png",
              "url": "Images/Shirts/Pocket/Flap_Pocket_Without_Button_1.png"
            },
            {
              "ref": "Flap_Pocket_Without_Button_1.png",
              "url": "Images/Shirts/Pocket/Flap_Pocket_Without_Button_1.png"
            }
          ],
          "description": "Look- A pocket that is best suited with casual shirts. A pocket with flap but has no button for closure.",
          "properties": {

          }
        }
      },
      "gusset": {
        "V Shape Clip gusset": {
          "title": "V Shape Clip Gusset",
          "images": [
            {
              "ref": "V_Shape_Clip_Gusset_1.png",
              "url": "Images/Shirts/Gusset/V_Shape_Clip_Gusset_1.png"
            },
            {
              "ref": "V_Shape_Clip_Gusset_1.png",
              "url": "Images/Shirts/Gusset/V_Shape_Clip_Gusset_1.png"
            }
          ],
          "description": "Look- The gusset is mainly used to give more strength on the side seams and can add a bit more character to the untucked shirt. Attached  additionally on top. Looks like an inverted ‘V’.",
          "properties": {

          }
        },
        "A Clip gusset": {
          "title": "A Clip Gusset",
          "images": [
            {
              "ref": "A_Clip_Gusset_1.png",
              "url": "Images/Shirts/Gusset/A_Clip_Gusset_1.png"
            },
            {
              "ref": "A_Clip_Gusset_1.png",
              "url": "Images/Shirts/Gusset/A_Clip_Gusset_1.png"
            }
          ],
          "description": "Look- The gusset is mainly used to give more strength on the side seams and can add a bit more character to the untucked shirt. Pointed at the top, attached additionally. Mainly used to give more strength over the side seams.",
          "properties": {

          }
        },
        "Patch gusset": {
          "title": "Patch Gusset",
          "images": [
            {
              "ref": "Patch_Gusset_1.png",
              "url": "Images/Shirts/Gusset/Patch_Gusset_1.png"
            },
            {
              "ref": "Patch_Gusset_1.png",
              "url": "Images/Shirts/Gusset/Patch_Gusset_1.png"
            }
          ],
          "description": "Look- The gusset is mainly used to give more strength on the side seams can add a bit more character to the untucked shirt. Differs from other gussets, attached  as a patch internally. Sometimes attached with a contrast fabric for more aesthetic appeal.",
          "properties": {

          }
        }
      },
      "yoke": {
        "Split Yoke": {
          "title": "Split Yoke",
          "images": [
            {
              "ref": "Split_Yoke_1.png",
              "url": "Images/Shirts/Yoke/Split_Yoke_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {

          }
        },
        "Single Yoke": {
          "title": "Single Yoke",
          "images": [
            {
              "ref": "Single_Yoke_1.png",
              "url": "Images/Shirts/Yoke/Single_Yoke_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {

          }
        }
      }
    },
    "pants": {
      "Front Pleats": {
        "Single Pleat Forward": {
          "title": "Single Pleat Forward",
          "images": [
            {
              "ref": "Single_Forward_Pleat_1.png",
              "url": "Images/Pants/Pleats/Single_Forward_Pleat_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "Depth": "1\""
          }
        },
        "Double Pleat Forward": {
          "title": "Double Pleat Forward",
          "images": [
            {
              "ref": "Double_Forward_Pleat_1.png",
              "url": "Images/Pants/Pleats/Double_Forward_Pleat_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "1st Pleat from fly": "1\"",
            "2nd Pleat from fly": "0.75\""
          }
        },
        "Single Pleat Reverse": {
          "title": "Single Pleat Reverse",
          "images": [
            {
              "ref": "Single_Pleat_Reverse_1.png",
              "url": "Images/Pants/Pleats/Single_Pleat_Reverse_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "Depth": "1\""
          }
        },
        "Double Pleat Reverse": {
          "title": "Double Pleat Reverse",
          "images": [
            {
              "ref": "Double_Pleat_Reverse_1.png",
              "url": "Images/Pants/Pleats/Double_Pleat_Reverse_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "1st Pleat from fly": "1\"",
            "2nd Pleat from fly": "0.75\""
          }
        },
        "Inverted Pleats": {
          "title": "Inverted Pleats",
          "images": [
            {
              "ref": "Inverted_Pleats_1.png",
              "url": "Images/Pants/Pleats/Inverted_Pleats_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "Depth": "0.5\" inside from each side"
          }
        },
        "No Pleat": {
          "title": "No Pleat",
          "images": [
            {
              "ref": "No_Pleat_Plain_Front_1.png",
              "url": "Images/Pants/Pleats/No_Pleat_Plain_Front_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
          }
        }
      },
      "Front Pockets": {
        "Slant Pocket": {
          "title": "Front Slant Pocket",
          "images": [
            {
              "ref": "Front_Slant_Pockets_1.png",
              "url": "Images/Pants/Pockets/Front_Slant_Pockets_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "Opening": "6.5\"",
            "Width from side seam to pocket on top": "1.5\""
          }
        },
        "On Seam Pocket": {
          "title": "On Seam Pocket",
          "images": [
            {
              "ref": "On_Seam_Pocket_1.png",
              "url": "Images/Pants/Pockets/On_Seam_Pocket_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "Placement": "1.25\" below the waistband",
            "Opening": "6.5\""
          }
        },
        "Jetted Pocket": {
          "title": "Jetted Pocket",
          "images": [
            {
              "ref": "Jetted_Pocket_1.png",
              "url": "Images/Pants/Pockets/Jetted_Pocket_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "Opening": "6.25\"",
            "Distance from side seam to pocket": "1.25\"(side)",
            "Distance from waistband seam to pocket": "1.25\"(top)"
          }
        },
        "Frog Pockets": {
          "title": "Frog Pockets",
          "images": [
            {
              "ref": "Frog_Style_Pocket_1.png",
              "url": "Images/Pants/Pockets/Frog_Style_Pocket_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "The depth and length depends on waist measurement",
          "properties": {

          }
        },
        "Jeans Style Pocket": {
          "title": "Jeans Style Pocket",
          "images": [
            {
              "ref": "Jean_Style_Pocket_1.png",
              "url": "Images/Pants/Pockets/Jean_Style_Pocket_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "The depth and length depends on waist measurement",
          "properties": {

          }
        },
        "Coin Pocket": {
          "title": "Coin Pocket",
          "images": [
            {
              "ref": "Coin_Pocket_1.png",
              "url": "Images/Pants/Pockets/Coin_Pocket_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {

          }
        }
      },
      "Fly Style": {
        "Zip": {
          "title": "Zip Fly",
          "images": [
            {
              "ref": "Zip_Fly_1.png",
              "url": "Images/Pants/Fly_Style/Zip_Fly_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "Width": "1.5\"",
            "Length": "Depends ton front rise"
          }
        },
        "Button": {
          "title": "Button Fly",
          "images": [
            {
              "ref": "Button_Fly_1.png",
              "url": "Images/Pants/Fly_Style/Button_Fly_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "Width": "1.75\"",
            "Length": "Depends ton front rise",
            "Total Buttons": "Depends on fly dimension"
          }
        }
      },
      "Front Closure": {
        "Standard Extended": {
          "title": "Standard Extended Closure",
          "images": [
            {
              "ref": "Standard_Extended_Closure_1.png",
              "url": "Images/Pants/Front_Closure/Standard_Extended_Closure_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "Length": "2.75\""
          }
        },
        "Extra Long Extended": {
          "title": "Extra Long Extended Closure",
          "images": [
            {
              "ref": "Extra_Long_Extended_Closure_1.png",
              "url": "Images/Pants/Front_Closure/Extra_Long_Extended_Closure_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "Length": "8\""
          }
        },
        "Jeans Style": {
          "title": "Jeans Style Closure",
          "images": [
            {
              "ref": "Jeans_Style_Closure_1.png",
              "url": "Images/Pants/Front_Closure/Jeans_Style_Closure_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "The fly ends with 1 button closure and in square shape",
          "properties": {
          }
        },
        "Hook and Bar": {
          "title": "Hook and Bar",
          "images": [
            {
              "ref": "Hook_And_Bar_Closure_1.png",
              "url": "Images/Pants/Front_Closure/Hook_And_Bar_Closure_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "The fly ends with 1 button closure and in square shape",
          "properties": {
          }
        }
      },
      "Waist Band": {
        "Side Metal Adjusters bw seam": {
          "title": "Side Metal Adjusters between waist seam",
          "images": [
            {
              "ref": "Side_Metal_Adjusters_Between_Wast_Seam_1.png",
              "url": "Images/Pants/Waist_Band/Side_Metal_Adjusters_Between_Wast_Seam_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
          }
        },
        "Side Metal Adjusters on waistband": {
          "title": "Side Metal Adjusters on waistband",
          "images": [
            {
              "ref": "Side_Metal_Adjusters_On_Wast_Seam_1.png",
              "url": "Images/Pants/Waist_Band/Side_Metal_Adjusters_On_Wast_Seam_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
          }
        },
        "Elastic Adjusting Waistband": {
          "title": "Elastic Adjusting Waistband",
          "images": [
            {
              "ref": "Elastic_Adjusting_WastBand_1.png",
              "url": "Images/Pants/Waist_Band/Elastic_Adjusting_WastBand_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
          }
        },
        "Standard Belt Loop": {
          "title": "Standard Belt Loop",
          "images": [
            {
              "ref": "Standard_Belt_Loop_1.png",
              "url": "Images/Pants/Waist_Band/Standard_Belt_Loop_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Total 7 loops",
          "properties": {
          }
        },
        "Hollywood Style": {
          "title": "Hollywood Style Waist Band",
          "images": [
            {
              "ref": "Hollywood_Style_Waist_Band_1.png",
              "url": "Images/Pants/Waist_Band/Hollywood_Style_Waist_Band_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "Total 7 loops",
          "properties": {
          }
        }
      },
      "Rear Pockets": {
        "Patch Pockets": {
          "title": "Pocket Pockets",
          "images": [
            {
              "ref": "Patch_Rear_Pockets_1.png",
              "url": "Images/Pants/Rear_Pockets/Patch_Rear_Pockets_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
          }
        },
        "Jeans Style Pockets": {
          "title": "Jeans Style Pockets",
          "images": [
            {
              "ref": "Jeans_Style_Rear_Pockets_1.png",
              "url": "Images/Pants/Rear_Pockets/Jeans_Style_Rear_Pockets_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
          }
        },
        "2 Rear Pockets": {
          "title": "2 Rear Pockets",
          "images": [
            {
              "ref": "Both_Sides_Rear_Pockets_1.png",
              "url": "Images/Pants/Rear_Pockets/Both_Sides_Rear_Pockets_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "Depth": "6\"",
            "Width": "Depends on rear pant size"
          }
        },
        "Right Rear Pocket": {
          "title": "Right Rear Pocket",
          "images": [
            {
              "ref": "Right_Side_Pocket_1.png",
              "url": "Images/Pants/Rear_Pockets/Right_Side_Pocket_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "Depth": "6\"",
            "Width": "Depends on rear pant size"
          }
        },
        "No Rear Pocket": {
          "title": "No Rear Pocket",
          "images": [
            {
              "ref": "Back_No_Pocket_1.png",
              "url": "Images/Pants/Rear_Pockets/Back_No_Pocket_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
          }
        }
      },
      "Bottom Cuffs": {
        "No Cuff": {
          "title": "No Cuff",
          "images": [
            {
              "ref": "No_Cuffs_1.png",
              "url": "Images/Pants/Bottom_Cuffs/No_Cuffs_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "Cuff Width": "Custom"
          }
        },
        "Cuff with button": {
          "title": "Cuffs With Buttons",
          "images": [
            {
              "ref": "Cuffs_With_Buttons_1.png",
              "url": "Images/Pants/Bottom_Cuffs/Cuffs_With_Buttons_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "Cuff Width": "Custom"
          }
        },
        "Cuff Without Button": {
          "title": "Cuff Without Button",
          "images": [
            {
              "ref": "Cuffs_Without_Buttons_1.png",
              "url": "Images/Pants/Bottom_Cuffs/Cuffs_Without_Buttons_1.png"
            },
            {
              "ref": "",
              "url": ""
            }
          ],
          "description": "",
          "properties": {
            "Cuff Width": "Custom"
          }
        }
      }
    }
  }

}]);
