import { firebase } from "./firebase.js";

export class Page {
  constructor(name, htmlName, headerName, footerName, jsName) {
    this.name = name;
    this.htmlName = htmlName;
    this.headerName = headerName;
    this.footerName = footerName;
    this.jsName = jsName || htmlName.substring(htmlName.lastIndexOf('/') + 1, htmlName.lastIndexOf('.')) + '.js';
    this.jsheaderName = headerName ? headerName.substring(headerName.lastIndexOf('/') + 1, headerName.lastIndexOf('.')) + '.js' : undefined;
  }
}

export class Router {
  static parser = new DOMParser();

  static init(mainAreaId, headerAreaId, footerAreaId, pages) {
    Router.pages = pages;
    Router.rootElem = document.getElementById(mainAreaId);
    Router.headerElem = document.getElementById(headerAreaId);
    Router.footerElem = document.getElementById(footerAreaId);
    window.addEventListener('hashchange', Router.handleHashChange);
    Router.handleHashChange();
  }

  static handleHashChange() {
    const urlHash = window.location.hash;
    if (firebase.getUser()) {
      if (urlHash && urlHash !== '#login') {
        const page = Router.pages.find(p => p.name === urlHash);
        if (page) Router.goToPage(page);
      } else {
        Router.goToPage(Router.pages[1]);
      }
    } else {
      Router.goToPage(Router.pages[0]);
    }
  }

  static async goToPage(page) {
    try {
      await Router.loadContent(page.htmlName, Router.rootElem);
      if (page.name !== '#login') {
        await Router.loadContent(page.headerName, Router.headerElem);
        await Router.loadContent(page.footerName, Router.footerElem);
      } else {
        Router.headerElem.innerHTML = '';
        Router.footerElem.innerHTML = '';
      }
      await Router.loadScript(page.jsName);
      if (page.name !== '#login') {
        await Router.loadScript(page.jsheaderName);
      }
    } catch (error) {
      console.error("Error loading page:", error);
    }
  }

  static async loadContent(url, element) {
    if (url) {
      try {
        const response = await fetch(url);
        const text = await response.text();
        const html = Router.parser.parseFromString(text, 'text/html');
        element.innerHTML = '';
        element.appendChild(html.body);
      } catch (error) {
        console.error(`Error loading content from ${url}:`, error);
      }
    }
  }

  static async loadScript(jsName) {
    if (jsName) {
      try {
        const module = await import('./' + jsName);
        if (module.init) module.init();
      } catch (error) {
        console.error(`Error loading script ${jsName}:`, error);
      }
    }
  }
}
