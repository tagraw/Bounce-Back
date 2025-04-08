import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { app } from '../../config/firebase';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [userName, setUserName] = useState('');
  const [bucketlist, setBucketlist] = useState([]);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const totalSubtasks = bucketlist.reduce((sum, item) => sum + (item.Subtasks?.length || 0), 0);
  const totalCompleted = bucketlist.reduce((sum, item) => sum + (item.CompletedSubtasks?.length || 0), 0);

  useFocusEffect(
    useCallback(() => {
      const user = auth.currentUser;
      if (user) {
        setUserName(user.email?.split('@')[0] || 'User');
        fetchUserBucketList(user.uid);
      }
    }, [])
  );

  const fetchUserBucketList = async (uid) => {
    try {
      const ref = collection(db, 'users', uid, 'bucketlist');
      const snapshot = await getDocs(ref);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBucketlist(items);
    } catch (err) {
      console.error('Error fetching user bucket list:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome Back,</Text>
          <Text style={styles.userName}>{userName}!</Text>
        </View>
        <View style={styles.avatarRow}>
          <Ionicons name="person-circle-outline" size={42} color="#444" />
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={26} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Upcoming Events</Text>

      {bucketlist.map((item) => {
        const total = item.Subtasks?.length || 0;
        const completed = item.CompletedSubtasks?.length || 0;
        const isComplete = total > 0 && completed === total;

        return (
          <View
            key={item.id}
            style={isComplete ? styles.cardComplete : styles.card}
          >
            <Image
              source={require('../../assets/images/bucketListImages/campingImage.jpg')}
              style={styles.cardImage}
            />
            <View style={styles.cardOverlay} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.Name}</Text>
              <Text style={styles.cardSubtext}>Subtasks: {completed} / {total}</Text>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Bucket</Text>
              </View>
            </View>
          </View>
        );
      })}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>🎯 You’re tracking {bucketlist.length} items</Text>
        <Text style={styles.summaryText}>✅ {totalCompleted} / {totalSubtasks} subtasks completed</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    color: '#444',
    fontWeight: '500',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#eee',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardComplete: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#fbd5d5',
    position: 'relative',
    elevation: 4,
    borderWidth: 2,
    borderColor: '#fbd5d5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardSubtext: {
    fontSize: 14,
    color: '#eee',
    marginTop: 4,
  },
  tag: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  summaryCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
});
