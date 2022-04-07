const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');
const CartItem = require('../models/cart-Item');
const Order = require('../models/order');
const { Op } = require("sequelize");


exports.getProduct = (req, res, next) => {

    let page = !req.query.page ? 1 : parseInt(req.query.page);

    let totalItems;
    let start = (page * 2) - 1;
    let end = page * 2;

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

    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;

    req.user.getCart()
        .then(cart => {
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

        order.addProducts(products.map(product => {

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


exports.getOrders = async (req, res, next) => {
    try {
        const result = [];
        const orders = await req.user.getOrders();
        await Promise.all(orders.map(async (order) => {
            const obj = {};
            obj.orderId = order.id;
            const o = await Order.findByPk(order.id);
            const products = await o.getProducts();
            const p = [];
            products.map(product => {
                p.push(product.dataValues);
            })
            obj.productDetail = p;
            result.push(obj);
            console.log(result);

        }))
        res.status(200).json({ data: result });
    } catch (err) {
        res.status(500).json({ err: err })
    }
};

