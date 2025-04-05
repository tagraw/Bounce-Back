import { Text, View, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router'; 
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { act } from 'react';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import MyBucketList from '../(tabs)/mybucketlist';

//Define props for progress bar

const progressProps = {
  progress: 0.5,
  indeterminate: false,
  styleAttr: 'Horizontal' as 'Horizontal',
  color: '#ffd33d',
}

type RootStackParamList = {
  MyBucketList: undefined;
}

type SingleBucketItemNavigationProp = StackNavigationProp<RootStackParamList, 'MyBucketList'>;

const styles = StyleSheet.create({
  arrowButton: {
    position: 'absolute',
    top: 40, 
    left: 20,
    padding: 10,
  },
  arrowImage: {
    width: 25, 
    height: 25,
  },
  activityImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 100,
    left: 20,
  },
  progressBar: {
    position: 'absolute',
    top: 200,
    left: 20,
    width: '80%',
  },
  progressText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
});

export default function SingleBucketItem({ navigation }: { navigation: SingleBucketItemNavigationProp }) {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((currentProgress) => (currentProgress < 4 ? currentProgress + 1 : 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
  <View>

    //back button to go back to the MyBucketList screen
    <TouchableOpacity style={styles.arrowButton} onPress={() => navigation.navigate('MyBucketList')}>
      <Image source={require('../../assets/images/bucketListImages/left-arrow.png')} style={styles.arrowImage} />
    </TouchableOpacity>


    // Image and text for the single bucket item
    <Text>Single Bucket Item</Text>

    //progress bar to show the progress of the bucket item
    <View style={styles.progressBar}>
      <Text style={styles.progressText}>{Math.round(progress * 4)} out of 4 tasks completed</Text>
      <ProgressBar {...progressProps} progress={progress} style={styles.progressBar} />
    </View>

    // Button to mark the bucket item subtasks as completed

    // Button to mark the bucket item subtasks as completed

    // Button to mark the bucket item subtasks as completed

    // Button to mark the bucket item subtasks as completed

    <Text>Group Members</Text>

  </View>
  );
};

