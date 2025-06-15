// DOMContentLoaded event to initialize the script
document.addEventListener("DOMContentLoaded", function() {
    console.log("Script loaded successfully!");
    fetchCityCoordinates("delhi");
    // Navigation view handling
    const navOptions = document.querySelectorAll('input[name="nav-option"]');
    const views = {
        "H": document.getElementById("hour-view"),
        "D": document.getElementById("day-view"),
        "W": document.getElementById("week-view")
    };

    function updateView() {
        console.log("Updating view...");
        Object.values(views).forEach(view => view.style.display = "none");
        const selectedOption = document.querySelector('input[name="nav-option"]:checked');
        if (selectedOption) {
            const viewId = selectedOption.id;
            if (views[viewId]) {
                views[viewId].style.display = "flex";
                console.log(`Showing view: ${viewId}`);
            } else {
                console.error(`View for option ${viewId} not found`);
            }
        } else {
            console.error("No nav option selected");
        }
    }

    navOptions.forEach(option => option.addEventListener("change", updateView));
    updateView();

    // Modal handling
    const cityButton = document.getElementById("city");
    const modal = document.getElementById("city-modal");
    const closeButton = document.querySelector(".close-button");

    cityButton.addEventListener("click", () => modal.style.display = "block");
    window.addEventListener("click", event => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
    closeButton.addEventListener("click", () => modal.style.display = "none");
});

// Close modal function
function closeModal() {
    document.getElementById("city-modal").style.display = "none";
}

// Handle city input and fetch weather data
function handleCityInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const cityInput = event.target;
        const city = cityInput.value.trim();
        if (city) {
            closeModal();
            cityInput.value = '';
            fetchCityCoordinates(city);
        }
    }
}
document.getElementById('city-input').addEventListener('keypress', handleCityInput);

// Use current location function
function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherData(lat, lon);
        }, () => {
            console.error("Geolocation failed.");
            alert('Failed to retrieve your location.');
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        alert('Geolocation is not supported by your browser.');
    }
    closeModal();
}

// Fetch city coordinates from OpenWeatherMap API
function fetchCityCoordinates(city) {
    const apiKey = '520d5195385a793cead9fda7318a2e00';
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                fetchWeatherData(lat, lon);
            } else {
                console.error("City not found.");
                alert('City not found. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching city coordinates:', error);
            alert('Failed to fetch city coordinates. Please try again.');
        });
}

// Fetch weather data from OpenWeatherMap API
function fetchWeatherData(lat, lon) {
    const apiKey = '520d5195385a793cead9fda7318a2e00';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            applyTheme(data.weather[0].description);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Failed to fetch weather data. Please try again.');
        });
}

// Display weather data on the page
function displayWeather(data) {
    console.log(data);

    const cityName = data.name || 'Unknown City';
    const temperature = Math.round(data.main.temp) || 'N/A';
    const feelsLike = Math.round(data.main.feels_like) || 'N/A';
    const weatherDescription = data.weather[0].description || 'No description';
    const humidity = data.main.humidity || 'N/A';
    const windSpeed = data.wind.speed || 'N/A';
    const visibilityMeters = (data.visibility / 1000).toFixed(1) || 'N/A';
    const pressure = data.main.pressure || 'N/A';
    const country = data.sys.country || 'Unknown Country';

    // Update HTML elements
    document.getElementById("city").innerHTML = `${cityName}, ${country}`;
    document.getElementById("weather-status").innerHTML = `It's ${weatherDescription.charAt(0).toLowerCase() + weatherDescription.slice(1)}.`;
    document.getElementById("current-temp").innerHTML = `${temperature}<sup>°C</sup>`;
    document.getElementById("temp").innerHTML = `${feelsLike}°C`;
    document.getElementById("humidityv").innerHTML = `${humidity}%`;
    document.getElementById("wind-speed").innerHTML = `${windSpeed} m/s`;
    document.getElementById("visibilityv").innerHTML = `${visibilityMeters} km`;
    document.getElementById("pressurev").innerHTML = `${pressure} hPa`;
}

// Apply theme based on weather description
function applyTheme(weatherDescription) {
    const themeMapping = {
        "clear sky": "clear-sky-theme",
        "few clouds": "few-clouds-theme",
        "scattered clouds": "scattered-clouds-theme",
        "overcast clouds": "broken-clouds-theme",
        "broken clouds": "broken-clouds-theme",
        "shower rain": "shower-rain-theme",
        "rain": "rain-theme",
        "light rain": "rain-theme",
        "thunderstorm": "thunderstorm-theme",
        "snow": "snow-theme",
        "mist": "mist-theme"
    };
    const themeClass = themeMapping[weatherDescription.toLowerCase()] || 'default-theme';
    console.log(`Applying theme: ${themeClass}`);
    document.body.className = themeClass;
}

// Update time and highlight the current day in the weekly forecast
const timeV = document.getElementById("time");
const tdayV = document.getElementById("tday");

setInterval(() => {
    const time = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = time.getDate();
    const month = monthNames[time.getMonth()];
    const year = time.getFullYear().toString().slice(-2);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const day = dayNames[time.getDay()];
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    timeV.innerHTML = `${formattedHours}:${formattedMinutes} - ${date} ${month} '${year}`;
    tdayV.innerHTML = `${day}`;

    // Highlight the current day in the weekly forecast
    highlightCurrentDayInForecast(time.getDay());
}, 1000);

// Highlight the current day in the weekly forecast
function highlightCurrentDayInForecast(currentDay) {
    const dayElements = document.querySelectorAll('.day');
    const iconElements = document.querySelectorAll('.icond use');

    console.log('Day Elements:', dayElements);
    console.log('Icon Elements:', iconElements);

    dayElements.forEach((dayElement, index) => {
        const iconElement = iconElements[index];
        
        if (index === currentDay) {
            console.log('Highlighting day:', index);
            dayElement.classList.add('current_day');
            iconElement.classList.add('current_day_icon');
        } else {
            dayElement.classList.remove('current_day');
            iconElement.classList.remove('current_day_icon');
        }
    });
}

