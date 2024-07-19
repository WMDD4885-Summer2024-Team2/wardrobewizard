import { userSignIn } from "./common.js";

export const init = () => { 
    googleSignIn.addEventListener("click", userSignIn);
}