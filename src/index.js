/**
 * Weather App
 * Uses Open-Meteo API (free, no API key required)
 * https://open-meteo.com/
 */

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");

// DOM elements to update
const cityNameEl = document.getElementById("city-name");
const dateTimeEl = document.getElementById("date-time");
const descriptionEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const temperatureEl = document.getElementById("temperature");
const iconWrapper = document.getElementById("icon-wrapper");

// WMO Weather interpretation codes
const weatherCodes = {
  0: { description: "clear sky", icon: "sun" },
  1: { description: "mainly clear", icon: "partly-cloudy" },
  2: { description: "partly cloudy", icon: "partly-cloudy" },
  3: { description: "overcast clouds", icon: "cloud" },
  45: { description: "fog", icon: "fog" },
  48: { description: "depositing rime fog", icon: "fog" },
  51: { description: "light drizzle", icon: "drizzle" },
  53: { description: "moderate drizzle", icon: "drizzle" },
  55: { description: "dense drizzle", icon: "drizzle" },
  56: { description: "light freezing drizzle", icon: "drizzle" },
  57: { description: "dense freezing drizzle", icon: "drizzle" },
  61: { description: "slight rain", icon: "rain" },
  63: { description: "moderate rain", icon: "rain" },
  65: { description: "heavy rain", icon: "rain" },
  66: { description: "light freezing rain", icon: "rain" },
  67: { description: "heavy freezing rain", icon: "rain" },
  71: { description: "slight snow", icon: "snow" },
  73: { description: "moderate snow", icon: "snow" },
  75: { description: "heavy snow", icon: "snow" },
  77: { description: "snow grains", icon: "snow" },
  80: { description: "slight rain showers", icon: "rain" },
  81: { description: "moderate rain showers", icon: "rain" },
  82: { description: "violent rain showers", icon: "rain" },
  85: { description: "slight snow showers", icon: "snow" },
  86: { description: "heavy snow showers", icon: "snow" },
  95: { description: "thunderstorm", icon: "thunderstorm" },
  96: { description: "thunderstorm with slight hail", icon: "thunderstorm" },
  99: { description: "thunderstorm with heavy hail", icon: "thunderstorm" },
};

// SVG Icons mapped to weather conditions
const icons = {
  sun: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="14" fill="#FDB813"/>
        <path d="M32 6V12M32 52V58M58 32H52M12 32H6M50.38 13.62L46.14 17.86M17.86 46.14L13.62 50.38M50.38 50.38L46.14 46.14M17.86 17.86L13.62 13.62" stroke="#FDB813" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  "partly-cloudy": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="10" fill="#FDB813"/>
        <path d="M24 6V10M24 38V42M42 24H38M6 24H2M37.8 10.2L35.4 12.6M12.6 35.4L10.2 37.8M37.8 37.8L35.4 35.4M12.6 12.6L10.2 10.2" stroke="#FDB813" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M44 50H26C21.58 50 18 46.42 18 42C18 37.58 21.58 34 26 34C26.58 34 27.14 34.08 27.68 34.22C28.62 29.5 32.84 26 38 26C43.8 26 48.58 30.28 49.84 35.78C53.16 36.56 55.68 39.56 55.68 43.12C55.68 47.02 52.5 50 48.72 50H44Z" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="1.5"/>
    </svg>`,
  cloud: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M46 48H18C12.48 48 8 43.52 8 38C8 32.48 12.48 28 18 28C18.72 28 19.42 28.1 20.1 28.26C21.24 22.38 26.44 18 32.5 18C39.68 18 45.72 23.38 47.3 30.26C51.44 31.22 54.6 34.96 54.6 39.28C54.6 44.14 50.62 48 46 48Z" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="1.5"/>
    </svg>`,
  fog: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 24H52M16 32H48M12 40H52M20 48H44" stroke="#9CA3AF" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  drizzle: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M42 40H24C19.58 40 16 36.42 16 32C16 27.58 19.58 24 24 24C24.58 24 25.14 24.08 25.68 24.22C26.62 19.5 30.84 16 36 16C41.8 16 46.58 20.28 47.84 25.78C51.16 26.56 53.68 29.56 53.68 33.12C53.68 37.02 50.5 40 46.72 40H42Z" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="1.5"/>
        <path d="M24 46L22 52M32 46L30 52M40 46L38 52" stroke="#60A5FA" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  rain: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M42 40H24C19.58 40 16 36.42 16 32C16 27.58 19.58 24 24 24C24.58 24 25.14 24.08 25.68 24.22C26.62 19.5 30.84 16 36 16C41.8 16 46.58 20.28 47.84 25.78C51.16 26.56 53.68 29.56 53.68 33.12C53.68 37.02 50.5 40 46.72 40H42Z" fill="#9CA3AF" stroke="#6B7280" stroke-width="1.5"/>
        <path d="M22 46L20 54M30 46L28 54M38 46L36 54M46 46L44 54" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  snow: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M42 40H24C19.58 40 16 36.42 16 32C16 27.58 19.58 24 24 24C24.58 24 25.14 24.08 25.68 24.22C26.62 19.5 30.84 16 36 16C41.8 16 46.58 20.28 47.84 25.78C51.16 26.56 53.68 29.56 53.68 33.12C53.68 37.02 50.5 40 46.72 40H42Z" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="1.5"/>
        <circle cx="22" cy="48" r="2.5" fill="#93C5FD"/><circle cx="30" cy="54" r="2.5" fill="#93C5FD"/>
        <circle cx="38" cy="48" r="2.5" fill="#93C5FD"/><circle cx="46" cy="54" r="2.5" fill="#93C5FD"/>
    </svg>`,
  thunderstorm: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M42 38H24C19.58 38 16 34.42 16 30C16 25.58 19.58 22 24 22C24.58 22 25.14 22.08 25.68 22.22C26.62 17.5 30.84 14 36 14C41.8 14 46.58 18.28 47.84 23.78C51.16 24.56 53.68 27.56 53.68 31.12C53.68 35.02 50.5 38 46.72 38H42Z" fill="#6B7280" stroke="#4B5563" stroke-width="1.5"/>
        <path d="M34 38L28 48H34L30 58" stroke="#FDB813" stroke-width="3" stroke-linejoin="round"/>
    </svg>`,
};

