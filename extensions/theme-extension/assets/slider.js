document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".slider");
    const leftBtn = document.querySelector(".slider-arrow--left");
    const rightBtn = document.querySelector(".slider-arrow--right");
    const slides = Array.from(document.querySelectorAll(".slide"));
    const visibleSlides = Number(window.VISIBLE_SLIDES);
    let startIndex = 0;

    function updateSlider() {
        const slide = slides[0];
        if (!slide) return;
        const slideWidth = slide.offsetWidth + 16;
        slider.scrollTo({
            left: slideWidth * startIndex,
            behavior: "smooth",
        });
    }

    if (leftBtn) {
        leftBtn.addEventListener("click", function () {
            startIndex = Math.max(0, startIndex - 1);
            updateSlider();
        });
    }

    if (rightBtn) {
        rightBtn.addEventListener("click", function () {
            startIndex = Math.min(slides.length - visibleSlides, startIndex + 1);
            updateSlider();
        });
    }
});
