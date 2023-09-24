const main = document.getElementById('present-forecast');
const viewSelect = document.getElementById('view-select');

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

viewSelect.value = '7-day';

const getSevenDayForecast = async () => {
    main.innerHTML = '';
    const response = await fetch('https://api.weather.gov/gridpoints/AKQ/44,77/forecast');
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
    const response = await fetch('https://api.weather.gov/gridpoints/AKQ/44,77/forecast/hourly');
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

viewSelect.onchange = () => {
    switch(viewSelect.value) {
        case '7-day':
            getSevenDayForecast();
            break;
        case 'hourly':
            getSevenDayHourlyForecast();
            break;
        default:
            throw new Error('uh oh bestie');
    }
}

getSevenDayForecast();