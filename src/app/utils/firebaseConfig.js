import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD8XoqMQhp082Y7hCGl3kofGn70pNehUaU",
    authDomain: "womanup-test-task-ac0ad.firebaseapp.com",
    databaseURL:
        "https://womanup-test-task-ac0ad-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "womanup-test-task-ac0ad",
    storageBucket: "womanup-test-task-ac0ad.appspot.com",
    messagingSenderId: "983752963108",
    appId: "1:983752963108:web:3bcaa9a4309e57ac7a94b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
