/**
* Template Name: eStartup
* Template URL: https://bootstrapmade.com/estartup-bootstrap-landing-page-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
document.addEventListener("DOMContentLoaded", function () {
  const videoCarousel = document.getElementById("videoCarousel");
  const leftArrow = document.getElementById("carouselLeft");
  const rightArrow = document.getElementById("carouselRight");
  const videoModal = document.getElementById("videoModal");
  const videoPlayer = document.getElementById("videoPlayer");
  const modalClose = document.getElementById("modalClose");

  // Example videos (replace with your own data)
  const videos = [
    { id: "MgpaULjZOl8" },
    { id: "SNNTVD_dTxU" },
    { id: "1Gh90HUejv8" },
    { id: "RZeJTtUrhwA" },
    { id: "gCGs6t3tOCU" },
    { id: "I45WeEjqmE4" }
  ];

  // Populate the carousel
  videos.forEach(video => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="https://img.youtube.com/vi/${video.id}/0.jpg">
    `;
    card.addEventListener("click", () => {
      openVideo(video.id);
    });
    videoCarousel.appendChild(card);
  });

  // Handle left/right navigation
  let currentScroll = 0;

  function updateScroll(direction) {
    const visibleWidth = videoCarousel.offsetWidth; // Width of visible area
    const scrollableWidth = videoCarousel.scrollWidth; // Total scrollable width
    const cardWidth = videoCarousel.children[0].offsetWidth + 16; // Card width + gap

    if (direction === "right") {
      if (currentScroll >= scrollableWidth - visibleWidth) {
        // Wrap around to the first card
        currentScroll = 0;
      } else {
        // Scroll right
        currentScroll = Math.min(currentScroll + cardWidth, scrollableWidth - visibleWidth);
      }
    } else if (direction === "left") {
      if (currentScroll <= 0) {
        // Wrap around to the last card
        currentScroll = scrollableWidth - visibleWidth;
      } else {
        // Scroll left
        currentScroll = Math.max(currentScroll - cardWidth, 0);
      }
    }

    videoCarousel.scrollTo({ left: currentScroll, behavior: "smooth" });
  }

  leftArrow.addEventListener("click", () => updateScroll("left"));
  rightArrow.addEventListener("click", () => updateScroll("right"));

  // Open video in modal
  function openVideo(videoId) {
    videoModal.style.display = "flex";
    videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }

  // Close video modal
  function closeModal() {
    videoModal.style.display = "none";
    videoPlayer.src = ""; // Stop video playback
  }

  // Close modal when clicking outside of it or on the close button
  videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal || e.target === modalClose) {
      closeModal();
    }
  });

  // Close modal on Escape key press
  videoModal.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      closeModal(); // Close modal on Escape key press
    }
  });

});

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

})();