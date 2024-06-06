const cityInputEl = document.getElementById('cityName');
const searchBtn = document.getElementById('search');
const userInputEl = document.querySelector('.userInput');
const userOutputWeather = document.querySelector('.userOutput');

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
        select: handleCitySelection // Call handleCitySelection when a city is selected
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
    // Retrieve the selected city from the input field
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
    const cityDisplay = document.createElement('h5');
    cityDisplay.textContent = selectedCity;

    const cityOutputContainer = document.createElement('div');
    cityOutputContainer.setAttribute('class', 'cityOutput');

    cityOutputContainer.appendChild(cityDisplay);
    userInputEl.appendChild(cityOutputContainer);

    // Using local storage to store the selected city
    localStorage.setItem('selectedCity', selectedCity);
}

// Fetch weather data based on selected city
function fetchWeatherData(selectedCity) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=2d6269600f96ffe09fdeb1b3948717ff`;

    fetch(weatherUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log('Weather data:', data);
            // Display weather data

            displayWeatherData(data);

        })
        .catch(function(error) {
            console.error('Error fetching weather data:', error);
        });
}

// Function to display weather data
function displayWeatherData(weatherData) {
    const cityDisplayInWeatherContainer =document.createElement('h3');

}

// Add event listener for the search button click event
searchBtn.addEventListener('click', handleSearchButtonClick);

// Initialize autocomplete when the input field gains focus
cityInputEl.addEventListener('focus', getCity);
