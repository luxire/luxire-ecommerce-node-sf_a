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
                //   http
                //     .post({
                //       uri: constants.redis.host+constants.redis.sync,
                //       headers:{
                //         'content-type': 'application/json',
                //         'X-Spree-Token': req.headers['X-Spree-Token']
                //       },
                //       body:JSON.stringify({ids: [body.id]})
                //     }, function(error, response, body){
                //     if(error){
                //       console.log('error', error);
                //     }
                //     else{
                //       console.log('success', body);
                //     };
                //   });
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
            //   http
            //     .post({
            //       uri: constants.redis.host+constants.redis.sync,
            //       headers:{
            //         'content-type': 'application/json',
            //         'X-Spree-Token': req.headers['X-Spree-Token']
            //       },
            //       body:JSON.stringify({ids: [body.id]})
            //     }, function(error, response, body){
            //     if(error){
            //       console.log('error', error);
            //     }
            //     else{
            //       console.log('success', body);
            //     };
            //   });
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
            //   http
            //     .post({
            //       uri: constants.redis.host+constants.redis.sync,
            //       headers:{
            //         'content-type': 'application/json',
            //         'X-Spree-Token': req.headers['X-Spree-Token']
            //       },
            //       body:JSON.stringify({ids: [body.id]})
            //     }, function(error, response, body){
            //     if(error){
            //       console.log('error', error);
            //     }
            //     else{
            //       console.log('success', body);
            //     };
            //   });
            res.status(response.statusCode).send(body);

        };
    })
}