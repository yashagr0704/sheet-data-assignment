// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const env = process.env.NODE_ENV;
const firebaseConfig = {
apiKey: "AIzaSyC9G_-zYHAecLU6bnQvv7Oegerx995OVxE",
  authDomain: "csvdata-57119.firebaseapp.com",
  projectId: "csvdata-57119",
  storageBucket: "csvdata-57119.appspot.com",
  messagingSenderId: "175981123019",
  appId: "1:175981123019:web:a13cd89de38e7e59f3524e",
  measurementId: "G-MYCVNHSGY8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;
export const auth = getAuth();
