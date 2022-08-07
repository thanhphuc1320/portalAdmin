import firebase from 'firebase/app';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyDmh1cgmJvE0MjIH6qpZnSUHoJWEKwU4sg',
  authDomain: 'tripi-social-portal---develop.firebaseapp.com',
  projectId: 'tripi-social-portal---develop',
  storageBucket: 'tripi-social-portal---develop.appspot.com',
  messagingSenderId: '697407071357',
  appId: '1:697407071357:web:678d0aee9668c017887d14',
};
firebase.initializeApp(firebaseConfig);
export default firebase;
