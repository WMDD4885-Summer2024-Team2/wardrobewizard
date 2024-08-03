 import {colorThief,uploadImageToStorage,saveOutfitToDb} from "./common.js";
import { base64ToBlob, startCamera , stopCamera} from "./utils.js"
 import { wardrowizAlert } from "./common.js"
 import {fetchData,fetchDepTagData,hexToHsl} from "./utils.js";
 import config from '../resources/config.json' with { type: 'json' };


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, collection, doc, addDoc, setDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
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
console.log(auth);
//console.log(auth) 

export const init = () => {
    mainPageOutfit.style.height = '100vh';
let uid;
let email;
const form = document.getElementById('upload-form');
onAuthStateChanged(auth, (user) => {

    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        uid = user.uid;
        email = user.email;
        console.log(uid);
        getData(email);

        // ...
    } else {
        // User is signed out
        // ...
    }
});

loaderBall.style.display = "none";

// If camera clicks , camera will appear, if gallery clicks, gallery will appear

galleryFile.style.display = "none";
cameraFile.style.display = 'none';



gallery.addEventListener('click', function () {
    document.getElementById("gallery").classList.add('active');
    document.getElementById("camera").classList.remove('active');

    galleryFile.style.display = "block";
    cameraFile.style.display = 'none';
})


camera.addEventListener('click', function () {
    mainPageOutfit.style.height = 'auto';

    document.getElementById("camera").classList.add('active');
    document.getElementById("gallery").classList.remove('active');

    galleryFile.style.display = "none";
    cameraFile.style.display = 'block';
})

// CAMERA RUNNINGGGGGGGGGG

let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let startButton = document.getElementById('start-button');
let takePictureButton = document.getElementById('take-picture-button');
let stream;
takePictureButton.style.display = 'none';

startButton.addEventListener('click', async () => {
    try {
        const constraints = {
            video: {
                facingMode: 'user', // or 'environment' for rear camera
                width: { ideal: 640 },
                height: { ideal: 480 }
            },
            audio: false
        };
    
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        takePictureButton.disabled = false;
        document.getElementById('video').style.display = "block";
        takePictureButton.style.display = 'block';
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
});

takePictureButton.addEventListener('click', () => {
    mainPageOutfit.style.height = '100vh';

    let capturedImages = [];

    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    let imageData = canvas.toDataURL('image/jpeg');
    capturedImages.push(imageData);
    document.getElementById('video').style.display = "none";

    document.getElementById('canvas').style.display = "none";
    video.srcObject = null;
    stream.getTracks().forEach(track => track.stop());
    takePictureButton.disabled = true;


    canvas.toBlob(blob => {
        const file = new File([blob], 'image.jpg', {
            contentType: 'image/jpeg',
            lastModified: Date.now()
        });

        if (file == null || file == "" || file == undefined) {
            alert('Please select an image');
        } else {

            get_results(file);
            rmbg(file);
        }
    }, 'image/jpeg', 0.92);

});

// CAMERA STOPPPPPPPPPPPPPP

// FILE INPUT RUNNNNNINGGGGG

const fileInput = document.getElementById("imageInput"); // input type="file" element

fileInput.addEventListener("change", (e) => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    if (file == null || file == "" || file == undefined) {
        alert('Please select an image');
    } else {
        get_results(file);
        rmbg(file);

    }
    reader.readAsDataURL(file);
});

// FILE INPUT STOPPPPPPPPPPPPPPP



// GETTING DEEP TAGGING RESULTS 

function get_results(capturedImage) {
    document.getElementById("gallery").classList.remove('active');
    document.getElementById("camera").classList.remove('active');
    loaderBall.style.display = "block";
    galleryFile.style.display = "none";
    cameraFile.style.display = 'none';
    imagePreview.innerHTML = '';
    outfit_form.style.display = 'none';
    uploadForm.style.display='none';

    outfit_form.reset();

    var myHeaders = new Headers();
    var formdata = new FormData();

    myHeaders.append("x-api-key", "ef96476e1df8176576aaf673e5d5ce12e77ba7ad2fef2a6c3fde14d391a20091");
    formdata.append("image", capturedImage);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
    };

    fetch('https://cloudapi.lykdat.com/v1/detection/tags', requestOptions)
        .then(response => response.text())
        .then(result => generate_tags(result, capturedImage))
        .catch(error => console.log(error));
}
// GETTING DEEP TAGGING RESULTS 

// removing background and getting colors
var imagefile;