function getWeatherInfo(code) {
  return weatherCodes[code] || { description: "unknown", icon: "cloud" };
}

function getIconSvg(iconName) {
  return icons[iconName] || icons.cloud;
}

function formatDate() {
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = days[now.getDay()];
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${dayName} ${hours}:${minutes}`;
}

function showError(message) {
  let errorEl = document.getElementById("error-message");
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.id = "error-message";
    errorEl.className = "error-message";
    const card = document.querySelector(".weather-card");
    card.appendChild(errorEl);
  }
  errorEl.textContent = message;
  errorEl.classList.add("visible");
  setTimeout(() => errorEl.classList.remove("visible"), 5000);
}

function setLoading(isLoading) {
  if (isLoading) {
    searchForm.classList.add("loading");
    document.querySelector(".weather-content").style.opacity = "0.5";
  } else {
    searchForm.classList.remove("loading");
    document.querySelector(".weather-content").style.opacity = "1";
  }
}

async function fetchWeather(city) {
  try {
    setLoading(true);

    // Step 1: Geocoding (convert city name to coordinates)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`City "${city}" not found. Please try again.`);
    }

    const { latitude, longitude, name } = geoData.results[0];

    // Step 2: Fetch current weather data
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const current = weatherData.current;
    const weatherInfo = getWeatherInfo(current.weather_code);

    // Update the UI
    cityNameEl.textContent = name;
    dateTimeEl.textContent = formatDate();
    descriptionEl.textContent = weatherInfo.description;
    humidityEl.textContent = `${current.relative_humidity_2m}%`;
    windEl.textContent = `${current.wind_speed_10m}km/h`;
    temperatureEl.textContent = Math.round(current.temperature_2m);
    iconWrapper.innerHTML = getIconSvg(weatherInfo.icon);

    // Save to localStorage for persistence
    localStorage.setItem("lastCity", name);
  } catch (error) {
    console.error("Weather fetch error:", error);
    showError(
      error.message || "Failed to fetch weather data. Please try again.",
    );
  } finally {
    setLoading(false);
  }
}

// Handle search
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

// Load last searched city (or default to Paris) on page load
document.addEventListener("DOMContentLoaded", () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    cityInput.value = lastCity;
    fetchWeather(lastCity);
  } else {
    fetchWeather("Paris");
  }
});
