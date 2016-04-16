'use strict';
var express =  require('express');
var controller = require('./standard_size.controller');
var router = express.Router();
router.get('/',controller.getAllStandardSize);
router.get('/:id',controller.getStandardSizeById);
router.post('/',controller.createStandardSize);
router.put('/:id',controller.updateStandardSizeById);
router.delete('/:id',controller.deleteStandardSizeById);


module.exports = router;
