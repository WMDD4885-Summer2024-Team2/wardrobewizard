
//Function to convert hex color to hsl color
export const hexToHsl = function(hex) {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    // Parse the r, g, b values
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    // Find the max and min values to get the lightness
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // Achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `hsl(${h}, ${s}%, ${l}%)`;
}

//SPA (Single Page Application)
export const navigateToPage = function(allPages) {
  const pageId = location.hash ? location.hash : '#page1';
  for (let page of allPages) {
    if (pageId === '#' + page.id) {
      page.style.display = 'block';
    } else {
      page.style.display = 'none';
    }
  }
  return;
}


export const base64ToBlob = function(base64, mimeType) {
  // Decode the base64 string to a binary string
  let binaryString = atob(base64.split(',')[1]);

  // Create a byte array with the same length as the binary string
  let byteArray = new Uint8Array(binaryString.length);

  // Fill the byte array with the binary string's character codes
  for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
  }

  // Create a Blob from the byte array
  let blob = new Blob([byteArray], { type: mimeType });

  return blob;
}