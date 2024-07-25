// import { getOutfitsByCategory } from "./common.js";

// export const init = () => {
//   showOutfit();
//   viewwardrobe.addEventListener("click", showOutfit);

//   outfitupload.addEventListener('click', ()=>{
//     window.location.href = '#uploadoutfitmycloset';
//   });
// };

// const showOutfit = () => {
//   renderdata("top", tops);
//   renderdata("bottom", bottoms);
//   renderdata("dress", dresses);
// };

// const renderdata = (catgeory, element) => {


//   let outfits = getOutfitsByCategory(catgeory);

//   if(outfits.length === 0){
//     element.innerHTML +=`Sorry, There are no ${catgeory}'s available in your wardrobe to display.`;
//     return;
//   }

//   outfits.forEach((outfit) => {
//     let tags = "";


//     outfit.tags.forEach((tag) => {
//       tags += `<span class='tag-info'>${tag}</span>`;
//     });

//     element.innerHTML += `<div class='card flex-grow'>
//         <div class='card-body'>
//           <div><img src='${outfit.downloadURL}'></div>
        
//         </div>
//         <div class='card-footer'>
//           ${tags}
//         </div>
//       </div>`;
//   });
// };

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, collection, doc, addDoc, setDoc, getDocs, getDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const user = auth.currentUser;
const storage = getStorage();
export const init = () => {
  showOutfits();
 // viewwardrobe.addEventListener("click", showOutfit);

  let email;
let uid;
onAuthStateChanged(auth, (user) => {

  if (user) {
    uid = user.uid;
    email = user.email;
    getData(email);
    getModelData(email)
  } else {

  }
});


const collectionName = 'outfit-info';
let occasionValues = [];
let colorValues = [];
function getData(documentId) {
  var outfit_info_data = [];
  const documentRef = doc(db, 'outfit-info', documentId);
  const subcollectionRef = collection(documentRef, 'outfit');
  getDocs(subcollectionRef).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {

      const data = doc.data();
      data.id = doc.id;
      outfit_info_data.push(data);
    });
    outputResult(outfit_info_data);
  });
}
var model_info_data = [];
function getModelData(documentId) {
  var model_info_data = [];
  const documentRef = doc(db, 'model-image', documentId);
  const subcollectionRef = collection(documentRef, 'model');
  getDocs(subcollectionRef).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {

      const data = doc.data();
      data.id = doc.id;
      model_info_data.push(data);
    });
    // outputModelResult(model_info_data);
  });
}




function outputResult(outfit_info_data) {
  showOutfits(outfit_info_data);
}
var outfits;

function showOutfits(outfit_info_data) {
  outfits = outfit_info_data;
  result(outfit_info_data);
  createDropdown(outfit_info_data);

}
function createDropdown(outfit_info_data) {
  //.log(outfit_info_data);
  const occasionValues = outfit_info_data.map((item) => item.occasion);
  const uniqueOccasionValues = [...new Set(occasionValues)];
  //uniqueOccasionValues.splice('selectAnOccasion', 1);
  let elementToRemove = "selectAnOccasion";

  let index = uniqueOccasionValues.indexOf(elementToRemove);

  if (index !== -1) {
    uniqueOccasionValues.splice(index, 1);
  }

  // creating dynamic dropdowns
  uniqueOccasionValues.forEach((occasion) => {
    const option = document.createElement("option");
    option.value = occasion;
    option.text = occasion;
    document.getElementById("occasion").appendChild(option);
  });

  // creating dynamic dropdowns
  const colorValues = outfit_info_data.map((item) => item.colorName);
  const uniqueColorValues = [...new Set(colorValues)];
  uniqueColorValues.forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.text = color;
    document.getElementById("color").appendChild(option);
  });


}
// function outputModelResult(model_info_data){
// var modelInfo = document.getElementById('model');
// modelInfo.addEventListener('click', function () {
//   resultModel(model_info_data);
//   console.log(model_info_data);

