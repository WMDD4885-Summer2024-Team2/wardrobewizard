import { getOutfitCount,genreateOutfits,getFileAsBase64,saveHistoryToDb,saveFavoriteToDb } from "./common.js";

import { wardrowizAlert } from "./common.js";
import { firebase } from "./firebase.js";
import { collection, doc, addDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
// export const init = async () => {
//   loader.style.display='flex';
//   try {
//     const outfitArray = await getOutfitCount();
//     console.log(outfitArray);

//    /*  const count = Array.isArray(outfitArray) ? outfitArray.length : 0;
//  */
//     const uploadOutfitSection = document.getElementById('uploadoutfitsection');
//     const outfitUpload = document.getElementById('outfitupload');

//     if (uploadOutfitSection) {
//       uploadOutfitSection.style.display = outfitArray < 2 ? 'grid' : 'none';
//     }


//     if(uploadOutfitSection.style.display === 'none'){

//        todaysSuggestionSection.style.display='grid';

//         await outfitGenreator();
//         const virtytryon = document.querySelectorAll('.virtual-try');
//         if(virtytryon){
//           virtytryon.forEach( (ele) =>{
//             ele.addEventListener('click',dovirtytryon);
//           })
//         }
//         modelCloseBtn.addEventListener('click',()=>{
//           mySizeChartModal.close();
//         });

//     }

//     if (outfitUpload) {
//       outfitUpload.addEventListener('click', () => {
//         window.location.href = '#uploadoutfithome';
//       });
//     }
//     loader.style.display='none';
//   } catch (error) {
//     console.error('Error initializing the app:', error);
//     loader.style.display='none';
//   }
// };

// const outfitGenreator = async() =>{
//   let outfits;
//   outfits= await genreateOutfits();
//   todayssuggestions.innerHTML='';

//   const outfit=outfits[Math.floor(Math.random() * outfits.length)];

//   if(outfit){

//     let tags='';

//     outfit[0].tags.forEach((tag) => 
//           {tags+=`<span class='tag-info'>${tag}</span>`
//     });


//     outfit[1].tags.forEach((tag) => 
//           {tags+=`<span class='tag-info'>${tag}</span>`
//     });

//     todayssuggestions.innerHTML+=`<div class='card flex-grow'>
//       <div class="flex  flex-row-nowrap justify-space-between align-items-center card-header"> 
//        <i class="fa-regular fa-heart icon-solid"></i>

//         <span class="virtual-try">Virtual Try On</span>

//       </div>

//       <div class='card-body'>
//         <img src='${outfit[0].downloadURL}' alt='${outfit[0].category}'>
//         <img src='${outfit[0].downloadURL}'  alt='${outfit[0].category}'>
//       </div>
//       <div class='card-footer'>
//         ${tags}
//       </div>


//     </div>`;

//    // saveHistoryToDb(`{"data" : ${outfit}`);

//   }

// }


// const dovirtytryon = async (e) =>{

//   const card=e.target.closest('.card');
//   const imgs= card.getElementsByTagName('img');
//   console.log(imgs[0].alt);
//   mySizeChartModal.show();
//   loader1.style.display='flex';



//  const modelImag = await getFileAsBase64(image1.src);
//  const outfitImage = imgs[0].src;
//  const request = {
//   "model": modelImag,
//   "garment_top": outfitImage,
//   "garment_type": imgs[0].alt==='dress' ? 'dress' : imgs[0].alt==='top' ? 'upper_body' : 'lower_body',
//   "desc": imgs[0].alt==='dress' ? 'dress' : imgs[0].alt==='top' ? 'shirt' : 'jeans'
// };



// const result= await fetchData(config.virtualTryOnAPI,"POST",request);

// image1.src=response.image.url;

// }
export const init = async () => {


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

  const conditions = document.getElementById('conditions');
  conditions.innerHTML = data.data[0].weather.description;

  const result = data.data[0].weather.description;

  const suggestionBox = document.createElement('div');
  suggestionBox.className = 'suggestion';
  const image = document.createElement('img');
  const label = document.createElement('h3');

  if (result.toLowerCase().includes('rain')) {
    image.src = "resources/images/umbrella.jpeg";
    label.innerText = `Looks like it's gonna pour! Don't forget your umbrella ☔️`;
    suggestionBox.appendChild(label);
    suggestionBox.appendChild(image);
  } else if (result.toLowerCase().includes('sun')) {
    image.src = 'resources/images/sunglasses.jpg';
    label.innerText = `Sunny vibes ahead! Grab those shades and enjoy 😎.`;
    suggestionBox.appendChild(label);
    suggestionBox.appendChild(image);
  } else if (result.toLowerCase().includes('cloud')) {
    image.src = 'resources/images/jacket.jpeg';
    label.innerText = `Take Light Jacket or Sweater with you, In case it gets cooler.`;
    suggestionBox.appendChild(label);
    suggestionBox.appendChild(image);
  } else {
    label.innerText = `Weather's looking fine, enjoy your day!`;
    suggestionBox.appendChild(label);
  }
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



  loader2.style.display = 'flex';
  showMatchingOutfit();
  createWeatherRecommendation();



  var topRecommendedOutfit = document.getElementById('top_recommended_outfit');
  var bottomRecommendedOutfit = document.getElementById('bottom_recommended_outfit');

  



  async function showMatchingOutfit() {
    
    try {
      const searchResult = await genreateOutfits();
      const matchingoutfit = document.getElementById('likeBtn');


      matchingoutfit.innerHTML = '';

      if (searchResult.length > 0) {
        loader2.style.display = 'none';
        const outfit = searchResult[Math.floor(Math.random() * searchResult.length)];
        topRecommendedOutfit.innerHTML = `<img src='${outfit[0].imageUrl}' alt=''>`;
        bottomRecommendedOutfit.innerHTML = `<img src='${outfit[1].imageUrl}' alt=''>`;
        // console.log(outfit[0].image64);
        generateClothes(outfit[0].image64, outfit[1].image64);

        storeOutfitInDatabase(outfit, matchingoutfit);
        //  loader.style.display = "none";
      } else {
        loader2.style.display = 'none';
        topRecommendedOutfit.innerHTML = `<p>No outfits are there</p>`;
    
        console.log('No matching outfit found');
      }
    } catch (error) {
      console.error('Error generating outfit:', error);
    }
  }
  // showMatchingOutfit();
  
  let outfit_id;
  const storeOutfitInDatabase = (outfit, matchingoutfit) => {

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
  generate_outfit.addEventListener('click', showMatchingOutfit);
 
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
  let listenerAdded = false;
  loader.style.display = 'none';


  function generateClothes(topGarment, lowerGarment) {
  if (!listenerAdded) {

    virtualTryOn.addEventListener('click', async function (e) {
    e.preventDefault();
    loader.style.display = 'flex';


    // var topGarment = clothes_manager.find(obj => obj.garment_type === 'top');
    // var lowerGarment = clothes_manager.find(obj => obj.garment_type === 'bottom');


    console.log(topGarment);
    console.log(lowerGarment);

    const response = await fetchData(base64data1, topGarment, "upper_body", "shirt");

    setTimeout(async () => {
      console.log("Upload timed out after 5 seconds");
      // uploadBottom(response.image.url);
      image1.src = response.image.url;

      const jsonData = await fetchData(response.image.url, lowerGarment, "lower_body", "jeans");
      // uploadBottom(jsonData.image.url);
      image1.src = jsonData.image.url;
      loader.style.display = 'none';

    }, 5000); // 5 seconds



  });
  listenerAdded = true;

}
}


const image1 = document.getElementById('image1');


const canvas1 = document.createElement('canvas');





canvas1.width = image1.width;
canvas1.height = image1.height;

const ctx1 = canvas1.getContext('2d');
ctx1.drawImage(image1, 0, 0);

const base64data1 = canvas1.toDataURL('image/jpeg');


// function uploadBottom(srcData){
//   image1.src = srcData;

// }

// Get the modal
var ebModal = document.getElementById('mySizeChartModal');
ebModal.style.display = "none";
vton.style.display= 'none';

// Get the button that opens the modal
var ebBtn = document.getElementById("virtualTryOn");

// Get the <span> element that closes the modal
var ebSpan = document.getElementById("closeModal");

// When the user clicks the button, open the modal 
ebBtn.onclick = function() {
    ebModal.style.display = "block";
    vton.style.display= 'block';

}

// When the user clicks on <span> (x), close the modal
ebSpan.onclick = function() {
    ebModal.style.display = "none";
    vton.style.display= 'none';

}


}