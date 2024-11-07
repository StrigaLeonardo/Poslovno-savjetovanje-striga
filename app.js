document.addEventListener("DOMContentLoaded", function () {
  // Load the header
  fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("header").innerHTML = data;

      // Apply border to the active link after the header is loaded
      const currentPage = window.location.pathname.split("/").pop();
      const links = document.querySelectorAll(".page-navigation a");

      links.forEach((link) => {
        if (
          !link.closest(".lang") &&
          link.getAttribute("href") === currentPage
        ) {
          link.style.borderBottom = "2px solid #cdd9e8";
        } else if (link.closest(".lang")) {
          link.style.borderBottom = "none";
        }
      });

      // Set up scroll event listener after header is loaded
      setupScrollListener();
    });

  // Load the footer
  fetch("footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("footer").innerHTML = data;
    })
    .then(() => {
      scrollToFormWrapper();
    });
});

// Function to set up scroll listener
function setupScrollListener() {
  const header = document.querySelector(".page-header");
  const title = document.querySelector(".page-title");
  const profilePhoto = document.querySelector(".profile-photo");
  const profileText = document.querySelector(".profile-text");

  const originalFontSize = 1.2;
  const scaleFactor = 0.001;

  window.addEventListener("scroll", function () {
    const scrollY = window.scrollY;

    // Scale the title font size based on scroll
    const newFontSize = Math.max(originalFontSize - scrollY * scaleFactor, 0.7);
    title.style.fontSize = newFontSize + "em";

    // Update header class based on scroll position
    if (scrollY > 0) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
      title.style.fontSize = originalFontSize + "em";
    }

    // Handle element animations with an offset
    if (
      isElementInViewport(profilePhoto, 250) &&
      !profilePhoto.classList.contains("slide-in-left")
    ) {
      profilePhoto.classList.add("slide-in-left");
      profilePhoto.style.opacity = "1";
    }

    if (
      isElementInViewport(profileText, 250) &&
      !profileText.classList.contains("slide-in-right")
    ) {
      profileText.classList.add("slide-in-right");
      profileText.style.opacity = "1";
    }
  });
}

// Function to check if an element is in the viewport with an adjustable offset
function isElementInViewport(el, offset = 50) {
  // <-- Adjust default offset (100) if desired
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight + offset ||
        document.documentElement.clientHeight + offset) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Define the shake animation
const shakeElement = document.querySelector(".profile-a");

function shakeWithDelay() {
  shakeElement.classList.add("shake-top");

  shakeElement.addEventListener(
    "animationend",
    () => {
      shakeElement.classList.remove("shake-top");
      setTimeout(shakeWithDelay, 5000);
    },
    { once: true }
  );
}

document.addEventListener("DOMContentLoaded", function () {
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // This adds a smooth scrolling effect
    });
  }

  nextBtn.addEventListener("click", scrollToTop);
  prevBtn.addEventListener("click", scrollToTop);
});

shakeWithDelay();
