angular.module('luxire')
.controller('MyAccountController', function($scope, CustomerOrders, $state){
  $scope.loading = true;
  $scope.my_orders = [];
  CustomerOrders.my_orders()
  .then(function(data){
    $scope.loading = false;
    $scope.my_orders = data.data.orders;
  }, function(error){
    $scope.loading = false;
    console.error(error);
  });

  $scope.get_display_date = function(date){
    var d = new Date(date.toString());
    return d.getDate()+'-'+ ( parseInt(d.getMonth()) + 1) +'-'+d.getFullYear();
  };

  var html_text = '';
  var personalized_text = '';
  var customized_text = '';
  var measurement_std_text = '';
  var measurement_body_text = '';

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  $scope.get_previous_orders = function(orders){
    var previous_orders = [];
    if(orders && orders.length){
      for(var i=0;i<orders.length;i++){
        if(orders[i].shipment_state=='shipped'){
          previous_orders.push(order[i])
        }
      }
    }
    return previous_orders;

  };

  function customization_template(customization_data){
    customized_text = '<div class="row" style="background: #F8F8F8; padding-left: 5%">'
    angular.forEach(customization_data, function(val, key){
      if(val.value){
        customized_text = customized_text+'<p style="font-size: 90%; margin-bottom: 0px">'+key+': '+val.value+'</p>'
      }
    });
    return customized_text+'</div>';
  };


  function personalization_template(personalization_data){
    personalized_text = '<div class="row" style="background: #F8F8F8; padding-left: 5%">'
    angular.forEach(personalization_data, function(val, key){

      if(Object.keys(val).length!==0){
        personalized_text = personalized_text +'<h5>'+key+'<h5>'
        if(key.toLowerCase()=='monogram'){
          angular.forEach(val, function(monogram_value, monogram_key ){
            personalized_text = personalized_text+'&nbsp;&nbsp;<p style="font-size: 90%; margin-bottom: 0px">'+monogram_key+':'+monogram_value+'</p>'
          })
        }
        else {
          angular.forEach(val, function(v, k ){
            if(v.hasOwnProperty('fabric')){
              personalized_text = personalized_text+'&nbsp;&nbsp;<p style="font-size: 90%; margin-bottom: 0px">'+k+':'+v.fabric+'</p>'
            }
            else{
              personalized_text = personalized_text+'&nbsp;&nbsp;<p style="font-size: 90%; margin-bottom: 0px">'+k+'</p>'
            }
          })
        }

      }

    })
    return personalized_text+'</div>';
  };
  function measurement_std_template(standard_measurements){
    measurement_std_text = '<div class="row" style="background: #F0F0F0; padding-left: 3.5%">'
                              +'<h5>Custom Measurements</h5>'
                            +'</div>'
                            +'<div class="measurement row" style="padding-left: 5%">'
    angular.forEach(standard_measurements, function(val, key){
      if(val.value){
        measurement_std_text = measurement_std_text+'<tr><td>'+key+': </td>&nbsp;<td>'+val.value+'</td></tr><br>'
      }
    });
    return measurement_std_text+'</div>';

  };

  function measurement_body_template(body_measurements){
    measurement_body_text = '<div class="row" style="background: #F0F0F0; padding-left: 3.5%">'
                              +'<h5>Body Measurements</h5>'
                            +'</div>'
                            +'<div class="row" style="padding-left: 3.5%">'
    angular.forEach(body_measurements, function(val, key){
      if(val.value){
        measurement_body_text = measurement_body_text+'<p style="font-size: 90%; margin-bottom: 0px">'+key+': '+val.value+'</p>'
      }
    });
    return measurement_body_text+'</div>';

  };


  $scope.trigger_popover = function(line_item){
    personalized_text = '';
    customized_text = '';
    measurement_std_text = '';
    measurement_body_text = '';
    html_text = '<div class="row" style="">'
                    +'<div class="row" style="margin-left: 0px; margin-right: 0px; margin: 3%">'
                      +'<div class="col col-md-4 col-sm-4 col-lg-4">'
                        +'<div class="row">'
                            +'<img style="max-width: 100%; border: solid 1px #888282" src='+$scope.getImage(line_item.variant.images[0].product_url)+'>'
                        +'</div>'
                      +'</div>'
                      +'<div class="col col-md-8 col-sm-8 col-lg-8" style="padding-right: 0px; font-family: Arial; font-weight:600;font-size: 90%; margin-top: 5%">'
                        +'<p>'+line_item.variant.name+'</p>'
                        +'<p style="font-size: 150%; margin-top: 5%">'+line_item.display_amount+'</p>'
                      +'</div>'

                    +'</div>'
                    +'<div class="row" style="margin-left: 0px; margin-right: 0px; background: #F8F8F8">'
                    +'<div class="col col-md-8 col-sm-8 col-lg-8" style="padding-right: 0px; font-family: Arial; font-weight:600;font-size: 90%;">'
                      +'<h5>Selected Options</h5>'
                    +'</div>'
                    +'</div>'
                  +'</div>';
    if(line_item.luxire_line_item && line_item.luxire_line_item.customized_data){
      html_text = html_text+customization_template(line_item.luxire_line_item.customized_data);
    }
    if(line_item.luxire_line_item && line_item.luxire_line_item.personalize_data){
      html_text = html_text+personalization_template(line_item.luxire_line_item.personalize_data);
    }
    if(line_item.luxire_line_item && line_item.luxire_line_item.measurement_data && line_item.luxire_line_item.measurement_data.standard_measurement_attributes){
      html_text = html_text+measurement_std_template(line_item.luxire_line_item.measurement_data.standard_measurement_attributes);
    }
    if(line_item.luxire_line_item && line_item.luxire_line_item.measurement_data && line_item.luxire_line_item.measurement_data.body_measurement_attributes){
      html_text = html_text+measurement_body_template(line_item.luxire_line_item.measurement_data.body_measurement_attributes);
    }
    $scope.popover_html = $sce.trustAsHtml(html_text);
  };

  $scope.get_order_details = function(event, order){
    event.preventDefault();
    $state.go('invoices',{number: order.number, token: order.token});
    // window.location.href= "http://104.215.252.45/#/invoice/"+order.number+"?token="+order.token;
  };

});
