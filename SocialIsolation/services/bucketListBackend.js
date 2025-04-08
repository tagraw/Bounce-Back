import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../config/firebase';

const db = getFirestore(app);
const auth = getAuth(app);

// 🔹 Add a bucket list item for the current user
export const addBucketItem = async (data) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');

  const bucketlistRef = collection(db, 'users', user.uid, 'bucketlist');

  const docRef = await addDoc(bucketlistRef, {
    ...data,
    createdAt: new Date(),
  });

  return docRef.id;
};

// 🔹 Get all bucket list items for the current user
export const getBucketList = async () => {
    const auth = getAuth(app);
    const db = getFirestore(app);
  
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
  
    const bucketlistRef = collection(db, 'users', user.uid, 'bucketlist');
    const snapshot = await getDocs(bucketlistRef);
  
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

// 🔹 Get a single item
export const getBucketItemById = async (itemId) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');

  const itemRef = doc(db, 'users', user.uid, 'bucketlist', itemId);
  const docSnap = await getDoc(itemRef);

  if (!docSnap.exists()) throw new Error('Item not found');

  return { id: docSnap.id, ...docSnap.data() };
};

// 🔹 Update an item
export const updateBucketItem = async (itemId, data) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');

  const itemRef = doc(db, 'users', user.uid, 'bucketlist', itemId);
  await updateDoc(itemRef, data);
};

// 🔹 Delete an item
export const deleteBucketItem = async (itemId) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not logged in');

  const itemRef = doc(db, 'users', user.uid, 'bucketlist', itemId);
  await deleteDoc(itemRef);
};
