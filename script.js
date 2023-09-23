const main = document.getElementById('present-forecast');
const viewSelect = document.getElementById('view-select');

viewSelect.value = '7-day';

const getSevenDayForecast = async () => {
    main.innerHTML = '';
    const response = await fetch('https://api.weather.gov/gridpoints/AKQ/44,77/forecast');
    const data = await response.json();
    const { periods } = data.properties;
    periods.forEach(period => {
        let { name, startTime, endTime, isDaytime, temperature, temperatureUnit, icon, shortForecast, detailedForecast } = period;
        startTime = new Date(startTime).toLocaleString();
        endTime = new Date(endTime).toLocaleString();
        startTime = startTime.replace(':00:00 ', '');
        endTime = endTime.replace(':00:00 ', '');
        icon = icon.replace('medium', 'large');
        isDaytime = isDaytime ? 'day' : 'night';
        main.innerHTML += `<div class="card ${isDaytime}">
                                <h2>${name}</h2>
                                <p class="timeframe">${startTime} &ndash; ${endTime}</p>
                                <img src="${icon}">
                                <p class="temperature">${temperature}&deg;${temperatureUnit}</p>
                                <p class="short-forecast-description">${shortForecast}</p>
                                <details>
                                    <summary>Select for detailed forecast</summary>
                                    <p>${detailedForecast}</p>
                                </details>
                            </div>`
    });
};

const getHourlyForecast = async () => {
    main.innerHTML = '';
    const response = await fetch('https://api.weather.gov/gridpoints/AKQ/44,77/forecast/hourly');
    const data = await response.json();
    const { periods } = data.properties;
    periods.forEach(period => {
        let { startTime, endTime, isDaytime, temperature, temperatureUnit, icon, shortForecast} = period;
        startTime = new Date(startTime).toLocaleString();
        endTime = new Date(endTime).toLocaleString();
        startTime = startTime.replace(':00:00 ', '');
        endTime = endTime.replace(':00:00 ', '');
        icon = icon.replace('medium', 'large');
        isDaytime = isDaytime ? 'day' : 'night';
        main.innerHTML += `<div class="card ${isDaytime}">
                                <p class="timeframe">${startTime} &ndash; ${endTime}</p>
                                <img src="${icon}">
                                <p class="temperature">${temperature}&deg;${temperatureUnit}</p>
                                <p class="short-forecast-description">${shortForecast}</p>
                            </div>`
    });
};

viewSelect.onchange = () => {
    switch(viewSelect.value) {
        case '7-day':
            getSevenDayForecast();
            break;
        case 'hourly':
            getHourlyForecast();
            break;
        default:
            throw new Error('uh oh bestie');
    }
}

getSevenDayForecast();