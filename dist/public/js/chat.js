
import GUN from "https://cdn.skypack.dev/gun";
import SEA from "https://cdn.skypack.dev/gun/sea";

const gun = Gun({
    peers: ["http://localhost:3000/gun"]
});

let user = gun.user()
// let user = gun.user().recall({sessionStorage: true});


const chat_screen_panel = document.querySelector('.chat-screen-panel');
const paste = document.querySelector('.chat-message-box input');

const login_btn = document.querySelector('.chat-login-btn');
const sign_btn = document.querySelector('.chat-sign-btn');
const clear_btn = document.querySelector('.chat-clear-btn');
const open_chat_side = document.querySelector('.chat-container > i');
const chat_side = document.querySelector('.chat-side');
const chat_wrapper = document.querySelector('.chat-wrapper');
const open_chat_icon = document.querySelector('.bxs-message-dots');


let chat_history = [];
let curr_date = new Date().getDate();
let loaded = false;
let prev_date = "";
let active_room = "";

function newMessageScroll() {
    chat_screen_panel.scrollTo({
        behavior: 'smooth',
        top: chat_screen_panel.scrollHeight
    });
}

function sendMessage(message) {
    let message_html = '';

    if (message.content === 'joined') {
        message_html = `
            <div class="chat-user-join">
                <p>${message.name} has arrived <i class='bx bxs-rocket'></i></p>
            </div>
        `;
    } else {

        if (message.content.trim() === "") {console.log("Empty message"); return;}
        let date = new Date(message.date);

        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        let time = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
        const cmp_date = date.getDate();
        let date_tag = '';

        if (prev_date !== cmp_date) {
            if (cmp_date === curr_date ) {
                date_tag = '<div class="date-tag">Today</div>';
            } else {
                if (curr_date - cmp_date === 1) {
                    date_tag = '<div class="date-tag">Yesterday</div>';
                } else {
                    date_tag = '<div class="date-tag">' + date.toDateString() + '</div>';
                }
            }
        }
        prev_date = cmp_date;



        message_html = date_tag + `
        <div class="chat-section">
            <div class="chat-user">${message.name}</div>
            <div class="chat-message-content">
                ${message.content}
            </div>
            <div class="chat-date">${time}</div>
        </div>
        `;
    }
    chat_screen_panel.innerHTML += message_html;
    newMessageScroll();
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
                document.getElementById('is-signed-up').innerHTML = 'true';
                error_msg[0].style.color = 'green';
                spinner[0].style.display = 'block';

                console.log("User Loggin not revisited: " + result.session_id);
                user.auth(uname.toLowerCase(), result.session_id, (ack) => {
                    console.log("User authenticated: " + ack.sea.pub);
                })
                // load cart if any
                if (result.cart.length > 0) {
                    console.log("Load Cart: "+ result.cart)
                    loadCart(result.cart);
                }

                setTimeout(() => {
                    // change account-info name
                    error_msg[0].innerHTML = '';
                    account_info.innerHTML = `<span>Welcome, ${uname}</span>`;
                    login_modal.style.display = 'none';
                    spinner[0].style.display = 'none';
                    sign_in_icon.style.display = 'none';
                    sign_in_text.style.display = 'none';
                    sign_out_icon.style.display = 'block';
                    sign_out_text.style.display = 'block';
                    document.getElementById('viewport-wrapper').style.overflowY = 'scroll';
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

    const format= /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(uname)) {
        console.log('No Special Characters Allowed');
        error_msg[1].innerHTML = "No Special Characters Allowed";
        error_msg[1].style.color = 'red';
        return;
    }
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

                    console.log("User creating: " + result.session_id);
                    user.create(uname.toLowerCase(), result.session_id, (ack) => {
                        console.log("User created:  + " + ack.pub);
                    })
                    setTimeout(() => {
                        error_msg[1].innerHTML = "";
                        // login_modal.style.display = 'none';
                        spinner[1].style.display = 'none';
                        changeToLoginPage();
                        document.getElementById('viewport-wrapper').style.overflowY = 'scroll';
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
                    .then(loginResults => {
                        const result = loginResults;

                        console.log("User loggin revisited: " + userData.session_id);
                        user.auth(results.name.toLowerCase(), userData.session_id, (ack) => {
                            console.log("User authenticated: " + ack.sea.pub);
                        })
                        // change account-info name
                        account_info.innerHTML = `<span>Welcome, ${result.name}</span>`;
                         // load cart if any
                         if (result.cart.length > 0) {
                            console.log("Load Cart: "+ result.cart)
                            loadCart(result.cart);
                        }
                    })
                    .catch(err => {
                        console.log("Login response: " + err);
                    })
            }
        })
        .catch(err => {console.log(err)})

}


