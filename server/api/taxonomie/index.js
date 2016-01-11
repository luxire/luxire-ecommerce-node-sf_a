'use strict';

var express =  require('express');
var controller = require('./taxonomie.controller');
var router = express.Router();

router.get('/',controller.taxonomies_index);
//router.get('/:id/',controller.taxonomie_search);
router.get('/:id',controller.taxonomie_show);
router.post('/', controller.taxonomie_create);
router.put('/:id', controller.taxonomie_update);
router.delete('/:id', controller.taxonomie_delete);
router.get('/:id/taxons',controller.taxon_index);
router.get('/:id/taxons/:tid',controller.taxonby_taxonid);
router.post('/:id/taxons', controller.taxon_create);
router.put('/:id/taxons/:tid', controller.taxon_update);
router.delete('/:id/taxons/:tid', controller.taxon_delete);



module.exports = router;
