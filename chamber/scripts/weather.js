const currentTemp = document.getElementById("current-temp");
const weatherIcon = document.getElementById("weather-icon");
const captionDesc = document.querySelector("figcaption");
const forecastContainer = document.getElementById("forecast-container");
const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=-25.870212221731688&lon=28.220492243469586&units=metric&appid=0e7a1e08a489cc95d126c49925fd5d52";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=-25.870212221731688&lon=28.220492243469586&units=metric&appid=0e7a1e08a489cc95d126c49925fd5d52";

async function fetchCurrentWeather() {
    try {
        const response = await fetch(currentWeatherUrl);
        if (response.ok) {
            const data = await response.json();
            console.log("Current Weather Data:", data); // Testing only
            displayCurrentWeather(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.error("Error fetching current weather:", error);
    }
}

async function fetchForecast() {
    try {
        const response = await fetch(forecastUrl);
        if (response.ok) {
            const data = await response.json();
            console.log("Forecast Data:", data); // Testing only
            displayForecast(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

function displayCurrentWeather(data) {
    currentTemp.innerHTML = `${data.main.temp}&deg;C`;
    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    let desc = data.weather[0].description;
    weatherIcon.setAttribute("src", iconsrc);
    weatherIcon.setAttribute("alt", desc);
    captionDesc.textContent = `${desc}`;
}

function displayForecast(data) {
    const forecastDays = data.list.filter((item) => item.dt_txt.includes("12:00:00")).slice(0, 3);
    forecastContainer.innerHTML = forecastDays.map((day) => {
        const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "long" });
        const temp = day.main.temp;
        const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
        const description = day.weather[0].description;

        return `
            <div class="forecast-day">
                <h3>${date}</h3>
                <img src="${icon}" alt="${description}">
                <p>${temp}&deg;C</p>
                <p>${description}</p>
            </div>
        `;
    }).join("");
}

fetchCurrentWeather();
fetchForecast();
