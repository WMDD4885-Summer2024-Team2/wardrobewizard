import { userSignOut, loadUserProfile } from "./common.js"

export const init = () => {  
   signOutButton.addEventListener("click", userSignOut);
   signOutButton2.addEventListener("click", userSignOut);

   closeBtn.addEventListener('click',()=>{
      uploadDialog.close();
     });
  
     var headerMenu = document.getElementById('header-menu');

     function openMenu() {
       headerMenu.setAttribute('class', 'bloom-mobile-header nav-visible');
     }
     function closeMenu() {
       headerMenu.removeAttribute('class', ' bloom-mobile-header nav-visible');
       headerMenu.setAttribute('class', ' bloom-mobile-header');
     }
     
     openNavButton.addEventListener("click", function (event) {
       openMenu();
     })
     
     closeNavButton.addEventListener("click", function (event) {
       closeMenu();
     })
     var mq = window.matchMedia("(min-width: 700px)");
     mq.addEventListener("change", function() {
       if (mq.matches) {
         closeMenu();
       }
     });
//  console.log('testlog');
//      console.log(loadUserProfile());

//      const result =  loadUserProfile();
//   const documents = result.docs;
  // documents.forEach((doc) => {
  //   console.log(doc.id + 'gotId');
  // userImage.src =  doc.data().profileImageUrl;


  // });

 
  async function main() {
    await getInformation();
  }
  
  async function getInformation() {
    const result = await loadUserProfile();
  const documents = result.docs;
  documents.forEach((doc) => {
    console.log(doc.id + 'docID');
  userImage.src =  doc.data().profileImageUrl;

  });
  }
  
  main();


}

 
