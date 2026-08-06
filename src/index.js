function formatDate(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const day = days[date.getDay()];
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${hours}:${minutes}`;
}

function updateTime() {
  const currentDateElement = document.querySelector("#current-date");
  const now = new Date();
  currentDateElement.innerHTML = formatDate(now);
}

function getWeatherIcon(iconCode) {
  const icons = {
    "clear-sky-day": "☀️",
    "clear-sky-night": "🌙",
    "few-clouds-day": "🌤️",
    "few-clouds-night": "☁️",
    "scattered-clouds-day": "☁️",
    "scattered-clouds-night": "☁️",
    "broken-clouds-day": "☁️",
    "broken-clouds-night": "☁️",
    "shower-rain-day": "🌦️",
    "shower-rain-night": "🌧️",
    "rain-day": "🌧️",
    "rain-night": "🌧️",
    "thunderstorm-day": "⛈️",
    "thunderstorm-night": "⛈️",
    "snow-day": "🌨️",
    "snow-night": "🌨️",
    "mist-day": "🌫️",
    "mist-night": "🌫️",
  };

  return icons[iconCode] || "☀️";
}

function displayWeatherData(response) {
  const temperatureElement = document.querySelector("#current-temperature");
  const cityElement = document.querySelector("#current-city");
  const descriptionElement = document.querySelector("#weather-description");
  const humidityElement = document.querySelector("#humidity");
  const windElement = document.querySelector("#wind");
  const iconElement = document.querySelector("#weather-icon");

  const temperature = Math.round(response.data.temperature.current);
  const city = response.data.city;
  const description = response.data.condition.description;
  const humidity = response.data.temperature.humidity;
  const wind = response.data.wind.speed;
  const iconCode = response.data.condition.icon;

  temperatureElement.innerHTML = temperature;
  cityElement.innerHTML = city;
  descriptionElement.innerHTML = description;
  humidityElement.innerHTML = `${humidity}%`;
  windElement.innerHTML = `${wind}km/h`;
  iconElement.innerHTML = getWeatherIcon(iconCode);
}

function searchCity(city) {
  const apiKey = "b2a5adcct04b33178913oc335f405433";
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherData);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  const searchInput = document.querySelector("#search-input");
  const city = searchInput.value.trim();

  if (city) {
    searchCity(city);
  }
}

const searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSearchSubmit);

updateTime();
setInterval(updateTime, 60000);

searchCity("Paris");
