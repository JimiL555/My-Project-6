var apiKey = '7ac58449a473e1de5175cb512d47a950';
var form = document.getElementById('city-form');
var cityInput = document.getElementById('city-input');
var currentWeatherDiv = document.getElementById('current-weather');
var forecastDiv = document.getElementById('forecast');
var searchHistoryDiv = document.getElementById('search-history');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    var cityName = cityInput.value.trim();
    if (cityName) {
        fetchWeatherData(cityName);
        saveSearchHistory(cityName);
        displaySearchHistory();
        cityInput.value = '';
    }
});

function fetchWeatherData(cityName) {
    var url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + apiKey + '&units=metric';
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            displayCurrentWeather(data);
            displayForecast(data);
        })
        .catch(function(error) {
            console.error('Error fetching weather data:', error);
        });
}

function displayCurrentWeather(data) {
    var weather = data.list[0];
    var weatherHTML = `
        <div class="weather-card">
            <h2>${data.city.name} (${new Date(weather.dt * 1000).toLocaleDateString()})</h2>
            <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" class="weather-icon" alt="${weather.weather[0].description}">
            <p>Temp: ${weather.main.temp} °C</p>
            <p>Humidity: ${weather.main.humidity}%</p>
            <p>Wind: ${weather.wind.speed} m/s</p>
        </div>
    `;
    currentWeatherDiv.innerHTML = weatherHTML;
}

function displayForecast(data) {
    forecastDiv.innerHTML = '';
    var forecastList = data.list.filter(function(_, index) {
        return index % 8 === 0;
    }).slice(1);
    forecastList.forEach(function(weather) {
        var weatherHTML = `
            <div class="weather-card">
                <h3>${new Date(weather.dt * 1000).toLocaleDateString()}</h3>
                <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" class="weather-icon" alt="${weather.weather[0].description}">
                <p>Temp: ${weather.main.temp} °C</p>
                <p>Humidity: ${weather.main.humidity}%</p>
                <p>Wind: ${weather.wind.speed} m/s</p>
            </div>
        `;
        forecastDiv.innerHTML += weatherHTML;
    });
}

function saveSearchHistory(cityName) {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

function displaySearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryDiv.innerHTML = '';
    searchHistory.forEach(function(city) {
        var cityButton = document.createElement('button');
        cityButton.textContent = city;
        cityButton.addEventListener('click', function() {
            fetchWeatherData(city);
        });
        searchHistoryDiv.appendChild(cityButton);
    });
}

// Initial load of search history
displaySearchHistory();