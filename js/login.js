import { userSignIn } from "./common.js";

// export const init = () => { 
//     googleSignIn.addEventListener("click", userSignIn);
// }
import { wardrowizAlert } from "./common.js";

import { firebase } from './firebase.js';
import { getFirestore, query, where, getDocs, collection, doc, getDoc, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
const auth = firebase.auth;
const provider = new GoogleAuthProvider();
const db = firebase.getDB();

//  const userSignIn = firebase.userSignIn;

signupForm.style.display = 'none';
var signup = document.getElementById('signup');
var login = document.getElementById('login');

signup.addEventListener('click', function () {
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';

})
login.addEventListener('click', function () {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
})


var login = document.getElementById("loginUser");

login.addEventListener('click', (event) => {
    event.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log('done');
            console.log(user.email);
            // window.location.href = './logged.html';
            wardrowizAlert('Welcome to wardrowiz');
            // window.location.href = '../generate_outfit/gen_outfit.html';
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            showErrors(errorCode);
          //  wardrowizAlert('Email and password does not match. Please try again or try sign up');

        });
});



var signup = document.getElementById("signUpUser");
signup.addEventListener('click', (event) => {
    event.preventDefault();

    var email = document.getElementById('email2').value;
    var password = document.getElementById('password2').value;
    var passwordConfirm = document.getElementById('confirmPassword').value;
    // console.log(email + " "  + password);
    // signin(email, password);
    if (password !== passwordConfirm) {
        wardrowizAlert('Passwords do not match');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {


            const user = userCredential.user;
            console.log(user);
            if (user) {
                const userId = user.uid;
                const userEmail = user.email;

                const userProfileRef = doc(collection(db, "user-profile"), userEmail);
                setDoc(userProfileRef, {
                    // Add any additional data you want to store in the user's profile
                    name: user.displayName ? user.displayName : 'anonymous',
                    email: user.email,
                    image: "https://firebasestorage.googleapis.com/v0/b/integrated-project1.appspot.com/o/amneeshsingh5%40gmail.com%2Fuser-image%2Fprofile-user-icon-isolated-on-white-background-eps10-free-vector.jpg?alt=media&token=b995f98c-24d2-40d9-95c0-e5a0a773628c"

                    //...
                })
                    .then(() => {

                        console.log("User profile document added successfully");
                    })
                    .catch((error) => {
                        console.error("Error adding user profile document: ", error);
                    });
            } else {
                console.log("No user logged in");
            }

            wardrowizAlert('You have been signed up !. Please Log In');
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';

        })
        .catch((error) => {
            var errorCode = error.code;
            console.log(errorCode);
            showErrors(errorCode);
     
        });

});


function showErrors(error){
    if (error === 'auth/user-not-found' || error === 'auth/wrong-password') {
        wardrowizAlert('Email or password is incorrect. Please try again.')
    }
    else if (error == 'auth/weak-password') {
        wardrowizAlert('Password should be greater than 6 digits.');
    }
    else if (error == 'auth/email-already-in-use') {
        wardrowizAlert('Email already in use. Please try again.');
    }
    else if (error == 'auth/invalid-email') {
        wardrowizAlert('Invalid email. Please try again.');
    }
    else if(error == "auth/invalid-credential"){
        wardrowizAlert('Invalid email or password. Please try again.');
    }
    else if(error == 'auth/missing-password'){
        wardrowizAlert('Please enter password.');
    } else {
        console.error(error)
    }
}
var google_sign_in = document.getElementById("googleUser");

google_sign_in.addEventListener('click', (event) => {
    event.preventDefault();


    signInWithPopup(auth, provider).then((result) => {
        var credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        //  onAuthStateChanged();

   //     window.location.href = '../generate_outfit/gen_outfit.html';
        //updateUserProfile(user);
        wardrowizAlert('Welcome to WardroWiz');
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.error(error);

        // ...
    });

});



onAuthStateChanged(firebase.auth, async (user) => {

    if (user) {
        console.log("loggedin");
        const userId = user.uid;
        const userEmail = user.email;
        const userProfileRef = doc(collection(db, "user-profile"), userEmail);

        const qu = query(collection(db, 'user-profile'), where('email', '==', user.email));
   

        const querySnapshot = await getDocs(qu);

        if (querySnapshot.empty) {
          console.log('No matching documents.');
          setDoc(userProfileRef, {
            // Add any additional data you want to store in the user's profile
            name: user.displayName,
            email: user.email,
            image: "https://firebasestorage.googleapis.com/v0/b/integrated-project1.appspot.com/o/amneeshsingh5%40gmail.com%2Fuser-image%2Fprofile-user-icon-isolated-on-white-background-eps10-free-vector.jpg?alt=media&token=b995f98c-24d2-40d9-95c0-e5a0a773628c"
            //...
        })
        } else {
          querySnapshot.forEach((doc) => {
            console.log(`Document data: ${doc.data()}`);
          });
        }
        
    } else {
        console.log("No user logged in");
    }

});
