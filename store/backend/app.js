
const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./util/database');
const routes = require('./routes/routes');
const Cart = require('./models/cart');
const Product = require('./models/product');
const User = require('./models/user');
const CartItem = require('./models/cart-Item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
});


app.use(bodyParser.json());
app.use(cors());
app.use(routes);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Product,{through:OrderItem});
Product.belongsToMany(Order,{through:OrderItem});


sequelize.sync(
    // {force:true}
).
    then((result) => {
        return User.findByPk(1);
    }).then(user => {
        if (!user) {
            return User.create({ name: 'arunsks', email: 'loveToCode@gmail.com' });
        }
        return user;
    }).then(user => {
        user.createCart();
    }).then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });


