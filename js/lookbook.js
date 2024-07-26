import { firebase } from "./firebase.js";
import { collection, query, getDocs, doc, limit , orderBy, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { wardrowizAlert } from "./common.js";
  
let historyOutfits;
let favOutfits;
let selectedTab = 'history';
export const init = () => {  
    
    getHistoryData();

    const historyData = document.getElementById('history');
    historyData.addEventListener('click', (eve) => {
        eve.preventDefault();
        searchBtn.value = "";
        getHistoryData();
    });

    const favouriteData = document.getElementById('favorite');
    favouriteData.addEventListener('click', (event) => {
        event.preventDefault();
        searchBtn.value = "";
        getFavouriteData();
    });

    searchButton.addEventListener('click', () => {
        if(!!searchBtn.value) {
            searchFromOutfits();
        } else {
            wardrowizAlert('Please enter some keyword to search!');
        }
    })
}

const getHistoryData = async () => {
    try {
        var outfit_history_data = [];
        const documentRef = doc(firebase.getDB(), 'history', firebase.getUser().email);
        const subcollectionRef = collection(documentRef, 'historyOutfit');
        const q = query(subcollectionRef, orderBy('createdAt', 'desc'), limit(10)); // create a query with orderBy and limit

        getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                outfit_history_data.push(data);
            });
            outputHistoryResult(outfit_history_data); 
        });
    } catch (error) {
        console.error('Error fetching history data:', error);
    }
}

const getFavouriteData = async (isClicked) => {
    try {
        var outfit_favorite_data = [];
        const documentRef = doc(firebase.getDB(), 'favorites', firebase.getUser().email);
        const subcollectionRef = collection(documentRef, 'favfit');
        getDocs(subcollectionRef).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                outfit_favorite_data.push(data);
            });
            outputFavoriteResult(outfit_favorite_data, isClicked);
        });
    } catch (error) {
        console.error('Error fetching Favourite data:', error);
    }
}

const outputHistoryResult = (outfit_info_data) => {
    historyOutfits = outfit_info_data;
    result(outfit_info_data, 'history');

    const historyTab = document.getElementById('history');
    historyTab.style.borderBottom = '1px solid var(--colorNavyBlue)';
    historyTab.addEventListener('click', function () {
        historyTab.style.borderBottom = '1px solid var(--colorNavyBlue)';
        selectedTab = 'history';
        const favoriteTab = document.getElementById('favorite');
        favoriteTab.style.borderBottom = '';
        result(outfit_info_data, 'history');
    });
}

const outputFavoriteResult = (model_info_data, isClicked) => {
    favOutfits = model_info_data;
    const favoriteTab = document.getElementById('favorite');
    if (isClicked) {
        result(model_info_data, 'favorite');
    }
    favoriteTab.addEventListener('click', function () {
        selectedTab = 'favorite';
        favoriteTab.style.borderBottom = '1px solid var(--colorNavyBlue)';
        const historyTab = document.getElementById('history');
        historyTab.style.borderBottom = '';
        result(model_info_data, 'favorite');
    });
}



