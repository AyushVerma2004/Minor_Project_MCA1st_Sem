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

// ---------------- SIGN UP ----------------
export async function signup(name, email, mobile, password) {
  if (!name || !email || !mobile || !password) throw new Error("All fields are required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email format");
  if (password.length < 6) throw new Error("Password must be at least 6 characters");

  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;

  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    mobile,
    createdAt: new Date(),
    authType: "email"
  });

  return user;
}

// ---------------- LOGIN ----------------
export async function login(email, password) {
  if (!email || !password) throw new Error("Email and password are required");

  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

// ---------------- GOOGLE LOGIN ----------------
export async function googleLogin() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  await setDoc(doc(db, "users", user.uid), {
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL || null,
    googleAuth: true,
    lastLogin: new Date()
  }, { merge: true });

  return user;
}

// ---------------- LOGOUT ----------------
export async function logout() {
  await signOut(auth);
}

// ---------------- AUTH STATE ----------------
export function checkAuthStatus(callback) {
  onAuthStateChanged(auth, user => {
    callback(user);
  });
}

// ---------------- CURRENT USER ----------------
export function getCurrentUser() {
  return auth.currentUser;
}

// ---------------- FIRESTORE WORKOUTS & GOALS ----------------
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

// ---------------- AUTH OBSERVER ----------------
checkAuthStatus(user => {
  if (user) console.log("User signed in:", user.email);
  else console.log("No user signed in");
});
