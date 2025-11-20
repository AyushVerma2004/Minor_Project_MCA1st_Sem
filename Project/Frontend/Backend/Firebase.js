// Firebase.js (type="module")

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
  storageBucket: "your-fitness-buddy-5b325.appspot.com",
  messagingSenderId: "773971869699",
  appId: "1:773971869699:web:2cbf98250a163f16d1ce36",
  measurementId: "G-86R010QDXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();


// ------------------------
// SIGN UP (Signin.html)
// ------------------------
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
    window.location.href = "Survey.html";

  } catch (error) {
    alert("Signup Failed: " + error.message);
  }
};


// ------------------------
// LOGIN (login.html)
// ------------------------
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
    window.location.href = "Afterlogin.html";
  } catch (error) {
    alert("Login Failed: " + error.message);
  }
};


// ------------------------
// GOOGLE LOGIN (Both pages)
// ------------------------
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
    window.location.href = "Afterlogin.html";

  } catch (error) {
    alert("Google Sign-in Failed: " + error.message);
  }
};
