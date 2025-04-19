import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import roadmapImage from '../../assets/images/roadmap.png';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback } from 'react';
import { app } from '../../config/firebase';

const windowWidth = Dimensions.get('window').width;
const scale = windowWidth / 393;

export default function RoadmapScreen() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [completedCount, setCompletedCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const user = auth.currentUser;
      if (user) {
        fetchCompletedTasks(user.uid);
      }
    }, [])
  );

  const fetchCompletedTasks = async (uid) => {
    try {
      const ref = collection(db, 'users', uid, 'bucketlist');
      const snapshot = await getDocs(ref);
      const items = snapshot.docs.map(doc => doc.data());
      const totalCompleted = items.reduce((sum, item) => sum + (item.CompletedSubtasks?.length || 0), 0);
      setCompletedCount(totalCompleted/5);
    } catch (err) {
      console.error('Error fetching completed tasks for roadmap:', err);
    }
  };

  const dotPositions = [
    { top: 520, left: 170 },
    { top: 500, left: 230 },
    { top: 460, left: 260 },
    { top: 420, left: 260 },
    { top: 380, left: 230 },
    { top: 340, left: 130 },
    { top: 300, left: 120 },
    { top: 270, left: 160 },
    { top: 240, left: 190 },
    { top: 210, left: 200 },
    { top: 150, left: 170 },
    { top: 120, left: 140 },
    { top: 90, left: 100 },
    { top: 60, left: 50 },
    { top: 30, left: 20 },
    { top: 0, left: 15 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Progress</Text>
        <View style={styles.profileIcon} />
      </View>

      <ImageBackground source={roadmapImage} style={styles.roadmapImage} resizeMode="cover">
      {dotPositions.map((pos, index) => {
  const isCompleted = index < completedCount;
  const isMilestone = (index + 1) % 5 === 0;

  const dotStyle = [
    styles.dot,
    isMilestone
      ? isCompleted
        ? styles.milestoneCompletedDot
        : styles.milestonePendingDot
      : isCompleted
        ? styles.filledDot
        : styles.emptyDot,
    {
      top: pos.top * scale,
      left: pos.left * scale,
      width: isMilestone ? 28 : 20,
      height: isMilestone ? 28 : 20,
      borderRadius: isMilestone ? 14 : 10,
    },
  ];

  return <View key={index} style={dotStyle} />;
})}


      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    paddingTop: 30,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ccc',
  },
  roadmapImage: {
    width: 390,
    height: 800,
    position: 'relative',
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 10,
  },
 
  milestoneDotFill: {
    borderColor: '#FFD700',
    borderWidth: 3,
    shadowColor: '#FFD700',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  milestoneText: {
    position: 'absolute',
    color: '#444',
    fontWeight: 'bold',
    fontSize: 12,
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },


  
  milestoneDot: {
    borderColor: '#FFD700',
    borderWidth: 3,
    backgroundColor: '#FFF8DC', 
    shadowColor: '#FFD700',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  dot: {
    position: 'absolute',
    borderWidth: 2,
  },
  
  filledDot: {
    backgroundColor: '#4CAF50',
    borderColor: 'white',
  },
  
  emptyDot: {
    backgroundColor: '#ccc',
    borderColor: 'white',
  },
  
  milestoneCompletedDot: {
    backgroundColor: '#4CAF50', // green
    borderColor: '#FFD700', // gold border
    borderWidth: 3,
    shadowColor: '#FFD700',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  
  milestonePendingDot: {
    backgroundColor: '#ccc', // gray
    borderColor: '#FFD700', // gold border
    borderWidth: 3,
    shadowColor: '#FFD700',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  
});
