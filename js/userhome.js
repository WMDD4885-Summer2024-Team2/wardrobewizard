import { getOutfitCount,genreateOutfits,getFileAsBase64,saveHistoryToDb } from "./common.js";
import config from '../resources/config.json' with { type: 'json' };
import {fetchData} from "./utils.js";


export const init = async () => {
  loader.style.display='flex';
  try {
    const outfitArray = await getOutfitCount();
    console.log(outfitArray);

   /*  const count = Array.isArray(outfitArray) ? outfitArray.length : 0;
 */
    const uploadOutfitSection = document.getElementById('uploadoutfitsection');
    const outfitUpload = document.getElementById('outfitupload');
    
    if (uploadOutfitSection) {
      uploadOutfitSection.style.display = outfitArray < 2 ? 'grid' : 'none';
    }

   
    if(uploadOutfitSection.style.display === 'none'){
      
       todaysSuggestionSection.style.display='grid';
      
        await outfitGenreator();
        const virtytryon = document.querySelectorAll('.virtual-try');
        if(virtytryon){
          virtytryon.forEach( (ele) =>{
            ele.addEventListener('click',dovirtytryon);
          })
        }
        modelCloseBtn.addEventListener('click',()=>{
          mySizeChartModal.close();
        });
       
    }

    if (outfitUpload) {
      outfitUpload.addEventListener('click', () => {
        window.location.href = '#uploadoutfithome';
      });
    }
    loader.style.display='none';
  } catch (error) {
    console.error('Error initializing the app:', error);
    loader.style.display='none';
  }
};

const outfitGenreator = async() =>{
  let outfits;
  outfits= await genreateOutfits();
  todayssuggestions.innerHTML='';
  
  const outfit=outfits[Math.floor(Math.random() * outfits.length)];

  if(outfit){

    let tags='';

    outfit[0].tags.forEach((tag) => 
          {tags+=`<span class='tag-info'>${tag}</span>`
    });
  
  
    outfit[1].tags.forEach((tag) => 
          {tags+=`<span class='tag-info'>${tag}</span>`
    });
    
    todayssuggestions.innerHTML+=`<div class='card flex-grow'>
      <div class="flex  flex-row-nowrap justify-space-between align-items-center card-header"> 
       <i class="fa-regular fa-heart icon-solid"></i>
       
        <span class="virtual-try">Virtual Try On</span>
      
      </div>
      
      <div class='card-body'>
        <img src='${outfit[0].downloadURL}' alt='${outfit[0].category}'>
        <img src='${outfit[0].downloadURL}'  alt='${outfit[0].category}'>
      </div>
      <div class='card-footer'>
        ${tags}
      </div>
      
     
    </div>`;

   /*  let data={
      "top" : outfit[0],
      "bottom" : outfit[1]
    }

    saveHistoryToDb(data); */

  }
 
}


const dovirtytryon = async (e) =>{

  const card=e.target.closest('.card');
  const imgs= card.getElementsByTagName('img');
  console.log(imgs[0].alt);
  mySizeChartModal.show();
  loader1.style.display='flex';

  

 const modelImag = await getFileAsBase64(image1.src);
 const outfitImage = imgs[0].src;
 const request = {
  "model": modelImag,
  "garment_top": outfitImage,
  "garment_type": imgs[0].alt==='dress' ? 'dress' : imgs[0].alt==='top' ? 'upper_body' : 'lower_body',
  "desc": imgs[0].alt==='dress' ? 'dress' : imgs[0].alt==='top' ? 'shirt' : 'jeans'
};

 

const result= await fetchData(config.virtualTryOnAPI,"POST",request);

image1.src=response.image.url;

}

