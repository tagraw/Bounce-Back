import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  getFirestore, doc, getDoc, collection, addDoc, query, where, getDocs,
} from 'firebase/firestore';
import { app } from '../../config/firebase';
import { getAuth } from 'firebase/auth';

type BucketListItem = {
  id: string;
  Name: string;
  Image?: string;
  Subtasks?: string[];
};

export default function BucketListDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const router = useRouter();

  const [item, setItem] = useState<BucketListItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      const docRef = doc(db, 'bucketlist', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setItem({ ...(docSnap.data() as BucketListItem), id: docSnap.id });
      } else {
        console.warn('No such document!');
      }
    };

    fetchItem();
  }, [id]);

  const handleAddToMyList = async () => {
    const user = auth.currentUser;
    if (!user || !item || isAdding) return;
    setIsAdding(true);

    try {
      const userBucketListRef = collection(db, 'users', user.uid, 'bucketlist');
      const q = query(userBucketListRef, where('Name', '==', item.Name));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert('✅ Added!', 'Item already in your bucket list.');
        router.push('/addbucketitems');
        return;
      }

      await addDoc(userBucketListRef, {
        Name: item.Name,
        Image: item.Image || null,
        Subtasks: item.Subtasks || [],
        createdAt: new Date(),
      });

      Alert.alert('✅ Added!', 'Item added to your bucket list.');
      router.push('/addbucketitems');
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('❌ Error', 'Could not add to your list.');
    } finally {
      setIsAdding(false);
    }
  };

  if (!item) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.Image }} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.title}>{item.Name}</Text>

        <Text style={styles.subheading}>Subtasks</Text>
        {item.Subtasks && item.Subtasks.length > 0 ? (
          <FlatList
            data={item.Subtasks}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item: task }) => (
              <Text style={styles.subtask}>• {task}</Text>
            )}
          />
        ) : (
          <Text style={styles.subtask}>No subtasks listed.</Text>
        )}
      </View>
      <TouchableOpacity
          onPress={handleAddToMyList}
          style={styles.button}
          disabled={isAdding}
        >
          <Text style={styles.buttonText}>
            {isAdding ? 'Adding...' : 'Add to My Bucket List'}
          </Text>
        </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  loading: {
    padding: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 220,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    marginTop: 10,
    marginBottom: 20,
    color: '#222',
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold',
    color: '#444',
  },
  subtask: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular',
  },
  button: {
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: 60,  // <- this controls the distance from bottom
    backgroundColor: '#fbd5d5',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
  },
});
