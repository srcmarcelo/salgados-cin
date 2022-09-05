// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrFBhjVtkhcpoll_em5Y6TK_nUkPlhxQI",
  authDomain: "salgados-cin.firebaseapp.com",
  projectId: "salgados-cin",
  storageBucket: "salgados-cin.appspot.com",
  messagingSenderId: "313537309327",
  appId: "1:313537309327:web:206efbffd23bbac3d99efa",
  measurementId: "G-JZSGY1EKDQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
