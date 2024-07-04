
import { firebase } from "./firebase.js";





export class Page {
    constructor(name, htmlName,headerName,footerName, jsName) {
      this.name = name;
      this.htmlName = htmlName;
      this.headerName=headerName;
      this.footerName=footerName;
      // if jsName is not given use the html name + '.js'
      this.jsName = jsName
        ? jsName
        : htmlName.substring(htmlName.lastIndexOf('/')+1, htmlName.lastIndexOf('.')) + '.js';

      this.jsheaderName = headerName? headerName.substring(headerName.lastIndexOf('/')+1 , headerName.lastIndexOf('.')) + '.js' : undefined;
    }
  }
  


export class Router {
    static parser = new DOMParser();
   
    static init(mainAreaId,headerArea,footerArea, pages) {
      Router.pages = pages;
      Router.rootElem = document.getElementById(mainAreaId);
      Router.headerElem=document.getElementById(headerArea);
      Router.footerElem=document.getElementById(footerArea);
      window.addEventListener('hashchange', function (e) {
        Router.handleHashChange();
      });
      Router.handleHashChange();
    }
  
    static handleHashChange() {
      const urlHash = window.location.hash;
      if(firebase.getUser()){
        if (urlHash.length > 0 && urlHash!=='#login') {
          // If there is a hash in URL
          for (let page of Router.pages) {
            // find which page matches the hash then navigate to it
            if (urlHash === page.name) {
              Router.goToPage(page);
              break;
            }
          }
        } else {
          // If no hash in URL, load the first Page as the default page
          Router.goToPage(Router.pages[1]);
        }
      }else{
        Router.goToPage(Router.pages[0]);
      }
      
    }
  
    static async goToPage(page) {
      try {
        const response = await fetch(page.htmlName);
        const txt = await response.text();
        const html = Router.parser.parseFromString(txt, 'text/html');
        Router.rootElem.innerHTML = '';
        Router.rootElem.appendChild(html.body);

        //Load header
        if(page.name!=='#login' && page.headerName){
          const response = await fetch(page.headerName);
          const txt = await response.text();
          const html = Router.parser.parseFromString(txt, 'text/html');
          Router.headerElem.innerHTML = '';
          Router.headerElem.appendChild(html.body);
        }else{
          Router.headerElem.innerHTML = '';
        }

        if(page.name!=='#login' && page.footerName){
          const response = await fetch(page.footerName);
          const txt = await response.text();
          const html = Router.parser.parseFromString(txt, 'text/html');
          Router.footerElem.innerHTML = '';
          Router.footerElem.appendChild(html.body);
        }else{
          Router.footerElem.innerHTML = '';
        }
        //alternative but slower
        //Router.rootElem.innerHTML = txt;
  
        //import the JS module dynamically
       const module = await import('./' + page.jsName);
      // console.log('imported module :' + page.jsName);
        //and invoke the init method of module if exists
        if (module.init) {
          module.init();
       }

       if(page.name!=='#login' && page.jsheaderName){
          const module = await import('./' + page.jsheaderName);
         // console.log('imported module :' + page.jsheaderName);
          //and invoke the init method of module if exists
          if (module.init) {
            module.init();
          }
       }
      } catch (error) {
        console.error(error);
      }
    }
  }
  