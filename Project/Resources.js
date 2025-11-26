// ---------------------------
// Logout Function
// ---------------------------
function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "index.html";
}

// ---------------------------
// Highlight active navigation link
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
});

// ---------------------------
// Optional: Collapsible video sections
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".video-grid");

    sections.forEach(section => {
        const title = section.previousElementSibling;

        if (title && title.tagName === "TITLE") {
            // Replace <title> with clickable heading
            const newHeading = document.createElement("h3");
            newHeading.textContent = title.textContent;
            newHeading.classList.add("collapsible-title");

            // Insert heading
            title.replaceWith(newHeading);

            // Apply click toggle
            newHeading.addEventListener("click", () => {
                section.classList.toggle("collapsed");
            });
        }
    });
});

// ---------------------------
// Optional: Back to Top Button
// ---------------------------
const backTopBtn = document.createElement("button");
backTopBtn.innerHTML = "⬆ Back to Top";
backTopBtn.id = "backToTop";
backTopBtn.style.display = "none";
document.body.appendChild(backTopBtn);

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backTopBtn.style.display = "block";
    } else {
        backTopBtn.style.display = "none";
    }
});

backTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
