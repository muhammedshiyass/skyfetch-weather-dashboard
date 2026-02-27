/**
 * PART 3: WeatherApp Constructor
 * Organizes all logic into a single object instance.
 */
function WeatherApp() {
    // PART 1: API Configuration
    this.apiKey = "c1ad54a4fb4cd42dd6091e0afedae2df"; 
    this.currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
    // PART 3: New Forecast URL
    this.forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    // PART 3: Cache DOM elements for better performance
    this.cityInput = document.getElementById('city-input');
    this.searchBtn = document.getElementById('search-btn');
    this.displayArea = document.getElementById('weather-display');

    // Initialize the app
    this.init();
}

/**
 * PART 3: Initialization Method
 */
WeatherApp.prototype.init = function() {
    // PART 2: Event Listeners (using .bind to maintain 'this' context)
    this.searchBtn.addEventListener('click', this.handleSearch.bind(this));
    
    this.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleSearch();
    });

    // PART 2: Initial screen state
    this.showWelcome();
};

/**
 * PART 2: UI Helper Methods (Moved to Prototype in Part 3)
 */
WeatherApp.prototype.showWelcome = function() {
    this.displayArea.innerHTML = `
        <div class="welcome-message">
            <p>Enter a city name to see current weather and 5-day forecast!</p>
        </div>
    `;
};

WeatherApp.prototype.showLoading = function() {
    this.displayArea.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Fetching weather data...</p>
        </div>
    `;
};

WeatherApp.prototype.showError = function(message) {
    this.displayArea.innerHTML = `
        <div class="error-message">
            <p>⚠️ ${message}</p>
        </div>
    `;
};

/**
 * PART 2: Search Logic
 */
WeatherApp.prototype.handleSearch = function() {
    const city = this.cityInput.value.trim();
    if (!city) {
        this.showError("Please enter a city name.");
        return;
    }
    this.getWeatherData(city);
    this.cityInput.value = ''; // Clear input
};

/**
 * PART 3: Fetching Data (Refactored to Async/Await + Promise.all)
 */
WeatherApp.prototype.getWeatherData = async function(city) {
    this.showLoading();
    
    // PART 2: Disable button while loading
    this.searchBtn.disabled = true;

    const currentParams = `?q=${city}&appid=${this.apiKey}&units=metric`;
    const forecastParams = `?q=${city}&appid=${this.apiKey}&units=metric`;

    try {
        // PART 3: Concurrent API calls for speed
        const [currentRes, forecastRes] = await Promise.all([
            axios.get(this.currentWeatherUrl + currentParams),
            axios.get(this.forecastUrl + forecastParams)
        ]);

        // Clear display and render both sections
        this.displayArea.innerHTML = '';
        this.displayCurrentWeather(currentRes.data);
        this.displayForecast(forecastRes.data);

    } catch (error) {
        console.error("API Error:", error);
        if (error.response && error.response.status === 404) {
            this.showError("City not found. Please check your spelling.");
        } else {
            this.showError("Unable to fetch weather. Check your connection.");
        }
    } finally {
        this.searchBtn.disabled = false;
    }
};

/**
 * PART 1 & 3: Render Current Weather
 */
WeatherApp.prototype.displayCurrentWeather = function(data) {
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    const html = `
        <div class="weather-info">
            <h2 class="city-name">${data.name}</h2>
            <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon">
            <div class="temperature">${Math.round(data.main.temp)}°C</div>
            <p class="description">${data.weather[0].description}</p>
        </div>
        <hr class="divider">
        <h3 class="forecast-title">5-Day Forecast</h3>
        <div id="forecast-grid" class="forecast-grid"></div>
    `;
    this.displayArea.innerHTML = html;
};

/**
 * PART 3: Process and Display Forecast
 */
WeatherApp.prototype.displayForecast = function(data) {
    const grid = document.getElementById('forecast-grid');
    
    // Filter to get weather specifically for 12:00 PM each day
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const card = `
            <div class="forecast-card">
                <p class="f-day">${dayName}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="icon">
                <p class="f-temp">${Math.round(item.main.temp)}°C</p>
                <p class="f-desc">${item.weather[0].main}</p>
            </div>
        `;
        grid.innerHTML += card;
    });
};

// PART 3: Instantiate the app
const app = new WeatherApp();