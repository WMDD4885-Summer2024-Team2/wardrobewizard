/* 
function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      console.log("Geolocation is supported. Requesting location...");
      const options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      };
      function success(position) {
        const crd = position.coords;
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        sessionStorage.setItem('latitude', crd.latitude);
        sessionStorage.setItem('longitude', crd.longitude);
        console.log(`More or less ${crd.accuracy} meters.`);
      }
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        sessionStorage.setItem('latitude', undefined);
        sessionStorage.setItem('longitude', undefined);
      }
      navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

getLocation().then(position => {
    console.log("Geolocation obtained successfully:", position);
  }).catch(error => {
    console.error("Error obtaining geolocation:", error);
  }); */