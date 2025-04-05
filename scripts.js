// Initial Display
document.addEventListener("DOMContentLoaded", () => {
    displayCourses(courses);
});

// Example: Dynamically load events
document.addEventListener("DOMContentLoaded", () => {
    const eventsSection = document.getElementById("events");
    if (eventsSection) {
        const events = [
            { name: "Business Networking Breakfast", date: "March 15" },
            { name: "Annual Gala", date: "April 20" },
            { name: "Small Business Expo", date: "May 10" }
        ];

        const eventsList = events.map(event => `<li>${event.name} - ${event.date}</li>`).join("");
        eventsSection.innerHTML += `<ul>${eventsList}</ul>`;
    }
});