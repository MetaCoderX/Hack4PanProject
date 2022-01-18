
/* Actions */
let sideMenu = document.getElementById('main-side');
let sideMenuNarrow = document.getElementById('main-side-narrow');
let sideMenuNarrowContent = document.querySelector('.main-side-narrow-content');
let viewPort = document.getElementsByTagName('body');
let viewWindow = document.getElementsByClassName('view-port');
let ham_menu = document.getElementsByClassName('ham-menu')[0];



function closeMenu() {
    // // viewPort[0].style.overflow = "scroll";
    // viewPort[0].style.height = '';
    sideMenu.style.animation = 'push-left-side 0.5s linear';
    setTimeout(() => {
        sideMenu.style.display = 'none';
        sideMenu.style.animation = 'push-right-side 0.5s linear';
    }, 500)
    // viewPort[0].style.overflow = 'hidden';
    document.getElementsByTagName('html')[0].style.overflow = "scroll";
    // viewWindow[0].style.cssText = '';
    viewWindow[0].style.visibility = 'hidden';

}

function openMenu() {
    
    // viewPort[0].style.height = '100vh';
    // viewPort[0].style.overflow = "hidden";
    document.getElementsByTagName('html')[0].style.overflow = "hidden";
    sideMenu.style.display = 'block';
    viewWindow[0].style.visibility = 'visible';
}

function openNarrowMenu() {
    console.log(sideMenuNarrowContent);
    sideMenuNarrow.style.visibility = 'visible';
    sideMenuNarrowContent.style.display = 'flex';
    sideMenuNarrow.style.zIndex = '200';  
    ham_menu.style.visibility = 'hidden';  
    // ham_menu.style.vis = 'none';  
}

function closeNarrowMenu() {
    sideMenuNarrowContent.style.animation = 'push-up 0.5s linear';
    setTimeout(() => {
        sideMenuNarrowContent.style.display = 'none';
        sideMenuNarrowContent.style.animation = 'drop-down 0.5s linear';
        ham_menu.style.visibility = 'visible';
        sideMenuNarrow.style.zIndex = '-1';  
    }, 500) 
}