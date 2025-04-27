import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, Image } from 'react-native';
import roadmapImage from '../assets/images/roadmap.png';
import avatarImage from '../assets/images/logo.png'; // Avatar
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { app } from '../config/firebase';

const windowWidth = Dimensions.get('window').width;
const scale = windowWidth / 393;

export const Roadmap = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [completedCount, setCompletedCount] = useState(0); // for avatar and roadmap
  const [nextTaskSubtasksRemaining, setNextTaskSubtasksRemaining] = useState(0); // for speech bubble

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
  
      let fullTasksCompleted = 0; // full tasks where all subtasks are done
      let nextTaskSubtasksRemaining = 0; // next incomplete task
  
      for (const item of items) {
        const subtasks = item.Subtasks || [];
        const completed = item.CompletedSubtasks || [];
  
        if (subtasks.length > 0 && subtasks.length === completed.length) {
          fullTasksCompleted++;
        } else if (nextTaskSubtasksRemaining === 0 && subtasks.length > 0) {
          // 🧠 Found the first *incomplete* task — calculate remaining subtasks
          nextTaskSubtasksRemaining = subtasks.length - completed.length;
        }
      }
  
      setCompletedCount(fullTasksCompleted);        
      setNextTaskSubtasksRemaining(nextTaskSubtasksRemaining); 
    } catch (err) {
      console.error('Error fetching completed tasks for roadmap:', err);
    }
  };

  const dotPositions = [
    { top: 615, left: 271 },
    { top: 590, left: 230 },
    { top: 583, left: 181 },
    { top: 575, left: 135 },
    { top: 540, left: 100 },
    { top: 500, left: 105 },
    { top: 465, left: 145 },
    { top: 450, left: 195 },
    { top: 425, left: 240 },
    { top: 375, left: 255 },
    { top: 333, left: 222 },
    { top: 315, left: 168 },
    { top: 280, left: 128 },
    { top: 245, left: 160 },
    { top: 200, left: 190 },
    { top: 155, left: 195 },
    { top: 115, left: 165 },
    { top: 85, left: 120 },
    { top: 65, left: 75 },
    { top: 25, left: 33 },
  ];

  const activitiesCompletedTowardMilestone = completedCount % 5;
  const activitiesRemaining = 5 - activitiesCompletedTowardMilestone;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Progress</Text>
        <View style={styles.profileIcon} />
      </View>

      <ImageBackground source={roadmapImage} style={styles.roadmapImage} resizeMode="cover">
        {/* Dots */}
        {dotPositions.map((pos, index) => {
          const isCompleted = index < completedCount;
          const isMilestone = (index + 1) % 5 === 0;
          const dotSize = isMilestone ? 26 : 16;
          const centerDotSize = isMilestone ? 12 : 6;

          return (
            <View
              key={index}
              style={[
                styles.outerDot,
                {
                  top: pos.top * scale,
                  left: pos.left * scale,
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: isCompleted ? '#4F8EF7' : 'white',
                  borderWidth: isCompleted ? 0 : 2,
                  borderColor: isCompleted ? 'white' : '#d9d9d9',
                  opacity: index === completedCount ? 0.7 : 1,
                },
              ]}
            >
              {!isCompleted && (
                <View style={[
                  styles.centerDot,
                  {
                    width: centerDotSize,
                    height: centerDotSize,
                    borderRadius: centerDotSize / 2,
                    backgroundColor: isMilestone ? '#d3d3d3' : '#aaa',
                  }
                ]} />
              )}
            </View>
          );
        })}

        {/* Speech Bubble */}
        {completedCount < dotPositions.length && (
          <View style={[
            styles.speechBubble,
            {
              top: (dotPositions[completedCount].top - 65) * scale,
              left: (dotPositions[completedCount].left - 47) * scale,
            }
          ]}>
            <Text style={styles.speechNumber}>
              {nextTaskSubtasksRemaining}/5 activities
            </Text>
            <Text style={styles.speechSubtext}>
              to unlock!
            </Text>
            <View style={styles.speechBubbleArrow} />
          </View>
        )}

        {/* Avatar */}
        {completedCount > 0 && completedCount <= dotPositions.length && (
          <Image
            source={avatarImage}
            style={[
              styles.avatar,
              {
                top: (dotPositions[completedCount - 1].top - 23) * scale,
                left: (dotPositions[completedCount - 1].left - 18) * scale,
              }
            ]}
          />
        )}
      </ImageBackground>
    </View>
  );
};

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
  outerDot: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerDot: {
    backgroundColor: '#aaa',
  },
  avatar: {
    position: 'absolute',
    width: 50,
    height: 50,
    resizeMode: 'contain',
    zIndex: 10,
    transform: [{ scaleX: -1 }],
  },
  speechBubble: {
    position: 'absolute',
    backgroundColor: 'white',
    paddingVertical: 5,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#ffffff', // white glow
    shadowOpacity: 0.9,     // stronger glow
    shadowRadius: 12,       // larger spread
    shadowOffset: { width: 0, height: 0 }, // centered glow
    elevation: 12,
    zIndex: 20,
  },
  speechNumber: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  speechSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  speechBubbleArrow: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
  },
});
