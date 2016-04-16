'use strict';

var express = require('express');
var controller = require('./luxireProperties.controller');

var router = express.Router();

router.get('/', controller.properties_Index);
router.get('/:id', controller.properties_byId);
router.post('/', controller.properties_create);
router.put('/:id', controller.properties_update);
router.delete('/:id', controller.properties_delete);



module.exports = router;
