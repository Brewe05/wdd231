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
});
