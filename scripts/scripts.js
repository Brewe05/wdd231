document.addEventListener("DOMContentLoaded", () => {
    displayCourses(courses);
});

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

//Footer
const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

const lastModifiedElement = document.getElementById("lastModified");
if (lastModifiedElement) {
    lastModifiedElement.textContent = "Last Update: " + document.lastModified;
}