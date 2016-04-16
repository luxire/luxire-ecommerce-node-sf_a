'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');


exports.taxonomies_index = function(req, res) {
  var token_id="99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058";

  http
    .get(env.spree.host+env.spree.taxonomie+"?token="+token_id, function(error, response, body){
      if(error==null){
            console.log("\n\nget : /api/taxonomie   response are as follows: \n\n");
            res.status(response.statusCode).send(body);
            console.log(body);
      }
      else{
        console.log("/api/taxonomie  error :"+error);
        res.status(500).send("Rails server not responding");
      };
  });

};


// search taxonomie by taxonomie name

exports.taxonomie_search = function(req, res) {
  //req.params.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
  //var params = querystring.stringify(req.params);
  var token_id ='99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
  var taxonomie_name="Categories";
  var taxonomie_obj={
      "taxonomies":{
          "name" : "Brand"
      }
  }
  http
    .get({
      uri: env.spree.host+env.spree.taxonomie,
      headers:{'content-type': 'application/json'},
      body:JSON.stringify(taxonomie_obj)
    },function(error, response, body){
      //console.log('response from',env.spree.host+env.spree.shipments);
      //console.log(response);
      if(error==null){
             console.log("\n\nget : /api/taxonomie/taxonomie_obj response: \n\n");
             console.log(body);
             res.status(response.statusCode).send(body);
       }
       else{
         console.log("/api/taxonomies/taxonomie_obj  error :"+error);
         res.status(500).send("Rails server not responding");
       };
  });
};

// Get taxonomies by taxonomie ID

exports.taxonomie_show = function(req, res) {
  console.log(env.spree.host+env.spree.taxonomie+'/'+req.params.id);
  var token_id="99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058";
  var taxonomie_id=9;
  http
    .get(env.spree.host+env.spree.taxonomie+"/"+req.params.id, function(error, response, body){
      if(error==null){
            console.log("\n\nget : /api/taxonomie/id   response are as follows: \n\n");
            res.status(response.statusCode).send(body);
            console.log(body);
      }
      else{
        console.log("/api/taxonomie/id  error :"+error);
        res.status(500).send("Rails server not responding");
      };
  });
};


//create a taxonomies by name

exports.taxonomie_create = function(req, res){
      var token_id="99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058";
      console.log("taxonomie create body:  \n"+req.body)

      http.post({
        uri: env.spree.host+env.spree.taxonomie+'?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
        headers:{'content-type': 'application/json'},
        body:JSON.stringify(req.body)
      },function(error,response,body){

        console.log(error);
         if(error == null){
             console.log("\n\npost : /api/taxonomies/taxonomy_name  response: \n\n"+body);
             res.status(response.statusCode).send(body);
         }
         else{
           res.status(500).send("Internal Server Error");
         }
    });
  };


// Update taxonomie by taxonomie Id

exports.taxonomie_update = function (req, res){
      var token_id="99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058";
      console.log("/server/api taxonomie update is calling with obj :\n"+req.body);
      console.log("/server/api taxonomie update is calling with id :\n"+req.params.id);

      var taxonomie_id=9;
      var taxonomie_name="";
      var updated_taxonomy_obj={
          "taxonomy":{
              "name": "express"
          }
        }
      console.log(req.params);
        http
          .put({
            uri: env.spree.host+env.spree.taxonomie+'/'+req.params.id+'?token='+token_id,
            headers:{'content-type': 'application/json'},
            body:JSON.stringify(req.body)
          }, function(error, response, body){
              if(error == null){
                  console.log(" \n\nput :  /api/taxonomies/taxonomie_id  response:  \n\n"+body);
                  res.status(response.statusCode).send(body);
              }else{
                res.status(500).send("Rails Server Not Responding");
              }
          });
  };


// Delete a taxonomie by taxonomie ID

exports.taxonomie_delete = function(req, res){
    //req.params.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
    var del_token='99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
    var del_taxonomie_id=4;
    //var params = querystring.stringify(req.params);
    http
      .del(env.spree.host+env.spree.taxonomie+'/'+req.params.id+'?token='+del_token, function(error, response, body){
        if(error==null){
          console.log("\n\nsucessfully deleted taxonomie..");
          console.log("\ndelete : /api/taxonomie   response: \n\n"+body);
          res.status(response.statusCode).send(body);
        }
        else{
          res.status(500).send("Rails server not responding");
        };
    });


  };


