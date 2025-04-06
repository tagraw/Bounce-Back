import React, { useState, useEffect } from 'react';
import { Image, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { app } from '../config/firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import styles from './bucketlistStyles';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';


export const BucketList = () => {
  // Access Firestore instance.
  const db = getFirestore(app);
  const bucketlistCollectionRef = collection(db, "bucketlist");
  const navigation = useNavigation();


  //images
  const imageMap = {
    'campingImage.jpg': require('../assets/images/bucketListImages/campingImage.jpg'),
    'guitarImage.jpg': require('../assets/images/bucketListImages/guitarImage.jpg'),
    'backpackingImage.jpg': require('../assets/images/bucketListImages/backpackingImage.jpg'),
    'potteryImage.jpg': require('../assets/images/bucketListImages/potteryImage.jpg'),
    'whitewaterRaftingImage.jpg': require('../assets/images/bucketListImages/whitewaterRaftingImage.jpg'),
    'spanishImage.jpg': require('../assets/images/bucketListImages/spanishImage.jpg'),
    'blackBeltImage.jpg': require('../assets/images/bucketListImages/blackBeltImage.jpg'),
    'cookingImage.jpg': require('../assets/images/bucketListImages/cookingImage.jpg'),
    'openMicImage.jpg': require('../assets/images/bucketListImages/openMicImage.jpg'),
    'roadtripImage.jpg': require('../assets/images/bucketListImages/roadtripImage.jpg'),
    'bookImage.jpg': require('../assets/images/bucketListImages/bookImage.jpg'),
    'triathlonImage.jpg': require('../assets/images/bucketListImages/triathlonImage.jpg'),
    'marathonImage.jpg': require('../assets/images/bucketListImages/marathonImage.jpg'),
    'sewingImage.jpg': require('../assets/images/bucketListImages/sewingImage.jpg'),
    'festivalImage.jpg': require('../assets/images/bucketListImages/festivalImage.jpg'),
    'scubaDivingImage.jpg': require('../assets/images/bucketListImages/scubaDivingImage.jpg'),
    'skyDivingImage.jpg': require('../assets/images/bucketListImages/skyDivingImage.jpg'),
    'dirtBikeImage.jpg': require('../assets/images/bucketListImages/dirtBikeImage.jpg'),
    'iceSkatingImage.jpg': require('../assets/images/bucketListImages/iceSkatingImage.jpg'),
    'rollerSkatingImage.jpg': require('../assets/images/bucketListImages/rollerSkatingImage.jpg'),
    'actingImage.jpg': require('../assets/images/bucketListImages/actingImage.jpg')
  };

  // Keep track of the fetched bucketlist items in state.
  const [bucketlist, setBucketlist] = useState([]);
  const [fontLoaded, setFontLoaded] = useState(false);

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

  // Load the font
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Baloo-Regular': require('../assets/fonts/Baloo-Regular.ttf'),
        'Solway-Regular': require('../assets/fonts/Solway-Regular.ttf'),
      });
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

  // Show "Loading fonts..." while fonts are loading
  if (!fontLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}> Add to Your Bucket List </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
        {bucketlist.length > 0 ? (
          bucketlist.map(item => (
            <View
              key={item.id}
              style={styles.bucketlistContainer}
            >
              <View style={styles.defaultSquare} />

              {item.Image && (
                <Image
                  source={imageMap[item.Image] || imageMap['default.jpg']}
                  style={styles.bucketlistImage}
                />
              )}
              <Text style={styles.bucketListNames}>{item.Name}</Text>
            </View>
          ))
        ) : (
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text>No bucket list items available.</Text>
            <TouchableOpacity onPress={() => navigation.navigate('home')}>
              <Text style={{ color: 'blue', marginTop: 10 }}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
