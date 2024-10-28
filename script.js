const userLocation = document.getElementById("userLocation"),
      converter = document.getElementById("converter"),
      weatherIcon = document.querySelector(".weatherIcon"),
      temperature = document.querySelector(".temperature"),
      feelsLike = document.querySelector(".feelsLike"),
      description = document.querySelector(".description"),
      date = document.querySelector(".date"),
      city = document.querySelector(".city"),
      HValue = document.getElementById("HValue"),
      WValue = document.getElementById("WValue"),
      SRValue = document.getElementById("SRValue"),
      SSValue = document.getElementById("SSValue"),
      CValue = document.getElementById("CValue"),
      UVValue = document.getElementById("UVValue"),
      PValue = document.getElementById("PValue"),
      Forecast = document.querySelector(".Forecast");

const WEATHER_API_ENDPOINT = `https://api.weatherapi.com/v1/current.json?key=d4b2b48cfc074a47bab184212240810&q=`;
const WEATHER_DATA_ENDPOINT = `https://api.weatherapi.com/v1/forecast.json?key=d4b2b48cfc074a47bab184212240810&days=7&units=metric&q=`;

function findUserLocation() {
    Forecast.innerHTML = ""; 

    fetch(WEATHER_API_ENDPOINT + userLocation.value)
    .then((response) => response.json())
    .then((data) => {
        if (!data || data.error) {
            alert("Location not found!  :)");
            return;
        }

        city.innerHTML = `${data.location.name}, ${data.location.country}`;
        weatherIcon.style.background = `url(${data.current.condition.icon})`; 

        fetch(WEATHER_DATA_ENDPOINT + userLocation.value)
        .then((response) => response.json())
        .then((data) => {
            const current = data.current;
            const forecast = data.forecast.forecastday;

            temperature.innerHTML = TempConverter(current.temp_c);
            feelsLike.innerHTML = `Feels like ${TempConverter(current.feelslike_c)}`;
            description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp;${current.condition.text}`;

            const options = {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            };
            date.innerHTML = new Date(current.last_updated_epoch * 1000).toLocaleString([], options);

            HValue.innerHTML = `${Math.round(current.humidity)}<span>%</span>`;
            WValue.innerHTML = `${Math.round(current.wind_kph)}<span> km/h</span>`;
            CValue.innerHTML = `${current.cloud}%`;
            UVValue.innerHTML = current.uv;
            PValue.innerHTML = `${current.pressure_mb} <span>hPa</span>`;

            SRValue.innerHTML = forecast[0].astro.sunrise;
            SSValue.innerHTML = forecast[0].astro.sunset;

            forecast.forEach((day) => {
                let div = document.createElement("div");
                let dailyDate = new Date(day.date_epoch * 1000).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
                
                div.innerHTML = `${dailyDate}`;
                div.innerHTML += `<img src="${day.day.condition.icon}"/>`;
                div.innerHTML += `<p class="forecast-desc">${day.day.condition.text}</p>`;
                div.innerHTML += `<span><span>${TempConverter(day.day.mintemp_c)}</span>&nbsp;&nbsp;<span>${TempConverter(day.day.maxtemp_c)}</span></span>`;

                Forecast.append(div);
            });
        });
    });
}

function TempConverter(temp) {
    let tempValue = Math.round(temp);
    if (converter.value === "°C") {
        return `${tempValue}°C`;
    } else {
        let fahrenheit = (tempValue * 9) / 5 + 32;
        return `${Math.round(fahrenheit)}°F`;
    }
}
