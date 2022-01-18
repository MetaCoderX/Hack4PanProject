
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
    document.getElementsByTagName('html')[0].style.overflow = 'hidden';
});

signout_modal_btn.addEventListener('click', () => {
    console.log("Sign out btn clicked");
    signin_modal_btn.style.display = 'block';
    signout_modal_btn.style.display = 'none';
    account_info.innerHTML = "You're not logged in yet";
    document.getElementsByTagName('html')[0].style.overflow = 'scroll';
    
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


// window.addEventListener("scroll", function () {
//     if ((document.documentElement.scrollTop >= 50 || document.body.scrollTop >= 50)) {
//         // console.log("hi");
//         if (!navContainer[0].classList.contains('nav-container-bg-color')) {
//             navContainer[0].classList.add('nav-container-bg-color');
//         }
//     } else if ((document.body.scrollTop < 50 || document.documentElement.scrollTop < 50) && navContainer[0].classList.contains('nav-container-bg-color')) {
//         navContainer[0].classList.remove('nav-container-bg-color');
//     }
// });


// // Show side-sub-content-container
// document.querySelectorAll('.side-new-content').forEach(row => {
//         row.addEventListener('click', () => {
//             let subContainer = document.getElementById('side-sub-content-container');
//             let mainContainer = document.getElementById('side-content-container');
//             subContainer.style.display = 'block';
//             mainContainer.style.display = 'none';
//             sideMenu.scrollTo(0, 0);
//         });
// });

// document.getElementById('main-menu').addEventListener('click', () => {

//     let subContainer = document.getElementById('side-sub-content-container');
//     let mainContainer = document.getElementById('side-content-container');
//     subContainer.style.display = 'none';
//     mainContainer.style.display = 'block';
//     subContentContainer.innerHTML = ""; // reset all pressed behaviours
// });



function dropDownSearch() {
    mobile_search_container.style.display = 'block';
    close_search.style.display = 'block';
}

function closeDropDownSearch() {
    mobile_search_container.style.display = 'none';
    close_search.style.display = 'none';
}

