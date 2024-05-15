document.addEventListener('DOMContentLoaded', function () {
    getLocation();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather, showError);
    } else {
        showError("Geolocation não é suportado pelo seu navegador.");
    }
}

function showWeather(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = '4f496c61993dda46d7387928b4aa8784';

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao obter previsão do tempo: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const forecastData = data.list.filter((item, index) => index % 8 === 0); 
            const weatherContainer = document.getElementById('weather');
            weatherContainer.innerHTML = ''; 

            forecastData.forEach(day => {
                const date = new Date(day.dt * 1000);
                const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' });
                const icon = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`;

                const card = `
                    <div class="weather-card">
                        <h2>${dayOfWeek}</h2>
                        <p>${day.weather[0].description}</p>
                        <img src="${icon}" alt="${day.weather[0].description}">
                        <p>Temperatura: ${day.main.temp}°C</p>
                        <p>Humidade: ${day.main.humidity}%</p>
                    </div>
                `;
                weatherContainer.innerHTML += card;
            });
        })
        .catch(error => {
            console.error('Erro ao obter previsão do tempo:', error);
            const weatherContainer = document.getElementById('weather');
            weatherContainer.innerHTML = '<p>Erro ao obter previsão do tempo. Por favor, tente novamente mais tarde.</p>';
        });
}

function showError(error) {
    console.error('Erro ao obter localização:', error);
    const weatherContainer = document.getElementById('weather');
    weatherContainer.innerHTML = '<p>Erro ao obter localização. Por favor, permita o acesso à sua localização.</p>';
}
