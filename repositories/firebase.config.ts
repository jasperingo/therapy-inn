
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence } from 'firebase/auth/react-native';
import { initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqdKH-dCMKh6oKbxxDIC-orTITknfXBe4",
  authDomain: "theraphy-inn.firebaseapp.com",
  projectId: "theraphy-inn",
  storageBucket: "theraphy-inn.appspot.com",
  messagingSenderId: "1026800087964",
  appId: "1:1026800087964:web:f4c1f422f2fbde6d16ce59"
};

const firebaseApp = initializeApp(firebaseConfig);

initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export default firebaseApp;