// })
// }

var top = document.getElementById('top');
top.addEventListener('click', function () {

  var tops = outfits.filter(outfit => outfit.garment_type === 'top');
  result(tops);
  console.log(tops);
})


var bottom = document.getElementById('bottom');
bottom.addEventListener('click', function () {
  var bottom = outfits.filter(outfit => outfit.garment_type === 'bottom');
  result(bottom);
  console.log(bottom);
})

var dresses = document.getElementById('dresses');
dresses.addEventListener('click', function () {
  var dresses = outfits.filter(outfit => outfit.garment_type === 'dress');
  result(dresses);
})

var occasion = document.getElementById('occasion');
occasion.addEventListener('change', function () {
  var occasion_info = outfits.filter(outfit => outfit.occasion == occasion.value);

  result(occasion_info);

})
var color = document.getElementById('color');
color.addEventListener('change', function () {
  var color_info = outfits.filter(outfit => outfit.colorName == color.value);

  result(color_info);

})
var checkedOutfits = [];
var clothes_manager = [];

function result(outfit) {
  console.log('hello');
  var outfitContainer = document.getElementById("outfits");
  outfitContainer.innerHTML = '';
  outfit.forEach((item) => {
    // const imageElement = document.createElement("img");
    // imageElement.src = outfit.image64;
    // imageElement.alt = `Outfit ${index + 1}`;
    // imageElement.className = "outfit-image";

  //   const content = `<div class="outfit-detail"><input type="checkbox" class="checkbox-custom"  id = "${item.id}-${item.garment_type}"> <img src = ${item.image64} alt = ${item.id}><button class="delete-btn"  id = "${item.id}"> 
  // <i class="fa-regular fa-trash-can"></i></button></div>`;

  const content =  `
  
  <div class="wardrowiz-card">
  <div class="wardrowiz-image">
      <img src=  ${item.image64} alt=${item.id}>
  </div>
  <div class="wardrowiz-details">
  <div class = "wardrowiz-header">
  <label class = " container">
  <input type="checkbox" class="checkbox-custom"  id = "${item.id}-${item.garment_type}"> 
  <svg viewBox="0 0 64 64" height="1.2em" width="1.2em">
    <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" class="path"></path>
  </svg>
  </label>
  <label>${item.garment_type}</label>
  <button class="delete-btn"  id = "${item.id}"> 
  <i class="fa-regular fa-trash-can"></i></button>
  </div>


    <div class="tags">
     <p>${item.tags}</p>
  


     
    </div>
   
  </div>
</div>`;
    outfitContainer.innerHTML += content;
    var buttons = document.querySelectorAll('.delete-btn');
    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        console.log(event.target.id);
        deleteOutfit(event.target.id);
        //  const docId = event.target.getAttribute('id');
        // console.log(`Document ID: ${docId}`);
      })
    })

    var checkboxes = document.querySelectorAll('.checkbox-custom');

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', (event) => {
        console.log(event.target.id);
        // const outfit_id = event.target.id.replace("-chk", "");
        const id = event.target.id.split("-")[0];
        const [outfit_id, garment_type] = event.target.id.split("-");
        const outfit_data = { outfit_id, garment_type };


        //console.log(outfit_data);
        // Output: { before: "75HLQMJiE5aVos2WgTiT", after: "top" }
        if (checkbox.checked) {
          // addOutfitForGeneration(outfit_data);
          console.log(id);
          const subcollectionName = "outfit";

          const parentDocRef = doc(collection(db, "outfit-info"), email);
          const subcollectionRef = collection(parentDocRef, subcollectionName);

          const subDocRef = doc(subcollectionRef, id);
          getDoc(subDocRef)
            .then((doc) => {
              if (doc.exists()) {
                const data = doc.data();
                console.log(data); // Output: the data from the document
                clothes_manager.push(data);

              } else {
                console.log("No such document!");
              }
            })
            .catch((error) => {
              console.error("Error getting document:", error);
            });



          if (checkedOutfits.length < 2) {
            checkedOutfits.push(outfit_data);
          } else {
            alert("You can only select 2 outfits");
          }
          generateClothes(clothes_manager);


        } else {
          const index = checkedOutfits.indexOf(outfit_id);
          if (index !== -1) {
            checkedOutfits.splice(index, 1);
          }

        }
      })
    })
  });

}




