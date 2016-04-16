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
/*upload image*/
router.put('/:id/images',controller.update_image);
/*----*/

router.delete('/:id',controller.styleMastersDeleteById);




module.exports = router;
