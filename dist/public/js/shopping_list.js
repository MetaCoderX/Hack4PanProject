let shop_list_container = document.getElementById('shop-list-container');
let shop_list_wrapper = document.querySelector('.shop-list-wrapper');
let checkout_btn = document.querySelector('.checkout-btn');
// console.log(shop_list_container);

let confirm_checkout_container = document.querySelector('.confirm-checkout-container');

const shopping_cart_function = document.getElementsByClassName('shopping-cart-function');


function closeConfirmCheckout() {
    confirm_checkout_container.style.display = 'none';
}

function checkout() {
    // console.log(document.cookie);
    const confirm_checkout_container = document.querySelector('.confirm-checkout-container');
    const confirm_checkout_btn = document.querySelector('.confirm-checkout-btn');
    const confirm_checkout_loader = document.querySelector('.confirm-checkout-body i');
    confirm_checkout_loader.style.display = 'block';
    confirm_checkout_btn.style.display = 'none';
    fetch('/category/checkout/' + document.cookie.split('=')[1])
    .then(res => res.json())
    .then(data => {
        const feedback_msg = document.querySelector('.checkout-feedback-msg-container');
        const feedback_circle = document.querySelector('.checkout-feedback-msg .fa-check-circle-o');
        const feedback_triangle = document.querySelector('.checkout-feedback-msg .fa-exclamation-triangle');
        const feedback_text = document.querySelector('.checkout-feedback-msg p');

        feedback_msg.style.display = 'flex';
        if (data.status === 0) {
            setTimeout(() => {
                window.location.href = '/';
            }, 3500);
        } else {
            feedback_circle.style.display = 'none';
            feedback_triangle.style.display = 'block';
            if (data.status === 1) {
                // error in login
                feedback_text.innerHTML = 'Please Login';
            } else {
                feedback_text.innerHTML = 'No items in cart';
            }
            setTimeout(() => {
                feedback_msg.style.display = 'none';
                shop_list_container.style.display = 'none';
                confirm_checkout_container.style.display = 'none';
                confirm_checkout_loader.style.display = 'none';
                confirm_checkout_btn.style.display = 'block';
                document.getElementById('viewport-wrapper').style.overflowY = 'scroll';
            }, 3000);
        }

        console.log(data);
    })
    .catch(err => {
        console.log(err);
    });
}

function openShopList() {
    // event.preventDefault();
    shop_list_container.style.display = 'flex';
    // viewPort[0].style.height = "100vh";
    // viewPort[0].style.overflow = "hidden";
    document.getElementById('viewport-wrapper').style.overflowY = 'hidden';
}

function closeShopList() {
    shop_list_wrapper.style.animation = 'card-slide-out 0.5s linear';
    setTimeout(() => {
        shop_list_container.style.display = 'none';
        shop_list_wrapper.style.animation = 'card-slide-in 0.5s linear';
        document.getElementById('viewport-wrapper').style.overflowY = 'scroll';
    }, 500);
}

let confirm_btn_pressed = false;

function confirmPurchase() {
    confirm_checkout_container.style.display = 'flex';
}

function addToShopList(product_data, totalSum) {
    const shop_list_content = document.getElementsByClassName('shop-list-content')[0];

    const shop_cart = document.querySelector('.nav-logo .fa-shopping-cart');
    shop_cart.classList.toggle('add-to-cart-animation');

    const shop_count = document.querySelector('.shop-count');
    shop_count.innerHTML = parseInt(shop_count.innerHTML) + 1;

    totalSum.innerHTML = parseInt(totalSum.innerHTML) + parseInt(product_data.price);
    document.querySelector('.cart-error-msg p').style.display = 'none';
    console.log("Shop LIst Content: " + shop_list_content);

    const cart_script = `
        <div class="shop-item">
            <div class="shop-item-product">
                <img src="${product_data.image}" alt="">
                <p class="shop-item-name">${product_data.name}</p>
            </div>
            <div class="shop-item-quantity">
                <div class="shop-item-quantity-input">
                    <input type="text" value="1" required>
                    <button class="update-btn">Update</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
            <div class="shop-item-price">
                ${product_data.price}
            </div>
            <div class="shop-item-sub-total">
                ${product_data.price}
            </div>
            <!-- <button class="shop-item-remove-btn">Remove</button> -->
            <div class="shop-item-id" style="display:none">${product_data.id}</div>
        </div>
    `
    shop_list_content.innerHTML += cart_script;
    setTimeout(() => {
        shop_cart.classList.toggle('add-to-cart-animation');
    }, 2000)
}

function checkItemExist(id) {
    const shop_item = document.getElementsByClassName('shop-item-id');
    console.log(shop_item);
    for (let i = 0; i < shop_item.length; i++) {
        if (shop_item[i].innerHTML == id) {
            return i;
        }
    }

    return -1;
}
function addItemToCart(product_data) {

    const exists = checkItemExist(product_data.id);
    const data = {'id': product_data.id};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        status: 200
    };
    // console.log(document.cookie.split('=')[1]);
    fetch("/cookie/get", options)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // logout if no cookie was found
        if (data.meta_id === null) {
            console.log("Please Login");
            openErrorLogin();
            throw {'error': "NotLoggedIn"};
            // window.location.href = '/login';
        } else {
            console.log("Ready to fetch /category/add-to-cart");
            console.log(data.meta_id);
            return fetch('/category/add-to-cart/' + product_data.id + '?meta_id=' + encodeURIComponent(data.meta_id));
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const totalSum = document.querySelector('.checkout p span');
        const subTotal = document.getElementsByClassName('shop-item-sub-total');
        console.log(subTotal);
        console.log("Exists");
        if (exists != -1) {
            console.log("HERE");

            const shop_cart = document.querySelector('.nav-logo .fa-shopping-cart');
            shop_cart.classList.toggle('add-to-cart-animation');

            const shop_count = document.querySelector('.shop-count');
            shop_count.innerHTML = parseInt(shop_count.innerHTML) + 1;
            const shop_item_quantity = document.querySelectorAll('.shop-item-quantity-input input');
            // console.log(shop_item_quantity.length);
            // console.log(shop_item_quantity[exists].value);
            const updatedValue = parseInt(shop_item_quantity[exists].value) + 1;
            shop_item_quantity[exists].setAttribute('value', updatedValue);
            shop_item_quantity[exists].value = updatedValue;

            subTotal[exists].innerHTML = parseInt(subTotal[exists].innerHTML) + parseInt(product_data.price);
            totalSum.innerHTML = parseInt(totalSum.innerHTML) + parseInt(product_data.price);
            // console.log(shop_item_quantity[exists].value);

            setTimeout(() => {
                shop_cart.classList.toggle('add-to-cart-animation');
            }, 2000)
        } else {
            addToShopList(product_data, totalSum);
        }
    })
    .catch(error => console.error(error));
}


function pressShoppingCart(id, name, price, image) {
     // get product item details
    //  console.log(price);
     let product_data = {};
    //  let product_item_id = document.getElementsByClassName('product-id')[i];
    //  let product_name = document.getElementsByClassName('product-name')[i];
    //  let product_price = document.getElementsByClassName('product-price')[i];
    //  let product_image = document.querySelectorAll('.product-item-container img')[i];
    product_data['name'] = name;
    product_data['price'] = price;
    product_data['image'] = image;
    product_data['id'] = id;
    console.log(product_data);
    //  // console.log(product_name.innerHTML);
     addItemToCart(product_data);
}
