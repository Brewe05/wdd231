document.addEventListener("DOMContentLoaded", () => {
    // Trigger animations for membership cards and join form
    const joinForm = document.getElementById("join-form");
    const membershipCards = document.querySelectorAll(".card");

    if (joinForm) {
        joinForm.style.animationPlayState = "running"; // Start join form animation
    }

    membershipCards.forEach((card, index) => {
        card.style.animationPlayState = "running"; // Start card animations
    });

    // Populate the hidden timestamp field
    const timestampField = document.getElementById("timestamp");
    if (timestampField) {
        const now = new Date();
        timestampField.value = now.toISOString();
    }

    // Populate thank you page with form data
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById("first-name").textContent = urlParams.get("first-name");
    document.getElementById("last-name").textContent = urlParams.get("last-name");
    document.getElementById("email").textContent = urlParams.get("email");
    document.getElementById("phone").textContent = urlParams.get("mobile-phone");
    document.getElementById("organization").textContent = urlParams.get("organization");
    document.getElementById("timestamp").textContent = urlParams.get("timestamp");
});
