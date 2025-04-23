import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, Dimensions,
  ScrollView, TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../config/firebase';
import { Ionicons } from '@expo/vector-icons';

// ✅ Define type for bucket list item
interface BucketListItem {
  Name?: string;
  Image?: string;
  Subtasks?: string[];
  CompletedSubtasks?: string[];
}

export default function MyBucketItemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const user = auth.currentUser;
  const router = useRouter();

  const [item, setItem] = useState<BucketListItem | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const fetchItem = async () => {
      if (!user || !id) return;
      const ref = doc(db, 'users', user.uid, 'bucketlist', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as BucketListItem;
        setItem(data);
        setCompleted(data.CompletedSubtasks || []);
      }
    };
    fetchItem();
  }, [id]);

  const toggleSubtask = async (taskName: string) => {
    const updated = completed.includes(taskName)
      ? completed.filter(t => t !== taskName)
      : [...completed, taskName];

    setCompleted(updated);
    const ref = doc(db, 'users', user!.uid, 'bucketlist', id);
    try {
      await updateDoc(ref, { CompletedSubtasks: updated });
    } catch (err) {
      console.error('Error updating Firestore:', err);
    }
  };

  if (!item) return <Text style={{ padding: 20 }}>Loading...</Text>;

  const total = item.Subtasks?.length || 0;
  const done = completed.length;
  const progress = total === 0 ? 0 : done / total;

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <ImageBackground
        source={{ uri: item.Image }}
        style={styles.headerImage}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.overlay}>
          <Text style={styles.title}>{item.Name}</Text>
          <Text style={styles.subtitle}>{done} out of {total} complete</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      </ImageBackground>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Activities</Text>
        <View style={styles.tasksWrapper}>
          {item.Subtasks?.map((taskName, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => toggleSubtask(taskName)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.taskText,
                completed.includes(taskName) && styles.completedText
              ]}>
                {taskName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 70) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerImage: {
    height: 250,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 6,
    borderRadius: 20,
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 15,
  },
  progressBar: {
    height: 20,
    width: '100%',
    backgroundColor: '#ccc',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6cc070',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tasksWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#E6A1A1',
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  taskText: {
    fontSize: 14,
    color: '#fff',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
});
