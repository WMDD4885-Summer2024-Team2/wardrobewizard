
import { wardrowizAlert } from "./common.js";
import { loadUserProfile } from "./common.js";
import { updateDataName, uploadImageToStorage, updateDataImage, userSignOut , resetPassword} from "./common.js";

import { firebase } from './firebase.js';
import { getFirestore, query, where, getDocs, collection, doc, getDoc, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const auth = firebase.auth;
const db = getFirestore();

profileForm.style.display = 'none';

nameEdit.addEventListener('click', function () {
  document.getElementById('name').disabled = false;

})
genderEdit.addEventListener('click', function () {
  document.getElementById('gender').disabled = false;
})

featureSelect.addEventListener('click', function () {
  document.getElementById('sectionFeatures').style.display = 'flex';
  document.getElementById('profileForm').style.display = 'none';

})

profileSelect.addEventListener('click', function () {
  document.getElementById('sectionFeatures').style.display = 'none';
  document.getElementById('profileForm').style.display = 'block';

})

export const init =  () => {
  getInformation();

}


let userDocID;
let imageUrl;
console.log('see');

 
async function getInformation() {
  const result = await loadUserProfile();
  const documents = result.docs;
  documents.forEach((doc) => {
    console.log(doc.id);
    userDocID = doc.id;
    imageUrl = doc.data().profileImageUrl;
    imageProfilePreview.innerHTML = `<img src="${doc.data().profileImageUrl}" alt="user image">`
    document.getElementById('userNameHeading').innerHTML += `${doc.data().name}`;
    document.getElementById('user_email').innerHTML = `<p id="userEmailHeading">${firebase.getUser().email}</p>`;
    document.getElementById('name').value = `${doc.data().name}`;
    document.getElementById('gender').value = `${doc.data().gender}`;

  });
}


userImageUpdate.addEventListener('click', function () {
  document.getElementById('fileInput').click();
})


var userProfileUpdate = document.getElementById('userProfileUpdate');
userProfileUpdate.addEventListener('click', function () {
  var dataName = document.getElementById('name').value;
  var dataGender = document.getElementById('gender').value;

  updateDataName(userDocID, dataName, dataGender, imageUrl);
  wardrowizAlert('Updated');
})



// const storage = firebase.getStorage();

fileInput.addEventListener('change', async function () {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = async (event) => {
    const base64String = event.target.result;
    try {
      var url = await uploadImageToStorage(base64String, 'user-outfit-image/user-image');
      console.log(url);
      updateDataImage(userDocID,url);
      imageProfilePreview.innerHTML = `<img src="${url}" alt="user image">`
   wardrowizAlert('Profile Picture Updated');
    } catch (error) {
      console.error(error);
    }
  };

  reader.readAsDataURL(file);
});
 


var signout = document.getElementById('signout');
signout.addEventListener('click', function () {

  userSignOut();

})

var reset_passcode = document.getElementById("resetPassword");
reset_passcode.addEventListener('click', (event) => {
  event.preventDefault();
  resetPassword(firebase.getUser().email);
  var email = document.getElementById('userEmailHeading').innerHTML;
  wardrowizAlert('Password reset email sent successfully at ' + email);


});




