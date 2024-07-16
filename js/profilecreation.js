import {startCamera,stopCamera,uploadImageToStorage,saveProfileToDb} from "./common.js";
import {fetchData} from "./utils.js";
import config from '../resources/config.json' with { type: 'json' };

const ctx = canvas.getContext("2d");

export const init = () => {
  profileNextBtn.addEventListener("click", saveUserProfileDetails);

  uploadBtn.addEventListener("click", () => {
    uploadDialog.showModal();
  });

  closeBtn.addEventListener("click", () => {
    uploadDialog.close();
  });

  fileupload.addEventListener("change", handleImage);

  retry.addEventListener("click", () => {
    uploadDialog.showModal();
  });

  finishProfileBtn.addEventListener("click", createProfile);

  startCameraBtn.addEventListener("click", initCamera);

snapImage.addEventListener("click", takeSnap);
};

const createProfile = async () => {
  //canvas

  let profileImageUrl = await uploadImageToStorage(
    canvas.toDataURL(),
    "user-profile"
  );

  let profile = {
    name: userName.value,
    gender: gender.value,
    profileImageUrl: profileImageUrl,
  };

  saveProfileToDb(profile);
  window.location.href = "#home";
};

const saveUserProfileDetails = () => {
  if (userName.value === "") {
    return false;
  }

  document.body.classList.toggle("move-to-profile-sec2");
};

const handleImage = (e) => {
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = async function (e) {

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);


      const base64String = img.src;
      
      uploadDialog.close();
      if (!document.body.classList.contains("hide"))
        document.body.classList.toggle("hide");

      if (!document.body.classList.contains("show"))
        document.body.classList.toggle("show");

      if (document.body.classList.contains("show-camera"))
        document.body.classList.toggle(".show-camera");
      
      retry.style.display='none';

      try{
        const result= await fetchData(config.rmbgURL,"POST",{
          base64Image: base64String
        });
  
        const image =new Image();
        image.onload = async function() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          retry.style.display='block';
         
    
         
        }
        image.src=result;
      }catch(e){
        retry.style.display='block';
      }
      

      
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
};

const initCamera = () => {
  uploadDialog.close();
  if (!document.body.classList.contains("hide"))
    document.body.classList.toggle("hide");

  if (document.body.classList.contains("show"))
    document.body.classList.toggle("show");

  if (!document.body.classList.contains("show-camera"))
    document.body.classList.toggle("show-camera");
  startCamera(videopath);
};

const takeSnap = async() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(videopath, 0, 0, canvas.width, canvas.height);
  document.body.classList.toggle("show-camera");
  document.body.classList.toggle("show");
  const base64String = canvas.toDataURL();

  try{
    const result= await fetchData(config.rmbgURL,"POST",{
      base64Image: base64String
    });

    const image =new Image();
    image.onload = async function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      
     

     
    }
    image.src=result;
  }catch(e){

  }

  stopCamera(videopath);
};


