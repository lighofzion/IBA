document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".nav-dot");
  let currentSlide = 0;
  let slideInterval;
  const intervalTime = 5000; // 5 seconds per slide

  // Initialize the carousel
  function initCarousel() {
    // Set up automatic sliding
    startSlideTimer();

    // Set up dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        goToSlide(index);
        resetSlideTimer();
      });
    });

    // Optional: pause on hover
    const carousel = document.querySelector(".hero-carousel");
    carousel.addEventListener("mouseenter", pauseSlideTimer);
    carousel.addEventListener("mouseleave", startSlideTimer);

    // Optional: add swipe support for mobile
    setupSwipeSupport();
  }

  // Go to a specific slide
  function goToSlide(slideIndex) {
    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length - 1;

    // Remove active class from current slide and dot
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");

    // Set new active slide and dot
    currentSlide = slideIndex;
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }

  // Go to the next slide
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  // Go to the previous slide
  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // Timer functions
  function startSlideTimer() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  function resetSlideTimer() {
    clearInterval(slideInterval);
    startSlideTimer();
  }

  function pauseSlideTimer() {
    clearInterval(slideInterval);
  }

  // Simple swipe detection for mobile
  function setupSwipeSupport() {
    const carousel = document.querySelector(".hero-carousel");
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      false
    );

    carousel.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      false
    );

    function handleSwipe() {
      // Minimum distance for swipe
      const minSwipeDistance = 50;

      if (touchEndX < touchStartX - minSwipeDistance) {
        // Swiped left, go to next slide
        nextSlide();
        resetSlideTimer();
      }

      if (touchEndX > touchStartX + minSwipeDistance) {
        // Swiped right, go to previous slide
        prevSlide();
        resetSlideTimer();
      }
    }
  }

  // Add dynamic visual effects
  function enhanceDiamondEffects() {
    // Add random subtle movements to diamonds
    setInterval(() => {
      if (document.hidden) return; // Don't animate when tab is not visible

      const activeDiamonds = document.querySelectorAll(
        ".carousel-slide.active .diamond"
      );
      activeDiamonds.forEach((diamond) => {
        // Subtle position adjustment
        const xShift = (Math.random() - 0.5) * 10;
        const yShift = (Math.random() - 0.5) * 10;

        // Apply temporary transform with subtle movement
        diamond.style.transform = `rotate(-45deg) translate(${xShift}px, ${yShift}px)`;

        // Reset after animation
        setTimeout(() => {
          diamond.style.transform = "rotate(-45deg)";
        }, 500);
      });
    }, 3000); // Every 3 seconds
  }

  // Start the carousel
  initCarousel();
  enhanceDiamondEffects();
});
