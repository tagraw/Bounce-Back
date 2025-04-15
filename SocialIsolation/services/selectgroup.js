import React, { useState } from 'react';
import {
  Text, TouchableOpacity, StyleSheet, ScrollView,
  Alert, SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from '../config/firebase';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

const groups = [
  'Single Parents',
  'Elderly or Retired',
  'Chronic Illnesses',
  'Military Veterans',
  'Former Prisoners',
  'Other',
];

export const SelectGroup = () => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const handleNext = async () => {
    const user = auth.currentUser;
    if (!user || !selectedGroup) {
      Alert.alert('Please select a group.');
      return;
    }

    try {
      const ref = doc(db, 'users', user.uid);
      await updateDoc(ref, { group: selectedGroup });
      Alert.alert('Success', `You've been added to the "${selectedGroup}" group!`);
      router.push('/addbucketitems');
    } catch (error) {
      console.error('Error updating group:', error);
      Alert.alert('Error saving group selection.');
    }
  };

  if (!fontsLoaded) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.question}>Which of these groups best describes you?</Text>

        {groups.map((group) => (
          <TouchableOpacity
            key={group}
            style={[
              styles.option,
              selectedGroup === group && styles.optionSelected
            ]}
            onPress={() => setSelectedGroup(group)}
          >
            <Text style={styles.optionText}>{group}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  question: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold',
    marginTop: 30,
    marginBottom: 30,
  },
  option: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
    alignItems: 'center',
  },
  optionSelected: {
    borderColor: '#fbb6b6',
    backgroundColor: '#fff0f0',
  },
  optionText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#000',
  },
  button: {
    marginTop: 20,
    marginBottom: 50,
    backgroundColor: '#fbd5d5',
    paddingVertical: 14,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#000',
  },
});
