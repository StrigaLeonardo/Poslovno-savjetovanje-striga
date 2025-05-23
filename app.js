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

  // Function to create the hamburger menu
  function setupHamburgerMenu() {
    const headerContainer = document.querySelector(".header-container");
    const pageNavigation = document.getElementById("page-navigation");

    if (!headerContainer || !pageNavigation) return;

    // Function to create the hamburger button
    function createHamburgerMenu() {
      const hamburgerMenu = document.createElement("button");
      hamburgerMenu.classList.add("hamburger-menu");
      hamburgerMenu.setAttribute("aria-label", "Otvori navigaciju");
      hamburgerMenu.innerHTML = `
      <svg class="hamburger-icon" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#cdd9e8">
        <path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"/>
      </svg>
      <svg class="close-icon hidden" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#cdd9e8">
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
      </svg>
    `;
      headerContainer.insertBefore(hamburgerMenu, pageNavigation);

      // Toggle navigation
      hamburgerMenu.addEventListener("click", function (e) {
        e.stopPropagation();
        pageNavigation.classList.toggle("show");
        document.body.classList.toggle("mobile-nav-open");

        const hamburgerIcon = this.querySelector(".hamburger-icon");
        const closeIcon = this.querySelector(".close-icon");
        hamburgerIcon.classList.toggle("hidden");
        closeIcon.classList.toggle("hidden");
      });

      // Touch-friendly dropdowns for mobile
      pageNavigation
        .querySelectorAll(".dropdown > a")
        .forEach((dropdownLink) => {
          dropdownLink.addEventListener("click", function (e) {
            if (window.innerWidth > 768) return;
            e.preventDefault();

            const currentDropdown =
              this.parentElement.querySelector(".dropdown-content");
            const isOpen = currentDropdown.classList.contains("show");

            // Close all dropdowns first
            pageNavigation
              .querySelectorAll(".dropdown-content")
              .forEach((el) => el.classList.remove("show"));

            if (!isOpen) {
              currentDropdown.classList.add("show");
            }
          });
        });
    }

    // Handle window resize
    function handleResize() {
      if (window.innerWidth <= 768) {
        if (!document.querySelector(".hamburger-menu")) {
          createHamburgerMenu();
        }
        pageNavigation.classList.remove("show");
        document.body.classList.remove("mobile-nav-open");
      } else {
        const hamburgerMenu = document.querySelector(".hamburger-menu");
        if (hamburgerMenu) hamburgerMenu.remove();
        pageNavigation.classList.remove("show");
        document.body.classList.remove("mobile-nav-open");
        pageNavigation
          .querySelectorAll(".dropdown-content.show")
          .forEach((el) => el.classList.remove("show"));
      }
    }

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (window.innerWidth > 768) return;
      if (
        !e.target.closest(".page-navigation") &&
        !e.target.closest(".hamburger-menu")
      ) {
        pageNavigation.classList.remove("show");
        document.body.classList.remove("mobile-nav-open");

        const hamburgerMenu = document.querySelector(".hamburger-menu");
        if (hamburgerMenu) {
          hamburgerMenu
            .querySelector(".hamburger-icon")
            .classList.remove("hidden");
          hamburgerMenu.querySelector(".close-icon").classList.add("hidden");
        }

        // Close all dropdowns
        pageNavigation
          .querySelectorAll(".dropdown-content")
          .forEach((el) => el.classList.remove("show"));
      }
    });

    // Initial setup
    handleResize();
    window.addEventListener("resize", handleResize);
  }

  document.addEventListener("DOMContentLoaded", setupHamburgerMenu);

  // Call the function on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", setupHamburgerMenu);

  document.querySelectorAll(".service-card-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const card = this.querySelector(".service-card");
      card.classList.toggle("expanded");
    });
  });
  window.addEventListener("load", function () {
    document.body.style.opacity = 1;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // 1. Load the cookie banner HTML dynamically
  fetch("cookie-banner.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("cookie-banner-placeholder").innerHTML = html;

      // 2. Now that the banner exists in the DOM, select elements
      const banner = document.getElementById("cookie-consent-banner");
      const settingsModal = document.getElementById("cookie-settings");
      const consent = localStorage.getItem("cookieConsent");

      // Only show banner if no consent decision exists
      if (!consent) {
        banner.style.display = "block";
      }

      // Accept All
      document
        .getElementById("accept-cookies")
        .addEventListener("click", () => {
          localStorage.setItem(
            "cookieConsent",
            JSON.stringify({ analytics: true })
          );
          banner.style.display = "none";
          loadAnalytics();
        });

      // Reject Non-Essential
      document
        .getElementById("reject-cookies")
        .addEventListener("click", () => {
          localStorage.setItem(
            "cookieConsent",
            JSON.stringify({ analytics: false })
          );
          banner.style.display = "none";
        });

      // Open Customization
      document
        .getElementById("customize-cookies")
        .addEventListener("click", () => {
          settingsModal.style.display = "block";
        });

      // Save Preferences
      document
        .getElementById("save-preferences")
        .addEventListener("click", () => {
          const analyticsChecked =
            document.getElementById("analytics-cookies").checked;
          localStorage.setItem(
            "cookieConsent",
            JSON.stringify({ analytics: analyticsChecked })
          );
          settingsModal.style.display = "none";
          banner.style.display = "none";
          if (analyticsChecked) loadAnalytics();
        });

      // Load analytics if consent exists
      if (consent) {
        const { analytics } = JSON.parse(consent);
        if (analytics) loadAnalytics();
      }
    });
});

function loadAnalytics() {
  // Dynamically load Google Analytics script
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID";
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-MB5LJKQK07");
}
