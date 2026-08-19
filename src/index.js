const input = document.getElementById("cityInput");
const btn = document.getElementById("searchBtn");
const result = document.getElementById("result");

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
function decodeWeather(code) {
  const map = {
    0: ["clear sky", "sun"],
    1: ["mainly clear", "sun-cloud"],
    2: ["partly cloudy", "sun-cloud"],
    3: ["overcast clouds", "cloud"],
    45: ["fog", "fog"],
    48: ["depositing rime fog", "fog"],
    51: ["light drizzle", "rain"],
    53: ["moderate drizzle", "rain"],
    55: ["dense drizzle", "rain"],
    56: ["light freezing drizzle", "rain"],
    57: ["dense freezing drizzle", "rain"],
    61: ["slight rain", "rain"],
    63: ["moderate rain", "rain"],
    65: ["heavy rain", "rain"],
    66: ["light freezing rain", "rain"],
    67: ["heavy freezing rain", "rain"],
    71: ["slight snow fall", "snow"],
    73: ["moderate snow fall", "snow"],
    75: ["heavy snow fall", "snow"],
    77: ["snow grains", "snow"],
    80: ["slight rain showers", "rain"],
    81: ["moderate rain showers", "rain"],
    82: ["violent rain showers", "rain"],
    85: ["slight snow showers", "snow"],
    86: ["heavy snow showers", "snow"],
    95: ["thunderstorm", "storm"],
    96: ["thunderstorm with hail", "storm"],
    99: ["thunderstorm with heavy hail", "storm"],
  };
  return map[code] || ["unknown", "cloud"];
}

function iconSVG(key) {
  const icons = {
    sun: `<svg class="icon" viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="#FDB813"/>
      <g stroke="#FDB813" stroke-width="4" stroke-linecap="round">
        <line x1="32" y1="4" x2="32" y2="12"/><line x1="32" y1="52" x2="32" y2="60"/>
        <line x1="4" y1="32" x2="12" y2="32"/><line x1="52" y1="32" x2="60" y2="32"/>
        <line x1="12" y1="12" x2="17" y2="17"/><line x1="47" y1="47" x2="52" y2="52"/>
        <line x1="52" y1="12" x2="47" y2="17"/><line x1="17" y1="47" x2="12" y2="52"/>
      </g></svg>`,
    "sun-cloud": `<svg class="icon" viewBox="0 0 64 64">
      <circle cx="24" cy="22" r="11" fill="#FDB813"/>
      <path d="M14 46a12 12 0 0 1-1-24 15 15 0 0 1 29-4 11 11 0 0 1-2 28z" fill="#B9C6E0"/>
      <path d="M18 46a12 12 0 0 1-1-24 15 15 0 0 1 29-4 11 11 0 0 1-2 28z" fill="#D7E1F2"/>
    </svg>`,
    cloud: `<svg class="icon" viewBox="0 0 64 64">
      <path d="M20 46a13 13 0 0 1-1-26 16 16 0 0 1 31-4 12 12 0 0 1-2 30z" fill="#A9B7D6"/>
      <path d="M24 46a13 13 0 0 1-1-26 16 16 0 0 1 31-4 12 12 0 0 1-2 30z" fill="#DCE4F4"/>
      <circle cx="46" cy="20" r="6" fill="#8BC7EE"/>
    </svg>`,
    rain: `<svg class="icon" viewBox="0 0 64 64">
      <path d="M18 38a12 12 0 0 1-1-24 15 15 0 0 1 29-4 11 11 0 0 1-2 28z" fill="#A9B7D6"/>
      <g stroke="#5B9BD5" stroke-width="3" stroke-linecap="round">
        <line x1="20" y1="46" x2="16" y2="58"/>
        <line x1="32" y1="46" x2="28" y2="58"/>
        <line x1="44" y1="46" x2="40" y2="58"/>
      </g></svg>`,
    snow: `<svg class="icon" viewBox="0 0 64 64">
      <path d="M18 38a12 12 0 0 1-1-24 15 15 0 0 1 29-4 11 11 0 0 1-2 28z" fill="#B9C6E0"/>
      <g fill="#8FB6E0">
        <circle cx="20" cy="50" r="2.5"/><circle cx="32" cy="54" r="2.5"/><circle cx="44" cy="50" r="2.5"/>
      </g></svg>`,
    storm: `<svg class="icon" viewBox="0 0 64 64">
      <path d="M18 34a12 12 0 0 1-1-24 15 15 0 0 1 29-4 11 11 0 0 1-2 28z" fill="#8B92A8"/>
      <polygon points="34,40 24,54 30,54 26,62 40,46 33,46" fill="#FDB813"/>
    </svg>`,
    fog: `<svg class="icon" viewBox="0 0 64 64">
      <g stroke="#B9C0CF" stroke-width="4" stroke-linecap="round">
        <line x1="10" y1="24" x2="54" y2="24"/>
        <line x1="6" y1="34" x2="58" y2="34"/>
        <line x1="10" y1="44" x2="54" y2="44"/>
      </g></svg>`,
  };
  return icons[key] || icons["cloud"];
}

function showLoading() {
  result.innerHTML = `<div class="weather-body"><div class="placeholder">Loading…</div></div>`;
}

function showError(msg) {
  result.innerHTML = `<div class="weather-body"><div class="error">${msg}</div></div>`;
}

async function searchCity() {
  const city = input.value.trim();
  if (!city) {
    return;
  }

  btn.disabled = true;
  showLoading();

  try {
    // 1. Geocode the city name
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      showError(`Couldn't find "${city}". Try another city name.`);
      return;
    }

    const place = geoData.results[0];
    const { latitude, longitude, name, timezone } = place;

    // 2. Fetch current weather for those coordinates
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=${encodeURIComponent(timezone)}`,
    );
    const weatherData = await weatherRes.json();

    if (!weatherData.current) {
      showError("Weather data unavailable right now. Please try again.");
      return;
    }

    const cur = weatherData.current;
    const [desc, iconKey] = decodeWeather(cur.weather_code);

    const localDate = new Date(cur.time);
    const dayName = DAYS[localDate.getDay()];
    const hh = localDate.getHours();
    const mm = localDate.getMinutes().toString().padStart(2, "0");

    result.innerHTML = `
      <div class="weather-body">
        <div>
          <h1 class="city-name">${name}</h1>
          <p class="meta">${dayName} ${hh}:${mm}, ${desc}</p>
          <p class="meta"><span class="label">Humidity:</span> <strong>${cur.relative_humidity_2m}%</strong>, <span class="label">Wind:</span> <strong>${cur.wind_speed_10m.toFixed(2)}km/h</strong></p>
        </div>
        <div class="temp-block">
          ${iconSVG(iconKey)}
          <div class="temp">
            <span class="num">${Math.round(cur.temperature_2m)}</span>
            <span class="deg">°C</span>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    showError("Something went wrong fetching the weather. Please try again.");
  } finally {
    btn.disabled = false;
  }
}

btn.addEventListener("click", searchCity);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchCity();
});

// Load Paris by default on first open
input.value = "Paris";
searchCity();
