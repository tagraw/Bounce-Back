import React, { useState } from 'react';
import { app } from '../config/firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export const BucketList = () => {
  // Access Firestore instance.
  const db = getFirestore(app);
  const bucketlistCollectionRef = collection(db, "bucketlist");

  // Keep track of the fetched bucketlist items in state.
  const [bucketlist, setBucketlist] = useState([]);

  // Function to fetch bucketlist items.
  const fetchBucketList = async () => {
    try {
      const querySnapshot = await getDocs(bucketlistCollectionRef);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Bucketlist items fetched successfully:', items);
      setBucketlist(items);
    } catch (error) {
      console.error('Error fetching bucketlist items:', error);
    }
  };

  return (
    <div>
      <h2>BucketList Items</h2>
      <button onClick={fetchBucketList}>Fetch BucketList</button>

      <ul>
        {bucketlist.map(item => (
          <li key={item.id}>
            {item.title} {/* Adjust this field based on your document structure */}
          </li>
        ))}
      </ul>
    </div>
  );
};
