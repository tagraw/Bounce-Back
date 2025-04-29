import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
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
  Subtasks?: string[];
  CompletedSubtasks?: string[];
};

export default function Index() {
  const [bucketlist, setBucketlist] = useState<BucketItem[]>([]);
  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const bucketlistRef = collection(db, 'users', user.uid, 'bucketlist');

    const unsubscribe = onSnapshot(bucketlistRef, (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as BucketItem[];

      setBucketlist(fetchedItems); // Overwrite instead of appending
    });

    return () => unsubscribe();
  }, []);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Fredoka': require('../../assets/fonts/Fredoka-VariableFont_wdth,wght.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  const sortedBucketlist = [...bucketlist].sort((a, b) => {
    const aCompleted = a.CompletedSubtasks?.length === a.Subtasks?.length;
    const bCompleted = b.CompletedSubtasks?.length === b.Subtasks?.length;
    return aCompleted === bCompleted ? 0 : aCompleted ? 1 : -1;
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>My Bucket List Groups</Text>
        </View>

        <View style={styles.cardContainer}>
          {sortedBucketlist.length > 0 ? (
            sortedBucketlist.map((item) => {
              const total = item.Subtasks?.length || 0;
              const done = item.CompletedSubtasks?.length || 0;
              const isCompleted = total > 0 && done === total;
              const progress = total === 0 ? 0 : (done / total) * 100;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.card, isCompleted && styles.completedCard]}
                  onPress={() => router.push(`/userlist/${item.id}`)}
                >
                  <View style={styles.imageWrapper}>
                    {item.Image && (
                      <Image source={{ uri: item.Image }} style={styles.image} />
                    )}
                    <View style={styles.overlay} />
                    <Text style={styles.cardTitle}>{item.Name}</Text>

                    <Text style={styles.progressText}>
                      {done}/{total} Subtasks Completed
                    </Text>

                    <View style={styles.progressBackground}>
                      <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedBadgeText}>Completed</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
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
    marginTop: 60,
    marginBottom: 20,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#222',
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    width: '100%',
    aspectRatio: 2.25,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  completedCard: {
    opacity: 0.7, // Dim completed cards
  },
  imageWrapper: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 14,
  },
  cardTitle: {
    position: 'absolute',
    top: 15,
    left: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    zIndex: 2,
  },
  progressBackground: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: '#eee',
    height: 18,
    borderRadius: 10,
  },
  progressFill: {
    backgroundColor: '#f4a4a4',
    height: 18,
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    bottom: 45,
    left: 20,
    color: '#fff',
    fontSize: 12,
  },
  completedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#6cc070',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  plusButton: {
    fontSize: 40,
    color: '#fff',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#7b7b7b',
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
});
