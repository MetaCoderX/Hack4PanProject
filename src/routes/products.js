const express = require('express');
const path = require('path');
const productController = require('../controllers/products');


const router = express.Router();
// const staticPath = path.join(__dirname, '..', 'static_content');

router.post('/category/:category', productController.loadClothings);   // render pages or load more function
router.get('/category/add-to-cart/:id', productController.addToCart);  // add to cart backend logic
router.get('/category/checkout/:id', productController.checkout);       // checkout backend logic

module.exports = router;