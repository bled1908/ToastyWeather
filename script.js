// STEP 1: Select the city input field using its id "city-input"
// This is where the user types the city name they want to search for.
const cityInput = document.getElementById("city-input");



// STEP 2: Select the Search button using its id "search-btn"
// When the user clicks this button → Fetch weather + show result.
const searchBtn = document.getElementById("search-btn");


// STEP 3: Select the weather result card and its child text elements:
// • #weather-result → complete weather box (initially hidden)
// • #city-name → show city + country name
// • #temp → show temperature in °C
// • #windspeed → show wind speed in km/h
const weatherResult = document.getElementById("weather-result");
const cityNameEl = document.getElementById("city-name");
const tempEl = document.getElementById("temp");
const windspeedEl = document.getElementById("windspeed");



// STEP 4: Select the toast container using id "toast-container"
// All toast notifications will be added here dynamically.
const toastContainer = document.getElementById("toast-container");



// STEP 5: Create a function showToast(message, type)
// This function will:
// • Create a new <div> toast box at runtime
// • Add classes: "toast" + style type ("success", "error", "info")
// • Show message passed as parameter (msg text) using "textContent" Property
// • Auto-hide after 2.5 seconds using setTimeout()
// • After hiding the toast visually (opacity 0),
// • Wait 500ms so the fade-out animation finishes,
// • Then remove the toast from the DOM completely

// Toast types example:
//    showToast("Enter a city!", "error")
//    showToast("Fetching weather...", "info")
//    showToast("Weather loaded successfully!", "success")
function showToast(msg, type = "info") {
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.textContent = msg;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 2500);
}



// STEP 6: Create an async function getLocation(city)
// Use Open-Meteo Geocoding API to get latitude & longitude
// API URL format:
//   https://geocoding-api.open-meteo.com/v1/search?name=CITY&count=1
// Return: First result (location data) or null if city not found
// Data returned includes:
//   result.name, result.country, result.latitude, result.longitude
async function getLocation(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results && data.results.length > 0 ? data.results[0] : null;
    } catch (error) {
        console.error("Error fetching location:", error);
        showToast("Location service failed.", "error");
        return null;
    }
}


// STEP 7: Create an async function getWeather(lat, lon)
// Use Open-Meteo Real-Time Weather API
// API URL format:
//   https://api.open-meteo.com/v1/forecast?latitude=LAT&longitude=LON&current_weather=true
// Return: Current temperature + wind speed from JSON response
async function getWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const { temperature, windspeed } = data.current_weather;
        return { temperature, windspeed };
    } catch (error) {
        console.error("Error fetching weather:", error);
        showToast("Weather service failed.", "error");
        return null;
    }
}


// STEP 8: Add click event listener to search button
// Inside event listener:
//   1 Get text from city input (cityInput.value)
//   2 If empty → show error toast: "Enter a city!"
//   3 Show info toast: "Fetching weather..."
//   4 Call getLocation() Function
//     • If no valid location → show "City not found!" toast & hide card
//   5 Call getWeather(lat, lon) Function
//   6 Update weather card UI with fetched data using "textContent" Property:
//     • City name (name + country)
//     • Temperature (°C)
//     • Wind speed (km/h)
//   7 Remove "hidden" class → show the weather card
//   8 Show success toast: "Weather loaded successfully!"
searchBtn.addEventListener("click", async() => {
    const city = cityInput.value.trim();
    if(!city) {
        showToast("Enter a city!", "error");
        return;
    }
    showToast("Fetching weather...", "info");
    const locationData = await getLocation(city);
    if(!locationData) {
        showToast("City not found!", "error");
        weatherResult.classList.add("hidden");
        return;
    }
    const { latitude, longitude, name, country } = locationData;
    const weatherData = await getWeather(latitude, longitude);
    if (!weatherData) {
        weatherResult.classList.add("hidden");
        return;
    }
    const { temperature, windspeed } = weatherData;
    cityNameEl.textContent = `${name}, ${country}`;
    tempEl.textContent = `Temperature: ${temperature} °C`;
    windspeedEl.textContent = `Wind Speed: ${windspeed} km/h`;
    weatherResult.classList.remove("hidden");
    showToast("Weather loaded successfully!", "success");
});

