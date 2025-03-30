import React, { useState, useEffect } from 'react';
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
  console.log('Bucketlist state:', bucketlist);  // Check bucketlist here

  return (
    <div>
      <h2>BucketList Items</h2>
      <button onClick={fetchBucketList}>Fetch BucketList</button>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {bucketlist.length > 0 ? (
          bucketlist.map(item => (
            <div key={item.id} style={{ margin: '20px', textAlign: 'center' }}>
              {/* Display image using relative path stored in Firestore */}
              {item.image && (
                <img
                  src={`/${item.image}`}  // Concatenate with the public directory
                  alt={item.Name}
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                  }}
                />
              )}
              <h3>{item.Name}</h3> {/* Display the item name */}
            </div>
          ))
        ) : (
          <p>No bucket list items available.</p>
        )}
      </div>
    </div>
  );
};
