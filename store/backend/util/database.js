const Sequelize = require('sequelize');

const sequelize = new Sequelize('cart-Item' , 'root','8148869556@MySql',
{dialect:'mysql', host:'localhost'});

module.exports = sequelize;