function rmbg(file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = async function (e) {
            const base64String = e.target.result;


            const result = await fetchData(config.rmbgURL, "POST", {
                base64Image: base64String
            });
            image64 = result;
          //  console.log(base64ToBlob(result, 'image/png'));


            var imgResult = document.createElement('img');

            imgResult.src = result;

            imgResult.alt = 'My Image';
            imgResult.id = "outfitImageStyle";

            imagePreview.appendChild(imgResult);



            const img = document.getElementById("outfitImageStyle");
            var hexColor;
            img.onload = function () {
                let dominantColor = colorThief.getColor(img);
                // Display the dominant color
                const r = parseInt(dominantColor[0]).toString(16).padStart(2, '0');
                const g = parseInt(dominantColor[1]).toString(16).padStart(2, '0');
                const b = parseInt(dominantColor[2]).toString(16).padStart(2, '0');
                hexColor = `#${r}${g}${b}`;
                colorHex = hexColor;
                // document.getElementById("colorSchema").style.display = "block";
                //   console.log(hexToHsl(colorPicker.value));
                console.log(base64ToBlob(outfitImageStyle.src, 'image/png'));
                imagefile = base64ToBlob(outfitImageStyle.src, 'image/png');
            //    passData(base64ToBlob(outfitImageStyle.src, 'image/png'), image64, colorHex);
                colorPopulator(colorHex);
                uploadForm.style.display='flex';
                mainPageOutfit.style.height = 'auto';
                outfit_form.style.display = 'block';
                loaderBall.style.display = "none";

            };

        };

        reader.readAsDataURL(file);

    } else {
        alert("Please select an image file.");
    }
}

// removing background and getting colors

const collectionName = 'outfit-info';

let occasionValues = [];

function getData(documentId) {
    var outfit_info_data = [];

    const documentRef = doc(db, 'outfit-info', documentId);
    const subcollectionRef = collection(documentRef, 'outfit');
    getDocs(subcollectionRef).then((querySnapshot) => {

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            outfit_info_data.push(data);


        });
        outputResult(outfit_info_data);


    });

}
function outputResult(outfit_info_data) {
    console.log(outfit_info_data);
    const occasionValues = outfit_info_data.map((item) => item.occassion);

    const uniqueOccasionValues = [...new Set(occasionValues)];

    uniqueOccasionValues.splice('selectAnOccasion', 1);

    // creating dynamic dropdowns
    uniqueOccasionValues.forEach((occasion) => {
        const option = document.createElement("option");
        option.value = occasion;
        option.text = occasion;
        document.getElementById("occasion").appendChild(option);
    });

}

//
document.getElementById('occasionInput').style.display = 'none';
var occasion_choice = document.getElementById('occasion');
occasion_choice.addEventListener('change', function () {
    var selectedOccassion = occasion_choice.options[occasion_choice.selectedIndex].value;
    if (selectedOccassion == 'other') {
        document.getElementById('occasionInput').style.display = 'block';
    } else {
        document.getElementById('occasionInput').style.display = 'none';
    }

})


function getOccasionValue() {
    const occasionSelect = document.getElementById('occasion');
    const otherOccasionInput = document.getElementById('occasionInput');

    if (occasionSelect.value === 'other') {
        return otherOccasionInput.value;
    } else {
        return occasionSelect.value;
    }
}

// Add an event listener to the button


var tags = [];
var checkedCheckboxes = [];
var colorName;
function generate_tags(results, imageresult) {
    tags = [];
    var accessories = [];

    // console.log(JSON.stringify(results));
    let topItem;
    let resultArray = JSON.parse(results);
    console.log(resultArray);

    accessories = resultArray.data.items.filter(item => item.category === 'accessories').map(item => item.name);
    console.log(accessories); // Output: ["coat", "outerwear"]

    colorName = resultArray.data.colors[0].name;
    console.log(colorName);

    for (let i = 0; i < resultArray.data.labels.length; i++) {

        tags.push(resultArray.data.labels[i].name);


        if (resultArray.data.labels[i].secondary_classification === "upperbody") {
            topItem = resultArray.data.labels[i].secondary_classification;
            //   console.log(topItem);
            categoryPopulator(topItem);

        }
        if (resultArray.data.labels[i].secondary_classification === "lowerbody") {
            topItem = resultArray.data.labels[i].secondary_classification;
            //  console.log(topItem);
            categoryPopulator(topItem);

        }
    }
    // const fileRef = ref(storage, `imagefile/${results.name}`);

    tagsPopulator(tags);

    // passData(imageresult);

}




function colorPopulator(colorCode) {
    const colorInput = document.getElementById('color');
    colorInput.value = colorCode;

}

function categoryPopulator(garment_type) {
    const categoryInput = document.getElementById('category');
    if (garment_type == "upperbody") {
        categoryInput.value = "top";
    }
    if (garment_type == "lowerbody") {
        categoryInput.value = "bottom";
    }
    if (garment_type == "dress") {
        categoryInput.value = "dress";
    }


}

