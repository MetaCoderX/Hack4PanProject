
let heart_empty = document.getElementsByClassName('fa-heart-o');
let heart_filled = document.getElementsByClassName('fa-heart');

function beautyBtnClicked() {
    window.location.href = '/beauty';
}
function electronicBtnClicked() {
    window.location.href = '/electronic';
}
function clothingBtnClicked() {
    window.location.href = '/clothing';
}
function suppliesBtnClicked() {
    window.location.href = '/supplies';
}

function healthBtnClicked() {
    window.location.href = '/health';
}


for (let i = 0; i < heart_empty.length; i ++) {
    // console.log(i);
    let eachHeartEmpty = heart_empty[i];
    let eachHeartFilled = heart_filled[i];

    eachHeartEmpty.addEventListener('click', () => {
        eachHeartFilled.style.display = 'inline-block';
        eachHeartEmpty.style.display = 'none';
    });

    eachHeartFilled.addEventListener('click', () => {
        eachHeartFilled.style.display = 'none';
        eachHeartEmpty.style.display = 'inline-block';
    });

}

/* Swiper JS */
var homeSwiper = new Swiper(".mySwiper1", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination1",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next1",
      prevEl: ".swiper-button-prev1",
    },
});

let swiper2 = new Swiper(".mySwiper2", {
    slidesPerView: 4,
    spaceBetween: 20,
    slidesPerGroup: 4,
    loop: true,
    loopFillGroupWithBlank: true,
    pagination: {
        el: ".swiper-pagination2",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next2",
        prevEl: ".swiper-button-prev2",
    },
});

let swiper3 = new Swiper(".mySwiper3", {
    slidesPerView: 1,
    spaceBetween: 30,
    slidesPerGroup: 1,
    loop: true,
    loopFillGroupWithBlank: true,
    pagination: {
        el: ".swiper-pagination3",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next3",
        prevEl: ".swiper-button-prev3",
    },
});
