'use strict';

var swiper = new Swiper(".mySwiper", {
    slidesPerView: 6,
    centeredSlides: false,
    slidesPerGroupSkip: 4,
    grabCursor: true,
    keyboard: {
      enabled: true,
    },
    breakpoints: {
      769: {
        slidesPerView: 6,
        slidesPerGroup: 5,
      },

    },
    scrollbar: {
      el: ".swiper-scrollbar",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

