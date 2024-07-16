import { getOutfitsByCategory, getOutfitCategories } from "./common.js";

export const init = () => {  
    showOutfit();
    viewwardrobe.addEventListener('click',showOutfit);
}

const showOutfit=()=>{
    displayOutfit.innerHTML='';
  
    getOutfitCategories().forEach(catgeory => {
      getOutfitsByCategory(catgeory).forEach((outfit) => {
        displayOutfit.innerHTML+=`<img src='${outfit.downloadURL}' alt=''>`
      });
    });
    
  }