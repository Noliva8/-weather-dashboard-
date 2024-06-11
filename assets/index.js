const cityInputEl = document.getElementById("cityName");
const searchBtn = document.getElementById("search");
const userInputEl = document.querySelector(".userInput");
const userOutputWeather = document.querySelector(".userOutput");
const formContainerEl = document.getElementById("form-container");

// AUTOCOMPLETE FUNCTION TO CHOOSE CITY

function getCity() {
  const cityUrl =
    "https://countriesnow.space/api/v0.1/countries/population/cities";

  fetch(cityUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const cityArray = [];
      for (let i = 0; i < data.data.length; i++) {
        const cityNameEl = data.data[i].city.trim().split(" ")[0];
        cityArray.push(cityNameEl);
      }
      initializeAutocomplete(cityArray);
    })
    .catch(function (error) {
      console.error("Error fetching city data:", error);
    });
}

function initializeAutocomplete(cityArray) {
  $("#cityName").autocomplete({
    source: cityArray,
    select: handleCitySelection,
  });
}

cityInputEl.addEventListener("input", getCity);

// Function to handle the selection of a city
function handleCitySelection(event, ui) {
  const selectedCity = ui.item.value;
  console.log("Selected city:", selectedCity);
}

// Function to handle the search button click event


function handleSearchButtonClick() {
  
  const selectedCity = cityInputEl.value;

  // Check if a city is selected
  if (selectedCity) {
console.log(selectedCity);

// Create button if city exists
let currentFutureContainerEl = document.querySelector('.current-Future-Container');

const currentButtonEl = document.createElement ('button');
currentButtonEl.textContent = 'current Weather';
currentButtonEl.setAttribute('class', 'btn btn-secondary current-weather');

const futureButtonEl = document.createElement ('button');
futureButtonEl.setAttribute('class', 'btn btn-secondary future-weather');
futureButtonEl.textContent ='Future Weather';

if (!currentFutureContainerEl){
  const currentFutureContainerEl =document.createElement('div');
currentFutureContainerEl.setAttribute('class','current-Future-Container' );
formContainerEl.appendChild(currentFutureContainerEl);
currentFutureContainerEl.appendChild(currentButtonEl);
currentFutureContainerEl.appendChild(futureButtonEl);

}

  const existingBtn = userInputEl.querySelector(`button.citySearched[data-city="${selectedCity}"]`);

  if (!existingBtn) {
    
    const currentCityDisplayedBtnEl = document.createElement('button');
    currentCityDisplayedBtnEl.textContent = selectedCity;
    
    currentCityDisplayedBtnEl.setAttribute('class', 'btn btn-secondary citySearched');
    currentCityDisplayedBtnEl.setAttribute('data-city', selectedCity); 
    userInputEl.appendChild(currentCityDisplayedBtnEl);
  

  }
// ADDED CODE
    
  const savedCities =  JSON.parse(localStorage.getItem('savedCities'))|| [] ;
    savedCities.push(selectedCity);
console.log(savedCities);

    localStorage.setItem('savedCities', JSON.stringify(savedCities));

    // END ADDED CODE
   
}



function getCurrentWeather (event, cityData) {
  event.preventDefault();

  



const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityData ? cityData:selectedCity }&appid=2d6269600f96ffe09fdeb1b3948717ff`;
fetch(weatherUrl)
.then( function (response){
return response.json()
})
.then( function (weatherdata){
  userOutputWeather.innerHTML = '';
    console.log(weatherdata.city.coord.name);
    console.log(weatherdata.city);
    let date = new Date().toDateString();
    console.log(date);
    

    const cityNameDisplayContainer = document.createElement('div');
    cityNameDisplayContainer.setAttribute('class','displayCity');
    const cityNameDisplayHeader =document.createElement('h5');
    cityNameDisplayHeader.textContent = `${weatherdata.city.name} (${date})`;
    

    const tempEl = document.createElement('p');
    const windEl = document.createElement('p');
    const humidityEl = document.createElement('p');

    
    


     cityNameDisplayContainer.appendChild(cityNameDisplayHeader);
     userOutputWeather.appendChild(cityNameDisplayContainer);
     userOutputWeather.appendChild(tempEl);
     userOutputWeather.appendChild(windEl);
     userOutputWeather.appendChild(humidityEl);
     userOutputWeather.appendChild(tempEl);

     tempEl.textContent = `Temperature: ${weatherdata.list[0].main.temp}°F`;
     windEl.textContent = `Wind Speed: ${weatherdata.list[0].wind.speed} m/s`;
     humidityEl.textContent = `Humidity: ${weatherdata.list[0].main.humidity}%`;
     


  }
    

  
)

// save selected city in local stolage

// i want to display the the data from that are within thi button: currentCityDisplayedBtnEl
// I want to save with local storage the value of this elements: cityNameDisplayHeader.value; tempEl.value; windEl.value, HumidityEl.value; 


}

const currentWeatherBtn = document.querySelector('.current-weather');
currentWeatherBtn.addEventListener('click', getCurrentWeather);




const futureWeatherBtn = document.querySelector('.future-weather');
const displa5Days = document.querySelector('.userInput2');



 if (futureWeatherBtn) {
    futureWeatherBtn.addEventListener('click', getFutureWeather);
  }

  function getFutureWeather(event) {
    event.preventDefault();

    const selectedCity = document.getElementById('cityName').value;

    const weatherUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=2d6269600f96ffe09fdeb1b3948717ff&units=imperial`;

    fetch(weatherUrlForecast)
      .then(function (response) {
        return response.json();
      })
      .then(function (forecastData) {
        console.log(forecastData);

        if (displa5Days) {
          displa5Days.innerHTML = '';

          const dayForecastHeader = document.createElement('h5');
          dayForecastHeader.textContent = '5-Day Forecast';
          displa5Days.appendChild(dayForecastHeader);

          const dayContainers = [];
          for (let i = 0; i < 5; i++) {
            const dayContainer = document.createElement('div');
            const date = document.createElement('h6');
            const icon = document.createElement('img');
            const temp = document.createElement('p');
            const wind = document.createElement('p');
            const humidity = document.createElement('p');

            const forecast = forecastData.list[i * 8]; 

            if (forecast && forecast.dt_txt && forecast.weather && forecast.weather[0] && forecast.main && forecast.wind) {
              date.textContent = new Date(forecast.dt_txt).toLocaleDateString();
              icon.src = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
              icon.alt = `${forecast.weather[0].description}`;
              temp.textContent = `Temp: ${forecast.main.temp}°F`;
              wind.textContent = `Wind: ${forecast.wind.speed} MPH`;
              humidity.textContent = `Humidity: ${forecast.main.humidity}%`;

              dayContainer.appendChild(date);
              dayContainer.appendChild(icon);
              dayContainer.appendChild(temp);
              dayContainer.appendChild(wind);
              dayContainer.appendChild(humidity);

              dayContainers.push(dayContainer);
            } else {
              console.error('Unexpected forecast data structure:', forecast);
            }
          }

          dayContainers.forEach(container => displa5Days.appendChild(container));
        }
      })
      .catch(function (error) {
        console.error('Error fetching forecast data:', error);
      });
  }

  document.getElementById('search').addEventListener('click', function () {
    const selectedCity = document.getElementById('cityName').value;

    if (selectedCity) {
      console.log(selectedCity);
      // You can add any other necessary logic here when a city is searched
    }
  });


futureWeatherBtn.addEventListener('click', getFutureWeather);



}
searchBtn.addEventListener('click', handleSearchButtonClick);

function loadCities () {
   const savedCities =  JSON.parse(localStorage.getItem('savedCities'))|| [] ;
  
console.log(savedCities);
for ( let i=0; i< savedCities.length; i++){
const currentCityDisplayedBtnEl = document.createElement('button');
    currentCityDisplayedBtnEl.textContent = savedCities[i];
    
    currentCityDisplayedBtnEl.setAttribute('class', 'btn btn-secondary citySearched');
    currentCityDisplayedBtnEl.setAttribute('data-city', savedCities[i]); 
    userInputEl.appendChild(currentCityDisplayedBtnEl);

    currentCityDisplayedBtnEl.addEventListener('click', ()=>{
      cityInputEl.value = savedCities[i];
     
    })
}
  
}

loadCities();


function historySearch () {

}