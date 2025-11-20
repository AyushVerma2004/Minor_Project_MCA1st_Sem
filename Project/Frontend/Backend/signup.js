function signup() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const mobile = document.getElementById("mobile").value;
  const password = document.getElementById("password").value;

  if (!username || !email || !mobile || !password) {
    alert("Please fill all fields!");
    return;
  }

  // Store user data (for demo purposes only)
  const user = { username, email, mobile, password };
  localStorage.setItem("user", JSON.stringify(user));

  alert("Signup successful! Please login now.");
  window.location.href = "index.html";
}
