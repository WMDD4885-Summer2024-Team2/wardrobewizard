import { getOutfitCount,genreateOutfits,getFileAsBase64,saveHistoryToDb,saveFavoriteToDb , loadFavouritesData} from "./common.js";

import { wardrowizAlert } from "./common.js";
import { firebase } from "./firebase.js";
import { collection, doc, addDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

export const init = async () => {


  // virtualTryOn.addEventListener('click', function(){
  //   document.getElementById("sidebar").classList.toggle('active');

  // })
  let cnt = 0;
  let interval = null;

  closeSideBar.addEventListener('click', function(){
    document.getElementById("sidebar").classList.toggle('active');
   startLoader(false);
  })

  loadFavouritesData().then((favoriteArray) => {
    console.log(favoriteArray);
    top_favorite_outfit.innerHTML = `<img src='${favoriteArray[0].top.imageUrl}' alt=''>`;
    bottom_favorite_outfit.innerHTML = `<img src='${favoriteArray[0].bottom.imageUrl}' alt=''>`;
    
    likeFav.innerHTML += `<div class="con-like">
    <input class="like" type="checkbox" checked title="like">
    <div class="checkmark">
    <svg xmlns="http://www.w3.org/2000/svg" class="outline" viewBox="0 0 24 24">
    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" class="filled" viewBox="0 0 24 24">
    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" class="celebrate">
    <polygon class="poly" points="10,10 20,20"></polygon>
    <polygon class="poly" points="10,50 20,50"></polygon>
    <polygon class="poly" points="20,80 30,70"></polygon>
    <polygon class="poly" points="90,10 80,20"></polygon>
    <polygon class="poly" points="90,50 80,50"></polygon>
    <polygon class="poly" points="80,80 70,70"></polygon>
    </svg>
    </div>
    </div>`;

  }).catch((error) => {
    console.error(error);
  });

  viewFav.addEventListener('click', function(){
    window.location.href = '#lookbook';
  })

  userWelcome.innerHTML = `Welcome ${firebase.getUser().displayName} to your digital closet.`
const createWeatherRecommendation = () => {
  const lat = sessionStorage.getItem('latitude');
  const lon = sessionStorage.getItem('longitude');
  const latitude = lat === 'null' || lat === 'undefined' ? null : lat;
  const longitude = lon === 'null' || lon === 'undefined' ? null : lon;


  if (!!latitude || !!longitude) {
    fetchDataFromWeatherAPI(latitude, longitude);
  }
  else {
    getLocation().then(position => {
      console.log("Geolocation obtained successfully:", position);
    }).catch(error => {
      console.error("Error obtaining geolocation:", error);
    });
  }
}

const fetchDataFromWeatherAPI = async(latitude, longitude) => {
  const apiKey = "d3fb1f87ce8d4a17aff8019ecb8b9262";
  try {
    const response = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data != null) {
      console.log(data , "test");
      showWeatherSuggestion(data);
    } else {
      console.log('Weather API did not return any data');
    }

  } catch (error) {
    console.error('Error:', error);
  }
  
}


const showWeatherSuggestion = (data) => {
  const city = document.getElementById('city_name');
  city.innerHTML = data.data[0].city_name;

  const temp = document.getElementById('temp');
  temp.innerHTML = `${data.data[0].temp}°C`;
  weatherImage.src = `https://www.weatherbit.io/static/img/icons/${data.data[0].weather.icon}.png`;
  const conditions = document.getElementById('conditions');
  conditions.innerHTML = data.data[0].weather.description;

  const result = data.data[0].weather.description;

  const suggestionBox = document.createElement('div');
  suggestionBox.className = 'suggestion';
  const image = document.createElement('img');
  const image2 = document.createElement('img');
  const label = document.createElement('h3');
  const temperature = data.data[0].temp;

  // Show different accessories based on the temperature
  if (temperature < 10) {
    // Show winter accessories (e.g. hats, scarves, gloves)
    image.src = 'resources/images/hatscarfgloves.jpg';
    label.innerText = `Stay warm! Wear a hat, scarf, and gloves.`;
    suggestionBox.appendChild(label);
    suggestionBox.appendChild(image);
  } else if ((temperature < 20) && result.toLowerCase().includes('rain')) {
    // Show spring/fall accessories (e.g. light jackets, sunglasses)
    image.src = "resources/images/umbrella.jpeg";
    label.innerText = `Looks like it's gonna pour! Don't forget your umbrella ☔️`;
    suggestionBox.appendChild(label);
    suggestionBox.appendChild(image);
  } else if ((temperature < 20) && result.toLowerCase().includes('sun')) {
    image.src = 'resources/images/polarized-sunglasses.jpg';
    label.innerText = `Sunny vibes ahead! Grab those shades and enjoy 😎.`;
    suggestionBox.appendChild(label);
    suggestionBox.appendChild(image);
    // Show summer accessories (e.g. shorts, t-shirts, sandals)
  } else {
    image.src = 'resources/images/polarized-sunglasses.jpg';
    label.innerText = `Sunny vibes ahead! Grab those shades and don't forget to apply sunscreen! 😎.`;
    suggestionBox.appendChild(label);
    suggestionBox.appendChild(image);
    image2.src = 'resources/images/sunscreen.jpg';
    suggestionBox.appendChild(image2);

  }
  // if (result.toLowerCase().includes('rain')) {
  //   image.src = "resources/images/umbrella.jpeg";
  //   label.innerText = `Looks like it's gonna pour! Don't forget your umbrella ☔️`;
  //   suggestionBox.appendChild(label);
  //   suggestionBox.appendChild(image);
  // } else if (result.toLowerCase().includes('sun')) {
  //   image.src = 'resources/images/sunglasses.jpg';
  //   label.innerText = `Sunny vibes ahead! Grab those shades and enjoy 😎.`;
  //   suggestionBox.appendChild(label);
  //   suggestionBox.appendChild(image);
  // }  else {
  //   label.innerText = `Weather's looking fine, enjoy your day!`;
  //   suggestionBox.appendChild(label);
  // }
  suggestionContainer.appendChild(suggestionBox);
}

const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      console.log("Geolocation is supported. Requesting location...");
      const options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      };
      function success(position) {
        const crd = position.coords;
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        sessionStorage.setItem('latitude', crd.latitude);
        sessionStorage.setItem('longitude', crd.longitude);
        fetchDataFromWeatherAPI(crd.latitude, crd.longitude);
        console.log(`More or less ${crd.accuracy} meters.`);
      }
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        sessionStorage.setItem('latitude', undefined);
        sessionStorage.setItem('longitude', undefined);
      }
      navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}



  loader.style.display = 'flex';
  showMatchingOutfit();
  createWeatherRecommendation();



  var topRecommendedOutfit = document.getElementById('top_recommended_outfit');
  var bottomRecommendedOutfit = document.getElementById('bottom_recommended_outfit');

  
