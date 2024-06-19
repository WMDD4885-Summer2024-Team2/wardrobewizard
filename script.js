

let imageArray = [];
let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(error => {
        console.error('Error accessing camera:', error);
    });

function takePicture() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    let imageData = canvas.toDataURL('image/png');
    imageArray.push(imageData);
    let image = document.createElement('img');
    image.src = imageData;
    document.getElementById('image-container').appendChild(image);
    console.log(imageArray);

    
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeather);
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

// function getWeather(position) {
//     let lat = position.coords.latitude;
//     let lon = position.coords.longitude;
//     let apiKey = 'c7a5e93050a92b8988fcca0aa938817d';
//     console.log(lat + " " + lon);
//     let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             let weather = document.getElementById('weather');
//             weather.innerHTML = `
//                 <h2>${data.name}</h2>
//                 <p>Temperature: ${data.main.temp} K</p>
//                 <p>Humidity: ${data.main.humidity}%</p>
//                 <p>Wind Speed: ${data.wind.speed} m/s</p>
//             `;
//         })
//         .catch(error => {
//             console.error('Error fetching weather data:', error);
//         });
// }

// getLocation();

