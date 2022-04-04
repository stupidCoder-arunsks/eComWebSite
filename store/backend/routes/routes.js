const controller = require('../controllers/controller');

const express = require('express');
const routes = express.Router();

routes.get('/getProducts', controller.getProduct);
routes.post('/addProduct', controller.addProduct);
routes.get('/getCart', controller.getCart);
routes.post('/addCart', controller.addCart);


module.exports = routes;
