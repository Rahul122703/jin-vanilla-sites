if (".slider-page-title-home".length > 0) {
    var swiper = new Swiper(".slider-page-title-home", {
        spaceBetween: 0,
        slidesPerView: 1,
        pagination: {
            el: ".page-title-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".page-title-next",
            prevEl: ".page-title-prev",
        },
    });
}

if ($(".slide-layout-3").length > 0) {
    var swiper = new Swiper(".slide-layout-3", {
        slidesPerView: 3,
        spaceBetween: 30,
        navigation: {
            nextEl: ".layout-3-next",
            prevEl: ".layout-3-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            550: {
                slidesPerView: 2.2,
            },
            991: {
                slidesPerView: 3,
            },
        },
    });
}

if ($(".slide-layout-4").length > 0) {
    var swiper = new Swiper(".slide-layout-4", {
        slidesPerView: 4,
        spaceBetween: 30,
        navigation: {
            nextEl: ".layout-4-next",
            prevEl: ".layout-4-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            550: {
                slidesPerView: 2.2,
            },
            767:{
                slidesPerView: 3.2,
            },
            991: {
                slidesPerView: 4,
            },
        },
    });
}

if ($(".testimonials-layout-3").length > 0) {
    var swiper = new Swiper(".testimonials-layout-3", {
        slidesPerView: 3,
        autoplay: {
            delay: 3000,
            disableOnInteraction: true,
        },
        spaceBetween: 30,
        navigation: {
            nextEl: ".testimonials-3-next",
            prevEl: ".testimonials-3-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            750: {
                slidesPerView: 2,
            },
            991: {
                slidesPerView: 3,
            },
        },
    });
}
if ($(".slide-wg-quote").length > 0) {
    var swiper = new Swiper(".slide-wg-quote", {
        autoplay: {
            delay: 4000,
            disableOnInteraction: true,
        },
        slidesPerView: 1,
        breakpoints: {
            768: {
                slidesPerView: 1,
                spaceBetween: 30,
            },
            992: {
                slidesPerView: 1,
                spaceBetween: 30,
            },
        },
    });
}
if ($(".brand-slide").length > 0) {
    var swiper = new Swiper(".brand-slide", {
        spaceBetween: 30,
        slidesPerView: 6,
        observer: true,
        observeParents: true,
        loop: true,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        speed: 10000,
        breakpoints: {
            0: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            450: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            768: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
            868: {
                slidesPerView: 6,
                spaceBetween: 30,
            },
        },
    });
}

if ($(".thumbs-slider").length > 0) {
    var direction = $(".tf-product-media-thumbs").data("direction");
    var thumbs = new Swiper(".tf-product-media-thumbs", {
        spaceBetween: 30,
        slidesPerView: "3",
        slideTo: 1,
        direction: "vertical",
        observer: true,
        observeParents: true,
        breakpoints: {
            0: {
                direction: "horizontal",
                slidesPerView: 3,
            },
            1150: {
                direction: "horizontal",
                direction: direction,
            },
        },
        450: {
            direction: "horizontal",
        },
    });
    var main = new Swiper(".tf-product-media-main", {
        spaceBetween: 0,
        observer: true,
        observeParents: true,
        thumbs: {
            swiper: thumbs,
        },
    });
}

if ($(".slide-filter").length > 0) {
    var swiper = new Swiper(".slide-filter", {
        spaceBetween: 59,
        slidesPerView: "auto",
        observer: true,
        observeParents: true,
        navigation: {
            nextEl: ".filter-next",
            prevEl: ".filter-prev",
        },
    });
}

$('.swiper-container.brand-slide').on('mouseenter', function() {
    mySwiper.autoplay.stop(); // Dừng autoplay
});

// Khôi phục autoplay khi không còn hover
$('.swiper-container.brand-slide').on('mouseleave', function() {
    mySwiper.autoplay.start(); // Bắt đầu autoplay lại
});
