import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Dimensions
} from 'react-native';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../config/firebase';
import { useRouter } from 'expo-router';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

export const BucketList = () => {
  const db = getFirestore(app);
  const masterListRef = collection(db, 'bucketlist');
  const router = useRouter();
  const [bucketlist, setBucketlist] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [fontLoaded, setFontLoaded] = useState(false);

  const user = getAuth(app).currentUser;

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

  const fetchBucketList = async () => {
    try {
      const snapshot = await getDocs(masterListRef);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBucketlist(items);
    } catch (error) {
      console.error('Error fetching bucketlist items:', error);
    }
  };

  const fetchUserSelections = async () => {
    if (!user) return;
    const userBucketRef = collection(db, 'users', user.uid, 'bucketlist');
    const snapshot = await getDocs(userBucketRef);
    const selected = new Set(snapshot.docs.map(doc => doc.id));
    setSelectedItems(selected);
  };

  useEffect(() => {
    fetchBucketList();
    fetchUserSelections();
  }, []);

  const handleSelect = async (item) => {
    if (!user || selectedItems.has(item.id)) return;

    const userItemRef = doc(db, 'users', user.uid, 'bucketlist', item.id);
    await setDoc(userItemRef, item); // Save full item in user bucket

    setSelectedItems((prev) => new Set(prev).add(item.id));
    router.push(`/bucketlist/${item.id}`);
  };

  if (!fontLoaded) return <Text>Loading fonts...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add to Your Bucket List</Text>

      <View style={styles.tabs}>
        <Text style={styles.tabActive}>All</Text>
        <Text style={styles.tab}>Fitness</Text>
        <Text style={styles.tab}>Mental Health</Text>
        <Text style={styles.tab}>Social</Text>
        <Text style={styles.tab}>Hobbies</Text>
      </View>

      <View style={styles.grid}>
        {bucketlist.map((item) => {
          const isSelected = selectedItems.has(item.id);
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.imageWrapper}>
                {item.Image && (
                  <Image
                    source={require('../assets/images/bucketListImages/campingImage.jpg')}
                    style={styles.image}
                  />
                )}
                {isSelected && (
                  <View style={styles.overlay}>
                    <Ionicons name="checkmark-circle" size={24} color="white" style={styles.checkmark} />
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.selectText}>{item.Name}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
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
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 50,
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
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: CARD_WIDTH,
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(251, 213, 213, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 6,
  },
  checkmark: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  selectButton: {
    backgroundColor: '#FBD5D5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
    marginTop: 4,
    width: '100%',
    alignSelf: 'stretch',
  },
  selectText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 8,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
  },
});
