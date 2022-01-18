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
})

login_instead_btn.addEventListener('click', () => {
    form[0].style.display = 'block';
    form[0].style.animation = 'login_form_animation 1.5s ease-in-out';
    form[1].style.animation = 'login_fade_out 1.5s ease-in-out';
    setTimeout(() => {
        form[1].style.display = 'none';
    }, 1000);
})

for (let i = 0; i < cancelbtn.length; i++) {
    cancelbtn[i].addEventListener('click', () => {
        form[0].style.display = 'block';
        form[0].style.animation = 'login_form_animation 1.5s ease-in-out';
        form[1].style.animation = 'login_fade_out 1.5s ease-in-out';
        form[1].style.display = 'none';
        login_modal.style.display = 'none';
        document.getElementsByTagName('html')[0].style.overflow = 'scroll';
    })
}

// loadCart(data)


function userLogin(userData) {

    const cookieOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        status: 200
    }
    fetch("/cookie/get", cookieOptions)
        .then(response => {
            return response.json();
        })
        .then(results => {
            console.log(results);
            if (results.meta_id !== null) {

                // document.getElementsByTagName('html')[0].style.overflow = 'scroll';
                sign_in_icon.style.display = 'none';
                sign_in_text.style.display = 'none';
                sign_out_icon.style.display = 'block';
                sign_out_text.style.display = 'block';

                console.log("Cookie Found");
                userData.session_id = results.meta_id;
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData),
                    status: 200
                }
                fetch('/login', options)
                    .then(response =>  {
                        console.log('Login response back from server');
                        return response.json();
                    })
                    .then(results => {
                        const result = results;
                        // change account-info name
                        account_info.innerHTML = `<span>Welcome, ${result.name}</span>`;
                    })
                    .catch(err => {
                        console.log("Login response: " + err);
                    })
            }
        })
        .catch(err => {console.log(err)})

}

form[0].addEventListener('submit', (e) => {
    e.preventDefault();
    // get uname and pwd from input
    let uname = document.getElementById('uname').value;
    let pwd = document.getElementById('pwd').value;
    console.log("Client side form data: " + uname + " " + pwd);

    const data = {'uname' : uname, 'pwd' : pwd, 'revisit': false};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        status: 200
    }
    fetch('/login', options)
        .then(response =>  {
            console.log('Login response back from server');
            return response.json();
        })
        .then(results => {
            const result = results;

            console.log(result);

            error_msg[0].innerHTML = result.message;
            if (result.status === true) {
                error_msg[0].style.color = 'green';
                spinner[0].style.display = 'block';

                // load cart if any
                if (result.cart.length > 0) {
                    console.log("Load Cart: "+ result.cart)
                    loadCart(result.cart);
                }

                setTimeout(() => {
                    // change account-info name
                    account_info.innerHTML = `<span>Welcome, ${uname}</span>`;
                    login_modal.style.display = 'none';
                    spinner[0].style.display = 'none';
                    document.getElementsByTagName('html')[0].style.overflow = 'scroll';
                    sign_in_icon.style.display = 'none';
                    sign_in_text.style.display = 'none';
                    sign_out_icon.style.display = 'block';
                    sign_out_text.style.display = 'block';
                }, 3000);
            } else error_msg[0].style.color = 'red'
        })
        .catch(err => {
            console.log("Login response: " + err);
        })
});

form[1].addEventListener('submit', (e) => {
    e.preventDefault();
    // get uname and pwd from input
    let uname = document.getElementById('signup-uname').value;
    let pwd = document.getElementById('signup-pwd').value;
    let confirm_pwd = document.getElementById('confirm-pwd').value;
    console.log("Client side form data: " + uname + " " + pwd + " " + confirm_pwd);

    if (pwd === confirm_pwd && pwd.length > 8) {

        const data = {'uname' : uname, 'pwd' : pwd};
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            status: 200
        }
        fetch('/signup', options)
            .then(response =>  {
                console.log('Signup response back from server');
                return response.json();
            })
            .then(results => {
                const result = results;
                console.log("Client side result: " + result);
                error_msg[1].innerHTML = result.message;
                if (result.status === true) {
                    error_msg[1].style.color = 'green';
                    spinner[1].style.display = 'block';
                    setTimeout(() => {
                        login_modal.style.display = 'none';
                        spinner[1].style.display = 'none';
                        document.getElementsByTagName('html')[0].style.overflow = 'scroll';
                        sign_in_icon.style.display = 'none';
                        sign_in_text.style.display = 'none';
                        sign_out_icon.style.display = 'block';
                        sign_out_text.style.display = 'block';
                    }, 3000);
                } else error_msg[1].style.color = 'red'
            })
            .catch(err => {
                console.log("Login response: " + err);
            })
    } else {
        error_msg[1].style.color = 'red';
        if (pwd.length < 9) {
            error_msg[1].innerHTML = "Password must be at least 9 characters long";
        } else {
            error_msg[1].innerHTML = "Passwords do not match";
        }
    }

});
