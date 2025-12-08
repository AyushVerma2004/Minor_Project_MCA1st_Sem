// ----------------------------------------------------
// FIREBASE IMPORTS
// ----------------------------------------------------
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

// ----------------------------------------------------
// FIREBASE CONFIG
// ----------------------------------------------------
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

// Google Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

// ----------------------------------------------------
// SIGNUP
// ----------------------------------------------------
export async function signup(name, email, mobile, password) {
  try {
    if (!name || !email || !mobile || !password)
      throw new Error("All fields are required");

    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      mobile,
      authType: "email",
      createdAt: new Date()
    });

    alert("Signup Successful!");
    window.location.href = "login.html";

  } catch (error) {
    console.error("Signup Error:", error);

    if (error.code === "auth/email-already-in-use")
      alert("This email is already registered!");
    else if (error.code === "auth/invalid-email")
      alert("Invalid email format.");
    else if (error.code === "auth/weak-password")
      alert("Password must be 6+ characters.");
    else
      alert(error.message);
  }
}

// ----------------------------------------------------
// LOGIN
// ----------------------------------------------------

// Change: Exported function is now a global function
window.login = async function (event) {
  event?.preventDefault();

  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();

  if (!email || !password) return alert("Please fill all fields.");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful!");
    window.location.href = "homepage.html";
  } catch (error) {
    console.error("Login Error:", error);
    // Added a better user-facing error message for common issues
    if (error.code === "auth/invalid-credential") {
        alert("Login Failed: Invalid email or password.");
    } else {
        alert("Login Failed: " + error.message);
    }
  }
}

// ----------------------------------------------------
// GOOGLE LOGIN
// ----------------------------------------------------
window.googleLogin = async function () {
    const btn = document.querySelector(".google-btn");
    
    
    if (btn) {
        btn.disabled = true;
        btn.style.opacity = "0.6";
    }

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user; // Get the authenticated user object
        
        
        await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            googleAuth: true,
            lastLogin: new Date()
        }, { merge: true });

       
        alert(`Welcome ${user.displayName}!`);
        
        
        window.location.href = "homepage.html"; 
        

    } catch (error) {
        console.error("Google Login Error:", error);
        alert("Google login failed: " + error.message);

        // 6. Re-enable button on failure
        if (btn) {
            btn.disabled = false;
            btn.style.opacity = "1";
        }
    }
};

// ----------------------------------------------------
// LOGOUT
// ----------------------------------------------------
window.logout = async function () {
  await signOut(auth);
  alert("Logged out!");
  window.location.href = "index.html"; // Redirects to index.html
};

// ...
export async function logout() { // This export is missing in firebase.js
  await signOut(auth);
  // No alert or redirect here, handled by window.logout or the module code
}

// ----------------------------------------------------
// AUTH OBSERVER
// ----------------------------------------------------
onAuthStateChanged(auth, user => {
  if (user) console.log("Logged in:", user.email);
  else console.log("Logged out");
});

// ----------------------------------------------------
// FIRESTORE FUNCTIONS
// ----------------------------------------------------
export async function saveWorkout(uid, workout) {
  const ref = await addDoc(collection(db, "users", uid, "workouts"), workout);
  return ref.id;
}

export async function saveGoal(uid, goal) {
  const ref = await addDoc(collection(db, "users", uid, "goals"), goal);
  return ref.id;
}

export async function getWorkouts(uid) {
  const qSnap = await getDocs(query(collection(db, "users", uid, "workouts")));
  return qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getGoals(uid) {
  const qSnap = await getDocs(query(collection(db, "users", uid, "goals")));
  return qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
}
