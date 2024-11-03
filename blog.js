const cardsPerPage = 9;
let currentPage = 1;
let blogs = [];

// Store the last visited page in localStorage
const storedPage = localStorage.getItem("currentPage");
if (storedPage) {
  currentPage = parseInt(storedPage); // Set to stored page number if available
}

// Check if the page is the main page or single blog page
if (document.getElementById("card-container")) {
  // Code for the main page displaying cards
  fetch("blogs.json") // Changed to blogs.json
    .then((response) => response.json())
    .then((data) => {
      blogs = data; // Update to blogs
      renderCards();
      createPagination();
    })
    .catch((error) => console.error("Error fetching data:", error));

  function renderCards() {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = ""; // Clear previous cards

    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = Math.min(startIndex + cardsPerPage, blogs.length);

    for (let i = startIndex; i < endIndex; i++) {
      const item = blogs[i]; // Update to blogs
      const card = document.createElement("div");
      card.className = "custom-post";
      card.innerHTML = `
          <a href="single-blog.html?id=${i}" class="card-link"> <!-- Link to single-blog with ID -->
            <div class="custom-header-post">
              <img src="${item.image}" alt="${item.title}" />
            </div>
            <div class="custom-body-post">
              <div class="custom-post-content">
                <h1 class="roboto-light">${item.title}</h1>
                <p class="roboto-light">${item.description}</p>
                <div class="custom-container-infos">
                  <div class="custom-posted-by">
                    <span>datum</span>
                    ${item.date}
                  </div>
                </div>
              </div>
            </div>
          </a>
        `;
      cardContainer.appendChild(card);
    }
  }

  function createPagination() {
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = ""; // Clear previous pagination

    const totalPages = Math.ceil(blogs.length / cardsPerPage); // Update to blogs

    for (let i = 1; i <= totalPages; i++) {
      const page = document.createElement("span");
      page.className = "page-number";
      page.textContent = i;
      page.setAttribute("data-page", i);

      // Add click event to each page number
      page.addEventListener("click", function () {
        currentPage = i; // Update current page
        localStorage.setItem("currentPage", currentPage); // Store current page
        renderCards(); // Render cards for the current page
        updatePaginationHighlight(); // Update pagination highlight

        // Scroll to the top
        scrollToTop();
      });

      // Hover behavior for the page numbers
      page.addEventListener("mouseenter", function () {
        updateHoverBorder(this); // Move border to hovered page
      });

      page.addEventListener("mouseleave", function () {
        if (currentPage !== i) {
          updateHoverBorder(document.querySelector(`.page-number.selected`));
        } else {
          updateHoverBorder(this);
        }
      });

      paginationContainer.appendChild(page);
    }

    updatePaginationHighlight(); // Set initial highlight
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll
    });
  }

  function updatePaginationHighlight() {
    const pageNumbers = document.querySelectorAll(".page-number");

    pageNumbers.forEach((page) => {
      if (parseInt(page.getAttribute("data-page")) === currentPage) {
        page.classList.add("selected"); // Add selected class for the current page
      } else {
        page.classList.remove("selected"); // Remove it for others
      }
    });

    const selectedPage = document.querySelector(`.page-number.selected`);
    updateHoverBorder(selectedPage); // Ensure the border is on the selected page
  }

  function updateHoverBorder(page) {
    const selectedPages = document.querySelectorAll(".page-number");
    selectedPages.forEach((pg) => {
      pg.style.borderBottom = ""; // Reset border for all
    });
    if (page) {
      page.style.borderBottom = "2px solid #496b79"; // Set border for the selected or hovered page
    }
  }
} else if (document.querySelector(".blog-container")) {
  // Code for single-blog page to display the detailed post
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  fetch("blogs.json") // Changed to blogs.json
    .then((response) => response.json())
    .then((data) => {
      const blog = data[postId]; // Update to blogs
      if (blog) renderSingleBlog(blog);
    })
    .catch((error) => console.error("Error loading blog:", error));

  function renderSingleBlog(blog) {
    const blogContainer = document.querySelector(".blog-container");
    blogContainer.innerHTML = `
        <div class="blog-post">
          <div class="blog-info">
            
            <div class="blogger-details">
              <label>Autor:</label>
              <p class="roboto-medium">Tajana Štriga</p>
              <label>Datum:</label>
              <p class="roboto-light">${blog.date}</p>
              <label>Naslov:</label>
              <p class="roboto-light">${blog.title}</p>
            </div>
          </div>
          <div class="blog-content">
            <h1 class="blog-main-title roboto-light">${blog.title}</h1>
            <p class="blog-date roboto-light">${blog.date}</p>
            <div class="blog-text">
              <p>${blog.content}</p> 
            </div>
          </div>
        </div>
        <div class="return-button-container">
          <button class="return-button roboto-medium" onclick="returnToMainPage()">Nazad</button>
        </div>
      `;
  }
}

// Function to handle returning to the main page
function returnToMainPage() {
  localStorage.setItem("currentPage", currentPage); // Store the current page before navigating away
  window.location.href = "blog-archive.html"; // Navigate to the main page
}
