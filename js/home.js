import { OutfitByCategory } from "./common.js";
import { genreateOutfit } from "./outfitsearch.js";

export const init = () => {  
    genrateOutfitbtn.addEventListener('click', showMatchingOutfit);
}


const  showMatchingOutfit = async () =>{
    const searchResult= await genreateOutfit(OutfitByCategory('top'),OutfitByCategory('bottom'),'Auto');
    matchingoutfit.innerHTML='';
  
    const outfit=searchResult[Math.floor(Math.random() * searchResult.length)];
    if(outfit){
      matchingoutfit.innerHTML+=`<img src='${outfit[0].downloadURL}' alt=''>`
      matchingoutfit.innerHTML+=`<img src='${outfit[1].downloadURL}' alt=''>`
    }
    
  };
