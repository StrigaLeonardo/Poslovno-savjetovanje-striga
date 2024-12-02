// login.js

import { firebaseConfig } from "./firebaseConfig.js";
import {
  initializeApp,
  getApps,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Firebase
  let app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  const auth = getAuth(app);

  // DOM Elements
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");

  // Handle Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The auth state observer in dashboard.js will handle the rest
    } catch (error) {
      console.error("Login failed:", error.message);
      errorMessage.textContent = error.message;
      errorMessage.style.display = "block";
    }
  });
});
