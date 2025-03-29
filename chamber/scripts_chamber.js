// Fetch and display weather information
document.addEventListener("DOMContentLoaded", () => {
    const weatherContainer = document.getElementById("weather");

    if (weatherContainer) {
        const lat = -25.8585; // Latitude for Centurion
        const lon = 28.1858; // Longitude for Centurion
        const apiKey = "1320f6e418c59e57106ae132d4aa2136";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        console.log("Fetching weather data from:", url); // Debugging log

        fetch(url)
            .then(response => {
                console.log("Response status:", response.status); // Debugging log
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(data => {
                console.log("Weather data received:", data); // Debugging log
                if (data.weather && data.main) {
                    weatherContainer.innerHTML = `
                        <p>Weather: ${data.weather[0].description}</p>
                        <p>Temperature: ${data.main.temp}°C</p>
                    `;
                } else {
                    throw new Error("Incomplete weather data");
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherContainer.innerHTML = "<p>Unable to load weather data.</p>";
            });
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
            const isGridView = memberContainer.classList.contains("grid-view");
            toggleButton.textContent = isGridView ? "Switch to Grid View" : "Switch to List View";
            memberContainer.classList.toggle("grid-view");
            memberContainer.classList.toggle("list-view");
        });
    }
});

// Fetch and display member data
async function fetchMembers() {
    try {
        const response = await fetch("members_chamber.json"); // Corrected file path
        if (!response.ok) throw new Error("Failed to fetch members data");
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
    } catch (error) {
        console.error("Error fetching members data:", error);
        const memberContainer = document.getElementById("members");
        if (memberContainer) {
            memberContainer.innerHTML = "<p>Unable to load member data.</p>";
        }
    }
}