async function fetchData(humanUrl, garmentUrl, garmentType, descr) {

  try {
    const data = {
      "model": humanUrl,
      "garment_top": garmentUrl,
      "garment_type": garmentType,
      "desc": descr
    };

    console.log(data);
    var response = await fetch("https://us-central1-integrated-project1.cloudfunctions.net/virtualtryon/virtualOutfit", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData;
  } catch (error) {
    console.error(error);
  }
}


const image1 = document.getElementById('image1');


const canvas1 = document.createElement('canvas');





canvas1.width = image1.width;
canvas1.height = image1.height;

const ctx1 = canvas1.getContext('2d');
ctx1.drawImage(image1, 0, 0);

const base64data1 = canvas1.toDataURL('image/jpeg');
var loader = document.getElementById('loader');
loader.style.display="none";

let listenerAdded = false;


var OutfitGenerator = document.getElementById('generateOutfit');
function generateClothes(clothes_manager) {
  if (!listenerAdded) {

  OutfitGenerator.addEventListener('click', async function (e) {
    e.preventDefault();
    loader.style.display="block";

    var topGarment = clothes_manager.find(obj => obj.garment_type === 'top');
    var lowerGarment = clothes_manager.find(obj => obj.garment_type === 'bottom');


    console.log(topGarment.image64);
    console.log(lowerGarment.image64);

     const response= await fetchData(base64data1, topGarment.image64, "upper_body", "shirt");

    setTimeout(async () => {
      console.log("Upload timed out after 5 seconds");
      const jsonData= await fetchData(response.image.url, lowerGarment.image64 , "lower_body", "jeans");
      uploadBottom(jsonData.image.url);
    }, 5000); // 5 seconds



    element.innerHTML += `<div class='card flex-grow'>
        <div class='card-body'>
          <div><img src='${outfit.imageUrl}'></div>
        
        </div>
        <div class='card-footer'>
          ${tags}
        </div>
      </div>`;
  });
  listenerAdded = true;

}
}
function uploadBottom(im) {
  loader.style.display="none";

  var divResultImg = document.getElementById('result-img');
  console.log(im);
  const img = document.createElement('img');
  img.src = im;
  img.alt = 'Image';
  divResultImg.appendChild(img);

}







// function canSelect(outfit) {
//   const existingType = checkedOutfits.some(item => item.garment_type === outfit.garment_type);
//   if (existingType) {
//     return false; // cannot select another outfit with the same garment type
//   }
//   return true; // can select
// }

// function addOutfitForGeneration(id){
// if (canSelect(id)) {
//   checkedOutfits.push(id);
//   console.log("Added new top outfit to array");
//   return checkedOutfits;
// } else {
//   console.log("Cannot select another top");
// }

// if (canSelect(id)) {
//   checkedOutfits.push(id);
//   console.log("Added new bottom outfit to array");
// } else {
//   console.log("Cannot select another bottom");
// }
// }


function deleteOutfit(outfitDocumentId) {
  console.log(outfitDocumentId + "go");
  const documentRef = doc(db, 'outfit-info', email);
  const subcollectionRef = collection(documentRef, 'outfit');

  const outfitDocRef = doc(subcollectionRef, outfitDocumentId);

  deleteDoc(outfitDocRef).then(() => {
    console.log('Outfit document deleted successfully!');
    alert('Outfit deleted');
  }).catch((error) => {
    console.error('Error deleting outfit document:', error);
  });
}

}




