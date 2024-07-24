import {startCamera,stopCamera,colorThief,uploadImageToStorage,saveOutfitToDb} from "./common.js";
import {fetchData,fetchDepTagData,hexToHsl} from "./utils.js";
import config from '../resources/config.json' with { type: 'json' };

const ctx = canvas.getContext("2d");

export const init = () => {

    if (document.body.classList.contains("hide"))
        document.body.classList.toggle("hide");

      if (document.body.classList.contains("show"))
        document.body.classList.toggle("show");

      if (document.body.classList.contains("show-camera"))
        document.body.classList.toggle(".show-camera");

    outfitupload.addEventListener("click", () => {
        uploadDialog.showModal();
      });
    
      closeBtn.addEventListener("click", () => {
        uploadDialog.close();
      });
    
      fileupload.addEventListener("change", (e) =>{
        try{
            loader.style.display='flex';
            handleImage(e);
            
        }catch(error){
            console.log(error);
            loader.style.display='none';
        }
      });
    
      retry.addEventListener("click", () => {
        uploadDialog.showModal();
      });
    
      
    
     startCameraBtn.addEventListener("click", initCamera);
    
     snapImage.addEventListener("click", takeSnap);

     uploadoutfitSubBtn.addEventListener('click',(e)=>{
           
        e.preventDefault();
        saveoutfit();
        
     });

     uploadoutfitBackBtn.addEventListener('click',()=>{
        pageNavigation();
     })
}

const saveoutfit = async() =>{

    let tagsArray=[];

    let inputs = tags.querySelectorAll("input[type='checkbox']");

    inputs.forEach((input)=>{
        if(input.checked){
            tagsArray.push(input.value);
        }
    });

    //Form Validation
    let validationCheckFailed=false;
    if(category.value==='' ){
        category.classList.add("invalid");
        validationCheckFailed=true;
    }
        
    if(occasion.value===''){
        occasion.classList.add("invalid");
        validationCheckFailed=true;
    }
    
    if(tagsArray.length===0){
        tags.classList.add("invalid");
        validationCheckFailed=true;
    }
        
     if(validationCheckFailed){
        return false;
     }
        

    let downloadURL = await uploadImageToStorage(
        canvas.toDataURL(),
        "outfit"
      );
    
      
    let outfit = {
        "category": category.value,
        "color": hexToHsl(colorPicker.value),
        "downloadURL": downloadURL,
        "tags" :tagsArray,
        "occasion" : occasion.value
    };

    saveOutfitToDb(outfit);
    pageNavigation();
   
}

//uploadoutfitmycloset
const pageNavigation = () =>{
    if( window.location.href.includes( "#uploadoutfithome")){
        window.location.href = "#userhome";
    }else if(window.location.href.includes( "#uploadoutfitmycloset")){
      window.location.href = "#mycloset";
    }
}
const handleImage = (e) => {
    //uploadoutfitSubBtn.setAttribute("disabled","disabled");
   
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = async function (e) {
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        uploadDialog.close();
        if (!document.body.classList.contains("hide"))
          document.body.classList.toggle("hide");
  
        if (!document.body.classList.contains("show"))
          document.body.classList.toggle("show");
  
        if (document.body.classList.contains("show-camera"))
          document.body.classList.toggle(".show-camera");
        
        retry.style.display='none';
  
        try{
          
          processImage(img.src);
          
        }catch(error){
          console.log(error);
          retry.style.display='block';
          loader.style.display='none';
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
    loader.style.display='flex';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(videopath, 0, 0, canvas.width, canvas.height);
    document.body.classList.toggle("show-camera");
    document.body.classList.toggle("show");
    const base64String = canvas.toDataURL();
    retry.style.display='none';
    try{
        stopCamera(videopath);
      
      processImage(base64String);
      
    }catch(error){
        console.log(error);
        retry.style.display='block';
        loader.style.display='none';
    }
    
    
  };

  const processImage = async (base64String) =>{

    const result= await fetchData(config.rmbgURL,"POST",{
        base64Image: base64String
      });

    const image =new Image();
      image.onload =  function() {
        let dominantColor = colorThief.getColor(image);
        // Display the dominant color
        const r = parseInt(dominantColor[0]).toString(16).padStart(2, '0');
        const g = parseInt(dominantColor[1]).toString(16).padStart(2, '0');
        const b = parseInt(dominantColor[2]).toString(16).padStart(2, '0');
        const hexColor = `#${r}${g}${b}`;
        
        colorPicker.value =hexColor;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        canvas.toBlob( async(blob) => {
            generate_tags(await fetchDepTagData(blob))
           
        });
        uploadoutfitSubBtn.removeAttribute("disabled");
        loader.style.display='none';
        retry.style.display='block';
      }
      image.src=result;
  }


  const generate_tags = (results) => {
   
    let accessories = [];

    
    try {
        let resultArray = JSON.parse(results);
       

        accessories = resultArray.data.items
            .filter(item => item.category === 'accessories')
            .map(item => item.name);
        

      

        for (let i = 0; i < resultArray.data.labels.length; i++) {
          
            tags.innerHTML+='';
            tags.innerHTML+=` <input type='checkbox' id="${resultArray.data.labels[i].name}" value="${resultArray.data.labels[i].name}"  >
                            <label for="${resultArray.data.labels[i].name}">${resultArray.data.labels[i].name}</label>`;
            let secondaryClassification = resultArray.data.labels[i].secondary_classification;
            if (secondaryClassification === "upperbody" || secondaryClassification === "lowerbody") {
                categoryPopulator(secondaryClassification);
            }
        }

        
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
}


const categoryPopulator = (garment_type) =>{
    
    if (garment_type === "upperbody") {
        category.value = "top";
    }
    if (garment_type === "lowerbody") {
        category.value = "bottom";
    }
    if (garment_type === "dress") {
        category.value = "dress";
    }
}