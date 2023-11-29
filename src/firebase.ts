// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
type config = {
  apiKey: string,
  authDomain: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string,
  appId: string
}

const firebaseConfig: config = {
  apiKey: "AIzaSyA807o7zbpvUjuGOku5oMudiJTCh85-SOs",
  authDomain: "senior-project-b33ea.firebaseapp.com",
  projectId: "senior-project-b33ea",
  storageBucket: "senior-project-b33ea.appspot.com",
  messagingSenderId: "25987002189",
  appId: "1:25987002189:web:282ca14b7578db08359104"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);
