let form = document.getElementsByTagName('form');
let login_instead_btn = document.querySelector('.login-instead-btn');

let sign_up = document.querySelector('.sign-up');
let sign_in_icon = document.querySelector('.nav-logo .fa-sign-in');
let sign_in_text = document.querySelector('.sign-in-text');
let sign_out_text = document.querySelector('.sign-out-text');
let sign_out_icon = document.querySelector('.nav-logo .fa-sign-out');

let cancelbtn = document.getElementsByClassName('cancelbtn');
let error_msg = document.getElementsByClassName('error-msg');
let spinner = document.querySelectorAll('.login-msg .fa-spinner');
// let login_modal = document.querySelector('.login-container'); LOGIN MODAL ALREADY DECLARED IN TOP.JS

let account_info = document.querySelector('.account-info');

let checkbox = document.querySelector('.remember-me input');




sign_up.addEventListener('click', () => {
    form[0].style.animation = 'login_fade_out 1.5s ease-in-out';
    form[1].style.animation = 'login_form_animation 1.5s ease-in-out';
    form[1].style.display = 'block';

    // if (checkbox.checked) {
    //     let uname = document.getElementById('uname').value;
    //     let pwd = document.getElementById('pwd').value;
    // }
    setTimeout(() => {
        form[0].style.display = 'none';
    }, 1000);
    error_msg[0].innerHTML = '';
    document.getElementById('uname').value = '';
    document.getElementById('pwd').value = '';

})

function changeToLoginPage() {
    document.getElementById('signup-uname').value = '';
    document.getElementById('signup-pwd').value = '';
    document.getElementById('confirm-pwd').value = '';
    form[0].style.display = 'block';
    form[0].style.animation = 'login_form_animation 1.5s ease-in-out';
    form[1].style.animation = 'login_fade_out 1.5s ease-in-out';
    setTimeout(() => {
        form[1].style.display = 'none';
    }, 1000);
}

login_instead_btn.addEventListener('click', () => {
    changeToLoginPage();
})

for (let i = 0; i < cancelbtn.length; i++) {
    cancelbtn[i].addEventListener('click', () => {
        document.getElementById('signup-uname').value = '';
        document.getElementById('signup-pwd').value = '';
        document.getElementById('confirm-pwd').value = '';
        document.getElementById('uname').value = '';
        document.getElementById('pwd').value = '';
        error_msg[i].innerHTML = '';
        form[0].style.display = 'block';
        form[0].style.animation = 'login_form_animation 1.5s ease-in-out';
        form[1].style.animation = 'login_fade_out 1.5s ease-in-out';
        form[1].style.display = 'none';
        login_modal.style.display = 'none';
        document.getElementById('viewport-wrapper').style.overflowY = 'scroll';
    })
}

function loadCart(data) {

    const shop_list_content = document.getElementsByClassName('shop-list-content')[0];
    console.log("Shop List Content: " + shop_list_content);

    const totalSum = document.querySelector('.checkout p span');
    console.log(totalSum);

    if (data.length > 0) {
        document.querySelector('.cart-error-msg p').style.display = 'none';
    }

    const shop_count = document.querySelector('.shop-count');
    for (let i = 0; i < data.length; i++) {

        const cart_script = `
            <div class="shop-item">
                <div class="shop-item-product">
                    <img src="${data[i].imagesource}" alt="">
                    <p class="shop-item-name">${data[i].name}</p>
                </div>
                <div class="shop-item-quantity">
                    <div class="shop-item-quantity-input">
                        <input type="text" value="${data[i].pquantity}" required>
                        <button class="update-btn">Update</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                </div>
                <div class="shop-item-price">
                    ${data[i].price}
                </div>
                <div class="shop-item-sub-total">
                    ${data[i].price * data[i].pquantity}
                </div>
                <!-- <button class="shop-item-remove-btn">Remove</button> -->
                <div class="shop-item-id" style="display:none">${data[i].id}</div>
            </div>
        `
        shop_list_content.innerHTML += cart_script;
        totalSum.innerHTML = parseInt(totalSum.innerHTML) + parseInt(data[i].price * data[i].pquantity);
        
        shop_count.innerHTML = parseInt(shop_count.innerHTML) + parseInt(data[i].pquantity);
    }
}
