const cities = [
    { name: "Seattle", id: "seattle", lat: 47.6062, lon: -122.3321 },
    { name: "Detroit", id: "detroit", lat: 42.3314, lon: -83.0458 },
    { name: "Oslo", id: "oslo", lat: 59.9139, lon: 10.7522 },
    { name: "Tokyo", id: "tokyo", lat: 35.6762, lon: 139.6503 },
    { name: "Moscow", id: "moscow", lat: 55.7558, lon: 37.6173 },
    { name: "Brasília", id: "brasília", lat: -15.7942, lon: -47.8822 }
];

function getWeatherDescription(code) {
    switch (code) {
        case 0:
            return "Clear sky";
        case 1:
        case 2:
        case 3:
            return "Partly cloudy";
        case 45:
        case 48:
            return "Foggy";
        case 51:
        case 53:
        case 55:
            return "Drizzle";
        case 61:
        case 63:
        case 65:
            return "Rain";
        case 71:
        case 73:
        case 75:
            return "Snow";
        case 95:
            return "Thunderstorm";
        default:
            return "Unknown";
    }
}

function fetchWeather(city) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch weather data for ${city.name}`);
            }
            return response.json();
        })
        .then(data => {
            const temperature = data.current_weather.temperature;
            const conditionCode = data.current_weather.weathercode;
            const conditionDescription = getWeatherDescription(conditionCode);

            document.getElementById(`temp-${city.id}`).textContent = `${temperature}°C`;
            document.getElementById(`cond-${city.id}`).textContent = conditionDescription;
        })
        .catch(error => {
            console.error(error);
            document.getElementById(`temp-${city.id}`).textContent = "Error";
            document.getElementById(`cond-${city.id}`).textContent = "Error";
        });
}

function updateWeather() {
    cities.forEach(city => {
        fetchWeather(city);
    });
}

setInterval(updateWeather, 10 * 60 * 1000);
updateWeather();

//____________________________________________________________________________________________________

let postLimit = 6;
let postPage = 1;
const postsContainer = document.getElementById('posts-container');

function fetchPosts() {
    const apiUrl = `https://jsonplaceholder.typicode.com/posts?_limit=${postLimit}&_page=${postPage}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(post => {

                const postBox = document.createElement('div');
                postBox.classList.add('post-box');
                
                postBox.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                `;
                postsContainer.appendChild(postBox);
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
}

function loadMorePosts() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        postPage++;
        fetchPosts();
    }
}

fetchPosts();

window.addEventListener('scroll', loadMorePosts);
