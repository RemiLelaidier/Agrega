import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDdAJdlw1B6-8AYYf1YPgA_Yt6U9aTrpPw",
    authDomain: "agrega-info.firebaseapp.com",
    databaseURL: "https://agrega-info.firebaseio.com",
    projectId: "agrega-info",
    storageBucket: "agrega-info.appspot.com",
    messagingSenderId: "91780574324"
};

const fire = firebase.initializeApp(config);
export default fire;