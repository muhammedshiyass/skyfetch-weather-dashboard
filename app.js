/* PART 1 CONFIGURATION */
const API_KEY = "c1ad54a4fb4cd42dd6091e0afedae2df"; 
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

/* PART 2: UI ELEMENT REFERENCES*/
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const displayArea = document.getElementById('weather-display');

/* PART 2: REFACTORED FETCH FUNCTION (Async/Await)*/
async function getWeather(city) {
    // Show loading state immediately
    showLoading();
    
    // Disable UI during fetch
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';

    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await axios.get(url);
        console.log('Weather Data:', response.data);
        
        // Success! Display data (Part 1 function)
        displayWeather(response.data);
        
        // Part 2: Focus back on input for next search
        cityInput.focus();
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        
        // Part 2: Advanced Error Handling
        if (error.response && error.response.status === 404) {
            showError('City not found. Please check the spelling and try again.');
        } else {
            showError('Something went wrong. Please check your connection.');
        }
    } finally {
        // Re-enable UI
        searchBtn.disabled = false;
        searchBtn.textContent = '🔍 Search';
    }
}

/* PART 1: DISPLAY FUNCTION (Slightly modified for Part 2)*/

function displayWeather(data) {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    displayArea.innerHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;
}

/* PART 2: NEW UI HELPER FUNCTIONS*/

function showLoading() {
    displayArea.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Fetching weather...</p>
        </div>
    `;
}

function showError(message) {
    displayArea.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
}

/* PART 2: EVENT LISTENERS*/

searchBtn.addEventListener('click', () => {
    handleSearch();
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    if (city.length < 2) {
        showError('City name is too short.');
        return;
    }

    getWeather(city);
    cityInput.value = ''; // Clear input after search
}