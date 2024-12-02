// dashboard.js

import { firebaseConfig } from "./firebaseConfig.js";
import {
  initializeApp,
  getApps,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Initialize Firebase
  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  // DOM Elements
  const loginModal = document.getElementById("login-modal");
  const dashboardContent = document.getElementById("dashboard-content");
  const logoutButton = document.getElementById("logout-button");

  // Show Login Modal by Default
  loginModal.style.display = "flex";

  // Auth State Observer
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data().isAdmin) {
          loginModal.style.display = "none";
          dashboardContent.style.display = "block";
          initializeDashboard(); // Initialize dashboard functions
        } else {
          throw new Error("Unauthorized access.");
        }
      } catch (error) {
        console.error("Authorization error:", error.message);
        await signOut(auth);
        loginModal.style.display = "flex";
        dashboardContent.style.display = "none";
      }
    } else {
      loginModal.style.display = "flex";
      dashboardContent.style.display = "none";
    }
  });

  // Logout Handler
  logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
      loginModal.style.display = "flex";
      dashboardContent.style.display = "none";
      console.log("Logged out.");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  });

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

    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const dateInput = document.getElementById("date");
    const imageInput = document.getElementById("image");

    const previewTitle = document.getElementById("preview-title");
    const previewDescription = document.getElementById("preview-description");
    const previewDate = document.getElementById("preview-date");
    const previewImage = document.getElementById("preview-image");

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
        e.preventDefault(); // Prevent default form submission

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

          // Disable Submit Button to Prevent Multiple Submissions
          const submitButton = document.querySelector(".send-button");
          submitButton.disabled = true;
          submitButton.textContent = "Publishing...";

          // Generate a unique filename to avoid collisions
          const uniqueFileName = `${Date.now()}_${imageFile.name}`;

          // Upload Image to Firebase Storage
          const imageStorageRef = storageRef(
            storage,
            `blog-images/${uniqueFileName}`
          );
          await uploadBytes(imageStorageRef, imageFile);

          // Get Image Download URL
          const imageUrl = await getDownloadURL(imageStorageRef);

          // Add Document to Firestore
          await addDoc(collection(db, "blogs"), {
            title: title,
            description: description,
            date: Timestamp.fromDate(date),
            image: `blog-images/${uniqueFileName}`, // Storage Path
            imageUrl: imageUrl, // Download URL
            content: sanitizedContent, // Sanitized HTML content
            createdAt: serverTimestamp(),
          });

          // Reset Form and Notify User
          document.getElementById("blog-post-form").reset();
          window.editor.setData(""); // Clear CKEditor content
          previewTitle.textContent = "Blog Title";
          previewDescription.textContent = "Blog description will appear here.";
          previewDate.textContent = "No date selected";
          previewImage.src = "placeholder.jpg";
          alert("Blog post published successfully!");
        } catch (error) {
          console.error("Error publishing blog post:", error);
          alert(
            "An error occurred while publishing the blog post. Please try again."
          );
        } finally {
          // Re-enable Submit Button
          const submitButton = document.querySelector(".send-button");
          submitButton.disabled = false;
          submitButton.textContent = "Publish Blog Post";
        }
      });
  }
});
