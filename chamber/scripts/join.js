document.addEventListener("DOMContentLoaded", () => {
    const joinForm = document.getElementById("join-form");
    const membershipCards = document.querySelectorAll(".card");

    if (joinForm) {
        joinForm.style.animationPlayState = "running";
    }

    membershipCards.forEach((card, index) => {
        card.style.animationPlayState = "running";
    });

    const timestampField = document.getElementById("timestamp");
    if (timestampField) {
        const now = new Date();
        timestampField.value = now.toISOString();
    }

    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById("first-name").textContent = urlParams.get("first-name");
    document.getElementById("last-name").textContent = urlParams.get("last-name");
    document.getElementById("email").textContent = urlParams.get("email");
    document.getElementById("phone").textContent = urlParams.get("mobile-phone");
    document.getElementById("organization").textContent = urlParams.get("organization");
    document.getElementById("timestamp").textContent = urlParams.get("timestamp");
});
