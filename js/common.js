import { firebase } from "./firebase.js";
import {
  collection,
  getFirestore,
  addDoc,
  onSnapshot,
  query,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Method to upload outfit image to Firebase Storage
export const uploadOutfitToStorage =  (imageData,folderName) => {
  return firebase.uploadToStorage(imageData,folderName);
}

   // Method to add outfit data to Firestore
 export const  pushOutfitToDb =  (data) => {
    return firebase.dbSave(data,"outfit-info","outfit"); 
  }

// Method to add history data to Firestore
 export const  saveHistoryToDb =  (data) => {
  return firebase.dbSave(data,"history","outfit"); 
}

// Method to add favorite data to Firestore
export const  saveFavoriteToDb =  (data) => {
  return firebase.dbSave(data,"favorite","outfit"); 
}

   // Method to load data from Firestore
let outfitArray;
export const loadOutfitData = () => {
    const q = query(
      collection(firebase.getDB(), "outfit-info", firebase.getUser().email, "outfit")
    );

    onSnapshot(q, (querySnapshot) => {
      outfitArray = querySnapshot.docs.map(doc => doc.data());
    });
  }

  // Method to get outfits by catgeory
export const  OutfitByCategory = (catgeory) => outfitArray.filter(outfit => outfit.catgeory === catgeory);

export const  OutfitCategories = () =>{
    const catgeories=new Set();
    outfitArray.forEach(outfit => catgeories.add(outfit.catgeory) );
    return catgeories;
}


//Singout
export const userSignOut = async () => {

  let status = await firebase.userSignOut();
  if(status){
    window.location.href='#login';
  }
  
};

//Sign In

export const userSignIn = async () =>{
  let status=await firebase.userSignIn();
  if(status){
    window.location.href='#home';
  }
};


 