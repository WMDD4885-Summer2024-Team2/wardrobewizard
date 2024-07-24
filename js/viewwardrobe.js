import { getOutfitsByCategory } from "./common.js";

export const init = () => {
  showOutfit();
 // viewwardrobe.addEventListener("click", showOutfit);

  outfitupload.addEventListener('click', ()=>{
    window.location.href = '#uploadoutfitmycloset';
  });
};

const showOutfit = () => {
  renderdata("top", tops);
  renderdata("bottom", bottoms);
  renderdata("dress", dresses);
};

const renderdata = (catgeory, element) => {


  let outfits = getOutfitsByCategory(catgeory);

  if(outfits.length === 0){
    element.innerHTML +=`Sorry, There are no ${catgeory}'s available in your wardrobe to display.`;
    return;
  }

  outfits.forEach((outfit) => {
    let tags = "";


    outfit.tags.forEach((tag) => {
      tags += `<span class='tag-info'>${tag}</span>`;
    });

    element.innerHTML += `<div class='card flex-grow'>
        <div class='card-body'>
          <div><img src='${outfit.imageUrl}'></div>
        
        </div>
        <div class='card-footer'>
          ${tags}
        </div>
      </div>`;
  });
};
