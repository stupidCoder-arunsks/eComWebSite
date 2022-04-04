const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');
const CartItem = require('../models/cart-Item');
const { Op } = require("sequelize");


exports.getProduct = (req, res, next) => {


    let albumProduct;
    let merchProduct;
    console.log("inside getProducts controller...");

    Product.findAll({
        where:
        {
            id: {
                [Op.lte]: 4,
            }

        }
    })
        .then(products => {
            albumProduct = products;
            Product.findAll({
                where:
                {
                    id: {
                        [Op.gt]: 4,
                    }

                }

            }).then(products => {
                merchProduct = products;
                res.json({ "albumProducts": albumProduct, "merchProducts": merchProduct })
            })
        })
        .catch(err => console.log(err));

    // res.json(product);
}

exports.addProduct = (req, res, next) => {

    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;

    // // console.log("inside addProduct controller...");
    req.user.createProduct({
        title: title,
        imageUrl: imageUrl,
        price: price
    })
        .then((result) => {
            res.json({ success: true });
        })
        .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {

    req.user.getCart()
        .then(cart => {
            return cart.getProducts().then(products => {
                res.json(products);
            });
        })
        .catch(err => console.log(err));

    // console.log("inside getCart controller...");

    // Cart.findAll().then((cartItems => {
    //     // console.log('cartItemFromDB >>> ',cartItems);
    //     res.json(cartItems);
    // })).catch(err => {
    //     console.log(err);
    // });
}

exports.addCart = (req, res, next) => {
    console.log("inside addCart controller...");

    // console.log('req body of addCart >> ' , req.body);

    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;

    req.user.getCart()
        .then(cart => {
            // console.log('cart >> ' , cart);
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        }).then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            newQuantity = 1;
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId);
        }).then(product => {
            return fetchedCart.addProduct(product, {
                through: { quantity: newQuantity }
            });
        }).then(() => {
            res.status(200).send({ message: "Success" });
        }).catch(err => {
            res.sendStatus(500);
        });

    //     console.log('backend add cart function >> ', req.params.productId);
    //     // console.log(productId);
    //     // Cart.create({
    //     //     productId: req.body.id,
    //     //     name: req.body.name,
    //     //     imgUrl: req.body.imgUrl,
    //     //     price: req.body.price,
    //     //     totalCartPrice: req.body.totalCartPrice
    //     // }).then(
    //     //     res.send('Product created sucessfully')
    //     // );
    //     // console.log('Incoming data from cart >> ', req.body);
}


