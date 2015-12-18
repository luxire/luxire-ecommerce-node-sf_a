'use strict';

var express = require('express');
var controller = require('./promotion.controller');
var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.delete('/:id', controller.destroy);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.post('/:id/rules', controller.add_rule);
router.delete('/:id/rules/:rule_id', controller.delete_rule);
router.post('/:id/actions', controller.add_action);
router.delete('/:id/actions/:action_id', controller.delete_action);

// router.get('/:id', controller.show);




module.exports = router;
