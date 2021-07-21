const express = require('express');
const { cartGet, addToCartPost } = require('../controllers/cart.controller');
const { isAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', isAuth, cartGet);

router.post('/add-to-cart/:id', addToCartPost);

module.exports = router;
