const swiper = new Swiper(".swiper", {
  // Optional parameters
  slidesPerView: 1,
  spaceBetween: 10,
  loop: true,
  effect: "flip",
  flipEffect: {
    slideShadows: false,
  },
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  breakpoints: {
    // when window width is >= 480px
    520: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 3,
      spaceBetween: 15,
    },
  },

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