let matchingDataArray = [];

  async function showMatchingOutfit() {
    
    try {
      const searchResult = await genreateOutfits();
      const matchingoutfit = document.getElementById('likeBtn');


      matchingoutfit.innerHTML = '';

      if (searchResult.length > 0) {
        loader.style.display = 'none';
        const outfit = searchResult[Math.floor(Math.random() * searchResult.length)];
        topRecommendedOutfit.innerHTML = `<img src='${outfit[0].imageUrl}' alt=''>`;
        bottomRecommendedOutfit.innerHTML = `<img src='${outfit[1].imageUrl}' alt=''>`;
        console.log(searchResult);
        matchingDataArray.push(searchResult);
        // generateClothes(outfit[0].image64, outfit[1].image64);

        storeOutfitInDatabase(outfit, matchingoutfit);
        //  loader.style.display = "none";
      } else {
        loader.style.display = 'none';
        topRecommendedOutfit.innerHTML = `<p>No outfits are there</p>`;
    
        console.log('No matching outfit found');
      }
    } catch (error) {
      console.error('Error generating outfit:', error);
    }
  }
  
  let outfit_id;
  const storeOutfitInDatabase = (outfit, matchingoutfit) => {
console.log(outfit);
    const top = {
      garment_type: outfit[0].garment_type,
      imageUrl: outfit[0].imageUrl,
      occasion: outfit[0].occasion,
      color: outfit[0].colorName,
      image64: outfit[0].image64,
      tags: outfit[0].tags
    }
    const bottom = {
      garment_type: outfit[1].garment_type,
      imageUrl: outfit[1].imageUrl,
      occasion: outfit[1].occasion,
      color: outfit[1].colorName,
      image64: outfit[1].image64,
      tags: outfit[1].tags
    }

    const structuredOutfitData = [top, bottom];
    addOutfitToHistory(top, bottom);
    addOutfitToFavorites(matchingoutfit, structuredOutfitData);

  }

  const addOutfitToHistory = (top, bottom) => {
    const outfitsData = {
      outfit: { top, bottom },
      createdAt: new Date()
    };
    saveHistoryToDb(outfitsData);
  }

  const addOutfitToFavorites = (matchingoutfit, outfit) => {

    let islike = false;
    const heartButton = document.createElement('button');
    heartButton.innerHTML = `<div class="con-like">
        <input class="like" type="checkbox" title="like">
        <div class="checkmark">
        <svg xmlns="http://www.w3.org/2000/svg" class="outline" viewBox="0 0 24 24">
        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" class="filled" viewBox="0 0 24 24">
        <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" class="celebrate">
        <polygon class="poly" points="10,10 20,20"></polygon>
        <polygon class="poly" points="10,50 20,50"></polygon>
        <polygon class="poly" points="20,80 30,70"></polygon>
        <polygon class="poly" points="90,10 80,20"></polygon>
        <polygon class="poly" points="90,50 80,50"></polygon>
        <polygon class="poly" points="80,80 70,70"></polygon>
        </svg>
        </div>
        </div>`;
    heartButton.addEventListener('click', () => {
      islike = !islike;
      if (islike) {
        addOutfitToFav(outfit);
        wardrowizAlert('Outfit has been added to favorites')
      } else {

        const outfitDocRef = doc(collection(doc(firebase.getDB(), 'favorites', firebase.getUser().email), 'favfit'), outfit_id);
        

        deleteDoc(outfitDocRef).then(() => {
          console.log('removed from favorites');
          wardrowizAlert('Outfit has been removed from favorites');
        }).catch((error) => {
          console.error('Error deleting outfit document:', error);
        });
      }
    });
    matchingoutfit.appendChild(heartButton);
  }
  const addOutfitToFav = (outfit) => {
    const outfitsData = {
      top: outfit[0],
      bottom: outfit[1]
    };
    // saveFavoriteToDb(outfitsData);

    addDoc(collection(firebase.getDB(), "favorites", firebase.getUser().email, "favfit"), outfitsData)
    .then((docRef) => {
      outfit_id = docRef.id;
      console.log(`Document ID: ${docRef}`);
    })
    .catch((error) => {
      console.error("Error adding document:", error);
    });
  }

  var generate_outfit = document.getElementById('genrateOutfit');
  // generate_outfit.addEventListener('click', showMatchingOutfit);