// Get list of all taxons
exports.taxon_index = function(req, res) {
    //req.params.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
    //var params = querystring.stringify(req.params);
    var token_id="99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058";
    var taxonomie_id=1;
    http
      .get(env.spree.host+env.spree.taxonomie+'/'+req.params.id+'/taxons', function(error, response, body){
        if(error==null){
              console.log("\n\nget : /api/taxonomies/taxons   response are as follows: \n\n");
              res.status(response.statusCode).send(body);
              console.log(body);
        }
        else{
          console.log("/api/taxonomie/taxons  error :"+error);
          res.status(500).send("Rails server not responding");
        };
    });
  };



// Get taxonomie taxons by taxon id

exports.taxonby_taxonid = function(req, res) {

      console.log("taxon by id:  \n\n"+req.params.id+"  "+req.params.tid);
      http
        .get(env.spree.host+env.spree.taxonomie+'/'+req.params.id+'/taxons/'+req.params.tid, function(error, response, body){
          if(error==null){
                console.log("\n\nget : /api/taxonomies/taxons/taxonid  response: \n\n");
                res.status(response.statusCode).send(body);
                console.log(body);
          }
          else{
            console.log("/api/taxonomie/taxons/taxonid  error :"+error);
            res.status(500).send("Rails server not responding");
          };
      });
    };

//create a taxon by name

exports.taxon_create = function(req, res){
    //orders which is in payment state, take the order id from shipment details of the orders
    var token_id="99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058";

      //console.log("tid: "+req.params.id);
      console.log("id: "+req.params.id);
      console.log("request object is:\n"+req.body);
      http.post({
        uri: env.spree.host+env.spree.taxonomie+'/'+req.params.id+'/taxons'+'?token='+token_id,
        headers:{'content-type': 'application/json'},
        body:JSON.stringify(req.body)
        },function(error,response,body){
        console.log(error);
             if(error == null){
                 console.log("\n\npost : /api/taxonomies/taxonomyid/taxons response: \n\n"+body);
                 res.status(response.statusCode).send(body);
             }
             else{
               res.status(500).send("Internal Server Error");
             }
        });
  };

  // Update taxons by taxon ID

  exports.taxon_update = function (req, res){
        console.log("-----------------------------");
        var token_id="99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058";
        console.log("updated tid : "+req.params.id);
        console.log("updated taxon id : "+req.params.tid);
        console.log("updated taxon id : "+req.body);
          http
            .put({
              uri: env.spree.host+env.spree.taxonomie+'/'+req.params.id+'/taxons/'+req.params.tid+'?token='+token_id,
              headers:{'content-type': 'application/json'},
              body:JSON.stringify(req.body)
            }, function(error, response, body){
                if(error == null){
                    console.log(" \n\nput :  /api/taxonomies/taxonomie_id/taxons/taxonid  response:  \n\n"+body);
                    res.status(response.statusCode).send(body);
                }else{
                  res.status(500).send("Rails Server Not Responding");
                }
            });
            console.log("-----------------------------");

    };

  // Delete a taxon by taxon ID
    exports.taxon_delete = function(req, res){
        //req.params.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
        var del_token='99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
        var del_taxonomie_id=1;
        var del_taxon_id=18;
        //var params = querystring.stringify(req.params);
        console.log("delete taxons\n\n"+req.params.id+"   "+req.params.tid);
        http
          .del(env.spree.host+env.spree.taxonomie+'/'+req.params.id+'/taxons/'+req.params.tid+'?token='+del_token,
           function(error, response, body){
            if(error==null){
              console.log("\n\nsucessfully deleted taxon..");
              console.log("\ndelete : /api/taxonomieId/taxons/taxonId   response: \n\n"+body);
              res.status(response.statusCode).send(body);
            }
            else{
              res.status(500).send("Rails server not responding");
            };
        });


      };
