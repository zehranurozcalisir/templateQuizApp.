var swiper = new Swiper('.sliderBarStyle', {
  slidesPerView: 3,
  spaceBetween: 10,
  loop: true,
  navigation: {
    nextEl: '.okButtonRight',
    prevEl: '.okButtonLeft',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    400: {
      slidesPerView: 3,
    },
  },
});
