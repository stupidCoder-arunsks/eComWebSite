const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');
const CartItem = require('../models/cart-Item');
const { Op } = require("sequelize");


exports.getProduct = (req, res, next) => {

    let page = !req.query.page ? 1 : parseInt(req.query.page);

    // console.log('page >>>> ' , page);

    let totalItems;
    let start = (page * 2) - 1;
    let end = page * 2;

    // console.log("inside getProducts controller...");
    Product.findAll().then(products => {
        totalItems = products.length;
    }).then(() => {
        Product.findAll({
            where: {
                id: {
                    [Op.between]: [start, end],
                }
            }
        }).then(products => {
            console.log('end total items >>> ', end, totalItems);
            // console.log('products length >>> ',products.length);
            res.json({
                "products": products, "pagination": {
                    currentPage: page,
                    nextPage: page + 1,
                    previousPage: page - 1,
                    hasPreviousPage: page > 1,
                    hasNextPage: end < totalItems,
                }
            });
        }).catch(err => {
            console.log(err);
        })
    })

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

}

exports.postOrder = async (req, res, next) => {
    try {

        const cart = await req.user.getCart();
        const products = await cart.getProducts();
        const order = await req.user.createOrder();

        // order.addProducts(products);

        order.addProducts(products.map(product => {
            // console.log('product OrderItem >>> ' , product.orderItem);
            // console.log('product >>> ' , product);

            product.orderItem = {
                quantity: product.cartItem.quantity
            }
            return product;
        }))

        await cart.setProducts(null);
        res.status(200).json({ orderId: order.id, message: "Success!" })
    } catch (err) {
        res.status(500).json({ err: err });
    }

}