'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./product.controller');

/*Products*/
router.get('/', controller.index);
router.get('/getAddtionalService', controller.getAdditionalProduct);
router.get('/taxonomies', controller.taxonomy_index);
router.get('/properties', controller.properties_index);
router.post('/search', controller.search); //search from redis
router.get('/searchByName', controller.search); //search from redis
// router.get('/collections', controller.collections);
router.post('/collections', controller.collections);

router.get('/:id', controller.show);
router.get('/:id/variants', controller.productVariants);
router.get('/taxonomies/:taxonomy_id', controller.taxonomy_show);
router.get('/taxonomies/:taxonomy_id/taxons/:taxon_id', controller.taxon_show);

router.post('/custom_image_upload', controller.custom_image_upload);
router.post('/recommended', controller.recommended);
router.post('/filters', controller.apply_filters);


module.exports = router;
