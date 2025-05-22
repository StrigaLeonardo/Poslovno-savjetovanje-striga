// Import Firebase modules and initialized app
import app from "./firebaseInit.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

const cardsPerPage = 9;
let currentPage = 1;
let blogs = [];

// Store the last visited page in localStorage
const storedPage = localStorage.getItem("currentPage");
if (storedPage) {
  currentPage = parseInt(storedPage);
}

// Preloader control functions

/**
 * Ensures the preloader exists on the page.
 * If it doesn't exist, inject it with the necessary HTML structure.
 */
function ensurePreloaderExists() {
  let preloader = document.getElementById("preloader");
  if (!preloader) {
    console.log("Preloader not found. Injecting preloader.");
    preloader = document.createElement("div");
    preloader.id = "preloader";

    // Add spinner div
    preloader.innerHTML = `
      <div class="loader" aria-label="Loading"></div>
    `;

    // Add ARIA attributes for accessibility
    preloader.setAttribute("role", "alert");
    preloader.setAttribute("aria-live", "assertive");
    preloader.setAttribute("aria-label", "Loading content, please wait.");

    // Append preloader to body as the first child
    document.body.prepend(preloader);
    console.log("Preloader injected into DOM.");
  } else {
    console.log("Preloader already exists.");
  }
}

/**
 * Shows the preloader and disables scrolling.
 */
function showPreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.display = "flex"; // Make preloader visible
    document.body.style.overflow = "hidden"; // Disable scrolling
    console.log("Preloader displayed and scrolling disabled.");
  } else {
    console.warn("showPreloader: Preloader element not found.");
  }
}

/**
 * Hides the preloader and re-enables scrolling.
 */
function hidePreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.add("hidden"); // Add CSS class to hide preloader
    setTimeout(() => {
      preloader.style.display = "none"; // Remove preloader from view
      document.body.style.overflow = "auto"; // Re-enable scrolling
      console.log("Preloader hidden and scrolling enabled.");
    }, 500); // Duration matches the CSS transition
  } else {
    console.warn("hidePreloader: Preloader element not found.");
  }
}

// Show blog content
function showBlogContent() {
  const blogContainer = document.querySelector(".blog-container");
  if (blogContainer) {
    blogContainer.style.display = "block";
    console.log("Blog content displayed.");
  } else {
    console.warn("Blog container element not found.");
  }
}

// Hide blog content
function hideBlogContent() {
  const blogContainer = document.querySelector(".blog-container");
  if (blogContainer) {
    blogContainer.style.display = "none";
    console.log("Blog content hidden.");
  } else {
    console.warn("Blog container element not found.");
  }
}

// Function to wait for all images in a container to load
function waitForImagesToLoad(container, callback) {
  const images = container.getElementsByTagName("img");
  let loadedImages = 0;

  if (images.length === 0) {
    console.log("No images found. Executing callback.");
    callback();
    return;
  }

  for (let img of images) {
    if (img.complete && img.naturalHeight !== 0) {
      loadedImages++;
      if (loadedImages === images.length) {
        console.log("All images already loaded. Executing callback.");
        callback();
      }
    } else {
      img.onload = img.onerror = () => {
        loadedImages++;
        console.log(`Image loaded: ${img.src}`);
        if (loadedImages === images.length) {
          console.log("All images loaded via events. Executing callback.");
          callback();
        }
      };
    }
  }
}

// Function to initialize page rendering (for blog archive, homepage, and single-blog)
function initializePage() {
  const isBlogArchive = document.getElementById("card-container") !== null;
  const isHomepage = document.getElementById("latest-blog-container") !== null;
  const isSingleBlog = document.querySelector(".blog-container") !== null;

  if (isBlogArchive) {
    // This is the blog-archive page
    showPreloader(); // Show preloader when loading blog archive
    fetchBlogs()
      .then(() => {
        renderCards();
        createPagination();
        const cardContainer = document.getElementById("card-container");
        waitForImagesToLoad(cardContainer, hidePreloader);
      })
      .catch((error) => {
        console.error("Error initializing blog archive:", error);
        hidePreloader();
      });
  } else if (isHomepage) {
    // This is the homepage
    showPreloader(); // Show preloader when loading homepage
    hideBlogContent(); // Hide content until loaded
    fetchBlogs()
      .then(() => {
        renderFirstThreeBlogs();
        handleScrollToSection();
        attachPreloaderEvents(); // Attach event listeners to blog links
        hidePreloader(); // Hide preloader after loading
        showBlogContent(); // Show content
      })
      .catch((error) => {
        console.error("Error initializing homepage:", error);
        hidePreloader();
      });
  } else if (isSingleBlog) {
    // This is the single-blog page
    console.log("Single-blog page detected.");
    ensurePreloaderExists();
    showPreloader(); // Show preloader
    hideBlogContent();
    loadSingleBlog();
  }
}

