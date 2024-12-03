import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import app from "./firebaseInit.js";

const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      const loginButton = loginForm.querySelector("button[type='submit']");
      loginButton.disabled = true;
      loginButton.textContent = "Logging in...";

      // Authenticate the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Login successful:", userCredential.user);

      // Redirect to the dashboard
      window.location.href = "/dashboard.html";
    } catch (error) {
      const errorCode = error.code;

      // Handle authentication errors
      switch (errorCode) {
        case "auth/invalid-email":
          errorMessage.textContent = "Invalid email address.";
          break;
        case "auth/user-disabled":
          errorMessage.textContent = "Account is disabled.";
          break;
        case "auth/user-not-found":
          errorMessage.textContent = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage.textContent = "Incorrect password.";
          break;
        default:
          errorMessage.textContent = "An error occurred. Please try again.";
      }

      errorMessage.style.display = "block";
    } finally {
      const loginButton = loginForm.querySelector("button[type='submit']");
      loginButton.disabled = false;
      loginButton.textContent = "Login";
    }
  });
});
