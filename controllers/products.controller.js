const Product = require('../models/Product.model');

const productsGet = async (req, res, next) => {
    const products = await Product.find();
    return res.render('products', { products, isAdmin: req.isAdmin, user: req.user });
};

const createGet = (req, res, next) => {
    return res.render('create-product');
};

const createPost = async (req, res, next) => {
    try {
        console.log(req.body);
        const {name, category, description, price} = req.body;
        const image = req.fileUrl ? req.fileUrl : '';
        const newProduct = new Product({ name, category, description, price, image });
        const createdProduct = await newProduct.save();

        return res.redirect('/products');
    } catch (error) {
        return next(error);
    }
};

const editGet = async (req, res, next) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        return res.render('edit-product', { product });
    } catch (error) {
        return next(error);
    }
};

const editPut = async (req, res, next) => {
    const { id } = req.params;
    const { name, description, price, category} = req.body;
    const uploadFields = {};

    if(name) {
        uploadFields.name = name;
    }

    if (description) {
        uploadFields.description = description;
    }

    if (price) {
        uploadFields.price = Number(price);
    }

    if (category) {
        uploadFields.category = category;
    }
    
    if (req.fileUrl) {
        uploadFields.image = req.fileUrl;
    };

    try {
        console.log(req.body);
        const editedProduct = await Product.findByIdAndUpdate(id, uploadFields, { new: true });
        
        return res.status(200).json(editedProduct);
    } catch (error) {
        return next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await Product.findByIdAndDelete(id);

        if (deleted) {
            const products = await Product.find();
            return res.render('products', { products, deleted: true });
        } else {
            const error = new Error("Can't find a product with this id. ¿Are you sure?");
            error.status = 400;
            return res.render('error', { message: error.message, status: error.status });
        }

    } catch (error) {
        return next(error);
    }
};

module.exports = {
    productsGet,
    createGet,
    createPost,
    editGet,
    editPut,
    deleteProduct,
}
