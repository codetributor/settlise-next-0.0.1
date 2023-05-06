// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC49FW4D-04qZGzgMaRySTWcxI1koxOGdY",
  authDomain: "settlise.firebaseapp.com",
  projectId: "settlise",
  storageBucket: "settlise.appspot.com",
  messagingSenderId: "992250335795",
  appId: "1:992250335795:web:d31dc73b21d25728840946"
};

// Initialize Firebase
let app;

if(app) {
    app
} else {
    app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);

export { app, db }