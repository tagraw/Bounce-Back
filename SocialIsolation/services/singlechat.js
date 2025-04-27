import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, StyleSheet, Image, Alert
} from 'react-native';
import { getAuth } from 'firebase/auth';
import {
  getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp,
  doc, getDoc, getDocs
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { app } from '../config/firebase';
import { useRouter } from 'expo-router';

export const ChatScreen = () => {
  const [groupSize, setGroupSize] = useState(0);
  const [groupName, setGroupName] = useState('');
  const router = useRouter();
  const [groupId, setGroupId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const user = auth.currentUser;

  // Request camera & media library permissions on mount
  useEffect(() => {
    (async () => {
      const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
      const mediaPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraPerm.status !== 'granted' || mediaPerm.status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Camera and media library permissions are needed to send photos.'
        );
      }
    })();
  }, []);

  // Fetch the user's group once
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const userData = snap.data();
          setGroupId(userData.group);

          // Fetch the bucketlist and pick the activity name
          const bucketlistSnapshot = await getDocs(collection(db, 'users', user.uid, 'bucketlist'));
          const bucketlistItems = bucketlistSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        const usersSnapshot = await getDocs(collection(db, 'users'));
        const members = usersSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(u => u.group === userData.group);

        setGroupSize(members.length);

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
      }
        if (snap.exists()) setGroupId(snap.data().group);
      } catch (e) {
        console.error('Error fetching group:', e);
      }
    })();
  }, [user]);

  // Subscribe to messages in that group
  useEffect(() => {
    if (!groupId) return;
    const msgsRef = collection(db, 'groups', groupId, 'messages');
    const q = query(msgsRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsubscribe;
  }, [groupId]);

  // Upload image URI to Firebase Storage and return URL
  const uploadImageAsync = async uri => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `chatImages/${groupId}/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      console.log('Uploaded image URL:', url);
      return url;
    } catch (e) {
      console.error('Upload error:', e);
      return null;
    }
  };

  // Capture photo with camera
  const capturePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera permission is required to send photos.');
      return null;
    }
  
    const result = await ImagePicker.launchCameraAsync({
          quality: 0.7,
         });
    console.log('🔥 launchCamera result:', result);
    // result should look like { canceled: false, assets: [{ uri: 'file://…' }] }
  
    if (result.canceled) {
      console.log('🛑 User cancelled photo capture');
      return null;
    }
  
    const uri = result.assets?.[0]?.uri;
    console.log('📸 Captured photo URI:', uri);
    return uri || null;
  };
  

  // Send a text message
  const sendMessage = useCallback(async () => {
    if (!input.trim() || !groupId) return;
    try {
      const msgsRef = collection(db, 'groups', groupId, 'messages');
      await addDoc(msgsRef, {
        text: input.trim(),
        senderId: user.uid,
        timestamp: serverTimestamp()
      });
      setInput('');
    } catch (e) {
      console.error('Send error:', e);
    }
  }, [input, groupId]);

  // Send a photo message
  const sendPhotoMessage = useCallback(async () => {
    if (!groupId) return;
    const uri = await capturePhoto();
    if (!uri) return;
    const imageURL = await uploadImageAsync(uri);
    if (!imageURL) return;
    try {
      const msgsRef = collection(db, 'groups', groupId, 'messages');
      await addDoc(msgsRef, {
        imageURL,
        senderId: user.uid,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error('Image send error:', e);
    }
  }, [groupId]);

  // Loading state
  if (!groupId) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading chat...</Text>
      </View>
    );
  }

  // Render each message (text or image)
  const renderItem = ({ item }) => (
    <View style={[
      styles.bubble,
      item.senderId === user.uid ? styles.myBubble : styles.theirBubble
    ]}>
      {item.imageURL ? (
        <Image source={{ uri: item.imageURL }} style={styles.chatImage} />
      ) : (
        <Text style={styles.bubbleText}>{item.text}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 🏡 Back Button */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/groupchat')}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.groupNameText}>{groupName} Group</Text>
        </View>

        {/* Subtext below the group name */}
        <TouchableOpacity style={styles.groupInfoRow} onPress={() => router.push('/groupmembers')}>
          <Text style={styles.groupInfoText}>{groupSize} {groupSize === 1 ? 'person' : 'people >'}</Text>
        </TouchableOpacity>
      </View>

        <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputRow}>
        <TouchableOpacity onPress={sendPhotoMessage} style={styles.cameraButton}>
          <Ionicons name="camera" size={28} color="#007AFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center' 
  },
  messagesList: {
    padding: 12 
  },
  bubble: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 16,
    maxWidth: '80%' 
  },
  myBubble: {
    backgroundColor: '#FBD5D5',
    alignSelf: 'flex-end'
  },
  theirBubble: {
    backgroundColor: '#C6F7C3',
    alignSelf: 'flex-start'
  },
  bubbleText: {
    fontSize: 16
  },
  chatImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginVertical: 4 
  },
  inputRow: {
    flexDirection: 'row',
    padding: 20, 
    paddingBottom: 30,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center'
  },
  cameraButton: {
    marginRight: 8
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8
  },
  sendButton: {
    backgroundColor: '#FBD5D5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20
  },
  sendText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600'
  },
  backButton: {
    padding: 10,
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 100, // make sure it's above the messages
    backgroundColor: '#eee',
    borderRadius: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  groupNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginLeft: 80, 
  },
  groupInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 170, // adjust to align nicely under the group name
  },
  groupInfoText: {
    fontSize: 13,
    color: '#888',
  },
});
