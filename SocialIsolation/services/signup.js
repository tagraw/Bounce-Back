import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView 
} from'react-native';
import { app } from '../config/firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import * as Font from 'expo-font';
import { Link } from 'expo-router';

export const Signup = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [firstName, setFirstName]       = useState('');
  const [lastName, setLastName]         = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [birthdayYear, setBirthdayYear] = useState('');
  const [location, setLocation]         = useState('');

  // Load custom font
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
      });
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

  const signUpUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up successfully:', userCredential.user);

      // Add extra user fields to Firestore in the "users" collection
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        firstName,
        lastName,
        email,
        birthdayYear,
        location,
        createdAt: new Date(), // You can also use serverTimestamp() here
      });

      Alert.alert('Success', 'User signed up successfully!');
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Error', 'There was an issue signing up. Please try again.');
    }
  };

  if (!fontLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Create Your Account</Text>
      </View>

      {/* Signup Form */}
      <View style={styles.formContainer}>
        <Text style={styles.formSubTitle}>Sign up to get started</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#999"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#999"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Birth Year (e.g. 1990)"
          placeholderTextColor="#999"
          value={birthdayYear}
          onChangeText={setBirthdayYear}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Location (e.g. New York, NY)"
          placeholderTextColor="#999"
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity style={styles.button} onPress={signUpUser}>
          <Link href="/addbucketitems">
            <Text style={styles.buttonText}>Sign Up</Text>
          </Link>   
        </TouchableOpacity>

        {/* Footer with navigation to Login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="">
            <Text style={styles.loginText}>Log In</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono-Regular',
  },
  formContainer: {
    marginTop: 40,
  },
  formSubTitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
    fontFamily: 'SpaceMono-Regular',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
    fontFamily: 'SpaceMono-Regular',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SpaceMono-Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#777',
    fontFamily: 'SpaceMono-Regular',
  },
  loginText: {
    fontSize: 14,
    color: '#007bff',
    textDecorationLine: 'underline',
    fontFamily: 'SpaceMono-Regular', 
  },
});
