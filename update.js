import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
 import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
 import { getAuth, GoogleAuthProvider, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

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

  const firebase = initializeApp(firebaseConfig);
  const database = getDatabase(firebase);
   const auth = getAuth(firebase);
   auth.languagecode = 'en';
   const provider =  new GoogleAuthProvider();

   const user = auth.currentUser;
   console.log(auth);

   function updateUserProfile(user){
  //  console.log(user.displayName);
    document.getElementById('userName').textContent = user.displayName;
    document.getElementById('userEmail').textContent = user.email;
    
    document.getElementById('userProfilePicture').src = user.photoURL;
    
    }


    onAuthStateChanged(auth, (user) =>{
        if(user){
            updateUserProfile(user);
            const uid = user.uid;
            return uid;
        }
        else{
            console.log('User is logged');
        
        }
    });


    const name = localStorage.getItem('name');
    console.log(name);