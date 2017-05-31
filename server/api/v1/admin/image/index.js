'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./image.controller');

router.post('/addImage', controller.addVariantImage);
router.post('/addImageFromUrl', controller.addVariantImageFromUrl);
router.delete('/deleteImage/:id', controller.deleteVariantImage);

module.exports = router;