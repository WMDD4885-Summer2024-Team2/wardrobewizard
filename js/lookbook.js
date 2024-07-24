import { firebase } from "./firebase.js";
import { collection, query, getDocs, doc, limit , orderBy, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

  
export const init = () => {  
    getHistoryData();

    const historyData = document.getElementById('history');
    historyData.addEventListener('click', (eve) => {
        eve.preventDefault();
        getHistoryData();
    });

    const favouriteData = document.getElementById('favorite');
    favouriteData.addEventListener('click', (event) => {
        event.preventDefault();
        getFavouriteData();
    });
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

const outputFavoriteResult = (model_info_data, isClicked) => {
    console.log('document', document)
    const favoriteTab = document.getElementById('favorite');
    if (isClicked) {
        result(model_info_data, 'favorite');
    }
    favoriteTab.addEventListener('click', function () {
        favoriteTab.style.borderBottom = '1px solid var(--color4)';
        const historyTab = document.getElementById('history');
        historyTab.style.borderBottom = '';
        result(model_info_data, 'favorite');
    });
}

const outputHistoryResult = (outfit_info_data) => {
    result(outfit_info_data, 'history');

    const historyTab = document.getElementById('history');
    historyTab.style.borderBottom = '1px solid var(--color4)';
    historyTab.addEventListener('click', function () {
        historyTab.style.borderBottom = '1px solid var(--color4)';
        const favoriteTab = document.getElementById('favorite');
        favoriteTab.style.borderBottom = '';
        result(outfit_info_data, 'history');
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

            outfitContainer.innerHTML += content;
        });
    }
    if (tabselection == 'favorite') {
        const totalItems = document.getElementById('totalOutfits');
        totalItems.innerHTML = `${outfit.length} items`;
        const outfitContainer = document.getElementById("outfits");
        outfitContainer.innerHTML = '';
        outfit.forEach((item) => {
            console.log(item);
            const content =
                `<div class="history-fav-card" id=${item.id}>
                <div class="topOutfit">
                <img src = ${item.top.imageUrl} alt = ${item.id}>
                </div>
                <div class="bottomOutfit">
                <img src = ${item.bottom.imageUrl} alt = ${item.id}>
                </div>
                <button class="delete-btn"  id = "${item.id}"> 
                <i class="fa-solid fa-heart"></i>
                </button>
                </div>`;

            outfitContainer.innerHTML += content;
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
