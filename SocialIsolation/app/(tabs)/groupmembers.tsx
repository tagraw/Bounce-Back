import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../config/firebase';

export default function GroupMembersScreen() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState('');

  const auth = getAuth(app);
  const db = getFirestore(app);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return;

      const group = userSnap.data().group;
      setGroupName(group);

      const groupQuery = query(collection(db, 'users'), where('group', '==', group));
      const querySnapshot = await getDocs(groupQuery);

      const groupUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setMembers(groupUsers);
      setLoading(false);
    };

    fetchGroupMembers();
  }, []);

  if (loading) return <Text style={styles.loading}>Loading group members...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Members in “{groupName}”</Text>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fbd5d5',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  loading: {
    padding: 20,
    fontSize: 16,
  },
});
