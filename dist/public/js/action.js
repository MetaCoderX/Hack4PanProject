
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

/* Navigation JS */

function getYPos(num, section_header) {
    console.log('getYPos');
    console.log(section_header);
    console.log(num);
    const viewport_wrapper = document.querySelector('#overflow-wrapper');
    console.log(viewport_wrapper);

    const rect1 = section_header.getBoundingClientRect();
    const rect2 = viewport_wrapper.getBoundingClientRect();
    console.log(rect1.top + " " + rect2.top);
    window.scrollTo({
        top: (-1 * rect2.top) - (-1 * rect1.top) - 200,
        behavior: 'smooth'
    })
}
function scrollBtn(num) {
    const section_header = document.querySelectorAll('.featured-products')[num];
    getYPos(num, section_header);
}

function allProductsBtn() {
    window.location.href = '/all';
}

function reviewsBtn() {
    const title = document.querySelector('.testimonial-header h3');
    const rect = title.getBoundingClientRect();
    console.log(rect.top);
    window.scrollTo({
        top: window.scrollY + rect.top - 200,
        behavior: 'smooth'
    })
}


/* Testimonial JS */
const stand_out = document.querySelector('.stand-out');
const testimonial_content = document.querySelectorAll('.testimonial-content');
function reviewScaleUp(id) {

    if (id === 0) {
        testimonial_content[0].style.transform = 'scale(1)';
        testimonial_content[1].style.transform = 'scale(0.8)';
        testimonial_content[2].style.transform = 'scale(0.8)';
        stand_out.style.transform = 'scale(0.8)';
    } else if (id === 1) {
        testimonial_content[0].style.transform = 'scale(0.8)';
        testimonial_content[1].style.transform = 'scale(1)';
        testimonial_content[2].style.transform = 'scale(0.8)';
    } else {
        testimonial_content[0].style.transform = 'scale(0.8)';
        testimonial_content[1].style.transform = 'scale(0.8)';
        testimonial_content[2].style.transform = 'scale(1)';
        stand_out.style.transform = 'scale(0.8)';
    }
}

function reviewScaleDown() {
    stand_out.style.transform = 'scale(1)';
    testimonial_content[0].style.transform = 'scale(0.8)';
    testimonial_content[2].style.transform = 'scale(0.8)';
}

function testimonialQuery(x) {
    if (x.matches) {
        stand_out.style.transform = 'scale(0.95)';
        testimonial_content[0].style.transform = 'scale(0.95)';
        testimonial_content[1].style.transform = 'scale(0.95)';
        testimonial_content[2].style.transform = 'scale(0.95)';
        for (let i = 0; i < testimonial_content.length; i ++) {
            testimonial_content[i].onmouseover= function() {
                testimonial_content[i].style.transform = 'scale(1)';
            }
            testimonial_content[i].onmouseout= function() {
                testimonial_content[i].style.transform = 'scale(0.95)';
            }
        }
    } else {
        stand_out.style.transform = 'scale(1)';
        testimonial_content[0].style.transform = 'scale(0.8)';
        testimonial_content[1].style.transform = 'scale(1)';
        testimonial_content[2].style.transform = 'scale(0.8)';
        for (let i = 0; i < testimonial_content.length; i ++) {
            testimonial_content[i].onmouseover = () => {
                reviewScaleUp(i);
            };
            if (i !== 1) {
                testimonial_content[i].onmouseout= reviewScaleDown;
            }
        }
    }
}
let testimonialMediaQuery = window.matchMedia("(max-width: 800px)");
testimonialQuery(testimonialMediaQuery);
testimonialMediaQuery.addEventListener("change", testimonialQuery);

let openedReview = false;
const review_container = document.querySelector('.review-container');
function openReview() {
    if (!openedReview) {
        review_container.style.display = 'block';
    } else {
        review_container.style.display = 'none';
    }
    openedReview = !openedReview;
}

function reviewRatingClicked(num) {
    const review_rating = document.querySelectorAll('.review-rating i');
    // reset bg color
    for (let i = 0; i < review_rating.length; i ++) {
        review_rating[i].classList.remove('fa-star-o');
    }
    for (let i = 0; i < num; i ++) {
        review_rating[i].classList.add('fa-star');
    }

    for (let i = 4; i > num - 1; i --) {
        review_rating[i].classList.add('fa-star-o');
    }
    const review_rating_comment = document.querySelector('.review-header p');
    let comment = "";
    switch(num) {
        case 1:
            comment = "Bad Experience";
            break;
        case 2:
            comment = "Quite a lot to Improve";
            break;
        case 3:
            comment = "Not great Not bad";
            break;
        case 4:
            comment = "Good Experience";
            break;
        case 5:
            comment = "Amazing Quality";
            break;
        default:
            break;
    }
    review_rating_comment.innerHTML = comment;
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
