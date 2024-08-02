
import { loadOutfitData, deleteOufitDoc, wardrowizAlert } from "./common.js";

export const init = () => {
    // viewwardrobe.addEventListener("click", showOutfit);

    showOutfits(loadOutfitData());

    uploadButtonCloset.addEventListener('click', function () {
        window.location.href = "#uploadoutfitmycloset";
    })


    function showOutfits(outfit_info_data) {

        if (outfit_info_data == 0) {
            document.getElementById('outfitHeading').innerHTML = ` No Outfits are there`;
            result(outfit_info_data);

        } else {
            result(outfit_info_data);
            createDropdown(outfit_info_data);

        }


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

    var top = document.getElementById('top');
    top.addEventListener('click', function () {
        var tops = loadOutfitData().filter(outfit => outfit.garment_type === 'top');

        if (tops.length != 0) {

            result(tops);
            document.getElementById('outfitHeading').innerHTML = ``;

        } else {
            result(tops);

            document.getElementById('outfitHeading').innerHTML = ` No tops are there`;
        }
        console.log(tops);
    })


    var bottom = document.getElementById('bottom');
    bottom.addEventListener('click', function () {
        var bottom = loadOutfitData().filter(outfit => outfit.garment_type === 'bottom');

        if (bottom.length != 0) {

            result(bottom);
            document.getElementById('outfitHeading').innerHTML = ``;

        } else {
            result(bottom);

            document.getElementById('outfitHeading').innerHTML = ` No Bottoms are there `;
        }
        console.log(bottom);
    })

    var dresses = document.getElementById('dresses');
    dresses.addEventListener('click', function () {
        var dresses = loadOutfitData().filter(outfit => outfit.garment_type === 'dress');
        if (dresses.length != 0) {

            result(dresses);
            document.getElementById('outfitHeading').innerHTML = ``;

        } else {
            result(dresses);
            document.getElementById('outfitHeading').innerHTML = `No dresses are there `;
        }
    })

    var allOutfits = document.getElementById('allOutfits');
    allOutfits.addEventListener('click', function () {
        var allOutfits = loadOutfitData();
        if (allOutfits.length != 0) {

            result(allOutfits);
            document.getElementById('outfitHeading').innerHTML = ``;

        } else {
            result(allOutfits);

            document.getElementById('outfitHeading').innerHTML = `No Outfits are there `;
        }
    })

    var occasion = document.getElementById('occasion');
    occasion.addEventListener('change', function () {
        var occasion_info = loadOutfitData().filter(outfit => outfit.occasion == occasion.value);
        if (occasion_info.length != 0) {
            result(occasion_info);
            document.getElementById('outfitHeading').innerHTML = ``;

        } else {

        }

    })
    var color = document.getElementById('color');
    color.addEventListener('change', function () {
        var color_info = loadOutfitData().filter(outfit => outfit.colorName == color.value);
        document.getElementById('outfitHeading').innerHTML = ``;

        result(color_info);

    })


    function result(outfit) {
        console.log('hello');
        var outfitContainer = document.getElementById("outfits");
        outfitContainer.innerHTML = '';
        outfit.forEach((item) => {
            console.log(item.id);
/* <div class="card">
<div class="image"> 
<img src=  ${item.image64} alt=${item.id}> 
</img>
</div>
<div class="card-body">
<div class = "card-description">
  <div class="title">${item.garment_type}</div>
  <div class="price">${item.tags}</div>
  </div>
  <div class = "deleteBtns">
  <i class="fa-regular fa-trash-can" id = "${item.id}"></i>
  </div>
</div> */
            const content = `
  
  

<div class = 'card-main'>
<div class="card-closet">
  <div class="card-inner">

    <div class="card-front">

      <div class="image"> 
        <img src=  ${item.image64} alt=${item.id}> 
         </img>
      </div>
 
    </div>

    <div class="card-back">
     <div class="price">${item.tags}</div>
    </div>

  </div>
</div>

<div class = "card-description">

<div class="title">${item.garment_type}</div>

<div class = "deleteBtns">
<i class="fa-regular fa-trash-can" id = "${item.id}"></i>
</div>

</div>

</div>



`;
            outfitContainer.innerHTML += content;
            var buttons = document.querySelectorAll('.fa-trash-can');
            buttons.forEach((button) => {
                button.addEventListener('click', (event) => {
                    console.log(event.target.id);
                    deleteOufitDoc(event.target.id)



                })
            })
        });

    }

}



