import React, { useState, useEffect } from 'react';
import { app } from '../config/firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Image } from 'react-native';

export const BucketList = () => {
  // Access Firestore instance.
  const db = getFirestore(app);
  const bucketlistCollectionRef = collection(db, "bucketlist");

  //images
  /*const imageMap = {
    'campingImage.jpg': require('../assets/images/campingImage.jpg'),
   // 'hikingImage.jpg': require('../assets/images/hikingImage.jpg'),
   // 'scubaDivingImage.jpg': require('../assets/images/scubaDivingImage.jpg'),
   // 'default.jpg': require('../assets/images/default.jpg'), // Fallback image
  };*/

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
  
  // Fetch bucketlist items immediately when the component mounts
  useEffect(() => {
    fetchBucketList();
  }, []);

  return (
    <div>
      <h2>BucketList Items</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {bucketlist.length > 0 ? (
          bucketlist.map(item => (
            <div key={item.id} style={{
              margin: '20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',  // Arrange content vertically
              alignItems: 'center',      // Horizontally center content
              justifyContent: 'center',  // Vertically center content
              maxWidth: '200px', 
             }}>
              {/* Display image using relative path stored in Firestore */}
              {item.Image && (
                 // <Image source={require('../assets/images/${item.image}')} style={{ width: 200, height: 200 }} />
               // <Image source={imageMap[item.image]} style={{ width: 200, height: 200 }} />

                <Image source={require('../assets/images/bucketListImages/campingImage.jpg')} style={{ width: 100, height: 100, borderRadius: '12%', justifyContent: 'center' }} />
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
