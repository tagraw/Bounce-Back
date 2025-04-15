import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { app } from '../../config/firebase';

export default function Index() {
  const [bucketlist, setBucketlist] = useState([]);
  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const bucketlistRef = collection(db, 'users', user.uid, 'bucketlist');

    const unsubscribe = onSnapshot(bucketlistRef, (snapshot) => {
      const addedItems = snapshot
        .docChanges()
        .filter(change => change.type === 'added')
        .map(change => ({
          id: change.doc.id,
          ...change.doc.data()
        }));

      if (addedItems.length > 0) {
        setBucketlist(prev => [...prev, ...addedItems]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Bucket List</Text>

      <View style={styles.cardContainer}>
        {bucketlist.length > 0 ? (
          bucketlist.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => router.push(`/(tabs)/userlist/${item.id}`)}
            >
              {item.Image && (
                <Image
                  source={require('../../assets/images/bucketListImages/campingImage.jpg')}
                  style={styles.image}
                />
              )}
              <Text style={styles.cardTitle}>{item.Name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No items yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 64) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 16,
    color: '#222',
  },
  card: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH,
    borderRadius: 10,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    color: '#333',
  },
  emptyText: {
    color: '#999',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
});
