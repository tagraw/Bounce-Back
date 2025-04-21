import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
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
    { top: 615, left: 271 },
    { top: 590, left: 230 },
    { top: 583, left: 181 },
    { top: 575, left: 135 },
    { top: 540, left: 100 }, // checkpoint
    { top: 500, left: 105 },
    { top: 465, left: 145 },
    { top: 450, left: 195 },
    { top: 425, left: 240 },
    { top: 375, left: 255 }, // checkpoint
    { top: 333, left: 222 },
    { top: 315, left: 168 },
    { top: 280, left: 128 },
    { top: 245, left: 160 },
    { top: 200, left: 190 }, // checkpoint
    { top: 155, left: 195 },
    { top: 115, left: 165 },
    { top:  85, left: 120 },
    { top:  65, left:  75 },
    { top:  25, left:  33 },
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
    padding: 20,
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ccc',
  },
  roadmapImage: {
    width: 390,
    height: 700,
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
