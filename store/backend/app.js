const product = {
    albumProducts: [
        {
          id:"album1",
          title:"Album1",
          imageUrl:"https://prasadyash2411.github.io/ecom-website/img/Album%201.png",
          price:12.99,
        },
        {
            id:"album2",
            title:"Album2",
            imageUrl:"https://prasadyash2411.github.io/ecom-website/img/Album%202.png",
            price:14.99,
          },
          {
            id:"album3",
            title:"Album3",
            imageUrl:"https://prasadyash2411.github.io/ecom-website/img/Album%203.png",
            price:9.99,
          },
          {
            id:"album4",
            title:"Album4",
            imageUrl:"https://prasadyash2411.github.io/ecom-website/img/Album%204.png",
            price:14.99,
          }
    ],
    merchProducts:[
        {
            id:"t-shirt",
            title:"T-Shirt",
            imageUrl:"https://prasadyash2411.github.io/ecom-website/img/Shirt.png",
            price:19.99,
          },
          {
            id:"coffee-cup",
            title:"Coffee-Cup",
            imageUrl:"https://prasadyash2411.github.io/ecom-website/img/Cofee.png",
            price:6.99,
          },
    ]
}

const express = require('express');

const app = express();
var cors = require('cors');
 
app.use(cors());

app.use('/product', (req, res, next) => {
    res.json(product);
})

app.listen(3000);