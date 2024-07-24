// import { getOutfitCount,genreateOutfits,getFileAsBase64,saveHistoryToDb } from "./common.js";
// import config from '../resources/config.json' with { type: 'json' };
// import {fetchData} from "./utils.js";
import { wardrowizAlert } from "./common.js";

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

   // saveHistoryToDb(`{"data" : ${outfit}`);

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



import { genreateOutfit } from "./outfitsearch.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, collection, doc, addDoc, setDoc, getDocs, getDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyBxkMWakgmz97Ulk79whfqSQcA-Q2uXQDA",
  authDomain: "integrated-project1.firebaseapp.com",
  projectId: "integrated-project1",
  storageBucket: "integrated-project1.appspot.com",
  messagingSenderId: "168333709827",
  appId: "1:168333709827:web:eb9a1c473b1af653aeb436",
  measurementId: "G-MSNKDYWBK4"
};
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);
const auth = getAuth(firebase);
auth.languagecode = 'en';
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const user = auth.currentUser;
const storage = getStorage();
let filteredDataTop = [];
let filteredDataBottom = [];
let email;
let uid;

onAuthStateChanged(auth, (user) => {

  if (user) {
    uid = user.uid;
    email = user.email;
    getData(uid);
  } else {

  }
});
export const init = async () => {
}
console.log('email', email);
const collectionName = 'outfit-info';
var outfit_info_data = [];
var history_info_data = [];
function getData(documentId) {
  const documentRef = doc(db, 'outfit-info', documentId);
  const subcollectionRef = collection(documentRef, 'outfit');
  getDocs(subcollectionRef).then((querySnapshot) => {

    querySnapshot.forEach((doc) => {
      var data = doc.data();
      //   console.log(data);
      outfit_info_data.push(data);


    });
    outputResult(outfit_info_data);

    filteredDataTop = outfit_info_data.filter(item => item.garment_type == "top");
    filteredDataBottom = outfit_info_data.filter(item => item.garment_type == "bottom");

  });

  const history = doc(db, 'history', email);
  const historyRef = collection(history, 'historyOutfit');
  getDocs(historyRef).then((querySnapshot) => {

    querySnapshot.forEach((doc) => {
      var data = doc.data();
      //   console.log(data);
      history_info_data.push(data);


    });

    outputHistorytResult(history_info_data);

  });


}

var topRecommendedOutfit = document.getElementById('top_recommended_outfit');
  var bottomRecommendedOutfit = document.getElementById('bottom_recommended_outfit');

function outputHistorytResult(history_info_data) {
  console.log(history_info_data);
  
  const randomIndex = Math.floor(Math.random() * history_info_data.length);
  const randomObject = history_info_data[randomIndex];

  console.log(randomIndex);
  if(history_info_data.length == 0){
    topRecommendedOutfit.innerHTML = "No Outfit";
  }else{
  topRecommendedOutfit.innerHTML = `<img src='${randomObject.outfit.top.imageUrl}' alt=''>`;
  bottomRecommendedOutfit.innerHTML = `<img src='${randomObject.outfit.bottom.imageUrl}' alt=''>`;

  }
}

function outputResult(outfit_info_data) {
  console.log(outfit_info_data);
  filteredDataTop = outfit_info_data.filter(item => item.garment_type == "top");
  filteredDataBottom = outfit_info_data.filter(item => item.garment_type == "bottom");
}
async function showMatchingOutfit() {
  // loader.style.display = "block";
  console.log(filteredDataTop);
  console.log(filteredDataBottom);
  try {
    const searchResult = await genreateOutfit(filteredDataTop, filteredDataBottom, 'Auto');
    const matchingoutfit = document.getElementById('likeBtn');
    
  
    matchingoutfit.innerHTML = '';

    if (searchResult.length > 0) {
      const outfit = searchResult[Math.floor(Math.random() * searchResult.length)];
      topRecommendedOutfit.innerHTML = `<img src='${outfit[0].imageUrl}' alt=''>`;
      bottomRecommendedOutfit.innerHTML = `<img src='${outfit[1].imageUrl}' alt=''>`;
      // console.log(outfit[0].image64);
      console.log('outfit', outfit);
      const top = {
        garment_type: outfit[0].garment_type,
        imageUrl: outfit[0].imageUrl,
        occasion: outfit[0].occasion,
        color: outfit[0].colorName
      }
      const bottom = {
        garment_type: outfit[1].garment_type,
        imageUrl: outfit[1].imageUrl,
        occasion: outfit[1].occasion,
        color: outfit[1].colorName
      }

      const structuredOutfitData = [top, bottom]

      createLikeButton(matchingoutfit, structuredOutfitData);

      addOutfitToHistory(structuredOutfitData);
    //  loader.style.display = "none";
    } else {
      console.log('No matching outfit found');
    }
  } catch (error) {
    console.error('Error generating outfit:', error);
  }
}
let outfit_id;

