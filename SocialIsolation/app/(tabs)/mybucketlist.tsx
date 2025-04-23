import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { app } from '../../config/firebase';
import * as Font from 'expo-font';


type BucketItem = {
  id: string;
  Name: string;
  Image?: string;
};

export default function Index() {
  const [bucketlist, setBucketlist] = useState<BucketItem[]>([]);
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
          ...change.doc.data(),
        })) as BucketItem[]; // ✅ Cast to correct type

      if (addedItems.length > 0) {
        setBucketlist(prev => [...prev, ...addedItems]);
      }
    });

    return () => unsubscribe();
  }, []);

  const [fontsLoaded, setFontsLoaded] = useState(false);

    const loadFonts = async () => {
      await Font.loadAsync({
        'Fredoka': require('../../assets/fonts/Fredoka-VariableFont_wdth,wght.ttf'),
      });
      setFontsLoaded(true);
    };

    useEffect(() => {
      loadFonts();
    }, []);

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>My Bucket List Groups</Text>
      </View>

      <View style={styles.cardContainer}>
        {bucketlist.length > 0 ? (
          bucketlist.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => router.push(`/userlist/${item.id}`)}
            >
              {item.Image && (
                <Image
                  source={{ uri: item.Image }}
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

     {/* Floating Plus Button */}
     <TouchableOpacity
     style={styles.floatingButton}
     onPress={() => router.push('/addbucketitems')}
   >
     <Text style={styles.plusButton}>＋</Text>
   </TouchableOpacity>
 </View>
  );
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 64) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 15,
  },
  header: {
    fontFamily: 'Fredoka',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#222',
  },
  plusButton: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#7b7b7b',
   borderRadius: 30,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardContainer: {
    marginBottom: 20,
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
