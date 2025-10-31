function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) {
    alert("No user found! Please sign up first.");
    return;
  }

  if (username === storedUser.username && password === storedUser.password) {
    localStorage.setItem("isLoggedIn", "true");
    alert("Login successful!");
    window.location.href = "quiz.html"; // go to protected page
  } else {
    alert("Invalid username or password!");
  }
}
