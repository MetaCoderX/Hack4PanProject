let error_login = document.querySelector('.error-login-container');
let viewport_wrapper = document.getElementById('viewport-wrapper');

function openErrorLogin() {
    error_login.style.display = 'flex';
    viewport_wrapper.style.overflowY = 'hidden';
    // viewport_wrapper.style.height = '100vh';
    // document.getElementsByTagName('html')[0].style.overflow = 'hidden';
}

function closeErrorLogin() {
    error_login.style.display = 'none';
    viewport_wrapper.style.overflowY = 'scroll';
    // document.getElementsByTagName('html')[0].style.overflow = 'scroll';
    // viewport_wrapper.style.height = 'auto';
}

function openLoginForm() {
    closeErrorLogin();
    let login_modal = document.querySelector('.login-container');
    login_modal.style.display = 'flex';
}
