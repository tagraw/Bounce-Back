import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, FlatList,
  TouchableOpacity, Dimensions, Alert
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { app } from '../../../config/firebase';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';


export const unstable_settings = {
  initialRouteName: 'index',
};

export const navigationOptions = {
  tabBarStyle: { display: 'none' },
  tabBarButton: () => null,
};

export default function BucketListDetail() {
  const { id } = useLocalSearchParams();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [item, setItem] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchItem = async () => {
      const docRef = doc(db, 'bucketlist', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setItem({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.warn('No such document!');
      }
    };

    if (id) fetchItem();
  }, [id]);

  const handleAddToMyList = async () => {
    const user = auth.currentUser;
    if (!user || !item) return;

    try {
      const userBucketListRef = collection(db, 'users', user.uid, 'bucketlist');
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
    }
  };

  if (!item) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <View style={styles.container}>
      {/* Image header (replace with item.Image later) */}
      <Image
        source={require('../../../assets/images/bucketListImages/campingImage.jpg')}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Title */}
      <Text style={styles.title}>{item.Name}</Text>

      {/* Subtasks */}
      <Text style={styles.subheading}>Subtasks</Text>
      {item.Subtasks?.length > 0 ? (
        <FlatList
          data={item.Subtasks}
          keyExtractor={(task, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.subtask}>• {item}</Text>}
        />
      ) : (
        <Text style={styles.subtask}>No subtasks listed.</Text>
      )}

      {/* Add button */}
      <TouchableOpacity onPress={handleAddToMyList} style={styles.button}>
        <Text style={styles.buttonText}>Add to My Bucket List</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  loading: {
    padding: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 10,
    color: '#222',
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Poppins_700Bold',
    color: '#444',
  },
  subtask: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontFamily: 'Poppins_400Regular',
  },
  button: {
    backgroundColor: '#FBD5D5',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 24,
    alignItems: 'center',
    alignSelf: 'center',
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
