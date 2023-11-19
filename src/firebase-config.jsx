import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCECmhyjaNWRYa8Cnyu4VUCt2GBYz0UCeg",
    authDomain: "fir-project-122af.firebaseapp.com",
  projectId: "fir-project-122af",  
    storageBucket: "fir-project-122af.appspot.com",
    messagingSenderId: "852818610234",
    appId: "1:852818610234:android:17093650188c58c8c1cd03"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);
  const auth = getAuth(app);

export {auth ,app , db}