function createLikeButton(matchingoutfit, outfit) {
  let islike = false;
  const heartButton = document.createElement('button');
  //heartButton.className = 'heart-button';
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
    console.log(`Heart clicked`);
    if (islike) {
    //  heartButton.style.fontSize = 'large';
      addOutfitToFav(outfit);
      wardrowizAlert('Outfit has been added to favorites')
    } else {
    //  heartButton.style.fontSize = 'small';
      const documentRef = doc(db, 'favorites', email);
      const subcollectionRef = collection(documentRef, 'favfit');
      const outfitDocRef = doc(subcollectionRef, outfit_id);

      deleteDoc(outfitDocRef).then(() => {
        console.log('Outfit document deleted successfully!');
        wardrowizAlert('Outfit has been removed from favorites');
      }).catch((error) => {
        console.error('Error deleting outfit document:', error);
      });
    }
  });
  matchingoutfit.appendChild(heartButton);
}
function addOutfitToFav(outfit) {
  console.log(outfit);
  const outfitsData = {
    top: outfit[0],
    bottom: outfit[1]
  };
  // Method to add outfit data to Fav Collection
  // addDoc(collection(db, "favorites", email, "favfit"), outfitsData);
  addDoc(collection(db, "favorites", email, "favfit"), outfitsData)
    .then((docRef) => {
      outfit_id = docRef.id;
      console.log(`Document ID: ${docRef}`);
    })
    .catch((error) => {
      console.error("Error adding document:", error);
    });


}

function addOutfitToHistory(outfit) {
  const structuredOutfit = {
    top: outfit[0],
    bottom: outfit[1]
  };
  const outfitsData = {
    outfit: structuredOutfit,
    createdAt: new Date()
  };
  addDoc(collection(db, "history", email, "historyOutfit"), outfitsData);
}

var generate_outfit = document.getElementById('genrateOutfit');
generate_outfit.addEventListener('click', showMatchingOutfit);
// loader.style.display = "none";
createWeatherRecommendation();

async function createWeatherRecommendation() {

  // const position = await getLocation();
  const lat = sessionStorage.getItem('latitude')
  const lon = sessionStorage.getItem('longitude')
  const latitude = lat === 'null' || lat === 'undefined' ? null : lat;
  const longitude = lon === 'null' || lon === 'undefined' ? null : lon;

  if (!!latitude || !!longitude) {
    console.log('lat', lat, lon);
    const apiKey = "240082a5a5ad45019573f09a73ca8d30";
    try {
      const response = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data != null) {
        console.log(data, 'data');
        const result = data.data[0].weather.description;
        showWeatherSuggestion(data);
      } else {
        alert('Not available');
      }

    } catch (error) {
      console.error('Error:', error);
    //  alert('Failed to get location or weather data');
    }
  }
  else {
  //  alert('Failed to get location or weather data')
  }
}



function showWeatherSuggestion(data) {
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

  if (result.toLowerCase().includes('cloud') || result.toLowerCase().includes('rain')) {
    image.src = "../umbrella.jpeg";
    label.innerText = `Looks like it's gonna pour! Don't forget your umbrella ☔️`;
    suggestionBox.appendChild(label);
    suggestionBox.appendChild(image);
  } else if (result.toLowerCase().includes('sun')) {
    image.src = '../sunglasses.jpg';
    label.innerText = `Sunny vibes ahead! Grab those shades and enjoy 😎.`;
    suggestionBox.appendChild(label);
    suggestionBox.appendChild(image);
  } else {
    label.innerText = `Weather's looking fine, enjoy your day!`;
    suggestionBox.appendChild(label);
  }
  suggestionContainer.appendChild(suggestionBox);
}

// var up_images = document.getElementById('uploadMoreImages');
// up_images.addEventListener('click', function (e) {
//   e.preventDefault();
//   window.location.href = '../uplaod_image/uploadImage.html';
// })
