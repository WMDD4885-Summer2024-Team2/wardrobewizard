import config from '../resources/config.json' with { type: 'json' };
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

    return [h,s,l];
}

/* const allPages = document.querySelectorAll('div.page');

//SPA (Single Page Application)
export const navigateToPage = function() {
  const pageId = location.hash ? location.hash : '#page1';
  for (let page of allPages) {
    if (pageId === '#' + page.id) {
      page.style.display = 'grid';
    } else {
      page.style.display = 'none';
    }
  }
  return;
} */


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


export const startCamera = (video)=>{
  if(video && navigator.mediaDevices && navigator.mediaDevices.getUserMedia){

    const mediaPromise=navigator.mediaDevices.getUserMedia({video:true});
    mediaPromise.then((stream)=>{
      video.srcObject = stream;
    }).catch((error) =>{
      console.error(error);
    });
  }
}

export const stopCamera = (video) =>{
  if(video && video.srcObject){
    const tracks=video.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
  }
 
}
 

// Reusable fetch utility function
export const fetchData = async (url, method, data = null) => {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : null,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error during fetch:", error);
    throw error;
  }
};

// Reusable fetch utility function
export const fetchDepTagData = async ( data = null) => {
  var formdata = new FormData();
  formdata.append("image", data);
  const options = {
    method: 'POST',
    headers: {
      "x-api-key": config.deepTagAPIKey
    },
    body: formdata 
  };

  try {
    const response = await fetch(config.deepTagingURL, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error during fetch:", error);
    throw error;
  }
};


export const getLocation = () => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser.");
  }

  console.log("Geolocation is supported. Requesting location...");

  const options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0,
  };

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log(`Latitude: ${latitude}`);
        console.log(`Longitude: ${longitude}`);
        sessionStorage.setItem('latitude', latitude);
        sessionStorage.setItem('longitude', longitude);
        console.log(`More or less ${accuracy} meters.`);
        resolve(position);
      },
      (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        sessionStorage.setItem('latitude', null);
        sessionStorage.setItem('longitude', null);
        reject(err);
      },
      options
    );
  });
}
