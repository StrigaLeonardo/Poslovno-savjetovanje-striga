const cardsPerPage = 9;
let currentPage = 1;
let blogs = [];

// Store the last visited page in localStorage
const storedPage = localStorage.getItem("currentPage");
if (storedPage) {
  currentPage = parseInt(storedPage);
}

// Fetch blogs and handle different sections
fetch("blogs.json")
  .then((response) => response.json())
  .then((data) => {
    blogs = data;

    if (document.getElementById("card-container")) {
      // Render cards for the main page
      renderCards();
      createPagination();
    }

    if (document.getElementById("latest-blog-container")) {
      // Render the first three blogs on the homepage
      renderFirstThreeBlogs();

      // Handle scrolling after the section is loaded
      handleScrollToSection();
    }

    if (document.querySelector(".blog-container")) {
      // Render the single blog post
      loadSingleBlog();
    }
  })
  .catch((error) => console.error("Error fetching data:", error));

// Function to render the first three blogs
function renderFirstThreeBlogs() {
  const latestBlogsContainer = document.getElementById("latest-blog-container");
  latestBlogsContainer.innerHTML = "";

  const firstThreeBlogs = blogs.slice(0, 3);

  firstThreeBlogs.forEach((blog) => {
    const card = document.createElement("div");
    card.className = "custom-post";
    card.innerHTML = `
      <a href="single-blog.html?id=${blog.id}" class="card-link" onclick="setOrigin('homepage')">
        <div class="custom-header-post">
          <img src="${blog.image}" alt="${blog.title}">
        </div>
        <div class="custom-body-post">
          <div class="custom-post-content">
            <h1 class="roboto-light">${blog.title}</h1>
            <p class="roboto-light">${blog.description}</p>
            <div class="custom-container-infos">
              <div class="custom-posted-by">
                <span>datum</span>
                ${blog.date}
              </div>
            </div>
          </div>
        </div>
      </a>
    `;
    latestBlogsContainer.appendChild(card);
  });
}

// Function to render all blog cards for the main blog page
function renderCards() {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = ""; // Clear previous cards

  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = Math.min(startIndex + cardsPerPage, blogs.length);

  for (let i = startIndex; i < endIndex; i++) {
    const item = blogs[i];
    const card = document.createElement("div");
    card.className = "custom-post";
    card.innerHTML = `
      <a href="single-blog.html?id=${item.id}" class="card-link" onclick="setOrigin('blog-archive')">
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

// Function to create pagination
function createPagination() {
  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.className = "pagination";
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(blogs.length / cardsPerPage);

  // Previous button
  const prev = document.createElement("a");
  prev.className = "pagination-newer";
  prev.textContent = "PRETHODNA";
  prev.href = "#";
  prev.addEventListener("click", function (event) {
    event.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      localStorage.setItem("currentPage", currentPage);
      renderCards();
      updatePaginationHighlight();
      scrollToTop();
    }
  });
  paginationContainer.appendChild(prev);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const page = document.createElement("a");
    page.className = "page-number";
    page.textContent = i;
    page.setAttribute("data-page", i);
    page.href = "#";

    if (i === currentPage) {
      page.classList.add("pagination-active");
    }

    page.addEventListener("click", function (event) {
      event.preventDefault();
      currentPage = parseInt(this.getAttribute("data-page"));
      localStorage.setItem("currentPage", currentPage);
      renderCards();
      updatePaginationHighlight();
      scrollToTop();
    });

    paginationContainer.appendChild(page);
  }

  // Next button
  const next = document.createElement("a");
  next.className = "pagination-older";
  next.textContent = "SLJEDEĆA";
  next.href = "#";
  next.addEventListener("click", function (event) {
    event.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      localStorage.setItem("currentPage", currentPage);
      renderCards();
      updatePaginationHighlight();
      scrollToTop();
    }
  });
  paginationContainer.appendChild(next);

  updatePaginationHighlight();
}

function updatePaginationHighlight() {
  const pageNumbers = document.querySelectorAll(".page-number");

  pageNumbers.forEach((page) => {
    if (parseInt(page.getAttribute("data-page")) === currentPage) {
      page.classList.add("pagination-active");
    } else {
      page.classList.remove("pagination-active");
    }
  });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Function to load a single blog post
function loadSingleBlog() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = parseInt(urlParams.get("id"), 10);

  const blog = blogs.find((item) => item.id === postId);

  if (blog) {
    renderSingleBlog(blog);
  } else {
    document.querySelector(".blog-container").innerHTML = `
      <p class="error-message">Blog not found. Please go back to the homepage or blog archive.</p>
    `;
  }
}

// Function to render a single blog post
function renderSingleBlog(blog) {
  const blogContainer = document.querySelector(".blog-container");
  blogContainer.innerHTML = `
    <div class="blog-post">
      <div class="blog-info">
        <div class="blogger-image-container">
          <img src="photos/tajana-blog.jpg" alt="Blogger Image" class="blogger-image" />
        </div>
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
          ${blog.content}
        </div>
      </div>
    </div>
    <div class="return-button-container">
      <button class="return-button roboto-medium" onclick="goBack()">Nazad</button>
    </div>
  `;
}

// Function to set the origin in localStorage
window.setOrigin = function (origin) {
  localStorage.setItem("originPage", origin);
};

// Function to handle the "Nazad" button click
window.goBack = function () {
  const origin = localStorage.getItem("originPage");
  if (origin === "homepage") {
    localStorage.setItem("scrollToSection", "latest-blogs");
    window.location.href = "index.html";
  } else if (origin === "blog-archive") {
    window.location.href = "blog-archive.html";
  } else {
    window.history.back();
  }
};

// Function to handle scrolling after the section is loaded
function handleScrollToSection() {
  const scrollToSection = localStorage.getItem("scrollToSection");
  if (scrollToSection === "latest-blogs") {
    localStorage.removeItem("scrollToSection");

    const section = document.getElementById(scrollToSection);
    if (section) {
      setTimeout(() => {
        const sectionPosition =
          section.getBoundingClientRect().top + window.scrollY;
        const offset = window.innerHeight / 2 - section.offsetHeight / 2;
        window.scrollTo({
          top: sectionPosition - offset,
          behavior: "smooth",
        });
      }, 100);
    }
  }
}
