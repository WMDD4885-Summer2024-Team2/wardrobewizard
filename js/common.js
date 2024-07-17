import { firebase } from "./firebase.js";
import {
  collection,
  getFirestore,
  addDoc,
  onSnapshot,
  query,
  getDocs,
  getCountFromServer,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { genreateOutfit } from "./outfitsearch.js";

// Method to upload outfit image to Firebase Storage
export const uploadImageToStorage = (imageData, folderName) => {
  return firebase.uploadToStorage(imageData, folderName);
};

// Method to add outfit data to Firestore
export const saveOutfitToDb = (data) => {
  return firebase.dbSave(data, "outfit-info", "outfit");
};

// Method to add history data to Firestore
export const saveHistoryToDb = (data) => {
  return firebase.dbSave(data, "history", "outfit");
};

// Method to add favorite data to Firestore
export const saveFavoriteToDb = (data) => {
  return firebase.dbSave(data, "favorite", "outfit");
};

// Method to add user profile data to Firestore
export const saveProfileToDb = (data) => {
  return firebase.dbSave(data, "user-profile", "profile");
};

let outfitArray = [];

// Method to load outfit data from Firestore
export const loadOutfitData = () => {
  const q = query(
    collection(
      firebase.getDB(),
      "outfit-info",
      firebase.getUser().email,
      "outfit"
    )
  );

  onSnapshot(q, (querySnapshot) => {
    outfitArray = querySnapshot.docs.map((doc) => doc.data());
  });
};

// Method to load user profile data from Firestore
export const loadUserProfile = async () => {
  const q = query(
    collection(
      firebase.getDB(),
      "user-profile",
      firebase.getUser().email,
      "profile"
    )
  );

  try {
    const docs = await getDocs(q);
    return docs;
  } catch (error) {
    console.error("Error loading user profile:", error);
  }
};

// Method to get outfits by category
export const getOutfitsByCategory = (category) => {
  return outfitArray.filter((outfit) => outfit.category === category);
};

// Method to get outfit count
export const getOutfitCount = async () => {
  return outfitArray.length;
};

// Method to get unique outfit categories
export const getOutfitCategories = () => {
  const categories = new Set();
  outfitArray.forEach((outfit) => categories.add(outfit.category));
  return Array.from(categories);
};

// Method to sign out the user
export const userSignOut = async () => {
  try {
    const status = await firebase.userSignOut();
    if (status) {
      window.location.href = "#login";
    }
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

// Method to sign in the user
export const userSignIn = async () => {
  try {
    const status = await firebase.userSignIn();
    /*  if (status) {
      window.location.href = '#home';
    } */
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

// Method to start the camera
export const startCamera = (video) => {
  if (video && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error starting camera:", error);
      });
  }
};

// Method to stop the camera
export const stopCamera = (video) => {
  if (video && video.srcObject) {
    const tracks = video.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
  }
};

//Genreate Outfit

export const genreateOutfits = () => {
  return genreateOutfit(
    getOutfitsByCategory("top"),
    getOutfitsByCategory("bottom"),
    "Auto"
  );
};


/* 
// Usage
(async () => {
  try {
    const position = await getLocation();
    console.log("Geolocation obtained successfully:", position);
  } catch (error) {
    console.error("Error obtaining geolocation:", error);
  }
})(); */



export const colorThief = new ColorThief();
