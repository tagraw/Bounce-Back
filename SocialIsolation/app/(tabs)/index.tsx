import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { app } from '../../config/firebase';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [userName, setUserName] = useState('');
  const [bucketlist, setBucketlist] = useState([]);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const auth = getAuth(app);
  const db = getFirestore(app);

  const fetchUserName = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const firstName = userDocSnap.data()?.firstName || 'User';
        setUserName(firstName);
      } else {
        console.warn('No such user document');
        setUserName('User');
      }
    } catch (error) {
      console.error('Failed to fetch user name:', error);
      setUserName('User');
    }
  };

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

  useFocusEffect(
    useCallback(() => {
      const user = auth.currentUser;
      if (user) {
        fetchUserName(user.uid);
        fetchUserBucketList(user.uid);
      }
    }, [])
  );

  const toggleExpand = (id) => {
    setExpandedIds(prev => {
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
        const isExpanded = expandedIds.has(item.id);

        return (
          <View key={item.id} style={styles.card}>
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Image source={require('../../assets/images/bucketListImages/campingImage.jpg')} style={styles.image} />
            </TouchableOpacity>
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.Name}</Text>
              <Text style={styles.meta}>{item.Date} • {item.Time}</Text>
              <Text style={styles.location}>{item.Location}</Text>
            </View>

            {isExpanded && (
              <View style={styles.expandedContent}>
                <Text style={styles.section}>About</Text>
                <Text style={styles.description}>{item.Description || 'No description provided.'}</Text>

                <Text style={styles.section}>Who's Attending</Text>
                <View style={styles.attendees}>
                  {(item.Attendees || []).map((name, idx) => (
                    <View key={idx} style={styles.attendeeBubble}>
                      <Text style={styles.attendeeText}>{name}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.section}>RSVP</Text>
                <View style={styles.rsvpButtons}>
                  <TouchableOpacity style={styles.yesBtn}><Text style={styles.rsvpText}>Yes</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.noBtn}><Text style={styles.rsvpText}>No</Text></TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        );
      })}
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
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 15,
    color: '#444',
  },
  section: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
  },
  attendees: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  attendeeBubble: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 30,
  },
  attendeeText: {
    fontSize: 13,
    color: '#333',
  },
  rsvpButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  yesBtn: {
    backgroundColor: '#c5f1cf',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  noBtn: {
    backgroundColor: '#f9bebe',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  rsvpText: {
    fontWeight: 'bold',
    color: '#222',
  },
});


// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity, Image
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { getAuth, signOut } from 'firebase/auth';
// import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
// import { useFocusEffect } from '@react-navigation/native';
// import { app } from '../../config/firebase';
// import { router } from 'expo-router';

// export default function HomeScreen() {
//   const [userName, setUserName] = useState('');
//   const [bucketlist, setBucketlist] = useState([]);
//   const [expandedIds, setExpandedIds] = useState(new Set());

//   const auth = getAuth(app);
//   const db = getFirestore(app);

//   const fetchUserName = async (uid) => {
//     try {
//       const userDocRef = doc(db, 'users', uid);
//       const userDocSnap = await getDoc(userDocRef);

//       if (userDocSnap.exists()) {
//         const firstName = userDocSnap.data()?.firstName || 'User';
//         setUserName(firstName);
//       } else {
//         console.warn('No such user document');
//         setUserName('User');
//       }
//     } catch (error) {
//       console.error('Failed to fetch user name:', error);
//       setUserName('User');
//     }
//   };

//   const fetchUserBucketList = async (uid) => {
//     try {
//       const ref = collection(db, 'users', uid, 'bucketlist');
//       const snapshot = await getDocs(ref);
//       const items = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setBucketlist(items);
//     } catch (err) {
//       console.error('Error fetching user bucket list:', err);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       const user = auth.currentUser;
//       if (user) {
//         fetchUserName(user.uid);
//         fetchUserBucketList(user.uid);
//       }
//     }, [])
//   );

//   const toggleExpand = (id) => {
//     setExpandedIds(prev => {
//       const updated = new Set(prev);
//       updated.has(id) ? updated.delete(id) : updated.add(id);
//       return updated;
//     });
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       router.replace('/(auth)/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.greeting}>Welcome Back,</Text>
//           <Text style={styles.userName}>{userName}!</Text>
//         </View>
//         <View style={styles.avatarRow}>
//           <Ionicons name="person-circle-outline" size={42} color="#444" />
//           <TouchableOpacity onPress={handleLogout}>
//             <Ionicons name="log-out-outline" size={26} color="red" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* ... bucket list card rendering remains unchanged ... */}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   header: {
//     marginTop: 50,
//     marginBottom: 24,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   greeting: {
//     fontSize: 18,
//     color: '#444',
//     fontWeight: '500',
//   },
//   userName: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   avatarRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
// });
