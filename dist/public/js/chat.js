import GUN from "https://cdn.skypack.dev/gun";
import SEA from "https://cdn.skypack.dev/gun/sea";

const gun = Gun({
    peers: ["https://5c5b-129-78-56-152.ngrok.io/gun", "http://localhost:3000/gun"]
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

open_chat_side.onclick = () => {
    console.log("Hello");
    chat_side.classList.toggle('chat-side-show');
    // paste.style.marginLeft = chat_side.offsetWidth + 'px';
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

let chat_history = [];
let curr_date = new Date().getDate();
let loaded = false;
let prev_date = "";
let active_room = "";

// clear_btn.onclick = () => {
//     // console.log("Clear all messages");
//     chat_screen_panel.innerHTML = '';
//     // gun.get('public-room').get('messages').put(null);
// }

// sign_btn.onclick = () => {
//     const name = document.querySelector('.chat-user-name').value;
//     const pwd = document.querySelector('.chat-user-pwd').value;
//     console.log("Sign up");
//     user.create(name, pwd, (ack) => {
//         console.log("Created User: " + ack.pub); 
//     });
//     sign_btn.style.display = 'none';
// }

// login_btn.onclick = () => {
//     const name = document.querySelector('.chat-user-name').value;
//     const pwd = document.querySelector('.chat-user-pwd').value;
//     console.log("Login");
//     user.auth(name,  pwd, (ack) => {
//         console.log(ack);
//         console.log("Authorized: " + ack.sea.pub);
//         gun.get('pub/' + ack.pub).put({
//             'name': name,
//             'pwd': pwd
//         })
//     });
//     login_btn.style.display = 'none';
//     sign_btn.style.display = 'none';
//     console.log(new Date());
// }


function newMessageScroll() {
    chat_screen_panel.scrollTo({
        behavior: 'smooth',
        top: chat_screen_panel.scrollHeight
    });
}

function sendMessage(message) {
    let date = new Date(message.date);
    let message_html = '';
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
    
    
    message_html = date_tag + `<div class="chat-section">
        <div class="chat-user">${message.name}</div>
        <div class="chat-message-content">${message.content}</div>
        <div class="chat-date">${time}</div>
    </div>
    `;
    chat_screen_panel.innerHTML += message_html;
    newMessageScroll();
}

const chat_error_msg = document.querySelector('.chat-error-msg');
const public_room = document.querySelector('.public-room');
gun.on('auth', (ack) => {
    console.log("User is logged in ");
    chat_error_msg.innerHTML = '&#9754; Choose a chat room or add a private chat';
    // click send
    document.querySelector('.chat-message-box button').onclick = () => { 
        console.log('btnclicked');
        if (!user.is) {
            console.log("Not logged in");
            return;
        } 
        // console.log(user.is);
        
        gun.get('new-room').get('messages').set({
            'content': paste.value,
            'name': user.is.alias,
            'date': Date.now()
        })    
        paste.value = '';
    }

    // show public room messages
    
    public_room.onclick = () => {
        if (!public_room.classList.contains('active-room')) {
            
            public_room.classList.add('active-room');
    
            chat_error_msg.innerHTML = '';
            chat_screen_panel.innerHTML += `
                    <div class="chat-user-join">
                        <p>${user.is.alias} joined</p>
                    </div>
            `
            gun.get('new-room').get('messages').map().once((message) => {
        
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
            }, 1500);
        }
    }
})


console.log(curr_date);