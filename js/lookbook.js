import { getFavourites } from "./common";

export const init = () => {  
    let selectedTab = 'history';
    const historyData = document.getElementById('history');
    historyData.addEventListener('click', getHistoryData);


    const favouriteData = document.getElementById('favorite');
    favouriteData.addEventListener('click', getFavouriteData);
    
}