import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Dimensions
} from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../config/firebase';
import { useRouter } from 'expo-router';

export const BucketList = () => {
  const db = getFirestore(app);
  const bucketlistCollectionRef = collection(db, 'bucketlist');
  const router = useRouter();
  const [bucketlist, setBucketlist] = useState([]);

  const fetchBucketList = async () => {
    try {
      const querySnapshot = await getDocs(bucketlistCollectionRef);
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBucketlist(items);
    } catch (error) {
      console.error('Error fetching bucketlist items:', error);
    }
  };

  useEffect(() => {
    fetchBucketList();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add to Your Bucket List</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Text style={styles.tabActive}>All</Text>
        <Text style={styles.tab}>Fitness</Text>
        <Text style={styles.tab}>Mental Health</Text>
        <Text style={styles.tab}>Social</Text>
        <Text style={styles.tab}>Hobbies</Text>
        <Text style={styles.tab}>Outdoor</Text>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {bucketlist.map((item) => (
          <View key={item.id} style={styles.card}>
            {item.Image && (
              <Image
                source={require('../assets/images/bucketListImages/campingImage.jpg')} // Replace with dynamic image logic later
                style={styles.image}
              />
            )}
            <Text style={styles.label}>{item.Name}</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => router.push(`/(tabs)/bucketlist/${item.id}`)}
            >
              <Text style={styles.selectText}>Select</Text>
            </TouchableOpacity>
          </View>
        ))}
</View>


      {/* Next Button */}
    
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 64) / 3;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Poppins_700Bold',
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    color: '#999',
    fontSize: 13,
    marginRight: 12,
    fontFamily: 'Poppins_400Regular',
  },
  tabActive: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 12,
    borderBottomWidth: 2,
    borderColor: '#000',
    fontFamily: 'Poppins_700Bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 18,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: CARD_WIDTH,
    borderRadius: 10,
  },
  label: {
    fontSize: 12,
    color: '#000',
    marginTop: 4,
    paddingBottom: 6,
    fontFamily: 'Poppins_400Regular',
  },
  nextButton: {
    backgroundColor: '#FBD5D5', // Soft pink
    borderRadius: 40,           // More rounded (pill style)
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  
  nextText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Poppins_700Bold',
  },

  selectButton: {
    backgroundColor: '#FBD5D5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
    marginTop: 4,
  },
  
  selectText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: 'Poppins_700Bold',
  }

  
});
