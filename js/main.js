

import { Firebase } from "./firebase.js";
import config from '../resources/config.json' with { type: 'json' };
import { navigateToPage,base64ToBlob,hexToHsl,startCamera,stopCamera,fetchData } from "./common.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { genreateOutfit } from "./outfitsearch.js";

const colorThief = new ColorThief();
const firebase =new Firebase(config);
const context = canvas.getContext('2d');


//init handler for hash navigation
window.addEventListener('hashchange', (event)=>{
  if(firebase.getUser() ){
    navigateToPage();
  }else{
    event.preventDefault();
    window.location.hash = ''; // Reset hash to prevent navigation
    page1.style.display='block';
  }
  
});

//SPA (Single Page Application)  - End



//User check
onAuthStateChanged(firebase.getAuth(), (user) => {
  if (user) {
    firebase.setUser(user);
    firebase.loadData();
    header.style.display = "block";
    
    userName.innerHTML = user.displayName;
    userEmail.innerHTML = user.email;
    window.location.href='#page2';
    
    
  } else {
    firebase.setUser(null);
    header.style.display = "none";
    window.location.href='#page1';
    
  }
});





//Sign In

const userSignIn = async () =>{
  let status=firebase.userSignIn();
  if(status){
    window.location.href='#page2';
  }
};


//Singout
const userSignOut = async () => {

  let status = firebase.userSignOut();
  if(status){
    window.location.href='#page1';
  }
  
};


const userSignInwithPassword = () =>{

}


const passwordRest = () =>{

}

const signup = () =>{

}


userLogin.addEventListener('click',userSignInwithPassword);
googleSignIn.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);


//Remove Image Background

let  rmbg = function() {
  const fileInput = document.getElementById("imageInput");
  const file = fileInput.files[0];

  if (file ) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      const base64String = e.target.result;

      /* // Send the Base64 string to the server
      fetch(config.rmbgURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64Image: base64String
        }),
      }) */
     const result= await fetchData(config.rmbgURL,"POST",{
        base64Image: base64String
      });

     
      
      document.getElementById("imagePreview").style.display = "block";
      document.getElementById("imagePreview").src = result;

      const img = document.getElementById("imagePreview");

      img.onload = function () {
        let dominantColor = colorThief.getColor(img);
        // Display the dominant color
        const r = parseInt(dominantColor[0]).toString(16).padStart(2, '0');
        const g = parseInt(dominantColor[1]).toString(16).padStart(2, '0');
        const b = parseInt(dominantColor[2]).toString(16).padStart(2, '0');
        const hexColor = `#${r}${g}${b}`;

        colorPicker.value = hexColor;
        document.getElementById("colorSchema").style.display = "block";

      };
      
    };
    reader.readAsDataURL(file);
  } else {
    alert("Please select an image file.");
  }
}



imageInput.addEventListener('change',rmbg);



let uploadOutfit = () =>{

  let outfit={
    'color' : hexToHsl(colorPicker.value),
    'catgeory' : catgeory.value,
    'tags' : []
  }

  firebase.uploadOutfitToStorage(base64ToBlob(imagePreview.src,'image/png'),outfit);


}

addItem.addEventListener('click',uploadOutfit)

// Request access to the camera
/* navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(error => {
        console.error('Error accessing the camera: ', error);
    }); */


const initCamera = () =>{
  videopath.style.display='block';
  startCamera(videopath);
}

const takeSnap = () => {
  videopath.style.display='none';
  //to scale properly we pass canvas width & height too
  context.drawImage(videopath, 0, 0, canvas.width, canvas.height);

  const canvasDataURL = canvas.toDataURL();
  //you can upload this to store image in an Storage
  console.log(canvasDataURL);
  stopCamera(videopath)
}

startCameraBtn.addEventListener('click',initCamera);

snapImage.addEventListener('click',takeSnap);

const showOutfit=()=>{
  displayOutfit.innerHTML='';

  firebase.getCategories().forEach(catgeory => {
    firebase.getOutfitByCategory(catgeory).forEach((outfit) => {
      displayOutfit.innerHTML+=`<img src='${outfit.downloadURL}' alt=''>`
    });
  });
  
}

const  showMatchingOutfit = async () =>{
  const searchResult= await genreateOutfit(firebase.getOutfitByCategory('top'),firebase.getOutfitByCategory('bottom'),'Auto');
  matchingoutfit.innerHTML='';

  const outfit=searchResult[Math.floor(Math.random() * searchResult.length)];
  if(outfit){
    matchingoutfit.innerHTML+=`<img src='${outfit[0].downloadURL}' alt=''>`
    matchingoutfit.innerHTML+=`<img src='${outfit[1].downloadURL}' alt=''>`
  }
  
};

viewwardrobe.addEventListener('click',showOutfit);

//setTimeout(showMatchingOutfit,10000);

genrateOutfit.addEventListener('click', showMatchingOutfit);

userSignUp.addEventListener('click', (e)=>{
  e.preventDefault();
  firebase.createUser(username.value,password.value);
});