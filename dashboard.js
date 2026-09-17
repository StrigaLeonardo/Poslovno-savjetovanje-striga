import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
  getDocs,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import app from "./firebaseInit.js";

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("login-modal");
  const dashboardContent = document.getElementById("dashboard-content");
  const blogPreviewWrapper = document.querySelector(".blog-preview-wrapper");
  const logoutButton = document.getElementById("logout-button");
  const logoutButtonWrapper = document.querySelector(".button");
  const footer = document.querySelector("footer");
  const appMenu = document.querySelector(".app-menu");
  const blogTableSection = document.getElementById("blog-table-section");
  const backToMenuTable = document.getElementById("back-to-menu-table");

  // Initial state
  appMenu.style.display = "none";
  footer.style.display = "none";
  loginModal.style.display = "flex";
  dashboardContent.style.display = "none";
  blogPreviewWrapper.style.display = "none";
  logoutButtonWrapper.style.display = "none";
  if (blogTableSection) blogTableSection.style.display = "none";

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        console.log("User document data:", userDoc.data());
        if (userDoc.exists() && userDoc.data().isAdmin) {
          loginModal.style.display = "none";
          logoutButtonWrapper.style.display = "flex";
          footer.style.display = "block";
          appMenu.style.display = "block";
          initializeDashboard();
        } else {
          throw new Error("Unauthorized access: User is not an admin.");
        }
      } catch (error) {
        console.error("Authorization error:", error.message);
        alert("Unauthorized access. Please contact an administrator.");
        await signOut(auth);
        resetToLogin();
      }
    } else {
      resetToLogin();
    }
  });

  // Logout handler
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try {
        await signOut(auth);
        alert("You have been logged out successfully.");
        resetToLogin();
      } catch (error) {
        console.error("Logout failed:", error);
        alert("An error occurred while logging out. Please try again.");
      }
    });
  }

  // Reset to login state
  function resetToLogin() {
    loginModal.style.display = "flex";
    dashboardContent.style.display = "none";
    blogPreviewWrapper.style.display = "none";
    logoutButtonWrapper.style.display = "none";
    appMenu.style.display = "none";
    if (blogTableSection) blogTableSection.style.display = "none";
    footer.style.display = "none";
  }

  // Initialize Dashboard Functions
  function initializeDashboard() {
    // Initialize CKEditor
    ClassicEditor.create(document.querySelector("#editor"), {
      toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "link",
        "bulletedList",
        "numberedList",
        "blockQuote",
        "|",
        "insertTable",
        "mediaEmbed",
        "undo",
        "redo",
      ],
      table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
      },
      mediaEmbed: {
        previewsInData: true,
      },
    })
      .then((editor) => {
        window.editor = editor;
      })
      .catch((error) => {
        console.error("Error initializing CKEditor:", error);
      });

    const appMenu = document.querySelector(".app-menu");
    const appMenuCards = document.querySelectorAll(".app-menu-card");
    const dashboardWrapper = document.querySelector(".dashboard-wrapper");

    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const dateInput = document.getElementById("date");
    const imageInput = document.getElementById("image");

    const previewTitle = document.getElementById("preview-title");
    const previewDescription = document.getElementById("preview-description");
    const previewDate = document.getElementById("preview-date");
    const previewImage = document.getElementById("preview-image");

    // Track menu state
    let isMenuVisible = true;

    // App menu card listeners
    appMenuCards.forEach((card) => {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        if (isMenuVisible) {
          appMenu.style.display = "none";

          // Check which card was clicked
          if (card.dataset.view === "blog-table") {
            if (blogTableSection) {
              blogTableSection.style.display = "block";
              dashboardWrapper.style.display = "none";
              loadBlogTable();
            }
          } else {
            // Default to editor view
            dashboardWrapper.style.display = "flex";
            dashboardContent.style.display = "block";
            blogPreviewWrapper.style.display = "block";
          }

          isMenuVisible = false;

          // Guard pushState to avoid duplicates
          if (!history.state || history.state.view !== "dashboard") {
            history.pushState({ view: "dashboard" }, "", window.location.href);
          }
        }
      });
    });

    // Back to menu from table
    if (backToMenuTable) {
      backToMenuTable.addEventListener("click", () => {
        if (blogTableSection) blogTableSection.style.display = "none";
        appMenu.style.display = "block";
        isMenuVisible = true;
      });
    }

    // Handle browser back/forward buttons
    window.addEventListener("popstate", (event) => {
      // Simplified: do not pushState here, just react to state
      if (event.state?.view === "dashboard") {
        appMenu.style.display = "none";

        dashboardWrapper.style.display = "flex";
        dashboardContent.style.display = "block";
        blogPreviewWrapper.style.display = "block";
        if (blogTableSection) blogTableSection.style.display = "none";
        isMenuVisible = false;
      } else {
        // Default: show menu
        appMenu.style.display = "block";
        dashboardWrapper.style.display = "none";
        if (blogTableSection) blogTableSection.style.display = "none";
        isMenuVisible = true;
      }
    });

    // Update title in preview
    titleInput.addEventListener("input", () => {
      previewTitle.textContent = titleInput.value || "Blog Title";
    });

    // Update description in preview
    descriptionInput.addEventListener("input", () => {
      previewDescription.textContent =
        descriptionInput.value || "Blog description will appear here.";
    });

    // Update date in preview
    dateInput.addEventListener("input", () => {
      const dateValue = dateInput.value
        ? new Date(dateInput.value).toLocaleDateString("hr-HR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "No date selected";
      previewDate.textContent = dateValue;
    });

    // Update image in preview
    imageInput.addEventListener("change", () => {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          previewImage.src = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        previewImage.src = "placeholder.jpg";
      }
    });

    // Handle form submission
    document
      .getElementById("blog-post-form")
      .addEventListener("submit", async function (e) {
        e.preventDefault();

        try {
          // Get Form Values
          const title = titleInput.value.trim();
          const description = descriptionInput.value.trim();
          const dateInputValue = dateInput.value;
          const imageFile = imageInput.files[0];
          const rawContent = window.editor.getData().trim();
          const sanitizedContent = DOMPurify.sanitize(rawContent, {
            ADD_TAGS: ["iframe"],
            ADD_ATTR: [
              "allow",
              "allowfullscreen",
              "frameborder",
              "scrolling",
              "src",
              "width",
              "height",
            ],
          });

          // Validate Fields
          if (
            !title ||
            !description ||
            !dateInputValue ||
            !imageFile ||
            !sanitizedContent
          ) {
            alert("Please fill in all fields.");
            return;
          }

          // Convert Date to Timestamp
          const date = new Date(dateInputValue);

          // Disable Submit Button
          const submitButton = document.querySelector(".send-button");
          submitButton.disabled = true;
          submitButton.textContent = "Publishing...";

          // Generate unique filename
          const uniqueFileName = `${Date.now()}_${imageFile.name}`;

          // Upload Image to Firebase Storage
          const imageStorageRef = storageRef(
            storage,
            `blog-images/${uniqueFileName}`,
          );
          await uploadBytes(imageStorageRef, imageFile);

          // Get Image Download URL
          const imageUrl = await getDownloadURL(imageStorageRef);

          // Add Document to Firestore
          await addDoc(collection(db, "blogs"), {
            title: title,
            description: description,
            date: Timestamp.fromDate(date),
            image: `blog-images/${uniqueFileName}`,
            imageUrl: imageUrl,
            content: sanitizedContent,
            createdAt: serverTimestamp(),
          });

          // Reset Form and Notify User
          document.getElementById("blog-post-form").reset();
          window.editor.setData("");
          previewTitle.textContent = "Blog Title";
          previewDescription.textContent = "Blog description will appear here.";
          previewDate.textContent = "No date selected";
          previewImage.src = "placeholder.jpg";
          alert("Blog post published successfully!");
        } catch (error) {
          console.error("Error publishing blog post:", error);
          alert(
            "An error occurred while publishing the blog post. Please try again.",
          );
        } finally {
          // Re-enable Submit Button
          const submitButton = document.querySelector(".send-button");
          submitButton.disabled = false;
          submitButton.textContent = "Publish Blog Post";
        }
      });
  }

  // Load and display blogs in table
  async function loadBlogTable() {
    const tableBody = document.getElementById("blog-table-body");
    const tableEmpty = document.getElementById("table-empty");
    const tableLoading = document.getElementById("table-loading");

    if (!tableBody || !tableEmpty || !tableLoading) return;

    tableLoading.style.display = "flex";
    tableEmpty.style.display = "none";
    tableBody.innerHTML = "";

    try {
      const blogsRef = collection(db, "blogs");
      const q = query(blogsRef, orderBy("date", "desc"));
      const snapshot = await getDocs(q);

      tableLoading.style.display = "none";

      if (snapshot.empty) {
        tableEmpty.style.display = "block";
        return;
      }

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const id = docSnap.id;

        const date = data.date?.toDate
          ? data.date.toDate().toLocaleDateString("hr-HR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "No date";

        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="blog-table-title">${data.title || "(No title)"}</td>
          <td class="blog-table-date">${date}</td>
          <td class="blog-table-desc">${
            data.description
              ? data.description.substring(0, 100) +
                (data.description.length > 100 ? "..." : "")
              : ""
          }</td>
          <td class="table-actions">
            <button class="btn-delete" data-id="${id}">Delete</button>
          </td>
        `;

        tableBody.appendChild(row);
      });

      // Add delete listeners to all buttons
      document.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const blogId = e.target.dataset.id;
          if (confirm("Delete this blog post permanently?")) {
            try {
              await deleteDoc(doc(db, "blogs", blogId));
              e.target.closest("tr").remove();
              if (tableBody.children.length === 0) {
                tableEmpty.style.display = "block";
              }
            } catch (error) {
              console.error("Delete failed:", error);
              alert("Failed to delete blog post. Please try again.");
            }
          }
        });
      });
    } catch (error) {
      console.error("Error loading blogs:", error);
      tableLoading.style.display = "none";
      tableEmpty.textContent = "Error loading blogs. Please refresh.";
      tableEmpty.style.display = "block";
    }
  }
});
