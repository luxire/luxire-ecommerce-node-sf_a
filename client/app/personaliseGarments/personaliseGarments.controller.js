angular.module('luxire')
.controller('personaliseGarmentsController', function($scope, products, $location, $state, $stateParams) {
	console.log($stateParams.cartObject);
	$scope.cartObject = $stateParams.cartObject;
	$scope.cartObject["Personalize"] = {};
	$scope.cartObject.product_price_after_personalisation = $scope.cartObject.product_price;
	$scope.personalizationItems = [{type: 'Product Price',cost: $scope.cartObject.product_price}];

	/*previous length of monogram*/
	var previousLength = 0;

	/**/
	var val,cost;

	$scope.customizeJson = {
    product_name: "Diamond Textured White",
    properties:[
      {
        type: "Customize",
        desc:[
        {
          type:"Collar",
          styles:[
            {
              image_url: "lib/assets/semi-spread.png",
              name: "Semi spread"
            },
            {
              image_url: "lib/assets/button-down.png",
              name: "Button down"
            },
            {
              image_url: "lib/assets/english-spread.png",
              name: "English spread"
            },
            {
              image_url: "lib/assets/spearpoint.png",
              name: "Spearpoint"
            },
            {
              image_url: "lib/assets/franklin-semi.png",
              name: "Franklin Semi"
            },
            {
              image_url: "lib/assets/mini-club.png",
              name: "Mini club"
            },
            {
              image_url: "lib/assets/richard-cutaway.png",
              name: "Richard Cutaway"
            },
            {
              image_url: "lib/assets/soft-ivy-button-down.png",
              name: "Soft Ivy Button"
            }
          ]
        },
        {
          type:"Cuff",
          styles:[
            {
              image_url: "lib/assets/portfoion.png",
              name: "Portfoion"
            },
            {
              image_url: "lib/assets/one-button.png",
              name: "One-Button"
            },
            {
              image_url: "lib/assets/two-button.png",
              name: "Two-Button"
            },
            {
              image_url: "lib/assets/custom.png",
              name: "Custom"
            },
            {
              image_url: "lib/assets/three-button.png",
              name: "Three Button"
            },
            {
              image_url: "lib/assets/french.png",
              name: "French"
            },
            {
              image_url: "lib/assets/soft-square-button.png",
              name: "Soft Square Button"
            },
            {
              image_url: "lib/assets/plain.png",
              name: "Plain"
            }
          ]
        },
        {
          type:"Back",
          styles:[
            {
              image_url: "lib/assets/center-pleats.png",
              name: "Center Pleats"
            },
            {
              image_url: "lib/assets/side-pleats.png",
              name: "Side Pleats"
            },
            {
              image_url: "lib/assets/no-pleats.png",
              name: "No Pleats"
            },
            {
              image_url: "lib/assets/shirred.png",
              name: "Shirred"
            },
            {
              image_url: "lib/assets/back-custom.png",
              name: "Custom"
            }
          ]
        },
        {
          type:"Left Pocket",
          styles:[
            {
              image_url: "lib/assets/no-pocket.png",
              name: "No Pocket"
            },
            {
              image_url: "lib/assets/pocket.png",
              name: "Pocket"
            },
            {
              image_url: "lib/assets/pocket-with-flap.png",
              name: "Pocket with Flap"
            },
            {
              image_url: "lib/assets/custom-pocket.png",
              name: "Custom Pocket"
            }
          ]
        },
        {
          type:"Right Pocket",
          styles:[
            {
              image_url: "lib/assets/no-pocket.png",
              name: "No Pocket"
            },
            {
              image_url: "lib/assets/pocket.png",
              name: "Pocket"
            },
            {
              image_url: "lib/assets/pocket-with-flap.png",
              name: "Pocket with Flap"
            },
            {
              image_url: "lib/assets/custom-pocket.png",
              name: "Custom Pocket"
            }
          ]
        },
        {
          type:"Placket",
          styles:[
            {
              image_url: "lib/assets/standard.png",
              name: "Standard"
            },
            {
              image_url: "lib/assets/plain-front.png",
              name: "Plain Front"
            },
            {
              image_url: "lib/assets/pullover-shirt.png",
              name: "Pullover Shirt"
            },
            {
              image_url: "lib/assets/hidden.png",
              name: "Hidden"
            },
            {
              image_url: "lib/assets/plain-front-with-side-stitch.png",
              name: "Plain front with Side Stitch"
            },
            {
              image_url: "lib/assets/placket-custom.png",
              name: "Custom"
            }
          ]
        },
        {
          type: "Yoke style",
          styles:[
            {
              image_url: "lib/assets/split-yoke.png",
              name: "Split yoke"
            },
            {
              image_url: "lib/assets/one-piece-yoke.png",
              name: "One piece yoke"
            }
          ]
        },
        {
          type:"Cut",
          styles:[
            {
              image_url: "",
              name: "Round"
            },
            {
              image_url: "",
              name: "V cut"
            },
            {
              image_url: "",
              name: "Square"
            },
            {
              image_url: "",
              name: "Square with clit"
            },
            {
              image_url: "",
              name: "Gussets"
            },
            {
              image_url: "",
              name: "Custom"
            }
          ]
        },
        {
          type: "Buttons",
          styles:[
            {
              image_url: "",
              name: "Standard"
            },
            {
              image_url: "",
              name: "Black"
            },
            {
              image_url: "",
              name: "Pearl"
            },
            {
              image_url: "",
              name: "Button 1"
            },
            {
              image_url: "",
              name: "Button 2"
            },
            {
              image_url: "",
              name: "Button 3"
            }
            ]
          }
        ]
      },
      {
        type: "Personalize",
        desc: [
          {
            type: "Add a Monogram",
            cost: "$20",
            field_type: "misc",
            properties:[
              {
                name: "Initials",
                type: "Text",
                options: ""
              },
              {
                name: "Location",
                type: "Select",
                options: [
                  "Left Cuff",
                  "Right Cuff",
                  "Left Pocket",
                  "Right Pocket"
                ]
              },
              {
                name: "Color",
                type: "Select",
                options: [
                  "Black",
                  "Indigo",
                  "Dark Green",
                  "Royal Blue"
                ]
              },
              {
                name: "Font",
                type: "Select",
                options: [
                  "Sans",
                  "Calibri",
                  "Arial",
                  "Helvetica"
                ]
              }
            ]
          },
          {
            type: "Additional Options",
            cost: "",
            field_type: "misc",
            properties:[
              {
                name: "Locker loop",
                type: "Checkbox",
								cost: "",
                options: ""
              },
              {
                name: "Hand attached collar",
                type: "Checkbox",
								cost: "$30",
                options: ""
              },
              {
                name: "Crowfeet Button Stitching",
                type: "Checkbox",
								cost: "$20",
                options: ""
              },
              {
                name: "Hand finish on yoke and shoulder",
                type: "Checkbox",
								cost: "$30",
                options: ""
              },
              {
                name: "Handmade Buttonholes",
                type: "Checkbox",
								cost: "$20",
                options: ""
              },
              {
                name: "Hand-attached Gussets",
                type: "Checkbox",
								cost: "$20",
                options: ""
              },
              {
                name: "Triple stict seams",
                type: "Checkbox",
								cost: "",
                options: ""
              },
              {
                name: "Front marcella bib",
                type: "Checkbox",
								cost: "",
                options: ""
              },
              {
                name: "Formal shirt side vent",
                type: "Checkbox",
								cost: "",
                options: ""
              }
            ]
          },
          {
            type: "Contrast",
            cost: "",
            field_type: "misc",
            properties:[
              {
                name: "Collar",
                type: "Card",
								cost: "$13",
                image_url: "lib/assets/collar.jpg"
              },
              {
                name: "Cuff",
                type: "Card",
								cost: "$10",
                image_url: "lib/assets/cuff.jpg"
              },
              {
                name: "Inside Placket",
                type: "Card",
								cost: "$5",
                image_url: "lib/assets/inside-placket.jpg"
              },
              {
                name: "Gussets",
                type: "Card",
								cost: "$5",
                image_url: "lib/assets/gusset.jpg"
              }
            ]

          },
          {
            type: "Custom Instruction",
            cost: "",
            field_type: "Text",
            properties: ""
          }
        ]
      },
      {
        type: "Measurement",
        desc: [
          {
            standard: [
              {
                property: "Necksize",
                Measurements: [
                  "12",
                  "13",
                  "14",
                  "15",
                ]
              },
              {
                property: "Sleeve Length",
                Measurements: [
                  "28",
                  "29",
                  "30",
                  "31",
                ]
              },
              {
                property: "Fit Type",
                Measurements: [
                  "S",
                  "M",
                  "L",
                  "XL",
                ]
              }
            ],
            sub_properties:[
              {
                name: "Top",
                properties:[
                  {
                    name: "Shirt Size",
                    measurements: [
                      "Small",
                      "Medium",
                      "Large"
                    ]
                  },
                  {
                    name: "Chest Width",
                    measurements: [
                      "13.00",
                      "14.00",
                      "15.00"
                    ]
                  },
                  {
                    name: "Yoke Width",
                    measurements: [
                      "13.00",
                      "14.00",
                      "15.00"
                    ]
                  },
                  {
                    name: "Shirt Length",
                    measurements: [
                      "25.00",
                      "26.00",
                      "27.00"
                    ]
                  },
                  {
                    name: "Shirt Length (Right)",
                    measurements: [
                      "32.00",
                      "33.00",
                      "34.00"
                    ]
                  },
                  {
                    name: "Shirt Length (Left)",
                    measurements: [
                      "32.00",
                      "33.00",
                      "34.00"
                    ]
                  },
                  {
                    name: "Shoulder Slope",
                    measurements: [
                      "Normal",
                      "Square Shoulder",
                      "Narrow"
                    ]
                  },
                ]
              },
              {
                name: "Bottom",
                properties:[
                  {
                    name: "Bottom Width",
                    measurements: [
                      "13.00",
                      "14.00",
                      "15.00"
                    ]
                  },
                  {
                    name: "Waist Width",
                    measurements: [
                      "13.00",
                      "14.00",
                      "15.00"
                    ]
                  },
                  {
                    name: "Waist Width",
                    measurements: [
                      "6.00",
                      "7.00",
                      "8.00"
                    ]
                  }
                ]
              },
              {
                name: "Sleeve",
                properties:[
                  {
                    name: "Shirt Sleeve Width",
                    measurements: [
                      "5.50",
                      "6.00",
                      "6.50"
                    ]
                  },
                  {
                    name: "Shirt Sleeve Opening",
                    measurements: [
                      "5.50",
                      "6.00",
                      "6.50"
                    ]
                  },
                  {
                    name: "Shirt Sleeve Length",
                    measurements: [
                      "32.00",
                      "33.00",
                      "34.00"
                    ]
                  },
                  {
                    name: "Armhole",
                    measurements: [
                      "6.00",
                      "7.00",
                      "8.00"
                    ]
                  },
                  {
                    name: "Cuff Around",
                    measurements: [
                      "6.00",
                      "6.50",
                      "7.00"
                    ]
                  },
                  {
                    name: "Forearm",
                    measurements: [
                      "32.00",
                      "33.00",
                      "34.00"
                    ]
                  },
                  {
                    name: "Shoulder Armpit Fit",
                    measurements: [
                      "32.00",
                      "33.00",
                      "34.00"
                    ]
                  },
                ]
              }
            ]
          }
        ]
      }
    ]
  }
	angular.forEach($scope.customizeJson.properties[1].desc,function(value, key){
		if(value.type == "Add a Monogram"){
			$scope.cartObject["Personalize"]["Monogram"] = {};
			angular.forEach(value.properties, function(value, key){
				$scope.cartObject["Personalize"]['Monogram'][value.name] = angular.isArray(value.options) ? value.options[0] : "";
			});
			$scope.cartObject["Personalize"]['Monogram'].selected = false;
		}
		else if(value.type == "Additional Options"){
			$scope.cartObject["Personalize"]["Additional Options"] = [];
			angular.forEach(value.properties, function(value, key){
				$scope.cartObject["Personalize"]["Additional Options"].push({name: value.name,cost: value.cost,selected: false});
			});
		}
		else if(value.type == "Contrast"){
			$scope.cartObject["Personalize"]["Contrast"] = [];
			angular.forEach(value.properties, function(value, key){
				$scope.cartObject["Personalize"]["Contrast"].push({name: value.name,cost: value.cost,selected: false});
			});
		}
		else if(value.type == "Custom Instruction"){
			$scope.cartObject["Personalize"]["Custom Instruction"] = "";
		}
	});




	$scope.page.setTitle('Personalize');
	$scope.go = function(path){
		$location.path('/' + path)
	}

	$scope.monogramInitialChange = function(monogram,type,cost){
		console.log(monogram);
		console.log($scope.cartObject);
		if(angular.equals(monogram.trim(),"")){
			if(!(angular.equals($scope.cartObject.product_price,$scope.cartObject.product_price_after_personalisation))){
				$scope.cartObject.product_price_after_personalisation = (parseFloat($scope.cartObject.product_price_after_personalisation) - parseFloat(cost.split('$')[1])).toFixed(2);
				$scope.cartObject['Personalize']['Monogram'].selected = false;
			}
		}
		else{
			if(angular.equals(monogram.trim().length,1) && previousLength < 2){
				$scope.cartObject.product_price_after_personalisation = (parseFloat($scope.cartObject.product_price_after_personalisation) + parseFloat(cost.split('$')[1])).toFixed(2);
				$scope.cartObject['Personalize']['Monogram'].selected = true;
				// console.log($scope.product_price_after_personalisation);
			};
		};
		previousLength = monogram.trim().length;
	};

	$scope.selectAdditionalOption = function(val, cost){
		if(cost.indexOf('$') !== -1){
			if(angular.equals(val,true)){
				$scope.cartObject.product_price_after_personalisation = (parseFloat($scope.cartObject.product_price_after_personalisation) + parseFloat(cost.split('$')[1])).toFixed(2);
			}
			else{
				$scope.cartObject.product_price_after_personalisation = (parseFloat($scope.cartObject.product_price_after_personalisation) - parseFloat(cost.split('$')[1])).toFixed(2);
			}
		}
	};

	$scope.activate= function(cusIndex, parentIndex, index){
		$scope.cartObject["Personalize"]["Contrast"][index].selected = !$scope.cartObject["Personalize"]["Contrast"][index].selected;
		val = $scope.cartObject["Personalize"]["Contrast"][index].selected;
		cost = $scope.cartObject["Personalize"]["Contrast"][index].cost;
		if(angular.equals(val,true)){
			$scope.cartObject.product_price_after_personalisation = (parseFloat($scope.cartObject.product_price_after_personalisation) + parseFloat(cost.split('$')[1])).toFixed(2);
		}
		else{
			$scope.cartObject.product_price_after_personalisation = (parseFloat($scope.cartObject.product_price_after_personalisation) - parseFloat(cost.split('$')[1])).toFixed(2);
		}
	 };

	 $scope.gotoMeasurement = function(){
		 console.log($scope.cartObject);
	   $state.go('measurement',{cartObject: $scope.cartObject});
	 };

	 var defer = $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		 event.preventDefault();
		 defer();
		//  $state.transitionTo(toState.name);
		 $state.go(toState.name,{cartObject: $scope.cartObject});
		// 	 console.log(event);
		// 	 console.log(toState.name);
		// 	 console.log(toParams);
		// 	 console.log(fromState.name);
		// 	 console.log(fromParams);
	 })



})
