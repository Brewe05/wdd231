// Fetch and display weather information
document.addEventListener("DOMContentLoaded", () => {
    const weatherContainer = document.getElementById("weather");

    if (weatherContainer) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=YourCity&appid=YourAPIKey&units=metric")
            .then(response => response.json())
            .then(data => {
                weatherContainer.innerHTML = `
                    <p>Weather: ${data.weather[0].description}</p>
                    <p>Temperature: ${data.main.temp}°C</p>
                `;
            })
            .catch(error => console.error("Error fetching weather data:", error));
    }

    // Add smooth scrolling for call-to-action buttons
    const ctaButtons = document.querySelectorAll(".cta-button");
    ctaButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = button.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Fetch and display member data
    fetchMembers();

    // Toggle between grid and list views
    const toggleButton = document.getElementById("toggle-view");
    const memberContainer = document.getElementById("members");

    if (toggleButton && memberContainer) {
        toggleButton.addEventListener("click", () => {
            memberContainer.classList.toggle("grid-view");
            memberContainer.classList.toggle("list-view");
        });
    }
});

// Fetch and display member data
async function fetchMembers() {
    const response = await fetch("members_chamber.json"); // Corrected file path
    const members = await response.json();
    const memberContainer = document.getElementById("members");

    if (memberContainer) {
        memberContainer.innerHTML = members.map(member => `
            <div class="member">
                <img src="${member.image}" alt="${member.name}">
                <h3>${member.name}</h3>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <a href="${member.website}" target="_blank">Visit Website</a>
                <p>Membership Level: ${member.membershipLevel}</p>
            </div>
        `).join("");
    }
}
