'use strict';

var  express = require('express');
var controller = require('./taxonomies.controller');
var router = express.Router();


router.post('/:id/taxons', controller.createTaxonsManually);
router.put('/:id/taxons/:taxonsId', controller.updateTaxons);
router.post('/createRuleBasedCollection', controller.createDynamicCollection);
router.put('/changePosition', controller.changePosition);
router.put('/sort', controller.sortCollection);

module.exports = router;
