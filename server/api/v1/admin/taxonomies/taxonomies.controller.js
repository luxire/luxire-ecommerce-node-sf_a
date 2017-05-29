'use strict';
const http = require('request');
const path = require('path');
const constants = require(path.resolve('server/api/v1/version_constants'));
const formidable = require('formidable');
const fs = require('fs');

exports.createTaxonsManually = function (req, res) {
    let form = new formidable.IncomingForm();
    let formDataToPost = {};
    form.parse(req, function (err, fields, files) {
        if (files.icon) {
            formDataToPost.icon = {
                value: fs.createReadStream(files.icon.path),
                options: {
                    filename: files.icon.name,
                    contentType: files.icon.type
                }
            }
        }
        for (let key in fields) {
            formDataToPost[key] = fields[key];
        }

        http.post(
            {
                uri: `${constants.spree.host}${constants.spree.taxonomies}/${req.params.id}${constants.spree.taxons}`,
                headers: {
                    'content-type': 'application/json',
                    'X-Spree-Token': req.headers['X-Spree-Token']
                },
                formData: formDataToPost
            }, function (error, response, body) {
                if (error) {
                    res.status(500).send("Internal Error");
                } else {
                    res.status(response.statusCode).send(JSON.parse(body));
                }
            })
    });

}

exports.updateTaxons = function (req, res) {

    let form = new formidable.IncomingForm();
    let formDataToPost = {};
    let taxonObj = {};
    form.parse(req, function (err, fields, files) {
        if (files.icon) {
            formDataToPost.icon = {
                value: fs.createReadStream(files.icon.path),
                options: {
                    filename: files.icon.name,
                    contentType: files.icon.type
                }
            }
        }
        for (let key in fields) {
            formDataToPost[key] = fields[key];
        }

        http.put(
            {
                uri: `${constants.spree.host}${constants.spree.taxonomies}/${req.params.id}${constants.spree.taxons}/${req.params.taxonsId}`,
                headers: {
                    'content-type': 'application/json',
                    'X-Spree-Token': req.headers['X-Spree-Token']
                },
                formData: formDataToPost
            }, function (error, response, body) {
                if (error) {
                    res.status(500).send("Internal Error");
                } else {
                    res.status(response.statusCode).send(JSON.parse(body));
                }
            })
    });

}

exports.createDynamicCollection = function (req, res) {
    let form = new formidable.IncomingForm();
    let formDataToPost = {};
    form.parse(req, function (err, fields, files) {
        if (files.icon) {
            formDataToPost.icon = {
                value: fs.createReadStream(files.icon.path),
                options: {
                    filename: files.icon.name,
                    contentType: files.icon.type
                }
            }
        }
        for (let key in fields) {
            formDataToPost[key] = fields[key];
        }
        http.post(
            {
                uri: `${constants.spree.host}${constants.spree.dynamicCollectionCreation}`,
                headers: {
                    'content-type': 'application/json',
                    'X-Spree-Token': req.headers['X-Spree-Token']
                },
                formData: formDataToPost
            }, function (error, response, body) {
                if (error) {
                    res.status(500).send("Internal Error");
                } else {
                    res.status(response.statusCode).send(JSON.parse(body));
                }
            })
    });
}


exports.changePosition = function(req, res){
     http.put(
            {
                uri: `${constants.spree.host}${constants.spree.changePosition}`,
                headers: {
                    'content-type': 'application/json',
                    'X-Spree-Token': req.headers['X-Spree-Token']
                },
                body: JSON.stringify(req.body)
            }, function (error, response, body) {
                if (error) {
                    res.status(500).send("Internal Error");
                } else {
                    res.status(response.statusCode).send(JSON.parse(body));
                }
            });
}

exports.sortCollection = function(req,res){
    let orderBy = req.body.orderBy;
    let requestObject = {}
    let condition = null;
    let taxonId = null;
    if(checkReqData(req,res)){
        requestObject.orderBy = orderBy === 'ascending' ? 'asc' : 'desc'
        requestObject.condition = req.body.condition;
        requestObject.taxonId = req.body.taxonId;
    }else{
        return;
    }
    http.put(
            {
                 uri: `${constants.spree.host}${constants.spree.changePositionBasedOnCondition}`,
                headers: {
                    'content-type': 'application/json',
                    'X-Spree-Token': req.headers['X-Spree-Token']
                },
                body: JSON.stringify(requestObject)
            }, function (error, response, body) {
                if (error) {
                    res.status(500).send("Internal Error");
                } else {
                    res.status(response.statusCode).send(JSON.parse(body));
                }
            });
}

function checkReqData(req,res){
    let inputData = {}
    inputData.condition = req.body.condition;
    inputData.taxonId = req.body.taxonId;
    inputData.orderBy = req.body.orderBy;
    for(let key in inputData){
        if(inputData[key] === null || inputData[key] === undefined || inputData[key] === ""){
            res.status(422).send(`${key} can not be empty. Please specify ${key}`)
            res.end()
            return false;
        }
    }
    return true;
}