// Fetch blogs from Firestore
async function fetchBlogs() {
  try {
    const q = query(collection(db, "blogs"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    blogs = [];

    querySnapshot.docs.forEach((docSnap) => {
      const blogData = docSnap.data();
      blogData.id = docSnap.id;

      // Convert Firestore Timestamp to formatted date string
      if (blogData.date && blogData.date.toDate) {
        const options = { day: "numeric", month: "long", year: "numeric" };
        blogData.date = blogData.date
          .toDate()
          .toLocaleDateString("hr-HR", options);
      }

      // Use placeholder image initially
      blogData.imageUrl = "photos/placeholder.jpg";

      // Add the blog data to the list
      blogs.push(blogData);
    });

    // Fetch and update image URLs
    await updateImageURLs(querySnapshot.docs);
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    throw error; // Propagate the error to be handled by caller
  }
}

// Update image URLs asynchronously
async function updateImageURLs(docs) {
  const promises = docs.map(async (docSnap) => {
    const blogData = blogs.find((blog) => blog.id === docSnap.id);

    if (blogData.image && typeof blogData.image === "string") {
      const imageRef = ref(storage, blogData.image);
      try {
        const url = await getDownloadURL(imageRef);
        blogData.imageUrl = url;

        // Update the image in the DOM
        const imgElement = document.querySelector(
          `img[data-id="${blogData.id}"]`
        );
        if (imgElement) {
          imgElement.src = url;
        }
      } catch (error) {
        console.error(
          `Error fetching image URL for blog ID ${blogData.id}:`,
          error
        );
      }
    }
  });

  await Promise.all(promises); // Wait for all image URLs to be updated
}

// Function to render the first three blogs on the homepage
function renderFirstThreeBlogs() {
  const latestBlogsContainer = document.getElementById("latest-blog-container");
  latestBlogsContainer.innerHTML = "";

  const blogScrollWrapper = document.createElement("div");
  blogScrollWrapper.className = "blog-scroll-wrapper";

  const firstThreeBlogs = blogs.slice(0, 3);

  firstThreeBlogs.forEach((blog) => {
    const card = document.createElement("div");
    card.className = "custom-post blog-card"; // Add blog-card class for styling
    card.innerHTML = `
      <a href="single-blog.html?id=${blog.id}" class="card-link">
        <div class="custom-header-post">
          <img src="${blog.imageUrl}" data-id="${blog.id}" alt="${blog.title}">
        </div>
        <div class="custom-body-post">
          <div class="custom-post-content">
            <h1 class="roboto-light">${blog.title}</h1>
            <p class="roboto-light">${blog.description || ""}</p>
            <div class="custom-container-infos">
              <div class="custom-posted-by">
                <span>Datum:</span> ${blog.date}
              </div>
            </div>
          </div>
        </div>
      </a>
    `;
    blogScrollWrapper.appendChild(card);
  });

  latestBlogsContainer.appendChild(blogScrollWrapper);
}

// Function to attach preloader events on the homepage
function attachPreloaderEvents() {
  const blogLinks = document.querySelectorAll(".card-link");
  blogLinks.forEach((link) => {
    link.addEventListener("click", () => {
      showPreloader();
    });
  });

  const blogArchiveLink = document.querySelector("#blog-archive-link");
  if (blogArchiveLink) {
    blogArchiveLink.addEventListener("click", () => {
      showPreloader();
    });
  }
}

// Function to render all blog cards for the main blog archive page
function renderCards() {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = ""; // Clear previous cards

  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = Math.min(startIndex + cardsPerPage, blogs.length);

  for (let i = startIndex; i < endIndex; i++) {
    const blog = blogs[i];
    const card = document.createElement("div");
    card.className = "custom-post";
    card.innerHTML = `
      <a href="single-blog.html?id=${blog.id}" class="card-link">
        <div class="custom-header-post">
          <img src="${blog.imageUrl}" data-id="${blog.id}" alt="${
      blog.title
    }" />
        </div>
        <div class="custom-body-post">
          <div class="custom-post-content">
            <h1 class="roboto-light">${blog.title}</h1>
            <p class="roboto-light">${blog.description || ""}</p>
            <div class="custom-container-infos">
              <div class="custom-posted-by">
                <span>Datum:</span> ${blog.date}
              </div>
            </div>
          </div>
        </div>
      </a>
    `;
    cardContainer.appendChild(card);
  }

  // After rendering cards, create pagination
  createPagination();
}

// Function to load a single blog post
async function loadSingleBlog() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  console.log(`Loading single blog post with ID: ${postId}`);

  if (!postId) {
    const blogContainer = document.querySelector(".blog-container");
    blogContainer.innerHTML = `<p class="error-message">Invalid blog ID.</p>`;
    hidePreloader();
    showBlogContent(); // Show content even if there's an error
    return;
  }

  try {
    const blogDoc = await getDoc(doc(db, "blogs", postId));
    if (!blogDoc.exists()) {
      const blogContainer = document.querySelector(".blog-container");
      blogContainer.innerHTML = `<p class="error-message">Blog post not found.</p>`;
      hidePreloader();
      showBlogContent(); // Show content even if there's an error
      return;
    }

    const blogData = blogDoc.data();
    if (blogData.date && blogData.date.toDate) {
      const options = { day: "numeric", month: "long", year: "numeric" };
      blogData.date = blogData.date
        .toDate()
        .toLocaleDateString("hr-HR", options);
    }

    if (blogData.image && typeof blogData.image === "string") {
      try {
        const imageRef = ref(storage, blogData.image);
        blogData.imageUrl = await getDownloadURL(imageRef);
      } catch {
        blogData.imageUrl = "photos/placeholder.jpg";
      }
    } else {
      blogData.imageUrl = "photos/placeholder.jpg";
    }

    renderSingleBlog(blogData);

    // Wait for images to load before hiding the preloader and showing content
    const blogContainer = document.querySelector(".blog-container");
    waitForImagesToLoad(blogContainer, () => {
      // Add a delay before hiding the preloader
      setTimeout(() => {
        hidePreloader();
        showBlogContent();
      }, 1000);
    });
  } catch (error) {
    console.error("Error loading blog post:", error);
    const blogContainer = document.querySelector(".blog-container");
    blogContainer.innerHTML = `<p class="error-message">Error loading blog post.</p>`;
    hidePreloader();
    showBlogContent(); // Show content even if there's an error
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
          ${blog.content || ""}
        </div>
      </div>
    </div>
    <div class="return-button-container">
      <button id="go-back-button" class="return-button roboto-medium">Nazad</button>
    </div>
  `;

  // Attach event listener to the Go Back button
  const goBackButton = document.getElementById("go-back-button");
  if (goBackButton) {
    goBackButton.addEventListener("click", goBack);
  }
}

// Function to go back
function goBack() {
  if (document.referrer) {
    // Navigate back if there's a referrer
    window.history.back();
  } else {
    // Redirect to a default page if no referrer
    window.location.href = "index.html";
  }
}

// === Pagination Logic Integration ===

// Function to create pagination
function createPagination() {
  const paginationContainer = document.getElementById("pagination-container");
  if (!paginationContainer) {
    console.warn("Pagination container element not found.");
    return;
  }

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

// Function to update pagination highlight
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

// Function to scroll to top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// === End of Pagination Logic Integration ===

// Helpers (for homepage)
function handleScrollToSection() {
  const scrollToSection = localStorage.getItem("scrollToSection");
  if (scrollToSection) {
    const waitForElement = (selector, callback) => {
      const element = document.getElementById(selector);
      if (element) {
        callback(element);
      } else {
        // Retry after a short delay if the element is not yet available
        setTimeout(() => waitForElement(selector, callback), 100);
      }
    };

    waitForElement(scrollToSection, (targetElement) => {
      targetElement.scrollIntoView({ behavior: "smooth" });
      localStorage.removeItem("scrollToSection");
    });
  }
}

// Initialize the page after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializePage);
