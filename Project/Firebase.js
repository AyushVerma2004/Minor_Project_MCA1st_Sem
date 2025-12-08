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
  doc,
  collection,
  addDoc,
  getDocs,
  query
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

// ----------------------------------------------------
// SIGN UP
// ----------------------------------------------------
export async function signup(name, email, mobile, password) {
  try {
    if (!name || !email || !mobile || !password)
      throw new Error("All fields are required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new Error("Invalid email format");
    if (password.length < 6)
      throw new Error("Password must be at least 6 characters");

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
}

// ----------------------------------------------------
// LOGIN FUNCTION
// ----------------------------------------------------
window.login = async function (event) {
  if (event) event.preventDefault();

  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();

  if (!email || !password) {
    alert("Please enter email and password!");
    return;
  }

  let loginButton = event?.target;
  if (loginButton && loginButton.tagName !== 'BUTTON') {
    loginButton = document.querySelector('.primary-btn');
  }

  if (loginButton) {
    loginButton.disabled = true;
    loginButton.dataset.originalText = loginButton.textContent;
    loginButton.textContent = "Logging in...";
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful!");
    window.location.href = "homepage.html";

  } catch (error) {
    console.error("Login Error:", error);

    if (loginButton) {
      loginButton.disabled = false;
      loginButton.textContent = loginButton.dataset.originalText;
    }

    if (error.code === "auth/invalid-credential") {
      alert("Invalid email or password.");
    } else if (error.code === "auth/user-not-found") {
      alert("No account found with this email.");
    } else if (error.code === "auth/wrong-password") {
      alert("Incorrect password.");
    } else if (error.code === "auth/too-many-requests") {
      alert("Too many attempts. Try later.");
    } else {
      alert("Login Failed: " + error.message);
    }
  }
};

// ----------------------------------------------------
// GOOGLE LOGIN
// ----------------------------------------------------
window.googleLogin = async function () {
  const googleBtn = document.querySelector('.google-btn');

  if (googleBtn) {
    googleBtn.disabled = true;
    googleBtn.style.opacity = '0.6';
  }

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

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

    alert("Welcome " + user.displayName + "!");
    window.location.href = "homepage.html";

  } catch (error) {
    console.error("Google Login Error:", error);

    if (googleBtn) {
      googleBtn.disabled = false;
      googleBtn.style.opacity = '1';
    }

    alert("Google Login Failed: " + error.message);
  }
};

// ----------------------------------------------------
// LOGOUT
// ----------------------------------------------------
window.logout = async function () {
  try {
    await signOut(auth);
    alert("Logged out successfully!");
    window.location.href = "index.html";
  } catch (error) {
    alert("Logout Error: " + error.message);
  }
};

// ----------------------------------------------------
// CHECK AUTH STATUS
// ----------------------------------------------------
window.checkAuthStatus = function () {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, resolve);
  });
};

// ----------------------------------------------------
// CURRENT USER
// ----------------------------------------------------
export function getCurrentUser() {
  return auth.currentUser;
}

// ----------------------------------------------------
// FIRESTORE FUNCTIONS
// ----------------------------------------------------
export async function saveWorkout(userId, workout) {
  if (!userId) throw new Error("User ID required");
  const docRef = await addDoc(collection(db, "users", userId, "workouts"), workout);
  return docRef.id;
}

export async function saveGoal(userId, goal) {
  if (!userId) throw new Error("User ID required");
  const docRef = await addDoc(collection(db, "users", userId, "goals"), goal);
  return docRef.id;
}

export async function getWorkouts(userId) {
  if (!userId) throw new Error("User ID required");
  const q = query(collection(db, "users", userId, "workouts"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getGoals(userId) {
  if (!userId) throw new Error("User ID required");
  const q = query(collection(db, "users", userId, "goals"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ----------------------------------------------------
// AUTH OBSERVER
// ----------------------------------------------------
onAuthStateChanged(auth, user => {
  if (user) console.log("User signed in:", user.email);
  else console.log("No user signed in");
});
