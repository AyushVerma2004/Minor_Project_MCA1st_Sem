// firebase.js (type="module")

// ---------------- FIREBASE IMPORTS ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  getFirestore,
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// ---------------- FIREBASE CONFIG ----------------
const firebaseConfig = {
  apiKey: "AIzaSyAWCLISIOyr4nHjJ2URuqD84EWAyHXBgDM",
  authDomain: "your-fitness-buddy-login.firebaseapp.com",
  projectId: "your-fitness-buddy-login",
  storageBucket: "your-fitness-buddy-login.firebasestorage.app",
  messagingSenderId: "530314127734",
  appId: "1:530314127734:web:09c1cae200b4b030d77257",
  measurementId: "G-S5CNQJ1F77"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Force account selection every time
provider.setCustomParameters({
  prompt: 'select_account'
});


// ----------------------------------------------------
//                 SIGN UP FUNCTION
// ----------------------------------------------------
window.signup = async function () {
  const name = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password || !mobile) {
    alert("Please fill all fields!");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address!");
    return;
  }

  // Validate password length
  if (password.length < 6) {
    alert("Password must be at least 6 characters long!");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      mobile,
      createdAt: new Date(),
      authType: "email"
    });

    alert("Account Created Successfully!");
    window.location.href = "login.html";

  } catch (error) {
    console.error("Signup Error:", error);
    
    // More specific error messages
    if (error.code === "auth/email-already-in-use") {
      alert("This email is already registered. Please login instead.");
    } else if (error.code === "auth/weak-password") {
      alert("Password is too weak. Please use at least 6 characters.");
    } else if (error.code === "auth/invalid-email") {
      alert("Invalid email format.");
    } else {
      alert("Signup Failed: " + error.message);
    }
  }
};


// ----------------------------------------------------
//                  LOGIN FUNCTION
// ----------------------------------------------------
window.login = async function (event) {
  // Prevent form submission if called from a form
  if (event) {
    event.preventDefault();
  }

  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  
  if (!emailInput || !passwordInput) {
    console.error("Email or password input field not found");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please enter email and password!");
    return;
  }

  // Find the login button
  let loginButton = event?.target;
  if (loginButton && loginButton.tagName !== 'BUTTON') {
    loginButton = document.querySelector('.primary-btn');
  }

  // Disable the login button to prevent double-clicks
  if (loginButton) {
    loginButton.disabled = true;
    const originalText = loginButton.textContent;
    loginButton.textContent = "Logging in...";
    
    // Store original text for later
    loginButton.dataset.originalText = originalText;
  }

  try {
    console.log("Attempting login for:", email);
    
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful:", userCredential.user.email);
    
    alert("Login Successful!");

    
window.location.href = "homepage.html";

  } catch (error) {
    console.error("Login Error:", error);
    console.error("Error code:", error.code);
    
    // Re-enable button on error
    if (loginButton) {
      loginButton.disabled = false;
      loginButton.textContent = loginButton.dataset.originalText || "Login";
    }
    
    // Better error handling for login
    if (error.code === "auth/invalid-credential") {
      alert("Invalid email or password. Please check your credentials and try again.");
    } else if (error.code === "auth/user-not-found") {
      alert("No account found with this email. Please sign up first.");
    } else if (error.code === "auth/wrong-password") {
      alert("Incorrect password. Please try again.");
    } else if (error.code === "auth/invalid-email") {
      alert("Invalid email format.");
    } else if (error.code === "auth/too-many-requests") {
      alert("Too many failed login attempts. Please try again later or reset your password.");
    } else if (error.code === "auth/network-request-failed") {
      alert("Network error. Please check your internet connection.");
    } else {
      alert("Login Failed: " + error.message);
    }
  }
};


// ----------------------------------------------------
//                 GOOGLE LOGIN (Both pages)
// ----------------------------------------------------
window.googleLogin = async function () {
  console.log("Google login button clicked");
  
  // Disable the Google button to prevent double clicks
  const googleBtn = document.querySelector('.google-btn');
  if (googleBtn) {
    googleBtn.disabled = true;
    googleBtn.style.opacity = '0.6';
    googleBtn.style.cursor = 'not-allowed';
  }
  
  try {
    console.log("Attempting Google sign in popup...");
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log("Google sign in successful:", user.email);

    // Save user data to Firestore
    console.log("Saving user data to Firestore...");
    await setDoc(
      doc(db, "users", user.uid),
      {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL || null,
        googleAuth: true,
        lastLogin: new Date()
      },
      { merge: true }
    );

    console.log("User data saved successfully");
    alert("Welcome " + user.displayName + "!");

window.location.href = "homepage.html"; // Redirect after success


  } catch (error) {
    console.error("Google Login Error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // Re-enable button on error
    if (googleBtn) {
      googleBtn.disabled = false;
      googleBtn.style.opacity = '1';
      googleBtn.style.cursor = 'pointer';
    }
    
    // Handle Google login specific errors
    if (error.code === "auth/popup-closed-by-user") {
      alert("Login cancelled. Please try again.");
    } else if (error.code === "auth/popup-blocked") {
      alert("Popup was blocked. Please allow popups for this site and try again.");
    } else if (error.code === "auth/cancelled-popup-request") {
      console.log("Popup request cancelled - another popup may be open");
    } else if (error.code === "auth/account-exists-with-different-credential") {
      alert("An account already exists with this email using a different sign-in method.");
    } else {
      alert("Google Login Failed: " + error.message);
    }
  }
};


// ----------------------------------------------------
//                 LOGOUT FUNCTION
// ----------------------------------------------------
window.logout = async function () {
  try {
    await signOut(auth);
    alert("You have been logged out successfully!");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout Error:", error);
    alert("Error logging out: " + error.message);
  }
};


// ----------------------------------------------------
//          CHECK AUTH STATUS
// ----------------------------------------------------
window.checkAuthStatus = function () {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });
};


// ----------------------------------------------------
//     GET CURRENT USER INFO
// ----------------------------------------------------
window.getCurrentUser = function () {
  return auth.currentUser;
};


// ----------------------------------------------------
//          AUTH STATE OBSERVER (REMOVED AUTO-REDIRECT)
// ----------------------------------------------------
// Only log auth state, don't auto-redirect
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user.email);
  } else {
    console.log("No user signed in");
  }
});