import { userSignOut } from "./common.js"

export const init = () => {  
    signOutButton.addEventListener("click", userSignOut);
}