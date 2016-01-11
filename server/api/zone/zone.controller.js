'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');

// Get list of all Zones
exports.index = function(req, res) {
  //req.params.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
  http
    .get(env.spree.host+env.spree.zones, function(error, response, body){
      if(error==null){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Rails server not responding");
      };
  });
};

//Get Zone details by Zones ID

exports.show = function(req, res){
    var params_id=req.params.id;
  http
    .get(env.spree.host+env.spree.zones+'/'+params_id, function(error, response, body){
      if(error==null){
            console.log(" \n\nget: /api/zones/1   response are as follows: \n\n");
            res.status(response.statusCode).send(body);
            console.log(body);
      }
      else{
        res.status(500).send("Rails server not responding");
      };

  });
};

//Add a new zone in the API
exports.create = function(req, res){
      //   var zone_name=" North America";
      //   var zoneable_id=2;
      //   var zone_obj={
      //   "zone": {
      //     "name": zone_name,
      //     "zone_members": [
      //       {
      //         "zoneable_type": "Spree::Country",
      //         "zoneable_id": zoneable_id
      //       }
      //     ]
      //   }
      // }
      var zone_obj = req.body;
      http.post({
        uri: env.spree.host+env.spree.zones+'?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
        headers:{'content-type': 'application/json'},
        body:JSON.stringify(zone_obj)
      },function(error,response,body){
        console.log(body);
        if(error == null){
          res.status(response.statusCode).send(body);
        }
        else{
          res.status(500).send("Internal Server Error");
        }
    });
  };

// Update Zone of a particular zone by Zone ID

exports.update = function (req, res){
  var updated_zoneobj = req.body;
  // var zone_id=7;
  // var zone_name="west America";
  // var zoneable_id=10;
  // var updated_zoneobj={
  //     "id": zone_id,
  //     "zone": {
  //       "name": zone_name,
  //       "zone_members": [
  //         {
  //           "zoneable_type": "Spree::Country",
  //           "zoneable_id": zoneable_id
  //         }
  //       ]
  //     }
  //   }
  console.log(req.params);
    http
      .put({
        uri: env.spree.host+env.spree.zones+'/'+zone_id+'?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
        headers:{'content-type': 'application/json'},
        body:JSON.stringify(updated_zoneobj)
      }, function(error, response, body){
          if(error == null){
            console.log("Error: param is missing or the value is empty: zone or the zone name has already taken..");
            res.status(response.statusCode).send(body);
          }else{
            res.status(500).send("Rails Server Not Responding");
          }
      });
};

// Destroy a particular Zone by ID
exports.destroy = function(req, res){
  //req.params.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
  var del_token='99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
  var del_zone_id=req.params.id;
  //var params = querystring.stringify(req.params);
  http
    .del(env.spree.host+env.spree.zones+'/'+del_zone_id+'?token='+del_token, function(error, response, body){
      if(error==null){
        console.log("sucessfully deleted zone..");
        console.log("\n\ndelete : /api/zones   response: \n\n"+body);
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Rails server not responding");
      };
  });


};
