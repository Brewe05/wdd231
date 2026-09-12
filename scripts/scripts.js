document.addEventListener("DOMContentLoaded", () => {
    displayCourses(courses);
});

function toggleMenu() {
    const navMenu = document.getElementById("nav-menu");
    if (!navMenu) return;
        navMenu.classList.toggle("active");
}

document.addEventListener("click", (e) => {
    const navMenu = document.getElementById("nav-menu");
    const menuIcon = document.querySelector(".menu-icon");
    if (!navMenu || !menuIcon) return;
        if (menuIcon.contains(e.target)) return;
        if (!navMenu.contains(e.target) && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
    }
});

window.addEventListener("resize", () => {
    const navMenu = document.getElementById("nav-menu");
    if (!navMenu) return;
    if (window.innerWidth >= 768 && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");

    }
});