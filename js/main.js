
import { firebase } from "./firebase.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import { Router, Page } from './routing.js'
import { loadOutfitData,loadUserProfile } from "./common.js";


//User check
onAuthStateChanged(firebase.getAuth(), async (user) => {
  if (user) {
    firebase.setUser(user);
    // firebase.loadData();
    loadOutfitData();

    const userProfile = await loadUserProfile();

    if (userProfile && userProfile.size == 0) {
      window.location.href = "#profilecreation";
    } else {
      window.location.href = "#home";
    }
  } else {
    firebase.setUser(null);

    window.location.href = "#login";
  }
});


const loadRouter = () =>{
  Router.init('mainArea','headerArea','footerArea', [
    new Page('#login', 'pages/login.html'),
    new Page('#home', 'pages/home.html','pages/header.html'), 
    new Page('#addoutfit', 'pages/addoutfit.html','pages/header.html'),
    new Page('#viewwardrobe', 'pages/viewwardrobe.html','pages/header.html'),
    new Page('#history', 'pages/history.html','pages/header.html'),
    new Page('#favourites', 'pages/favourites.html','pages/header.html'),
    new Page('#profilecreation', 'pages/profilecreation.html','pages/header.html'),
    new Page('#uploadoutfithome', 'pages/uploadoutfit.html','pages/header.html')
  ])
};

/* loadRouter(); */
//setting up the Router with pages
setTimeout(loadRouter
,500);

