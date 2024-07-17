import { getOutfitCount,genreateOutfits } from "./common.js";

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
      uploadOutfitSection.style.display = outfitArray < 5 ? 'grid' : 'none';
    }

   
    if(uploadOutfitSection.style.display === 'none'){
      
       todaysSuggestionSection.style.display='grid';
      await outfitGenreator();
       
       
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

  for(let count =1;count<=3;count++){
    const outfit=outfits[Math.floor(Math.random() * outfits.length)];

    let tags='';

    outfit[0].tags.forEach((tag) => 
          {tags+=`<span class='tag-info'>${tag}</span>`
    });


    outfit[1].tags.forEach((tag) => 
          {tags+=`<span class='tag-info'>${tag}</span>`
    });





    todayssuggestions.innerHTML+=`<div class='card flex-grow'>
      <div class='card-body'>
        <img src='${outfit[0].downloadURL}'>
        <img src='${outfit[0].downloadURL}'>
      </div>
      <div class='card-footer'>
        ${tags}
      </div>
    </div>`;
   }
}
