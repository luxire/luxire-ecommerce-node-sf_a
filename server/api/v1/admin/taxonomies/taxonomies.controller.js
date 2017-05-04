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