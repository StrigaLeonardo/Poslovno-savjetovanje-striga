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

      // Adjust main padding after header is loaded
      adjustMainPadding();

      // Add dropdown behavior for the USLUGE link
      setupUslugeDropdown();
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
  function adjustContentOffset() {
    const header = document.querySelector(".page-header");
    const agrobiznis = document.querySelector(".agrobiznis-wrapper");
    if (!header || !agrobiznis) return;

    const headerHeight = header.offsetHeight;
    agrobiznis.style.paddingTop = headerHeight + "px";
  }

  // Call on load, resize, and scroll (because header height changes on scroll)
  window.addEventListener("load", adjustContentOffset);
  window.addEventListener("resize", adjustContentOffset);
  window.addEventListener("scroll", adjustContentOffset);
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
        <svg class="hamburger-icon" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#e8eaed">
          <path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"/>
        </svg>
        <svg class="close-icon hidden" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#e8eaed">
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
        </svg>
      `;
      headerContainer.insertBefore(hamburgerMenu, pageNavigation);

      // Add click event to toggle menu visibility and icon
      hamburgerMenu.addEventListener("click", function () {
        pageNavigation.classList.toggle("show");

        // Toggle icon
        const hamburgerIcon = hamburgerMenu.querySelector(".hamburger-icon");
        const closeIcon = hamburgerMenu.querySelector(".close-icon");
        if (pageNavigation.classList.contains("show")) {
          hamburgerIcon.classList.add("hidden");
          closeIcon.classList.remove("hidden");
          pageNavigation.style.maxHeight = `${pageNavigation.scrollHeight}px`;
          pageNavigation.style.opacity = "1";
        } else {
          hamburgerIcon.classList.remove("hidden");
          closeIcon.classList.add("hidden");
          pageNavigation.style.maxHeight = "0";
          pageNavigation.style.opacity = "0";
        }
      });
    }

    // Function to handle showing and hiding the hamburger menu
    function handleResize() {
      if (window.innerWidth <= 768) {
        if (!document.querySelector(".hamburger-menu")) {
          createHamburgerMenu();
        }
        pageNavigation.style.maxHeight = "0";
        pageNavigation.style.opacity = "0";
      } else {
        const hamburgerMenu = document.querySelector(".hamburger-menu");
        if (hamburgerMenu) {
          hamburgerMenu.remove();
          pageNavigation.classList.remove("show");
          pageNavigation.style.display = "flex";
          pageNavigation.style.maxHeight = "";
          pageNavigation.style.opacity = "";
        }
      }
    }

    // Initial check and event listener for resizing
    handleResize();
    window.addEventListener("resize", handleResize);
  }

  // Function to adjust the padding of the main element dynamically
  function adjustMainPadding() {
    const header = document.querySelector(".page-header");
    const mainContent = document.querySelector("main");

    function setMainPadding() {
      if (header && mainContent) {
        const headerHeight = header.offsetHeight;
        mainContent.style.paddingTop = `${headerHeight}px`;
      }
    }

    // Adjust padding on load
    setMainPadding();

    // Adjust padding on window resize
    window.addEventListener("resize", setMainPadding);
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

  // Function to handle USLUGE dropdown link behavior
  function setupUslugeDropdown() {
    const uslugeLink = document.querySelector(".dropdown > a");
    const dropdownContent = document.querySelector(".dropdown-content");

    let clickTimer = null;

    // Add a click event to the USLUGE link
    uslugeLink.addEventListener("click", function (event) {
      event.preventDefault();

      if (
        dropdownContent.style.maxHeight &&
        dropdownContent.style.maxHeight !== "0px"
      ) {
        dropdownContent.style.maxHeight = "0";
        dropdownContent.style.opacity = "0";
      } else {
        dropdownContent.style.maxHeight = "600px";
        dropdownContent.style.opacity = "1";
      }

      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }

      clickTimer = setTimeout(() => {
        clickTimer = null;
      }, 300);
    });

    uslugeLink.addEventListener("dblclick", function () {
      window.location.href = "usluge.html";
    });
  }

  document.querySelectorAll(".service-card-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const card = this.querySelector(".service-card");
      card.classList.toggle("expanded");
    });
  });
});
