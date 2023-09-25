const main = document.getElementById('present-forecast');
const viewSelect = document.getElementById('view-select');

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

viewSelect.value = '7-day';

const celsiusToFahrenheit = (celsiusValue) => {
    return (celsiusValue * 1.8) + 32
}

const getSevenDayForecast = async () => {
    main.innerHTML = '';
    const response = await fetch('https://api.weather.gov/gridpoints/AKQ/44,77/forecast', {cache: 'no-cache'});
    const data = await response.json();
    const { periods } = data.properties;
    periods.forEach(period => {
        let { name, startTime, endTime, isDaytime, temperature, temperatureUnit, relativeHumidity, icon, shortForecast, detailedForecast } = period;
        startTime = new Date(startTime).toLocaleString();
        endTime = new Date(endTime).toLocaleString();
        startTime = startTime.replace(':00:00 ', '');
        endTime = endTime.replace(':00:00 ', '');
        icon = icon.replace('medium', 'large');
        isDaytime = isDaytime ? 'day' : 'night';
        main.innerHTML += `<div class="card ${isDaytime}">
                                <h2>${name}</h2>
                                <p class="timeframe">${startTime} &ndash; ${endTime}</p>
                                <div class="middle-banner">
                                    <img src="${icon}">
                                    <div class="stats">
                                        <p class="temperature">${temperature}&deg;${temperatureUnit}</p>
                                        <p class="humidity">${relativeHumidity.value}% moist</p>
                                    </div>
                                </div>
                                <p class="short-forecast-description">${shortForecast}</p>
                                <details>
                                    <summary>Select for detailed forecast</summary>
                                    <p>${detailedForecast}</p>
                                </details>
                            </div>`
    });
};

const getSevenDayHourlyForecast = async () => {
    main.innerHTML = '';
    const response = await fetch('https://api.weather.gov/gridpoints/AKQ/44,77/forecast/hourly', {cache: 'no-cache'});
    const data = await response.json();
    const { periods } = data.properties;
    periods.forEach(period => {
        let { startTime, endTime, isDaytime, temperature, temperatureUnit, relativeHumidity, icon, shortForecast} = period;
        const day = new Date(startTime).getDay();
        startTime = new Date(startTime).toLocaleString();
        endTime = new Date(endTime).toLocaleString();
        startTime = startTime.replace(':00:00 ', '');
        endTime = endTime.replace(':00:00 ', '');
        icon = icon.replace('small', 'medium');
        isDaytime = isDaytime ? 'day' : 'night';
        main.innerHTML += `<div class="card ${isDaytime}">
                                <h2>${dayNames[day]}</h2>
                                <p class="timeframe">${startTime} &ndash; ${endTime}</p>
                                <div class="middle-banner">
                                    <img src="${icon}">
                                    <div class="stats">
                                        <p class="temperature">${temperature}&deg;${temperatureUnit}</p>
                                        <p class="humidity">${relativeHumidity.value}% moist</p>
                                    </div>
                                </div>
                                <p class="short-forecast-description">${shortForecast}</p>
                            </div>`;
    });
};

const getLatestObservation = async () => {
    main.innerHTML = '';
    const response = await fetch('https://api.weather.gov/stations/KRIC/observations/latest', {cache: 'no-cache'});
    const data = await response.json();
    const { properties } = data;
    
    let { timestamp, isDaytime, temperature, relativeHumidity, icon, shortForecast} = properties;
        timestamp = new Date(timestamp).toLocaleString();
        timestamp = timestamp.replace(':00:00 ', '');
        icon = icon.replace('medium', 'large');
        main.innerHTML += `<div class="card ${isDaytime}">
                                <p class="timeframe">${timestamp}</p>
                                <div class="middle-banner">
                                    <img src="${icon}">
                                    <div class="stats">
                                        <p class="temperature">${celsiusToFahrenheit(temperature.value).toFixed(0)}&deg;F</p>
                                        <p class="humidity">${relativeHumidity.value.toFixed(0)}% moist</p>
                                    </div>
                                </div>
                            </div>`;
};

viewSelect.onchange = () => {
    switch(viewSelect.value) {
        case '7-day':
            getSevenDayForecast();
            break;
        case 'hourly':
            getSevenDayHourlyForecast();
            break;
        case 'current observation':
            getLatestObservation();
            break;
        default:
            throw new Error('uh oh bestie');
    }
}

getSevenDayForecast();