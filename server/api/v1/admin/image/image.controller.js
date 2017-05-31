'use strict';
var http = require('request');
var querystring = require('querystring');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));
var fs = require('fs');
// Use formidable to parse multipart form data
var formidable = require('formidable');

exports.addVariantImage = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var formDataToPost = {
            image: {
                value: fs.createReadStream(files.image.path),
                options: {
                    filename: files.image.name,
                    contentType: files.image.type
                }
            },
            variantId: fields.variantId
        };
        let productId = fields.productId;
        http.post({
            uri: constants.spree.host + constants.spree.addVariantimage,
            headers: {
                'content-type': 'application/json',
                'X-Spree-Token': req.headers['X-Spree-Token']
            },
            formData: formDataToPost
        }, function (error, response, body) {
            if (error) {
                res.status(500).send(error.syscall);
            }
            else {
                  http
                    .post({
                      uri: constants.redis.host+constants.redis.sync,
                      headers:{
                        'content-type': 'application/json',
                        'X-Spree-Token': req.headers['X-Spree-Token']
                      },
                      body:JSON.stringify({ids: [productId]})
                    }, function(error, response, body){
                    if(error){
                      console.log('Error adding variant Image in Redis', error);
                    }
                    else{
                      console.log('success', body);
                    };
                  });
                res.status(response.statusCode).send(body);

            };
        })
    })
};


exports.addVariantImageFromUrl = function (req, res) {
    http.post({
        uri: constants.spree.host + constants.spree.addVariantImageFromUrl,
        headers: {
            'content-type': 'application/json',
            'X-Spree-Token': req.headers['X-Spree-Token']
        },
        body: JSON.stringify(req.body)
    }, function (error, response, body) {
        if (error) {
            res.status(500).send(error.syscall);
        }
        else {
              http
                .post({
                  uri: constants.redis.host+constants.redis.sync,
                  headers:{
                    'content-type': 'application/json',
                    'X-Spree-Token': req.headers['X-Spree-Token']
                  },
                  body:JSON.stringify({ids: [req.body.productId]})
                }, function(error, response, body){
                if(error){
                  console.log('Error adding variant Image from URL in Redis ', error);
                }
                else{
                  console.log('success', body);
                };
              });
            res.status(response.statusCode).send(body);

        };
    })
};


exports.deleteVariantImage = function (req, res) {
    http.delete({
        uri: constants.spree.host + constants.spree.deleteImage + '/' + req.params.id,
        headers: {
            'content-type': 'application/json',
            'X-Spree-Token': req.headers['X-Spree-Token']
        }
    }, function (error, response, body) {
        if (error) {
            res.status(500).send(error.syscall);
        }
        else {
              http
                .post({
                  uri: constants.redis.host+constants.redis.sync,
                  headers:{
                    'content-type': 'application/json',
                    'X-Spree-Token': req.headers['X-Spree-Token']
                  },
                  body:JSON.stringify({ids: [req.query.productId]})
                }, function(error, response, body){
                if(error){
                  console.log('Error deleting ProductImage from Redis ', error);
                }
                else{
                  console.log('success', body);
                };
              });
            res.status(response.statusCode).send(body);

        };
    })
}
