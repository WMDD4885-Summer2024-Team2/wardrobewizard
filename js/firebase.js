import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,GoogleAuthProvider,signInWithPopup,signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { collection,getFirestore,doc,addDoc,getDocs ,setDoc,onSnapshot,query} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export class Firebase{
  
  outfit=[];

  constructor(config){
    
     this.config=config;

     // Initialize Firebase
    this.app = initializeApp(config.firebase);

    //Firebase User Authentication 
    this.auth = getAuth();

    //Google Provider
    this.auth.languageCode = "it";
    this.provider = new GoogleAuthProvider();
    this.provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

    //Storage Service
    this.storage = getStorage();

    //DB Service
    this.db=getFirestore();


    
    
  }

  // Method to get Firebase Auth service
  getAuth() {
    return this.auth;
  }

  getProvider(){
    return this.provider;
  }

  setUser(user){
    this.user=user;
  }
  

  getUser(){
    return this.user;
  }


  getStorage(){
    
    return this.storage;
  }







  //load data from DB

  loadData(){
    const q = query(collection(this.db, "outfit-info",this.user.email,'outfit'));
  
    const subscribe = onSnapshot(q, (querySnapshot) => {
      
      querySnapshot.forEach((doc) => {
          this.outfit.push(doc.data());
      });
     
    });
  }


  async userSignIn ()  {
    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        this.user=result.user;
        return true;
      })
      .catch((error) => {
        return false;
      });
  };

  async userSignOut  () {
    signOut(this.auth)
      .then(() => {
        alert("You have signed out successfully!");
        return true;
      })
      .catch((error) => { return false});
  };

  
  async uploadOutfitToStorage(imageData,outfit){
    

    let storageRef=ref(this.storage, this.user.email+'/'+Date.now()+'.png');
    const uploadTask =  uploadBytesResumable(storageRef, imageData);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;

        // ...

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        
        outfit.downloadURL=downloadURL;
        this.pushoutfittodb(outfit)
       
        
      });
    }
  );
  }


  async pushoutfittodb(outfit){

    
    const docRef = await addDoc(collection(this.db,"outfit-info",this.user.email,'outfit'), outfit);

  }

  
 

}






