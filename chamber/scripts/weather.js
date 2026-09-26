const apiKey = "0e7a1e08a489cc95d126c49925fd5d52"; 
const lat = "-25.7479"; // Pretoria Latitude
const lon = "28.2293";  // Pretoria Longitude

const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

document.addEventListener("DOMContentLoaded", () => {
    fetchWeatherData();
});

async function fetchWeatherData() {
    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        if (!currentRes.ok || !forecastRes.ok) {
            throw new Error("Failed to retrieve weather data.");
        }

        const currentData = await currentRes.json();
        const forecastData = await forecastRes.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
    } catch (error) {
        console.error("Weather API Error:", error);
        document.getElementById("weather-current").innerHTML = "<p>Weather data unavailable.</p>";
        document.getElementById("weather-forecast").innerHTML = "";
    }
}

function displayCurrentWeather(data) {
    const weatherContainer = document.getElementById("weather-current");
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherContainer.innerHTML = `
        <div class="weather-details">
            <img src="${iconUrl}" alt="${desc}" class="weather-icon">
            <div>
                <p><strong>${temp}&deg;C</strong></p>
                <p style="text-transform: capitalize;">${desc}</p>
            </div>
        </div>
    `;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById("weather-forecast");
    forecastContainer.innerHTML = "";

    const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

    dailyForecasts.forEach(item => {
        const date = new Date(item.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const temp = Math.round(item.main.temp);

        const dayElement = document.createElement("div");
        dayElement.className = "forecast-day";
        dayElement.innerHTML = `
            <span><strong>${dayName}:</strong></span>
            <span>${temp}&deg;C</span>
        `;

        forecastContainer.appendChild(dayElement);
    });
}