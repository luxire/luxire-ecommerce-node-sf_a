'use strict';

var express =  require('express');
var controller = require('./style_master.controller');
var router = express.Router();

router.get('/',controller.styleMastersIndex);
router.get('/:id',controller.getStyleMastersById);
router.post('/',controller.styleMastersCreate);
router.get('/new',controller.styleMastersNew);
router.get('/:id/edit',controller.styleMastersEditById);
router.patch('/:id',controller.styleMastersShowById);
router.put('/:id',controller.styleMastersUpdateById);
/*upload master image*/
router.put('/:id/images',controller.update_image);
/*----*/

router.post('/:id/style_detail_images',controller.create_style_detail_image);
router.delete('/:id/style_detail_images/:image_id',controller.delete_style_detail_image);

// router.get('/:id/style_detail_images',controller.update_image);
// router.post('/:id/style_detail_images',controller.update_image);
// router.post('/:id/style_detail_images',controller.update_image);


router.delete('/:id',controller.styleMastersDeleteById);




module.exports = router;
