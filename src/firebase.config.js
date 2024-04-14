// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDV0T2LSWi_8TXP_wqEunUI4Ved8W-UlQ",
  authDomain: "tax-plus.firebaseapp.com",
  projectId: "tax-plus",
  storageBucket: "tax-plus.appspot.com",
  messagingSenderId: "746357176224",
  appId: "1:746357176224:web:f3cd133c76b22ead7e16c5",
  measurementId: "G-1H60CGNYRS",
};
const employeeConfig = {
  apiKey: "AIzaSyBYF9q3w9Y_9tiL1HMi7ma8OkIl6vcs77U",
  authDomain: "tax-plus-employee.firebaseapp.com",
  projectId: "tax-plus-employee",
  storageBucket: "tax-plus-employee.appspot.com",
  messagingSenderId: "229301943604",
  appId: "1:229301943604:web:f7b5bf22f9995902f1f961",
};

const publicUserConfig = {
  apiKey: "AIzaSyB6yOp2cQMSRUWJlYOjnr4u81LrEjv_Yew",
  authDomain: "tax-plus-public-user.firebaseapp.com",
  projectId: "tax-plus-public-user",
  storageBucket: "tax-plus-public-user.appspot.com",
  messagingSenderId: "1085572725458",
  appId: "1:1085572725458:web:54585e0d8e52255d3f8b0b",
};
const chatConfig = {
  apiKey: "AIzaSyBSpX6d1voE1p41z9iN4NfsPV1NGftJphg",
  authDomain: "tax-plus-chat.firebaseapp.com",
  projectId: "tax-plus-chat",
  storageBucket: "tax-plus-chat.appspot.com",
  messagingSenderId: "382828909383",
  appId: "1:382828909383:web:045c23b0e292c845853262",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const employeeApp = initializeApp(employeeConfig, "secondary");
const publicUserApp = initializeApp(publicUserConfig, "third");
const chatApp = initializeApp(chatConfig, "fourth");
const auth = getAuth(app);
const employeeAuth = getAuth(employeeApp);
const publicUserAuth = getAuth(publicUserApp);
const publicUserStorage = getStorage(employeeApp);
const chatStore = getFirestore(chatApp);
export {
  auth,
  employeeAuth,
  publicUserAuth,
  publicUserStorage,
  chatStore,
  chatApp,
};
