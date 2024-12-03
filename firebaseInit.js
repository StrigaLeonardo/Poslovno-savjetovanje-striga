import {
  initializeApp,
  getApps,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { firebaseConfig } from "./firebaseConfig.js";

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

console.log("Firebase Initialized with Config:", app.options);

export default app;
