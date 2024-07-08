var apiKey = '7ac58449a473e1de5175cb512d47a950';  
var form = document.getElementById('city-form');
var cityInput = document.getElementById('city-input');
var stateInput = document.getElementById('state-input');
var currentWeatherDiv = document.getElementById('current-weather');
var forecastDiv = document.getElementById('forecast');
var searchHistoryDiv = document.getElementById('search-history');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    var cityName = cityInput.value.trim();
    var stateCode = stateInput.value.trim();
    if (cityName && stateCode) {
        fetchWeatherData(cityName, stateCode);
        saveSearchHistory(cityName, stateCode);
        displaySearchHistory();
        cityInput.value = '';
        stateInput.value = '';
    }
});

function fetchWeatherData(cityName, stateCode) {
    var url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + ',' + stateCode + ',US&appid=' + apiKey + '&units=metric';
    console.log('Fetching weather data for URL:', url);  // Log the URL
    fetch(url)
        .then(function(response) {
            console.log('Fetch response:', response);  // Log the response
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            console.log('Weather data:', data);  // Log the data
            displayCurrentWeather(data);
            displayForecast(data);
        })
        .catch(function(error) {
            console.error('Error fetching weather data:', error);
            alert('Failed to fetch weather data. Please check the city name and state code, and try again.');
        });
}

function displayCurrentWeather(data) {
    if (!data || !data.list || data.list.length === 0) {
        console.error('No weather data available for current weather.');
        return;
    }

    var weather = data.list[0];
    var weatherHTML = `
        <div class="weather-card">
            <h2>${data.city.name} (${new Date(weather.dt * 1000).toLocaleDateString()})</h2>
            <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" class="weather-icon" alt="${weather.weather[0].description}">
            <p>Temp: ${weather.main.temp} °C</p>
            <p>Humidity: ${weather.main.humidity}%</p>
            <p>Wind: ${weather.wind.speed} m/s</p>
        </div>
    `;
    currentWeatherDiv.innerHTML = weatherHTML;
}

function displayForecast(data) {
    if (!data || !data.list || data.list.length === 0) {
        console.error('No weather data available for forecast.');
        return;
    }

    forecastDiv.innerHTML = '';
    var forecastList = data.list.filter(function(_, index) {
        return index % 8 === 0;
    }).slice(1);

    forecastList.forEach(function(weather) {
        var weatherHTML = `
            <div class="weather-card">
                <h3>${new Date(weather.dt * 1000).toLocaleDateString()}</h3>
                <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" class="weather-icon" alt="${weather.weather[0].description}">
                <p>Temp: ${weather.main.temp} °C</p>
                <p>Humidity: ${weather.main.humidity}%</p>
                <p>Wind: ${weather.wind.speed} m/s</p>
            </div>
        `;
        forecastDiv.innerHTML += weatherHTML;
    });
}

function saveSearchHistory(cityName, stateCode) {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    var cityState = cityName + ', ' + stateCode;
    if (!searchHistory.includes(cityState)) {
        searchHistory.push(cityState);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

function displaySearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryDiv.innerHTML = '';
    searchHistory.forEach(function(cityState) {
        var cityButton = document.createElement('button');
        cityButton.textContent = cityState;
        cityButton.addEventListener('click', function() {
            var cityStateArray = cityState.split(', ');
            var cityName = cityStateArray[0];
            var stateCode = cityStateArray[1];
            fetchWeatherData(cityName, stateCode);
        });
        searchHistoryDiv.appendChild(cityButton);
    });
}

// Initial load of search history
displaySearchHistory();