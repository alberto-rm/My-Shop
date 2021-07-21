const express = require('express');
const { upload, uploadToCloudinary } = require('../middlewares/file.middleware');
const Product = require('../models/Product.model');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const products = await Product.find();
    return res.render('products', {products});
});

router.get('/create', (req, res, next) => {
    return res.render('create-product');
})

router.post('/create', [upload.single('image'), uploadToCloudinary],async (req, res, next) => {
    try {
        console.log(req.body);
        const {name, category, description, price} = req.body;
        const image = req.fileUrl ? req.fileUrl : '';
        const newProduct = new Product({name, category, description, price, image});
        const createdProduct = await newProduct.save();

        return res.redirect('/products');
    } catch (error) {
        return next(error);
    }
});

module.exports = router;