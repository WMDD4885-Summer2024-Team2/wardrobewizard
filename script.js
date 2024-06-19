import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
 import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { getAuth,sendPasswordResetEmail ,GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
 //import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// const firebaseConfig = {
//     apiKey: "AIzaSyDcQFnQqSs-ciNioeivs8xO8-2wumj85WQ",
//     authDomain: "wardrobe-wizard-3735.firebaseapp.com",
//     projectId: "wardrobe-wizard-3735",
//     storageBucket: "wardrobe-wizard-3735.appspot.com",
//     messagingSenderId: "979356686132",
//     appId: "1:979356686132:web:8bec4e50208fa67f0fb761",
//     measurementId: "G-FZX5EM1HNH"
//   };

const firebaseConfig = {
  apiKey: "AIzaSyBxkMWakgmz97Ulk79whfqSQcA-Q2uXQDA",
  authDomain: "integrated-project1.firebaseapp.com",
  projectId: "integrated-project1",
  storageBucket: "integrated-project1.appspot.com",
  messagingSenderId: "168333709827",
  appId: "1:168333709827:web:eb9a1c473b1af653aeb436",
  measurementId: "G-MSNKDYWBK4"
};
  // Initialize Firebase
  const firebase = initializeApp(firebaseConfig);
  const database = getDatabase(firebase);
   const auth = getAuth();
   auth.languagecode = 'en';
   const provider =  new GoogleAuthProvider();


    document.getElementById("login").addEventListener('click', (event) => {
    event.preventDefault();
    var email  = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth , email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log('done');
      var uid = user.uid;
      localStorage.setItem('name', uid);
      window.location.href = './logged.html';

      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
   });
  

  document.getElementById("signin").addEventListener('click', (event) => {
    event.preventDefault();

    var email  = document.getElementById('username').value;
    var password = document.getElementById('password').value;
   // console.log(email + " "  + password);
  // signin(email, password);

createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {

    const user = userCredential.user;
    console.log(user);
    
   })
    .catch((error) => {
      var errorCode = error.code;
     var errorMessage = error.message;
     console.log(errorMessage);
     if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      alert('Email or password is incorrect. Please try again.')
    } else {
      console.error(error)
    }

    });
 
});
 

document.getElementById("googleUser").addEventListener('click', (event) => {
 // event.preventDefault();
  signInWithPopup(auth, provider).then((result) => {
    var credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;

    window.location.href = './logged.html';
//updateUserProfile(user);
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    console.error(error);

    // ...
  });

});

document.getElementById('passwordreset').addEventListener('click', (event) =>{
event.preventDefault();
var email  = document.getElementById('username').value;

sendPasswordResetEmail(auth, email).then(() => {
    console.log("Password reset email sent successfully!");
  })
 .catch((error) => {
    console.error("Error sending password reset email:", error);
  });

});
