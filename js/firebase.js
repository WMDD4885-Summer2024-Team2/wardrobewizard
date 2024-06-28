// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
  collection,
  getFirestore,
  addDoc,
  onSnapshot,
  query,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase class to encapsulate Firebase functionalities
export class Firebase {
  // Array to store outfit data
  outfit = [];

  constructor(config) {
    this.config = config;

    // Initialize Firebase app
    this.app = initializeApp(config.firebase);

    // Initialize Firebase Authentication service
    this.auth = getAuth();

    // Set up Google Auth provider
    this.auth.languageCode = "it";
    this.provider = new GoogleAuthProvider();
    this.provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

    // Initialize Firebase Storage service
    this.storage = getStorage();

    // Initialize Firestore service
    this.db = getFirestore();
  }

  // Method to get Firebase Auth service
  getAuth = () => this.auth;

  // Method to get Google Auth provider
  getProvider = () => this.provider;

  // Method to set the current user
  setUser = (user) => {
    this.user = user;
  }

  // Method to get the current user
  getUser = () => this.user;

  // Method to get Firebase Storage service
  getStorage = () => this.storage;

  // Method to load data from Firestore
  loadData = () => {
    const q = query(
      collection(this.db, "outfit-info", this.user.email, "outfit")
    );

    onSnapshot(q, (querySnapshot) => {
      this.outfit = querySnapshot.docs.map(doc => doc.data());
    });
  }

  // Method to get outfits by catgeory
  getOutfitByCategory = (catgeory) => this.outfit.filter(outfit => outfit.catgeory === catgeory);

  // Method for user sign-in using Google Auth
  userSignIn = async () => {
    try {
      const result = await signInWithPopup(this.auth, this.provider);
      this.user = result.user;
      return true;
    } catch (error) {
      return false;
    }
  }

  getCategories = () =>{
    const catgeories=new Set();
    this.outfit.forEach(outfit => catgeories.add(outfit.catgeory) );
    return catgeories;
  }

  // Method for user sign-out
  userSignOut = async () => {
    try {
      await signOut(this.auth);
      alert("You have signed out successfully!");
      return true;
    } catch (error) {
      return false;
    }
  }

  // Method for user sign-in using email and password
  userSignInWithPassword = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.user = userCredential.user;
      return userCredential;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // Method to create a new user using email and password
  createUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      this.user = userCredential.user;
      return userCredential;
    } catch (error) {
      return error;
    }
  }

  // Method to send a password reset email
  resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return true;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return false;
    }
  }

  // Method to upload outfit image to Firebase Storage
  uploadOutfitToStorage = async (imageData, outfit) => {
    const storageRef = ref(this.storage, `${this.user.email}/${Date.now()}.png`);
    const uploadTask = uploadBytesResumable(storageRef, imageData);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
        if (snapshot.state === "paused") console.log("Upload is paused");
        if (snapshot.state === "running") console.log("Upload is running");
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
          case "storage/canceled":
          case "storage/unknown":
            console.error(error);
            break;
        }
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          outfit.downloadURL = downloadURL;
          this.pushOutfitToDb(outfit);
        } catch (error) {
          console.log(error);
        }
      }
    );
  }

  // Method to add outfit data to Firestore
  pushOutfitToDb = async (outfit) => {
    try {
      const docRef = await addDoc(
        collection(this.db, "outfit-info", this.user.email, "outfit"),
        outfit
      );
      console.log(docRef);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
}
