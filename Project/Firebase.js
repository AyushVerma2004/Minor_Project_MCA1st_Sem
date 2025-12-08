// firebase.js (type="module")

// ---------------- FIREBASE IMPORTS ----------------
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

// ---------------- INITIALIZE FIREBASE ----------------
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();


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
    alert("Signup Failed: " + error.message);
  }
};


// ----------------------------------------------------
//                  LOGIN FUNCTION
// ----------------------------------------------------
window.login = async function () {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please enter email and password!");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful!");
    window.location.href = "index.html";   
  } catch (error) {
    alert("Login Failed: " + error.code + " - " + error.message);
  }
};


// ----------------------------------------------------
//                 GOOGLE LOGIN (Both pages)
// ----------------------------------------------------
window.googleLogin = async function () {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await setDoc(
      doc(db, "users", user.uid),
      {
        name: user.displayName,
        email: user.email,
        googleAuth: true,
        createdAt: new Date()
      },
      { merge: true }
    );

    alert("Welcome " + user.displayName + "!");
    window.location.href = "index.html"; // Redirect after success

  } catch (error) {
    alert("Google Sign-in Failed: " + error.message);
  }
};
