import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs, deleteField } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyALHLhCMc840OJMOl1joViz8HUaQqors_I",
  authDomain: "pawtraks-331a5.firebaseapp.com",
  projectId: "pawtraks-331a5",
  storageBucket: "pawtraks-331a5.firebasestorage.app",
  messagingSenderId: "490032294029",
  appId: "1:490032294029:web:c37109adff2412bdef5ac4"
};

const app = initializeApp(firebaseConfig);
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LfOf9AsAAAAAEOhUMPT4iLQyQgKydBZNcaCHpeM'),
  isTokenAutoRefreshEnabled: true
});
export const db = getFirestore(app);
export const auth = getAuth(app);

export async function saveUser(userData) {
  try {
    if (!userData || !userData.email) return;
    await setDoc(doc(db, 'users', userData.email), userData, { merge: true });
  } catch(e) { console.error('saveUser error:', e); }
}
export async function removePasswordField(email) {
  try {
    await setDoc(doc(db, 'users', email), { password: deleteField() }, { merge: true });
  } catch(e) { console.error('removePasswordField error:', e); }
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

export async function registerWithFirebase(email, password) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(cred.user);
    return { success: true, user: cred.user };
  } catch(e) { return { success: false, error: e.message }; }
}

export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch(e) { return { success: false, error: e.message }; }
}
export async function signInUser(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: cred.user };
  } catch(e) { return { success: false, error: e.message }; }
}

export async function signOutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch(e) { return { success: false, error: e.message }; }
}