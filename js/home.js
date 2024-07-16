import { getOutfitCount } from "./common.js";

export const init = async () => {
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

    if (outfitUpload) {
      outfitUpload.addEventListener('click', () => {
        window.location.href = '#uploadoutfithome';
      });
    }
  } catch (error) {
    console.error('Error initializing the app:', error);
  }
};
