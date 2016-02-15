'use strict';

var _ = require('lodash');
var http = require('request');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));

exports.getAllMeasurementType = function(req, res) {
  console.log('get all measurementType');
  http
    .get(constants.spree.host+constants.spree.measurement_types+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

};

exports.getMeasurementTypeById = function(req, res) {
  http
    .get(constants.spree.host+constants.spree.measurement_types+"/"+req.params.id+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };

    });

};

/*exports.createMeasurementType = function(req, res){
  console.log(req.body);
  http.post({
    uri: constants.spree.host+constants.spree.measurement_types+'?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    console.log(response);
    if(response.statusCode == 201){
      res.send({data: body,status: 201});
    }
    else{
      console.log('Could not post');
      res.status(response.statusCode).send(response.body.error);
    }
  })

}*/
exports.createMeasurementType = function(req, res){
      http.post({
        uri: constants.spree.host+constants.spree.measurement_types+'?token='+req.headers['X-Spree-Token'],
        headers:{'content-type': 'application/json'},
        body:JSON.stringify(req.body)
      },function(error,response,body){
        if(error){
          res.status(500).send(error.syscall);
        }
        else{
          res.status(response.statusCode).send(body);
        };

    });
  };

exports.patchMeasurementTypeById = function(req, res){
  console.log(req.body);
  http.patch({
    uri: constants.spree.host+constants.spree.measurement_types+"/"+req.params.id+'?token='+req.headers['X-Spree-Token'],
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    console.log(response);
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  })
}

exports.updateMeasurementTypeById = function(req, res){
  http.put({
    uri: constants.spree.host+constants.spree.measurement_types+"/"+req.params.id+'?token='+req.headers['X-Spree-Token'],
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };

  });
};

exports.deleteMeasurementType= function(req, res) {
  console.log(req.params);
  http
    .del(constants.spree.host+constants.spree.measurement_types+"/"+req.params.id+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

}
