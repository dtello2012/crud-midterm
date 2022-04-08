import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: `${process.env.REACT_APP_API_KEY}`,
    authDomain: 'mideterm-app.firebaseapp.com',
    projectId: 'mideterm-app',
    storageBucket: 'mideterm-app.appspot.com',
    messagingSenderId: `${process.env.REACT_APP_MESSAGING_SENDER_ID}`,
    appId: `${process.env.REACT_APP_APP_ID}`,
    measurementId: `${process.env.REACT_APP_MEASUREMENT_ID}`
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
