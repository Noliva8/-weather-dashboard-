const cityInputEl = document.getElementById('cityName');
const searchBtn = document.getElementById('search');
const userInputEl = document.querySelector('.userInput');
const userOutputWeather = document.querySelector('.userOutput');
const formContainerEl = document.getElementById('form-container');

// AUTOCOMPLETE FUNCTION TO CHOOSE CITY
function getCity() {
    const cityUrl = 'https://countriesnow.space/api/v0.1/countries/population/cities';

    fetch(cityUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            const cityArray = [];
            for (let i = 0; i < data.data.length; i++) {
                const cityName = data.data[i].city.trim().split(' ')[0];
                cityArray.push(cityName);
            }
            initializeAutocomplete(cityArray);
        })
        .catch(function(error) {
            console.error('Error fetching city data:', error);
        });
}

function initializeAutocomplete(cityArray) {
    $("#cityName").autocomplete({
        source: cityArray,
        select: handleCitySelection
    });
}

cityInputEl.addEventListener('input', getCity);

// Function to handle the selection of a city
function handleCitySelection(event, ui) {
    const selectedCity = ui.item.value;
    console.log('Selected city:', selectedCity);
}

// Function to handle the search button click event
function handleSearchButtonClick() {
    const selectedCity = cityInputEl.value;

    // Check if a city is selected
    if (selectedCity) {
        // Display the selected city
        displaySelectedCity(selectedCity);

        // Fetch weather data for the selected city
        fetchWeatherData(selectedCity);
    } else {
        console.error('No city selected.');
    }
}

// Function to display the selected city
function displaySelectedCity(selectedCity) {
    // Check if the city is already displayed
    const existingCityDisplays = document.querySelectorAll('.cityOutput h5');
    let cityAlreadyDisplayed = false;

    existingCityDisplays.forEach(function(cityDisplay) {
        if (cityDisplay.textContent === selectedCity) {
            cityAlreadyDisplayed = true;
        }
    });

    if (!cityAlreadyDisplayed) {
        const cityDisplay = document.createElement('h5');
        cityDisplay.textContent = selectedCity;
        cityDisplay.setAttribute('class', 'city-item');

        const cityOutputContainer = document.createElement('div');
        cityOutputContainer.setAttribute('class', 'cityOutput');

        cityOutputContainer.appendChild(cityDisplay);
        userInputEl.appendChild(cityOutputContainer);

        cityDisplay.addEventListener('click', function() {
            fetchWeatherData(selectedCity);
        });
    }

    // Remove existing buttons if any
    const existingButtons = document.querySelector('.current-Future-Container');
    if (existingButtons) {
        existingButtons.remove();
    }

    const currentWeatherConditionBtn = document.createElement('button');
    currentWeatherConditionBtn.textContent = 'Current';
    currentWeatherConditionBtn.setAttribute('class', 'btn btn-secondary');

    const futureWeatherConditionBtn = document.createElement('button');
    futureWeatherConditionBtn.textContent = 'Future';
    futureWeatherConditionBtn.setAttribute('class', 'btn btn-secondary');

    const currentFutureWeatherContainer = document.createElement('div');
    currentFutureWeatherContainer.setAttribute('class', 'current-Future-Container');

    currentFutureWeatherContainer.appendChild(currentWeatherConditionBtn);
    currentFutureWeatherContainer.appendChild(futureWeatherConditionBtn);

    formContainerEl.appendChild(currentFutureWeatherContainer);

    // Using local storage to store the selected city
    localStorage.setItem('selectedCity', selectedCity);

    // Add event listeners for the buttons
    currentWeatherConditionBtn.addEventListener('click', function() {
        fetchCurrentWeatherData(selectedCity);
    });

    futureWeatherConditionBtn.addEventListener('click', function() {
        fetchFutureWeatherData(selectedCity);
    });
}

// Fetch weather data based on selected city
function fetchWeatherData(selectedCity) {
    fetchCurrentWeatherData(selectedCity);
    fetchFutureWeatherData(selectedCity);
}

function fetchCurrentWeatherData(selectedCity) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=imperial&appid=2d6269600f96ffe09fdeb1b3948717ff`;

    fetch(weatherUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log('Weather data:', data);
            displayWeatherData(data, 'current');
        })
        .catch(function(error) {
            console.error('Error fetching weather data:', error);
        });
}

function fetchFutureWeatherData(selectedCity) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&units=imperial&appid=2d6269600f96ffe09fdeb1b3948717ff`;

    fetch(weatherUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log('Weather data:', data);
            displayWeatherData(data, 'future');
        })
        .catch(function(error) {
            console.error('Error fetching weather data:', error);
        });
}

// Function to display weather data
function displayWeatherData(weatherData, type) {
    userOutputWeather.innerHTML = ''; // Clear previous weather data

    if (type === 'current') {
        const city = weatherData.name;
        const date = new Date(weatherData.dt * 1000);
        const temp = weatherData.main.temp;
        const windSpeed = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;
        const icon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        const weatherInfo = `${city} (${formattedDate})\nTemp: ${temp}°F\nWind: ${windSpeed} MPH\nHumidity: ${humidity}%`;

        const weatherDisplay = document.createElement('div');
        weatherDisplay.setAttribute('class', 'weatherDisplay');
        weatherDisplay.style.backgroundColor = "var(--secondaryBackgroundColor)";
        weatherDisplay.innerHTML = `
            <h3>${city} (${formattedDate})</h3>
            <img src="${icon}" alt="Weather icon">
            <p>Temp: ${temp}°F</p>
            <p>Wind: ${windSpeed} MPH</p>
            <p>Humidity: ${humidity}%</p>
        `;
        userOutputWeather.appendChild(weatherDisplay);
    } else {
        // Display future weather data for 5 days
        for (let i = 0; i < weatherData.list.length; i += 8) {
            const city = weatherData.city.name;
            const date = new Date(weatherData.list[i].dt * 1000);
            const temp = weatherData.list[i].main.temp;
            const windSpeed = weatherData.list[i].wind.speed;
            const humidity = weatherData.list[i].main.humidity;
            const icon = `http://openweathermap.org/img/wn/${weatherData.list[i].weather[0].icon}.png`;
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            const weatherInfo = `${city} (${formattedDate})\nTemp: ${temp}°F\nWind: ${windSpeed} MPH\nHumidity: ${humidity}%`;

            const weatherDisplay = document.createElement('div');
            weatherDisplay.setAttribute('class', 'weatherDisplay');
            weatherDisplay.style.backgroundColor = "var(--secondaryBackgroundColor)";
            weatherDisplay.innerHTML = `
                <h3>${city} (${formattedDate})</h3>
                <img src="${icon}" alt="Weather icon">
                <p>Temp: ${temp}°F</p>
                <p>Wind: ${windSpeed} MPH</p>
                <p>Humidity: ${humidity}%</p>
            `;
            userOutputWeather.appendChild(weatherDisplay);
        }
    }
}

// Add event listener for the search button click event
searchBtn.addEventListener('click', handleSearchButtonClick);

// Initialize autocomplete when the input field gains focus
cityInputEl.addEventListener('focus', getCity);