const chat_error_msg = document.querySelector('.chat-error-msg');
const public_room = document.querySelector('.public-room');

open_chat_side.onclick = () => {
    console.log("Hello");
    chat_side.classList.toggle('chat-side-show');
}

open_chat_icon.onclick = () => {
    // post request options
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        status:  200
    }
    fetch('/cookie/get', options)
    .then(res => res.json())
    .then(data => {
        // console.log(account_info.innerHTML.split(', ')[1].split('<')[0]);
        if (!user.is) {
            console.log('You are not authenticated');
            error_login.style.display = 'flex';
            return;
        }
        if (data.meta_id !== null && user.is.alias.toLowerCase() === data.name.toLowerCase()) {
            console.log("Verified");
            chat_wrapper.classList.toggle('open-chat');

            if (document.getElementById('is-clicked').innerHTML === 'false') {
                document.getElementById('is-clicked').innerHTML = 'true';
                chat_error_msg.innerHTML = '&#9754; Choose a chat room or add a private chat';
                // click send
                document.querySelector('.chat-message-box button').onclick = () => {
                    console.log('btnclicked');

                    gun.get('test-room5').get('messages').set({
                        'content': paste.value,
                        'name': data.name,
                        'date': Date.now()
                    })
                    paste.value = '';
                }

                // show public room messages

                public_room.onclick = () => {
                    if (!public_room.classList.contains('active-room')) {

                        public_room.classList.add('active-room');

                        chat_error_msg.innerHTML = '';

                        gun.get('test-room5').get('messages').map().once((message) => {

                            if (loaded) {
                                console.log("Add msg");
                                sendMessage(message);
                            } else {
                                console.log("Load msg");
                                chat_history.push(message);
                            }
                        })
                        setTimeout(() => {
                            chat_history.sort((a, b) => {
                                return a.date - b.date;
                            })
                            chat_history.forEach((message) => {
                                sendMessage(message);
                            });
                            loaded = true;
                            gun.get('test-room5').get('messages').set({
                                'content': 'joined',
                                'name': data.name,
                                'date': Date.now()
                            })
                            // console.log(chat_history);
                        }, 1000);

                    }
                }
            }

        } else {
            error_login.style.display = 'flex';
        }
    })
    .catch(e => console.log(e));




}


// var mql = window.matchMedia('(max-width: 600px)');
// let mediaChanged = false;

// function changedMedia(e) {
//     if (e.matches) {
//         if (!mediaChanged) {
//             console.log('This is a narrow screen — less than 600px wide.')
//             chat_side.classList.toggle('chat-side-phone');
//             mediaChanged = true;
//         }
//     } else {
//         /* the viewport is more than than 600 pixels wide */
//         console.log('This is a wide screen — more than 600px wide.')
//         if (mediaChanged) {
//             chat_side.classList.toggle('chat-side-phone');
//             mediaChanged = false;
//         }
//     }
// }
// mql.addEventListener('change', changedMedia);
// changedMedia(mql);


console.log(curr_date);


window.onload = () => {
    console.log(document.getElementById('page-name'));
    if (document.getElementById('page-name') !== null) {
        console.log("KEKW");
        recentId = parseInt(clothing_header_content.innerHTML) + 1;
        clothing_header_content.innerHTML = num_of_results.innerHTML;
        page_name = document.getElementById('page-name').innerHTML;
        console.log(page_name);
        updateClothingDOM();
    }
    let data = {'revisit': true};
    userLogin(data);
}
