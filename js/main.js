
import { firebase } from "./firebase.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import { Router, Page } from './routing.js'
import { loadOutfitData } from "./common.js";


//User check
onAuthStateChanged(firebase.getAuth(), (user) => {
  if (user) {
    firebase.setUser(user);
   // firebase.loadData();
    loadOutfitData();
    window.location.href='#home';
    
    
  } else {
    firebase.setUser(null);
   
    window.location.href='#login';
    
  }
});


const loadRouter = () =>{
  Router.init('mainArea','headerArea','footerArea', [
    new Page('#login', 'pages/login.html'),
    new Page('#home', 'pages/home.html','pages/header.html'), 
    new Page('#addoutfit', 'pages/addoutfit.html','pages/header.html'),
    new Page('#viewwardrobe', 'pages/viewwardrobe.html','pages/header.html'),
    new Page('#history', 'pages/history.html','pages/header.html'),
    new Page('#favourites', 'pages/favourites.html','pages/header.html')
  ])
}
//setting up the Router with pages
setTimeout(loadRouter
,500);

