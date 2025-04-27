import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { app } from '../../config/firebase';
import { router } from 'expo-router';

type BucketListItem = {
  id: string;
  Name?: string;
  Date?: string;
  Time?: string;
  Location?: string;
  Description?: string;
  Image?: string;
  Subtasks?: string[];
  CompletedSubtasks?: string[];
  Attendees?: string[];
};

export default function HomeScreen() {
  const [userName, setUserName] = useState('');
  const [bucketlist, setBucketlist] = useState<BucketListItem[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [rsvpedIds, setRsvpedIds] = useState<Set<string>>(new Set());

  const auth = getAuth(app);
  const db = getFirestore(app);

  const fetchUserInfo = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserName(userData.firstName || 'User');
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const user = auth.currentUser;
      if (user) {
        fetchUserInfo(user.uid);
        fetchUserBucketList(user.uid);
      }
    }, [])
  );

  const fetchUserBucketList = async (uid: string) => {
    try {
      const ref = collection(db, 'users', uid, 'bucketlist');
      const snapshot = await getDocs(ref);
      const items: BucketListItem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBucketlist(items);
    } catch (err) {
      console.error('Error fetching bucket list:', err);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const handleRSVP = (id: string) => {
    setRsvpedIds(prev => new Set(prev).add(id));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const sortedBucketlist = [...bucketlist].sort((a, b) => {
    const aCompleted = a.CompletedSubtasks?.length === a.Subtasks?.length;
    const bCompleted = b.CompletedSubtasks?.length === b.Subtasks?.length;
    return aCompleted === bCompleted ? 0 : aCompleted ? 1 : -1;
  });

  return (
    <ScrollView style={styles.container}>
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

      {sortedBucketlist.map((item) => {
        const total = item.Subtasks?.length || 0;
        const done = item.CompletedSubtasks?.length || 0;
        const isComplete = total > 0 && done === total;
        const isExpanded = expandedIds.has(item.id);

        return (
          <View key={item.id} style={[styles.card, isComplete && styles.cardComplete]}>
            <View style={styles.imageWrapper}>
              {item.Image && (
                <Image source={{ uri: item.Image }} style={styles.cardImage} />
              )}
              <View style={styles.cardOverlay} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.Name}</Text>
                <Text style={styles.cardSubtext}>{item.Date} {item.Time}</Text>
                <Text style={styles.cardSubtext}>{item.Location}</Text>
              </View>

              {/* Completed or Subtask Badge */}
              {isComplete ? (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>Completed</Text>
                </View>
              ) : (
                <View style={styles.subtaskBadge}>
                  <Text style={styles.subtaskBadgeText}>
                    {   done === 0
                      ? 'Working on: Subtask #1'
                      : done === 1
                      ? 'Working on: Subtask #2'
                      : done === 2
                      ? 'Working on: Subtask #3'
                      : done === 3
                      ? 'Working on: Subtask #4'
                      : done === 4
                      ? 'Working on: Subtask #5'
                      : done === 5
                      ? 'Working on: Subtask #6'
                      : done === 6
                      ? 'Working on: Subtask #7'
                      : `Subtask ${done + 1}`}
                  </Text>
                </View>
              )}

              <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.arrow}>
                <Ionicons
                  name="chevron-down"
                  size={22}
                  color="white"
                  style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
                />
              </TouchableOpacity>
            </View>

            {isExpanded && (
              <View style={styles.expandedContent}>
                <Text style={styles.expandedTitle}>About</Text>
                <Text style={styles.expandedText}>{item.Description || 'No description provided.'}</Text>

                <Text style={styles.expandedTitle}>Next Activity:</Text>
                {item.Subtasks && item.Subtasks.length > 0 && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={styles.expandedText}>
                      {item.Subtasks.find(sub => !item.CompletedSubtasks?.includes(sub)) || 'All activities complete!'}
                    </Text>
                  </View>
                )}

                <Text style={styles.expandedTitle}>Who's Attending</Text>
                <View style={styles.attendeesRow}>
                  {(item.Attendees && item.Attendees.length > 0) ? (
                    item.Attendees.map((name, i) => (
                      <View key={i} style={styles.attendeeBubble}>
                        <Text>{name}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.placeholderText}>No one has RSVPed yet.</Text>
                  )}
                </View>

                <Text style={styles.expandedTitle}>RSVP to this Event</Text>
                {!rsvpedIds.has(item.id) ? (
                  <View style={styles.rsvpRow}>
                    <TouchableOpacity style={styles.yesBtn} onPress={() => handleRSVP(item.id)}>
                      <Text style={styles.rsvpText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.noBtn} onPress={() => handleRSVP(item.id)}>
                      <Text style={styles.rsvpText}>No</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.rsvpConfirmation}>🎉 You've RSVPed for this event!</Text>
                )}
              </View>
            )}
          </View>
        );
      })}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>🎯 You’re tracking {bucketlist.length} items</Text>
        <Text style={styles.summaryText}>
          ✅ {bucketlist.reduce((sum, item) => sum + (item.CompletedSubtasks?.length || 0), 0)}
          {' '}out of{' '}
          {bucketlist.reduce((sum, item) => sum + (item.Subtasks?.length || 0), 0)}
          {' '}subtasks completed
        </Text>
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
    opacity: 0.7,
    backgroundColor: '#fbd5d5',
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
    top: 20,
    left: 20,
    alignItems: 'flex-start',
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
  subtaskBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f9c5d5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subtaskBadgeText: {
    fontSize: 12,
    color: '#b84a6a',
    fontWeight: 'bold',
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
  placeholderText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  rsvpRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  yesBtn: {
    backgroundColor: '#D2E8DC',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#467C5A',
  },
  noBtn: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  rsvpText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rsvpConfirmation: {
    marginTop: 12,
    color: '#6cc070',
    fontWeight: 'bold',
    fontSize: 14,
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