let  topGarment;
let lowerGarment;

  generate_outfit.addEventListener('click', function(){



    const matchingoutfit = document.getElementById('likeBtn');


    matchingoutfit.innerHTML = '';

    console.log(matchingDataArray[0].length);
    const randomIndex = Math.floor(Math.random() * matchingDataArray[0].length);
    topRecommendedOutfit.innerHTML = `<img src='${matchingDataArray[0][randomIndex][0].imageUrl}' alt=''>`;
    bottomRecommendedOutfit.innerHTML = `<img src='${matchingDataArray[0][randomIndex][1].imageUrl}' alt=''>`;

    topGarment = matchingDataArray[0][randomIndex][0].image64;
    lowerGarment = matchingDataArray[0][randomIndex][1].image64;

    storeOutfitInDatabase(matchingDataArray[0][randomIndex], matchingoutfit);

   // generateClothes(matchingDataArray[0][randomIndex][0].imageUrl, matchingDataArray[0][randomIndex][1].imageUrl);

  });
  async function fetchData(humanUrl, garmentUrl, garmentType, descr) {

    try {
      const data = {
        "model": humanUrl,
        "garment_top": garmentUrl,
        "garment_type": garmentType,
        "desc": descr
      };

      console.log(data);//https://us-central1-integrated-project1.cloudfunctions.net/virtualtryon/virtualOutfit
      var response = await fetch("http://localhost:3000/virtualOutfit", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const jsonData = await response.json();
      console.log(jsonData);
      return jsonData;
    } catch (error) {
      console.error(error);
    }
  }


  // let listenerAdded = false;
  loader2.style.display = 'none';
  headerWrite.innerHTML = `Hang tight! Your virtual try-on will be ready in just a minute. `
  // function generateClothes(topGarment, lowerGarment) {

  // if (!listenerAdded) {

    virtualTryOn.addEventListener('click', async function (e) {

    e.preventDefault();
    document.getElementById("sidebar").classList.toggle('active');

    loader2.style.display = 'flex';
    startLoader(true);
  

  

    // var topGarment = clothes_manager.find(obj => obj.garment_type === 'top');
    // var lowerGarment = clothes_manager.find(obj => obj.garment_type === 'bottom');


    console.log(topGarment);
    console.log(lowerGarment);
    // top_favorite_outfit.innerHTML = `<img src='${topGarment}' alt=''>`;
    // bottom_favorite_outfit.innerHTML = `<img src='${lowerGarment}' alt=''>`
    const response = await fetchData(base64data1, topGarment, "upper_body", "shirt");

    setTimeout(async () => {
      console.log("Upload timed out after 5 seconds");
      // uploadBottom(response.image.url);
      image1.src = response.image.url;

      const jsonData = await fetchData(response.image.url, lowerGarment, "lower_body", "jeans");
      // uploadBottom(jsonData.image.url);
      image1.src = jsonData.image.url;
      loader2.style.display = 'none';
    startLoader(false);
    document.querySelector(".progress").style.width =  `100%`;
    document.querySelector(".text").innerHTML = `<p>100%</p>`;
    headerWrite.innerHTML = `Wow, you look absolutely stunning in this outfit! `;


    }, 5000); // 5 seconds



  });
  // listenerAdded = true;

// }
// }


const image1 = document.getElementById('image1');


const canvas1 = document.createElement('canvas');





canvas1.width = image1.width;
canvas1.height = image1.height;

const ctx1 = canvas1.getContext('2d');
ctx1.drawImage(image1, 0, 0);

const base64data1 = canvas1.toDataURL('image/jpeg');

function startLoader(st){
  if(st){  
     
    if (!interval) {
    interval = setInterval(function() {
      cnt++;
      document.querySelector(".progress").style.width = cnt + "%";
      document.querySelector(".text").innerHTML = `<p>${cnt}%</p>`;
      if (cnt === 100) {
        clearInterval(interval);
        interval = null;
      }
    }, 2000);
  }
}
else{
    clearInterval(interval);
    interval = null
    cnt = 0;
    document.querySelector(".progress").style.width = cnt + "%";
    document.querySelector(".text").innerHTML = `<p>${cnt}%</p>`;

    console.log('stop');
  }

}


}