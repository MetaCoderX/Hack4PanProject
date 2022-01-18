const express = require('express');
const path = require('path');
const cookieController = require('../controllers/cookie');

const router = express.Router();

router.post('/cookie/:type', cookieController.validateCookies, cookieController.getCookie);
router.get('/cookie/remove', cookieController.removeCookie);

module.exports = router;