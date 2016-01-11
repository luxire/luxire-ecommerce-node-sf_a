'use strict';

var express = require('express');
var controller = require('./tax.controller');
var router = express.Router();

router.get('/', controller.index);
router.get('/new', controller.new);
router.post('/', controller.create);
router.delete('/:id', controller.destroy);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);


// router.get('/:id', controller.show);




module.exports = router;
