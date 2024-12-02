// dashboard.js

document.addEventListener("DOMContentLoaded", function () {
  // Firebase Configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA7lzLPNx0fk3KOa2d_h-8RjZAgOwp48Dg",
    authDomain: "striga-poslovno-savjetovanje.firebaseapp.com",
    projectId: "striga-poslovno-savjetovanje",
    storageBucket: "striga-poslovno-savjetovanje.firebasestorage.app",
    messagingSenderId: "484239240396",
    appId: "1:484239240396:web:d18c9d1005fa3e66efe669",
    measurementId: "G-MB5LJKQK07",
  };

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  // Initialize Firestore and Storage
  const db = firebase.firestore();
  const storage = firebase.storage();

  // Initialize CKEditor with Paste from Office support
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
    // Paste from Office is enabled by default
    pasteFromOffice: {
      // Optional customization
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
  // const contentInput = document.querySelector("#editor"); // CKEditor handles this

  const previewTitle = document.getElementById("preview-title");
  const previewDescription = document.getElementById("preview-description");
  const previewDate = document.getElementById("preview-date");
  const previewImage = document.getElementById("preview-image");
  // const previewContent = document.getElementById("preview-content"); // Optional

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

        // Convert Date to Firestore Timestamp
        const date = new Date(dateInputValue);

        // Disable Submit Button to Prevent Multiple Submissions
        const submitButton = document.querySelector(".send-button");
        submitButton.disabled = true;
        submitButton.textContent = "Publishing...";

        // Generate a unique filename to avoid collisions
        const uniqueFileName = `${Date.now()}_${imageFile.name}`;

        // Upload Image to Firebase Storage (use blog-images)
        const imageRef = storage.ref(`blog-images/${uniqueFileName}`);
        const uploadTaskSnapshot = await imageRef.put(imageFile);

        // Get Image Download URL
        const imageUrl = await uploadTaskSnapshot.ref.getDownloadURL();

        // Add Document to Firestore
        await db.collection("blogs").add({
          title: title,
          description: description,
          date: firebase.firestore.Timestamp.fromDate(date),
          image: `blog-images/${uniqueFileName}`, // Storage Path
          imageUrl: imageUrl, // Store the download URL
          content: sanitizedContent, // Store sanitized HTML content
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
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
        document.getElementById("submission-error").classList.add("show");
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
});
