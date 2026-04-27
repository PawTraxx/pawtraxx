import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyALHLhCMc840JMOl1joViz8HUaQqors_I",
  authDomain: "pawtraks-331a5.firebaseapp.com",
  projectId: "pawtraks-331a5",
  storageBucket: "pawtraks-331a5.firebasestorage.app",
  messagingSenderId: "490032294029",
  appId: "1:490032294029:web:c37109adff2412bdef5ac4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function saveUser(userData) {
  try {
    if (!userData || !userData.email) return;
    await setDoc(doc(db, 'users', userData.email), userData, { merge: true });
  } catch(e) { console.error('saveUser error:', e); }
}

export async function getUser(email) {
  try {
    const snap = await getDoc(doc(db, 'users', email));
    return snap.exists() ? snap.data() : null;
  } catch(e) { console.error('getUser error:', e); return null; }
}

export async function getAllUsersFromDB() {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const users = {};
    snap.forEach(function(d){ users[d.id] = d.data(); });
    return users;
  } catch(e) { console.error('getAllUsers error:', e); return {}; }
}

export async function deleteUserFromDB(email) {
  try {
    await deleteDoc(doc(db, 'users', email));
  } catch(e) { console.error('deleteUser error:', e); }
}