const express = require('express');
const path = require('path');
const previewController = require('../controllers/preview');

const router = express.Router();

router.post('/preview', previewController.previewItem);

module.exports = router;