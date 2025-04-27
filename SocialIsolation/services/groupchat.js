import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { app } from '../config/firebase';

export const MessagesScreen = () => {
  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [lastMessage, setLastMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);


  useEffect(() => {
    const fetchGroupAndMembers = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Get user's group name
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (userData) {
        // Fetch bucketlist
        const bucketlistSnapshot = await getDocs(collection(db, 'users', user.uid, 'bucketlist'));
        const bucketlistItems = bucketlistSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
      }));

      const incompleteTasks = bucketlistItems.filter(item => item.completed !== true);
      const completeTasks = bucketlistItems.filter(item => item.completed === true);

      if (incompleteTasks.length > 0) {
        setGroupName(incompleteTasks[0].Name || 'Group Chat');
      } else if (completeTasks.length > 0) {
        const randomIndex = Math.floor(Math.random() * completeTasks.length);
        setGroupName(completeTasks[randomIndex].Name || 'Group Chat');
      } else {
        setGroupName('Group Chat');
      }
      } else {
        setGroupName('Group Chat');
      }

      // Get all users in the same group
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const groupMembers = usersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.group === userData?.group && u.id !== user.uid) // Exclude current user

      setMembers(groupMembers);

      // get most recent text message 
      const groupQuery = query(collection(db, 'groups', userData?.group, 'messages'), orderBy('timestamp', 'desc'));
      const groupMessagesSnapshot = await getDocs(groupQuery);

      if (!groupMessagesSnapshot.empty) {
        const latestMsg = groupMessagesSnapshot.docs[0].data();
        if (latestMsg.text) {
          setLastMessage(latestMsg.text);
        }
      }
    };

    fetchGroupAndMembers();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Messages</Text>

      {/* Pinned Section */}
      <Text style={styles.pinnedTitle}>📌 Pinned</Text>
      <View style={styles.pinnedBox}>
        <TouchableOpacity 
          style={styles.messageItem}
          onPress={() => router.push('/singlechat')}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=300&q=80' }}
            style={styles.avatar}
          />
          <View style={styles.messageInfo}>
            <Text style={styles.name}>{groupName + ' Group' || 'Group Chat'}</Text>
            <Text style={styles.preview}>{lastMessage || 'Welcome to the group chat!'}</Text>
          </View>
          <Text style={styles.time}>Today</Text>
        </TouchableOpacity>
      </View>

      {/* All Messages Section */}
      <Text style={styles.allMessagesTitle}>All messages</Text>
      {members.map((member) => (
        <TouchableOpacity 
          key={member.id}
          style={styles.messageItem}
          onPress={() => router.push('/singlechat')}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>
              {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
            </Text>
          </View>
          <View style={styles.messageInfo}>
            <Text style={styles.name}>{member.firstName} {member.lastName}</Text>
            <Text style={styles.preview}>Start a conversation...</Text>
          </View>
          <Text style={styles.time}>Today</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 60,
    marginBottom: 20,
  },
  pinnedBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  pinnedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d38c8c',
    marginBottom: 15,
  },
  allMessagesTitle: {
    paddingTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginTop: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fbd5d5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  messageInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  preview: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
});
