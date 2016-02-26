'use strict';

var express = require('express');
var controller = require('./userManager.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/login', controller.login);
router.post('/cloudhop_login', controller.cloudhop_login)
router.post('/signup', controller.signup);
router.delete('/delete/:id', controller.delete);
router.put('/:id/edit/change_password',controller.change_password);
router.post('/forgot_password', controller.forgot_password);
router.post('/reset_password_token_validation', controller.reset_password_token_validation);
router.post('/reset_password_with_token', controller.change_password_with_reset_token);


module.exports = router;
