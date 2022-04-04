// const product = {
//     albumProducts: [
//         {
//             title: "Album1",
//             imageUrl: "https://prasadyash2411.github.io/ecom-website/img/Album%201.png",
//             price: 12.99,
//         },
//         {
//             title: "Album2",
//             imageUrl: "https://prasadyash2411.github.io/ecom-website/img/Album%202.png",
//             price: 14.99,
//         },
//         {
//             title: "Album3",
//             imageUrl: "https://prasadyash2411.github.io/ecom-website/img/Album%203.png",
//             price: 9.99,
//         },
//         {
//             title: "Album4",
//             imageUrl: "https://prasadyash2411.github.io/ecom-website/img/Album%204.png",
//             price: 14.99,
//         }
//     ],
//     merchProducts: [
//         {
//             id: "t-shirt",
//             title: "T-Shirt",
//             imageUrl: "https://prasadyash2411.github.io/ecom-website/img/Shirt.png",
//             price: 19.99,
//         },
//         {
//             id: "coffee-cup",
//             title: "Coffee-Cup",
//             imageUrl: "https://prasadyash2411.github.io/ecom-website/img/Cofee.png",
//             price: 6.99,
//         },
//     ]
// }

const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const routes = require('./routes/routes');
const Cart = require('./models/cart');
const Product = require('./models/product');
const User = require('./models/user');
const CartItem = require('./models/cart-Item');

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


