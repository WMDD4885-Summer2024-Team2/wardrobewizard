

import { Firebase } from "./firebase.js";
import config from '../resources/config.json' with { type: 'json' };
import { navigateToPage,base64ToBlob,hexToHsl } from "./commonutils.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const colorThief = new ColorThief();
const firebase =new Firebase(config);


//SPA (Single Page Application)  - Start

const allPages = document.querySelectorAll('div.page');
allPages[0].style.display = 'block';
navigateToPage(allPages);
//init handler for hash navigation
window.addEventListener('hashchange', navigateToPage(allPages));

//SPA (Single Page Application)  - End



//User check
onAuthStateChanged(firebase.getAuth(), (user) => {
  if (user) {
    firebase.setUser(user);
    firebase.loadData();
    signOutButton.style.display = "block";
    message.style.display = "block";
    userName.innerHTML = user.displayName;
    userEmail.innerHTML = user.email;
    page1.style.display = "none";
    page2.style.display = "block";
    
  } else {
    firebase.setUser(null);
    signOutButton.style.display = "none";
    message.style.display = "none";
    page1.style.display = "block";
    page2.style.display = "none";
  }
});


const signInButton = document.getElementById("googleLogin");
const signOutButton = document.getElementById("signOutButton");
const message = document.getElementById("message");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

signOutButton.style.display = "none";
message.style.display = "none";



//Sign In

const userSignIn = async () =>{
  let status=firebase.userSignIn();
  if(status){
    page1.display = "none";
    page2.display = "block";
  }
};


//Singout
const userSignOut = async () => {

  let status = firebase.userSignOut();
  if(status){
    alert("You have signed out successfully!");
    page1.style.display = "block";
    page2.style.display = "none";
  }
  
};


signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);


//Remove Image Background

let  rmbg = function() {
  const fileInput = document.getElementById("imageInput");
  const file = fileInput.files[0];

  if (file ) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const base64String = e.target.result;

      // Send the Base64 string to the server
      fetch(config.rmbgURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64Image: base64String
        }),
      })
        .then((response) => response.text())
        .then((result) => {
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
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
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
    'catgeory' : '',
    'tags' : []
  }

  firebase.uploadOutfitToStorage(base64ToBlob(imagePreview.src,'image.png'),outfit);


}

addItem.addEventListener('click',uploadOutfit)






