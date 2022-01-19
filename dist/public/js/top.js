
let navWindow = document.getElementsByClassName('nav-window');
let navContainer = document.getElementsByClassName('nav-container');

let mobile_search_container = document.getElementsByClassName('mobile-search-container')[0];
let close_search = document.getElementsByClassName('close-search')[0];

let signin_modal_btn = document.querySelector('.nav-logo .fa-sign-in');
let signout_modal_btn = document.querySelector('.nav-logo .fa-sign-out');
let login_modal = document.querySelector('.login-container');


signin_modal_btn.addEventListener('click', () => {
    console.log("Sign in btn clicked");
    login_modal.style.display = 'flex';
    document.getElementById('viewport-wrapper').style.overflowY = 'hidden';

});

signout_modal_btn.addEventListener('click', () => {
    console.log("Sign out btn clicked");
    signin_modal_btn.style.display = 'block';
    signout_modal_btn.style.display = 'none';
    account_info.innerHTML = "You're not logged in yet";


    setTimeout(() => {
        login_modal.style.display = 'none';
        fetch('/cookie/remove')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            window.location.href = "/";
        })
        .catch((err) => {
            console.log(err);
        })

    }, 500);
})


function dropDownSearch() {
    mobile_search_container.style.display = 'block';
    close_search.style.display = 'block';
}

function closeDropDownSearch() {
    mobile_search_container.style.display = 'none';
    close_search.style.display = 'none';
}
