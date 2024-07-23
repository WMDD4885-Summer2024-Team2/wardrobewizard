
import { wardrowizAlert } from "./common.js";

import { firebase } from './firebase.js';

import {onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const auth = firebase.auth;
const db = firebase.getDB();

const aboutUs = document.getElementById('aboutUs');
const about = document.getElementById('about');

const whoUs = document.getElementById('whoUs');
const who = document.getElementById('who');

const teamUs = document.getElementById('teamUs');
const team = document.getElementById('team');

aboutUs.addEventListener('click', () => {
  about.scrollIntoView({ behavior: 'smooth' });
});
whoUs.addEventListener('click', () => {
  who.scrollIntoView({ behavior: 'smooth' });
});
teamUs.addEventListener('click', () => {
  team.scrollIntoView({ behavior: 'smooth' });
});
var signout = document.getElementById('signout');
signout.addEventListener('click', function () {

  signOut(auth).then(() => {
  //  location.reload();

    console.log("User signed out");
    wardrowizAlert('See you !');

  }).catch((error) => {

    console.error("Error signing out:", error);
  });

})

onAuthStateChanged(auth, (user) => {
  if (user) {
    // user is logged in, enable button
    document.getElementById("login").style.display = "none";
    document.getElementById("wardrowizHome").style.display = "block";
    document.getElementById("signout").style.display = "block";

  } else {
    // user is not logged in, disable button
    document.getElementById("login").style.display = "block";
    document.getElementById("wardrowizHome").style.display = "none";
    document.getElementById("signout").style.display = "none";
    console.log("logged out");

  }
});





function getLocation() {
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

getLocation().then(position => {
    console.log("Geolocation obtained successfully:", position);
  }).catch(error => {
    console.error("Error obtaining geolocation:", error);
  });