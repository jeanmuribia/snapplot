// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPEpTNNO566FVsORTVi4T0BmL9NesGWQE",
  authDomain: "snapplot-6a1ff.firebaseapp.com",
  projectId: "snapplot-6a1ff",
  storageBucket: "snapplot-6a1ff.appspot.com",
  messagingSenderId: "85638164388",
  appId: "1:85638164388:web:70573ccec7c8d276d3db31",
  measurementId: "G-LTLMT2FG1C"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const firestore = getFirestore(firebase)
//const analytics = getAnalytics(app);

const firebaseExports = {firebase, firestore};
export default firebaseExports;

