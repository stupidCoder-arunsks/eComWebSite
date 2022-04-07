const response = {
    "products": [
        {
            "id": 3,
            "title": "Album3",
            "price": 9.99,
            "imageUrl": "https://prasadyash2411.github.io/ecom-website/img/Album%203.png",
            "createdAt": "2022-04-03T18:18:55.000Z",
            "updatedAt": "2022-04-03T18:18:55.000Z",
            "userId": 1
        },
        {
            "id": 4,
            "title": "Album4",
            "price": 12.99,
            "imageUrl": "https://prasadyash2411.github.io/ecom-website/img/Album%204.png",
            "createdAt": "2022-04-03T18:19:16.000Z",
            "updatedAt": "2022-04-03T18:19:16.000Z",
            "userId": 1
        }
    ],
    "pagination": {
        "currentPage": 2,
        "nextPage": 3,
        "previousPage": 1,
        "hasPreviosPage": true,
        "hasNextPage": true
    }
};

console.log(response.products);

response.products.forEach(product => {
    console.log('Product >> ', product.title);
})