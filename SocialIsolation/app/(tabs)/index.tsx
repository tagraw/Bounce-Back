import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc} from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { app } from '../../config/firebase';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [userName, setUserName] = useState('');
  const [bucketlist, setBucketlist] = useState([]);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const auth = getAuth(app);
  const db = getFirestore(app);

  const totalSubtasks = bucketlist.reduce((sum, item) => sum + (item.Subtasks?.length || 0), 0);
  const totalCompleted = bucketlist.reduce((sum, item) => sum + (item.CompletedSubtasks?.length || 0), 0);

  const fetchUserInfo = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid); // 👈 reference to user doc
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserName(userData.firstName || 'User'); // 👈 use first name if it exists
      } else {
        console.log('No such user document!');
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const user = auth.currentUser;
      if (user) {
        fetchUserInfo(user.uid); // 👈 fetch Firestore user data
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

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
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
        console.log('Image URI for item:', item.Image);

        const total = item.Subtasks?.length || 0;
        const completed = item.CompletedSubtasks?.length || 0;
        const isComplete = total > 0 && completed === total;
        const isExpanded = expandedIds.has(item.id);

        return (
          <View key={item.id} style={[styles.card, isComplete && styles.cardComplete]}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item.Image }}
                style={styles.cardImage}
              />
              <View style={styles.cardOverlay} />

              {/* Expand arrow */}
              <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.arrow}>
                <Ionicons
                  name="chevron-down"
                  size={22}
                  color="white"
                  style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
                />
              </TouchableOpacity>

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.Name}</Text>
                <Text style={styles.cardSubtext}>{item.Date} • {item.Time}</Text>
                <Text style={styles.cardSubtext}>{item.Location}</Text>
              </View>
            </View>

            {isExpanded && (
              <View style={styles.expandedContent}>
                <Text style={styles.expandedTitle}>About</Text>
                <Text style={styles.expandedText}>{item.Description || 'No description provided.'}</Text>

                <Text style={styles.expandedTitle}>Who's Attending</Text>
                <View style={styles.attendeesRow}>
                  {(item.Attendees || []).map((name, i) => (
                    <View key={i} style={styles.attendeeBubble}>
                      <Text>{name}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.expandedTitle}>RSVP</Text>
                <View style={styles.rsvpRow}>
                  <TouchableOpacity style={styles.yesBtn}><Text>Yes</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.noBtn}><Text>No</Text></TouchableOpacity>
                </View>
              </View>
            )}
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
    marginTop: 50,
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
  },
  cardComplete: {
    backgroundColor: '#fbd5d5',
    borderColor: '#fbd5d5',
    borderWidth: 2,
  },
  imageWrapper: {
    position: 'relative',
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
    fontSize: 13,
    color: '#eee',
    marginTop: 2,
  },
  arrow: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 6,
  },
  expandedContent: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  expandedTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 6,
  },
  expandedText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 10,
  },
  attendeesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  attendeeBubble: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rsvpRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  yesBtn: {
    backgroundColor: '#c5f1cf',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  noBtn: {
    backgroundColor: '#f9bebe',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
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
