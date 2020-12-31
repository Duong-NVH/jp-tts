import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNzpXtOzbc2LIK01KB5EwQ-xIQOk7drCw",
  authDomain: "jp-tts.firebaseapp.com",
  projectId: "jp-tts",
  storageBucket: "jp-tts.appspot.com",
  messagingSenderId: "25688578172",
  appId: "1:25688578172:web:ebf7073af5cb3cccf451f9",
};
firebase.initializeApp(firebaseConfig);

export const fireStore = firebase.firestore();
