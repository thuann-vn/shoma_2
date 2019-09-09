import * as firebase from 'firebase';
import '@firebase/firestore';
import ApiKeys from '../constants/ApiKeys';

// Initialize firebase...
firebase.initializeApp(ApiKeys.FirebaseConfig);

export default firebase;

export const firestore = firebase.firestore();

export const getUserId = () => {
    return firebase.auth().currentUser ? firebase.auth().currentUser.uid : null;
}

/**
 * 
 * @return {firebase.firestore.CollectionReference}
 */
export const getUserAllData = () => {
    const userId = getUserId();
    return firestore.collection('users').doc(userId);
}

/**
 * 
 * @param {*} collection 
 * @return {firebase.firestore.CollectionReference}
 */
export const getCollectionRef = (collection) => {
    const userId = getUserId();
    return firestore.collection('users').doc(userId).collection(collection);
}