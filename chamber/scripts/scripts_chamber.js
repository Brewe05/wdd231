document.addEventListener("DOMContentLoaded", () => {
    const weatherContainer = document.getElementById("weather-container");

    if (weatherContainer) {
        const city = "pretoria"; // city name
        const country = "za"; //  country code
        const apiKey = "0e7a1e08a489cc95d126c49925fd5d52"; // valid API key
        const callbackName = "displayWeather"; // Callback function name
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&callback=${callbackName}&appid=${apiKey}`;

        window[callbackName] = function (data) {
            if (data.weather && data.main) {
                weatherContainer.innerHTML = `
                    <p>Weather: ${data.weather[0].description}</p>
                    <p>Temperature: ${(data.main.temp - 273.15).toFixed(2)}°C</p> <!-- Convert Kelvin to Celsius -->
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                `;
            } else {
                weatherContainer.innerHTML = "<p>Unable to load weather data.</p>";
            }
        };

        const script = document.createElement("script");
        script.src = url;
        script.onerror = () => {
            console.error("Error loading weather data.");
            weatherContainer.innerHTML = "<p>Unable to load weather data.</p>";
        };
        document.body.appendChild(script);
    }

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

    fetchMembers();

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

async function fetchMembers() {
    try {
        const response = await fetch("members_chamber.json");
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
                    <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a>
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

async function fetchFeaturedMembers() {
    try {
        const response = await fetch("members_chamber.json");
        if (!response.ok) throw new Error("Failed to fetch members data");
        const members = await response.json();
        const featuredContainer = document.getElementById("featured-members-container");

        if (featuredContainer) {
            const featuredMembers = members.filter(member => member.membershipLevel === "Gold");
            featuredContainer.innerHTML = featuredMembers.map(member => `
                <div class="member">
                    <img src="${member.image}" alt="${member.name}">
                    <h3>${member.name}</h3>
                    <p>${member.address}</p>
                    <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a>
                </div>
            `).join("");
        }
    } catch (error) {
        console.error("Error fetching featured members:", error);
        const featuredContainer = document.getElementById("featured-members-container");
        if (featuredContainer) {
            featuredContainer.innerHTML = "<p>Unable to load featured members.</p>";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchMembers();
    fetchFeaturedMembers();
});
