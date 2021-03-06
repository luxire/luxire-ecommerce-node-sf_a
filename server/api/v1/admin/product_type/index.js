'use strict';
var express =  require('express');
var controller = require('./product_type.controller');
var router = express.Router();
router.get('/',controller.getAllProductType);
router.get('/:id',controller.getProductTypeById);
router.post('/',controller.createProductType);
router.get('/:id/edit',controller.editProductTypeById);
router.patch('/:id',controller.productTypesShowById);
router.put('/:id',controller.updateProductTypeById);
router.delete('/:id',controller.deleteProductTypeById);
/*upload image*/
router.put('/:id/images',controller.update_image);
/*----*/

module.exports = router;
