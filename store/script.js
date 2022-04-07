const parentContainer = document.getElementById('EcommerceContainer');
const cart_items = document.querySelector('#cart .cart-items');

const merchParentNode = document.getElementById('merch-content');

window.addEventListener('DOMContentLoaded', () => {

    console.log("DOM Content Loaded....");

    axios.get('http://localhost:3000/getProducts').then(response => {
        renderPage(response);
    })

    axios.get('http://localhost:3000/getCart').then(cartItems => {

        let totalCartPrice = 0;

        if (cartItems.data.length > 0) {
            cartItems.data.forEach(cartItem => {
                document.querySelector('.cart-number').innerText = cartItems.data.length;

                const cart_item = document.createElement('div');
                cart_item.classList.add('cart-row');
                cart_item.setAttribute('id', `in-cart-${cartItem.productId}`);

                totalCartPrice = totalCartPrice + (cartItem.cartItem.quantity * cartItem.price);
                document.querySelector('#total-value').innerText = `${totalCartPrice.toFixed(2)}`;

                cart_item.innerHTML = `
    <span class='cart-item cart-column'>
    <img class='cart-img' src="${cartItem.imageUrl}" alt="">
    <span>${cartItem.title}</span>
    </span>
    <span class='cart-price cart-column'>${cartItem.price}</span>
    <span class='cart-quantity cart-column'>
    <input type="text" value="${cartItem.cartItem.quantity}">
    <button>REMOVE</button>
    </span>`

                cart_items.appendChild(cart_item);
            });
        }

    }).catch(err => {
        console.log(err);
    });
});

parentContainer.addEventListener('click', (e) => {

    if (e.target.className == 'shop-item-button') {

        console.log('Id of that product >> ', e.target.parentNode.parentNode.firstElementChild.innerText);
        productId = e.target.parentNode.parentNode.id;
        productName = e.target.parentNode.parentNode.firstElementChild.innerText;

        axios.post(`http://localhost:3000/addCart`, { "productId": productId }).then((data) => {
            if (data.status === 200) {
                const container = document.getElementById('container');
                const notification = document.createElement('div');
                notification.classList.add('notification');
                notification.innerHTML = `<h4>Your Product : <span>${productName}</span> is added to the cart</h4>`;
                container.appendChild(notification);
                setTimeout(() => {
                    notification.remove();
                }, 2500);
            } else {
                console.log("Error while adding to cart...");
            }
        });


    }

    if (e.target.className == 'cart-btn-bottom' || e.target.className == 'cart-bottom' || e.target.className == 'cart-holder') {
        document.querySelector('#cart').style = "display:block;";
    }

    if (e.target.className == 'cancel') {
        document.querySelector('#cart').style = "display:none;";
    }

    if (e.target.className == 'purchase-btn') {

        axios.get("http://localhost:3000/purchase")
            .then(response => {
                console.log('response for purchase >>> ', response);
                alert(`your orderId:${response.data.orderId} was ${response.data.message} Thanks for your purchase`);
            })
            .catch(err => console.log(err));

        if (parseInt(document.querySelector('.cart-number').innerText) === 0) {
            alert('Cart is Empty , Add some products to purchase !');
            return
        }


        cart_items.innerHTML = ""
        document.querySelector('.cart-number').innerText = 0
        document.querySelector('#total-value').innerText = `0`;
    }

    if (e.target.innerText == 'REMOVE') {
        let total_cart_price = document.querySelector('#total-value').innerText;
        total_cart_price = parseFloat(total_cart_price).toFixed(2) - parseFloat(document.querySelector(`#${e.target.parentNode.parentNode.id} .cart-price`).innerText).toFixed(2);
        document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText) - 1
        document.querySelector('#total-value').innerText = `${total_cart_price.toFixed(2)}`
        e.target.parentNode.parentNode.remove()
    }


});

function renderPage(response) {

    const musicParentNode = document.getElementById('music-content');
    musicParentNode.innerHTML = "";
    console.log('response inside renderPage >>> ', response);
    response.data.products.forEach(product => {
        const productHtml = ` <div id="${product.id}">
       <h3>${product.title}</h3>
       <div class="image-container">
           <img class="prod-images" src="${product.imageUrl}"
               alt="">
       </div>
       <div class="prod-details">
           <span>$<span>${product.price}</span></span>
           <button class="shop-item-button" type="button">ADD TO CART</button>
       </div>`;

        musicParentNode.innerHTML += productHtml;
    });

    console.log('previous page , next page >>> ', response.data.pagination.hasPreviousPage, response.data.pagination.hasNextPage)

    const pagination = document.getElementById("pagination");
    pagination.classList.add('pagination');
    let paginationChild = "";

    if (response.data.pagination.hasPreviousPage) {
        paginationChild = `<span id="pagination" class="pagination" onclick=pagination(${response.data.pagination.previousPage})> ${response.data.pagination.previousPage} </span>`
    }
    if (response.data.pagination.hasNextPage) {
        paginationChild += `<span id="pagination" class="pagination" onclick=pagination(${response.data.pagination.nextPage})> ${response.data.pagination.nextPage} </span>`
    }

    pagination.innerHTML = paginationChild;

}

function pagination(page) {
    axios.get(`http://localhost:3000/getProducts?page=${page}`)
        .then(response => {
            renderPage(response);
        })
        .catch(err => {
            console.log(err);
        })
}



