const express = require('express');
const path = require('path');
const userController = require('../controllers/user');

const router = express.Router();

router.post('/login', userController.userLogin);
router.post('/signup', userController.userSignup);

module.exports = router;