function tagsPopulator(tag) {
    console.log(tag);

    const checkboxContainer = document.getElementById("garmentTags"); // container element for checkboxes
    checkboxContainer.innerHTML = '';

    tag.forEach((item) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = item;
        checkbox.id = `checkbox-${item}`;

        const checkboxDiv = document.createElement("div");
        checkboxDiv.className = "customCheckbox";

        const label = document.createElement("label");
  label.for = `checkbox-${item}`;
  label.textContent = item;

  checkboxDiv.appendChild(checkbox);
  checkboxDiv.appendChild(label);
        // document.getElementById("garmentTags").innerHTML = ` <div class="checkbox">
        //     <input id="checkbox-${item}" name="checkbox" type="checkbox" value="${item}">
        //     <label for="${item.id}">
        //       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200">
        //         <mask fill="white" id="checkbox-mask"><rect height="200" width="200"></rect></mask>
        //         <rect mask="url(#checkbox-mask)" stroke-width="40" height="200" width="200"></rect>
        //         <path stroke-width="15" d="M52 111.018L76.9867 136L149 64"></path>
        //       </svg>
        //       <span>${item}</span>
        //     </label>
        //   </div>`;

        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                checkedCheckboxes.push(item);
            } else {
                const index = checkedCheckboxes.indexOf(item);
                if (index !== -1) {
                    checkedCheckboxes.splice(index, 1);
                }
            }
        });

        checkboxContainer.appendChild(checkboxDiv);

    });
}








// var video = document.getElementById('video');
// let canvas = document.getElementById('canvas');
// let context = canvas.getContext('2d');
// canvas.style.display = 'none';

// takePicture.addEventListener('click', function () {
//     video.srcObject.getTracks().forEach(track => track.stop());
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     document.getElementById('video').style.display = 'none';

//     pictureClick();
// })

// startButton.addEventListener('click', function () {
//     document.getElementById('video').style.display = 'block';
//     // document.getElementById('image-preview').innerHTML = '';

//     navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//         .then(stream => {
//             video.srcObject = stream;
//             video.play();
//         })
//         .catch(error => {
//             console.error('Error accessing camera:', error);
//         });
// })




var imageArray = [];

// function pictureClick() {
//     imageArray = [];
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     let imageData = canvas.toDataURL('image/png');
//     imageArray.push(imageData);
//     // let image = document.createElement('img');
//     //  image.src = imageData;
//     //   document.getElementById('image-preview').appendChild(image);
//     console.log(imageArray);
//     convertImageTogetResult();

// }





var image64;
var colorHex;
//--------------------------------------------------


//function passData(imagefile, image64, colorHex) {


    uploadData.addEventListener('click', async function (e) {
        var imagedata = {
            "color": hexToHsl(colorHex),
            "colorName": colorName,
            "garment_type": document.getElementById('category').value,
            "occasion": getOccasionValue(),
            "tags": checkedCheckboxes,
            "image64": image64,
            "imageUrl": ""
           // "imageFile": imagefile,
        }

        console.log(imagedata);

        const storage = getStorage(firebase);

        const metadata = {
            contentType: 'image/jpeg'
        };

        // sending image data to storage
        const fileRef = ref(storage, `${email}/user-outfit-image/${Date.now()}.png`);

        const uploadTask = uploadBytesResumable(fileRef, imagefile, metadata);


        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // Handle errors
                switch (error.code) {
                    case 'torage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'torage/canceled':
                        // User canceled the upload
                        break;
                    //...
                    case 'torage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    imagedata.imageUrl = downloadURL;

                    //    sending image data to database
                    const userRef = doc(db, `outfit-info/${email}`);
                    setDoc(userRef, {});

                    // Create a subcollection for the outfit
                    const outfitRef = collection(userRef, "outfit");
                    //   Add a document to the outfit subcollection
                    addDoc(outfitRef, imagedata).then((docRef) => {
                        console.log(`Outfit document added with ID: ${docRef.id}`);
                       // alert('Outfit uploaded');
                        wardrowizAlert('Outfit uploaded');
                        // window.location.href = '#uploadOutfit';
                        resetPage();
                    })
                        .catch((error) => {
                            console.error("Error adding outfit document:", error);
                        });

                    // Send the downloadable URL to the database
                    //...
                });
            }
        );

    })
//}


function resetPage() {
    imageArray = [];
    tags = [];
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('category').value = 'selectAcategory';
    document.getElementById('garmentTags').innerHTML = '';
    document.getElementById('imageInput').value = '';
    // document.getElementById('image-preview').innerHTML = '';
    document.getElementById('occasion').value = 'selectAnOccasion';
    document.getElementById('color').value = '#ffffff';

}
uploadForm.style.display='none';
outfit_form.style.display = 'none';



// generateOutfit.addEventListener('click', function () {
//     window.location.href = '../generate_outfit/gen_outfit.html';
// })

}