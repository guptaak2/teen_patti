import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyB8PcAZcXkzuqhwiE1itEi3XZ6z6lFjsSM",
    authDomain: "teen-patti-5a5fc.firebaseapp.com",
    databaseURL: "https://teen-patti-5a5fc.firebaseio.com",
    projectId: "teen-patti-5a5fc",
    storageBucket: "teen-patti-5a5fc.appspot.com",
    messagingSenderId: "478653158074",
    appId: "1:478653158074:web:315fbf33f859b2a4632883",
    measurementId: "G-8WZ36J1853"
  };

  const fire = firebase.initializeApp(config)
  export default fire;