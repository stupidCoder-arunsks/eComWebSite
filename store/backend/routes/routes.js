const controller = require('../controllers/controller');

const express = require('express');
const routes = express.Router();

routes.get('/getProducts', controller.getProduct);
routes.post('/addProduct', controller.addProduct);
routes.get('/getCart', controller.getCart);
routes.post('/addCart', controller.addCart);
routes.get('/purchase',controller.postOrder);
routes.get('/orders' , controller.getOrders);


module.exports = routes;
