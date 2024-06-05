const cityInputEl = document.getElementById('cityName');

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
            // Remove anything after the space added after the city name
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
        source: cityArray
    });
}

cityInputEl.addEventListener('input', getCity);
