document.addEventListener("DOMContentLoaded", function () {
  const galleryWrapper = document.querySelector(".gallery-wrapper");
  const prevButton = document.querySelector(".prev-button");
  const nextButton = document.querySelector(".next-button");
  const galleryItems = document.querySelectorAll(".gallery-item");

  let currentIndex = 0;
  const itemsPerView =
    window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3;
  const totalItems = galleryItems.length;

  // Set initial width based on number of items visible
  galleryItems.forEach((item) => {
    if (window.innerWidth < 768) {
      item.style.flex = "0 0 calc(100% - 20px)";
      item.style.maxWidth = "calc(100% - 20px)";
    } else if (window.innerWidth < 992) {
      item.style.flex = "0 0 calc(50% - 20px)";
      item.style.maxWidth = "calc(50% - 20px)";
    } else {
      item.style.flex = "0 0 calc(33.333% - 20px)";
      item.style.maxWidth = "calc(33.333% - 20px)";
    }
  });

  // Update function to move the gallery
  function updateGallery() {
    const itemWidth = galleryItems[0].offsetWidth + 20; // Width + margin
    galleryWrapper.style.transform = `translateX(-${
      currentIndex * itemWidth
    }px)`;

    // Enable/disable buttons based on position
    prevButton.style.opacity = currentIndex === 0 ? "0.5" : "1";
    nextButton.style.opacity =
      currentIndex >= totalItems - itemsPerView ? "0.5" : "1";
  }

  // Event listeners for navigation buttons
  prevButton.addEventListener("click", function () {
    if (currentIndex > 0) {
      currentIndex--;
      updateGallery();
    }
  });

  nextButton.addEventListener("click", function () {
    if (currentIndex < totalItems - itemsPerView) {
      currentIndex++;
      updateGallery();
    }
  });

  // Handle window resize
  window.addEventListener("resize", function () {
    const newItemsPerView =
      window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3;

    // Reset styles based on new viewport
    galleryItems.forEach((item) => {
      if (window.innerWidth < 768) {
        item.style.flex = "0 0 calc(100% - 20px)";
        item.style.maxWidth = "calc(100% - 20px)";
      } else if (window.innerWidth < 992) {
        item.style.flex = "0 0 calc(50% - 20px)";
        item.style.maxWidth = "calc(50% - 20px)";
      } else {
        item.style.flex = "0 0 calc(33.333% - 20px)";
        item.style.maxWidth = "calc(33.333% - 20px)";
      }
    });

    // Adjust current index if needed
    if (currentIndex > totalItems - newItemsPerView) {
      currentIndex = totalItems - newItemsPerView;
    }

    // Update the gallery
    updateGallery();
  });

  // Initialize gallery
  updateGallery();
});
