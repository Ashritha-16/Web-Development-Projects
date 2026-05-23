const apiKey = "cf03ad666655bf0231d11285c230b256";

/* Get weather data */
function getWeather() {

    const city = document.getElementById("cityInput").value;

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    const weatherURL =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const forecastURL =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(weatherURL)
        .then(response => response.json())
        .then(data => showWeather(data));

    fetch(forecastURL)
        .then(response => response.json())
        .then(data => showForecast(data.list));
}

/* Show current weather */
function showWeather(data) {

    if (data.cod !== 200) {
        alert("City not found");
        return;
    }

    const temp = Math.round(data.main.temp - 273.15);
    const desc = data.weather[0].description;
    const city = data.name;
    const icon = data.weather[0].icon;

    document.getElementById("temperature").innerText = temp + "°C";
    document.getElementById("description").innerText = desc;
    document.getElementById("cityName").innerText = city;

    const iconImg = document.getElementById("weatherIcon");
    iconImg.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    iconImg.style.display = "block";
}

/* Show hourly forecast */
function showForecast(list) {

    const container = document.getElementById("hourlyForecast");
    container.innerHTML = "";

    const nextHours = list.slice(0, 8);

    nextHours.forEach(item => {

        const hour = new Date(item.dt * 1000).getHours();
        const temp = Math.round(item.main.temp - 273.15);
        const icon = item.weather[0].icon;

        container.innerHTML += `
            <div class="hour-box">
                <p>${hour}:00</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png">
                <p>${temp}°C</p>
            </div>
        `;
    });
}