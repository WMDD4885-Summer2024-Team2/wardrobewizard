import { OutfitByCategory, OutfitCategories } from "./common.js";

export const init = () => {  
    showOutfit();
    viewwardrobe.addEventListener('click',showOutfit);
}

const showOutfit=()=>{
    displayOutfit.innerHTML='';
  
    OutfitCategories().forEach(catgeory => {
        OutfitByCategory(catgeory).forEach((outfit) => {
        displayOutfit.innerHTML+=`<img src='${outfit.downloadURL}' alt=''>`
      });
    });
    
  }