const mongoose = require('mongoose');
const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');

const cartGet = async (req, res, next) => {
    try {
        const existingCart = await Cart
            .findOne({ owner: req.user._id })
            .populate('owner')
            .populate('products.productId');
            
            // .populate({ 
            //     path: 'products',
            //     populate: {
            //       path: 'productId',
            //       model: 'Products'
            //     } 
            //  });

        if (existingCart) {
            existingCart.owner.password = null;
        }
    
        return res.json(existingCart);
    } catch (error) {
        next(error);
    }
};

const addToCartPost = async (req, res, next) => {
    const userId = req.user._id;
    const productId = req.params.id;
    const product = await Product.findById(productId);

    /**
     * Si no hay carrito, lo creo.
     * 
     * Si existe el carrito, lo recupero.
     * 
     * Si el producto no existe en el carrito, lo añado.
     * Si el producto si existe en el carrito, le sumo 1 a quantity de ese producto y actualizo los totales.
     */

    // cart.products = [
    //     {
    //         productId: 'adsasd231SAdsdDSA',
    //         quantity: 1,
    //     },
    //     {
    //         productId: '12123asdASDasdASdasd',
    //         quantity: 3
    //     }
    // ]

    const existingCart = await Cart.findOne({ owner: userId }).populate('owner');

    if(!existingCart) {
        /**
         * Creo el carrito porque no existe.
         */
        const newCart = new Cart({
            owner: userId,
            products: [{
                productId,
                quantity: 1,
            }],
            totalPrice: product.price,
            totalQuantity: 1,
        });

        await newCart.save();

        console.log(newCart);
    } else {
        /**
         * Ya existe el carrito, Si no tengo el producto, lo añado.
         * 
         * Si el producto existe, busco quantity y le sumo 1.
         */

        const hasProduct = existingCart.products.some((prod => prod.productId.equals(productId)));

        if(!hasProduct) {
            /**
             * Si no tengo el producto, lo añado.
             */
            const editedCart = await Cart.findByIdAndUpdate(
                existingCart._id,
                {
                    $addToSet: { 
                        products: {
                            productId: mongoose.Types.ObjectId(productId),
                            quantity: 1,
                        }
                    },
                    $inc: {
                        totalPrice: product.price,
                        totalQuantity: 1
                    }
                },
                { new: true }
            );

            return res.json(editedCart);
        } else {
            const newProducts = existingCart.products.map(product => {
                if(product.productId.equals(productId)) {
                    product.quantity = product.quantity + 1;
                };

                return product;
            });

            /**
             * Si el producto existe, busco quantity y le sumo 1.
             */

            const editedProduct = await Cart.findByIdAndUpdate(
                existingCart._id,
                {
                    $set: {
                        products: newProducts,
                    },
                    $inc: {
                        totalPrice: product.price,
                        totalQuantity: 1
                    }
                },
                { new: true }
            );

            console.log(editedProduct);
        }
    }

    return res.redirect('/cart');
};

module.exports = {
    cartGet, 
    addToCartPost,
}
