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
  apiKey: "AIzaSyBsHTk6fK2zVx5IPefn4SLO6TnIHCRAhpg",
  authDomain: "senior-project-a5c2f.firebaseapp.com",
  projectId: "senior-project-a5c2f",
  storageBucket: "senior-project-a5c2f.appspot.com",
  messagingSenderId: "353310434546",
  appId: "1:353310434546:web:daaf467447ad819c6adc6b"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);