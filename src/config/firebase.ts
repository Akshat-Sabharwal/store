import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { ReCaptchaV3Provider, initializeAppCheck } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyCmOvCx44lHCyy93Iz3ULxSIz39lVz-RjE",
  authDomain: "learningfirebase-64df1.firebaseapp.com",
  databaseURL:
    "https://learningfirebase-64df1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "learningfirebase-64df1",
  storageBucket: "learningfirebase-64df1.appspot.com",
  messagingSenderId: "1007809484295",
  appId: "1:1007809484295:web:bebd9e798cd3e2ddaefca2",
  measurementId: "G-X6DH2KX645",
};

const app = initializeApp(firebaseConfig);

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LccABYqAAAAAKw1lPA0BfhxWwbuc4AbYkL0URad"),
  isTokenAutoRefreshEnabled: true,
});

export const useFirebase = () => {
  const auth = getAuth(app);
  const storage = getStorage(app);
  const db = getFirestore(app);

  return { auth, storage, db };
};
