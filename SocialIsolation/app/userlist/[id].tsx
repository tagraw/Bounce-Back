import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Switch, ImageBackground, Dimensions,
  ScrollView, TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../config/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function MyBucketItemDetail() {
  const { id } = useLocalSearchParams();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const user = auth.currentUser;
  const router = useRouter();

  const [item, setItem] = useState(null);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    const fetchItem = async () => {
      if (!user || !id) return;
      const ref = doc(db, 'users', user.uid, 'bucketlist', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setItem(data);
        setCompleted(data.CompletedSubtasks || []);
      }
    };
    fetchItem();
  }, [id]);

  const toggleSubtask = async (taskName) => {
    const updated = completed.includes(taskName)
      ? completed.filter(t => t !== taskName)
      : [...completed, taskName];

    setCompleted(updated);
    const ref = doc(db, 'users', user.uid, 'bucketlist', id);
    try {
      await updateDoc(ref, { CompletedSubtasks: updated });
    } catch (err) {
      console.error('Error updating Firestore:', err);
    }
  };

  if (!item) return <Text style={{ padding: 20 }}>Loading...</Text>;

  const total = item.Subtasks?.length || 0;
  const done = completed.length;
  const progress = done / total;

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
            <View key={index} style={styles.card}>
              <Text style={[
                styles.taskText,
                completed.includes(taskName) && styles.completedText
              ]}>
                {taskName}
              </Text>
              <Switch
                value={completed.includes(taskName)}
                onValueChange={() => toggleSubtask(taskName)}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerImage: {
    height: 250,
    width: '100%',
    justifyContent: 'flex-end',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
    borderRadius: 20,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#fff',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    width: '100%',
    backgroundColor: '#ccc',
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#6cc070',
    borderRadius: 3,
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
    backgroundColor: '#FBD5D5',
    width: CARD_WIDTH,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  //test
});
