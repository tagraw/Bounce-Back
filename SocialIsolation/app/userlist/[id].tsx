import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions, Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '../../config/firebase';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface BucketListItem {
  Name?: string;
  Image?: string;
  group: string;
  Subtasks?: string[];
  CompletedSubtasks?: string[];
  Attendees?: string[];
}

export default function MyBucketItemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const user = auth.currentUser;
  const router = useRouter();

  const [item, setItem] = useState<BucketListItem | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const areAllSubtasksCompleted = () => {
    if (item?.Subtasks)
      return item.Subtasks.length > 0 && completed.length === item.Subtasks.length;
    return false;
  };

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

  useEffect(() => {
    if (areAllSubtasksCompleted()) {
      router.push('/(tabs)/mybucketlist');
    }
  }, [completed, item]);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return;
      const group = userSnap.data().group;

      const groupQuery = collection(db, 'users');
      const querySnapshot = await getDocs(groupQuery);

      const groupUsers = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...(doc.data() as BucketListItem) }))
        .filter(u => u.group === group);

      setMembers(groupUsers);
      setLoadingMembers(false);
    };

    fetchGroupMembers();
  }, []);

  const toggleSubtask = async (taskName: string) => {
    if (!user) return;
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

  const total = item?.Subtasks?.length || 0;
  const done = completed.length;
  const progress = total === 0 ? 0 : done / total;

  return (
    <ScrollView style={styles.container}>
      {/* Header Image */}
      <ImageBackground
        source={{ uri: item?.Image }}
        style={styles.headerImage}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/mybucketlist')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.overlay}>
          <Text style={styles.title}>{item?.Name}</Text>
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
          {item?.Subtasks?.map((taskName, index) => (
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

        {/* Line Separator */}
        <View style={styles.separator} />

        {/* Group Members Section */}
        <View style={styles.groupHeader}>
          <Text style={styles.groupTitle}>Group Members</Text>
          <Pressable
            style={({ pressed }) => [
              styles.messageButton,
              pressed && { backgroundColor: '#a8d5af' }
            ]}
          >
            <Ionicons name="chatbubble-ellipses" size={26} color="#356245" />
          </Pressable>
        </View>

        {/* Light Grey Background Box */}
        <View style={styles.groupMembersBox}>
          <View style={styles.membersRow}>
            {loadingMembers ? (
              <Text>Loading members...</Text>
            ) : (
              members.map((member, index) => (
                <View key={index} style={styles.memberCard}>
                  <View style={styles.avatarCircle}>
                    <Ionicons name="person" size={24} color="#444" />
                  </View>
                  <Text style={styles.memberName}>{member.firstName} {member.lastName}</Text>
                </View>
              ))
            )}
          </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tasksWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#e8a4a4',
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
  },
  taskText: {
    fontSize: 14,
    color: '#fff',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  separator: {
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    marginVertical: 20,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  messageButton: {
    backgroundColor: '#d5e8d4',
    padding: 10,
    borderRadius: 20,
  },
  groupMembersBox: {
    backgroundColor: '#f2f2f2', // light grey
    borderRadius: 12,
    padding: 16,
  },
  membersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 10,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    marginBottom: 15,
    gap: 10,
  },
  avatarCircle: {
    backgroundColor: '#fbd5d5', // light pink
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
