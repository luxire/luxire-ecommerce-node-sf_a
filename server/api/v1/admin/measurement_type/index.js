'use strict';

var express =  require('express');
var controller = require('./measurement_type.controller');
var router = express.Router();

router.get('/',controller.getAllMeasurementType);
router.get('/:id',controller.getMeasurementTypeById);
router.post('/',controller.createMeasurementType);
router.post('/images', controller.add_image);
router.put('/:id/images', controller.update_image);
router.patch('/:id',controller.patchMeasurementTypeById);
router.put('/:id',controller.updateMeasurementTypeById);
router.delete('/:id',controller.deleteMeasurementType);

module.exports = router;
