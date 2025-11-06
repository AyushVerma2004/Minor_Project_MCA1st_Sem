// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { 
  getFirestore, 
  setDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRKFVQanh4Q4OF22K4HqlTu_fxaxtD5Sw",
  authDomain: "your-fitness-buddy-5b325.firebaseapp.com",
  projectId: "your-fitness-buddy-5b325",
  storageBucket: "your-fitness-buddy-5b325.firebasestorage.app",
  messagingSenderId: "773971869699",
  appId: "1:773971869699:web:2cbf98250a163f16d1ce36",
  measurementId: "G-86R010QDXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// --- Sign Up with Email & Password ---
window.signup = async function () {
  const name = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const mobile = document.getElementById("mobile").value.trim();

  if (!name || !email || !password || !mobile) {
    return alert("Please fill in all fields!");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      mobile,
      createdAt: new Date()
    });

    alert("Account created successfully!");
    window.location.href = "Survey.html";
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
};

// --- Login with Email & Password ---
window.login = async function () {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    return alert("Please fill in all fields!");
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "Survey.html";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
};

// --- Google Sign-In (Shared for both pages) ---
async function googleLogin() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName,
      email: user.email,
      googleAuth: true,
      createdAt: new Date()
    }, { merge: true });

    alert(`Welcome ${user.displayName}!`);
    window.location.href = "Survey.html";
  } catch (error) {
    alert("Google Sign-in failed: " + error.message);
  }
}

// Attach Google login handler to button if it exists
const googleBtn = document.getElementById("googleLogin");
if (googleBtn) googleBtn.addEventListener("click", googleLogin);
