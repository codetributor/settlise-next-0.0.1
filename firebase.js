// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
let app, firebaseConfig, db;
// Your web app's Firebase configuration
fetch('http://127.0.0.1:3000/api/firebase')
.then(result => result.json())
.then(data => {

  firebaseConfig = {
    apiKey: data.apiKey,
    authDomain: data.authDomain,
    projectId: data.projectId,
    storageBucket: data.storageBucket,
    messagingSenderId: data.messagingSenderId,
    appId: data.appId
  };

if(app) {
    app
} else {
    app = initializeApp(firebaseConfig);
}

db = getFirestore(app);

})


// Initialize Firebase


export { app, db }