const result = (outfit, tabselection) => {
    if (tabselection == 'history') {
        const totalItems = document.getElementById('totalOutfits');
        totalItems.innerHTML = `${outfit.length} items`;
        const outfitContainer = document.getElementById("outfits");
        outfitContainer.innerHTML = '';
        outfit.forEach((item) => {
            const content =
                `<div class="history-fav-card">
                <div class="topOutfit">
                <img src = ${item.outfit.top.imageUrl} alt = ${item.id}>
                </div>
                <div class="bottomOutfit">
                <img src = ${item.outfit.bottom.imageUrl} alt = ${item.id}>
                </div>
                </div>`;
                
            const temporaryDiv = document.createElement('div');
            temporaryDiv.innerHTML = content;
            const tags = document.createElement('div');
            tags.className = "tags";
            if (item.outfit.top.tags && (item.outfit.top.tags.length > 0)) {
                item.outfit.top.tags.map((tag) => {
                    const label = `<label>${tag}</label>`;
                    tags.innerHTML += label;
                });
            } else {
                const label = `<label>No Tags</label>`;
                tags.innerHTML += label;
            }
            if (item.outfit.bottom.tags && (item.outfit.bottom.tags.length > 0)) {
                for(let i=0; i<= 2; i++) {
                    const label = `<label>${tag[i]}</label>`;
                    tags.innerHTML += label;
                }
                item.outfit.bottom.tags.map((tag) => {
                    const label = `<label>${tag}</label>`;
                    tags.innerHTML += label;
                });
            }
            temporaryDiv.querySelector('.history-fav-card').appendChild(tags);
            outfitContainer.innerHTML += temporaryDiv.innerHTML;
        });
    }
    if (tabselection == 'favorite') {
        const totalItems = document.getElementById('totalOutfits');
        totalItems.innerHTML = `${outfit.length} items`;
        const outfitContainer = document.getElementById("outfits");
        outfitContainer.innerHTML = '';
        outfit.forEach((item) => {
            console.log(item, 'item');
            const content =
                `<div class="history-fav-card" id=${item.id}>
                <div class="topOutfit">
                <img src = ${item.top.imageUrl} alt = ${item.id}>
                </div>
                <div class="bottomOutfit">
                <img src = ${item.bottom.imageUrl} alt = ${item.id}>
                </div>
                </div>`;

            const temporaryDiv = document.createElement('div');
            temporaryDiv.innerHTML = content;
            const tags = document.createElement('div');
            tags.className = "tags";
            if (item.top.tags && (item.top.tags.length > 0)) {
                for(let i=0; i<= 1; i++) {
                    const label = `<label>${item.top.tags[i]}</label>`;
                    tags.innerHTML += label;
                }
            } else {
                const label = `<label>No Tags</label>`;
                tags.innerHTML += label;
            }
            if (item.bottom.tags && (item.bottom.tags.length > 0)) {
                for(let i=0; i<= 2; i++) {
                    const label = `<label>${item.bottom.tags[i]}</label>`;
                    tags.innerHTML += label;
                }
            }

            const likeButton = document.createElement('button');
            likeButton.id = item.id;
            likeButton.className = "delete-btn";
            const icon = `<i class="fa-solid fa-heart"></i>`;
            likeButton.innerHTML += icon;
            temporaryDiv.querySelector('.history-fav-card').appendChild(likeButton);
            temporaryDiv.querySelector('.history-fav-card').appendChild(tags);
            
            outfitContainer.innerHTML += temporaryDiv.innerHTML;
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function () {
                    deleteOutfitFromDatabase(this.id);
                });
            });
        });
    }
}

const deleteOutfitFromDatabase = (outfitDocumentId) => {
    const documentRef = doc(firebase.getDB(), 'favorites', firebase.getUser().email);
    const subcollectionRef = collection(documentRef, 'favfit');
    const outfitDocRef = doc(subcollectionRef, outfitDocumentId);

    deleteDoc(outfitDocRef).then(() => {
        getFavouriteData(true);
    }).catch((error) => {
        console.error('Error deleting outfit document:', error);
    });
}


const searchFromOutfits = () => {
    const searchKeyword = searchBtn.value;
    if (selectedTab === 'history') {
        const filteredHistoryOutfits = historyOutfits.filter(item => {
            const topTags = item.outfit.top && item.outfit.top.tags ? item.outfit.top.tags : [];
            const bottomTags = item.outfit.bottom && item.outfit.bottom.tags ? item.outfit.bottom.tags : [];

            const hasTopTag = topTags.some(tag => tag.includes(searchKeyword));
            const hasBottomTag = bottomTags.some(tag => tag.includes(searchKeyword));

            return hasTopTag || hasBottomTag;
        });
        result(filteredHistoryOutfits, 'history');
    } else {
        const filteredFavouriteOutfits = favOutfits.filter(item => {
            const topTags = item.top && item.top.tags ? item.top.tags : [];
            const bottomTags = item.bottom && item.bottom.tags ? item.bottom.tags : [];

            const hasTopTag = topTags.some(tag => tag.includes(searchKeyword));
            const hasBottomTag = bottomTags.some(tag => tag.includes(searchKeyword));

            return hasTopTag || hasBottomTag;
        });
        result(filteredFavouriteOutfits, 'favorite');
    }
}

