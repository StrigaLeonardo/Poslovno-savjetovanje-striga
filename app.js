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

      setupScrollListener();

      setupHamburgerMenu();
    });

  // Load the footer
  fetch("footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("footer").innerHTML = data;
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

      const newFontSize = Math.max(
        originalFontSize - scrollY * scaleFactor,
        0.7
      );
      title.style.fontSize = newFontSize + "em";

      if (scrollY > 0) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
        title.style.fontSize = originalFontSize + "em";
      }

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

  // Function to create the hamburger menu
  function setupHamburgerMenu() {
    const headerContainer = document.querySelector(".header-container");
    const pageNavigation = document.getElementById("page-navigation");

    if (!headerContainer || !pageNavigation) {
      return;
    }

    // Function to create the hamburger button
    function createHamburgerMenu() {
      const hamburgerMenu = document.createElement("button");
      hamburgerMenu.classList.add("hamburger-menu");
      hamburgerMenu.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#e8eaed">
          <path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"/>
        </svg>
      `;
      headerContainer.insertBefore(hamburgerMenu, pageNavigation);

      // Add click event to toggle menu visibility
      hamburgerMenu.addEventListener("click", function () {
        pageNavigation.classList.toggle("show");
      });
    }

    // Function to handle showing and hiding the hamburger menu
    function handleResize() {
      if (window.innerWidth <= 768) {
        if (!document.querySelector(".hamburger-menu")) {
          createHamburgerMenu();
        }
      } else {
        const hamburgerMenu = document.querySelector(".hamburger-menu");
        if (hamburgerMenu) {
          hamburgerMenu.remove();
          pageNavigation.classList.remove("show");
          pageNavigation.style.display = "flex";
        }
      }
    }

    // Initial check and event listener for resizing
    handleResize();
    window.addEventListener("resize", handleResize);
  }

  function isElementInViewport(el, offset = 50) {
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

  // Shake animation setup
  shakeWithDelay();

  function shakeWithDelay() {
    const shakeElement = document.querySelector(".profile-a");
    if (!shakeElement) return;

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

  // Service card dropdown description functionality
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {
    const header = card.querySelector(".service-header");

    header.addEventListener("click", function () {
      serviceCards.forEach((otherCard) => {
        if (otherCard !== card) {
          otherCard.classList.remove("open");
          const otherDescription = otherCard.querySelector(
            ".service-description"
          );
          if (otherDescription) {
            otherDescription.style.maxHeight = "0";
            otherDescription.style.opacity = "0";
            setTimeout(() => {
              otherDescription.style.display = "none";
            }, 500);
          }
        }
      });

      // Toggle the clicked card
      card.classList.toggle("open");

      // Toggle description display
      const description = card.querySelector(".service-description");
      if (description) {
        if (card.classList.contains("open")) {
          description.style.display = "block";
          setTimeout(() => {
            description.style.maxHeight = description.scrollHeight + "px";
            description.style.opacity = "1";
          }, 10);
        } else {
          description.style.maxHeight = "0";
          description.style.opacity = "0";
          setTimeout(() => {
            description.style.display = "none";
          }, 500);
        }
      }
    });
  });
});
