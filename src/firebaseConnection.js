import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyABp8ZsDj4wjkUivL3L0FeG1k8XB3x1XYc",
    authDomain: "bancodadosturmab-c458e.firebaseapp.com",
    projectId: "bancodadosturmab-c458e",
    storageBucket: "bancodadosturmab-c458e.appspot.com",
    messagingSenderId: "683528297688",
    appId: "1:683528297688:web:e11c58695a752ea7894bad"
};  

const firebaseApp = initializeApp(firebaseConfig);
const bancodedados = getFirestore(firebaseApp);
const auth = getAuth (firebaseApp);

export {bancodedados, auth};



