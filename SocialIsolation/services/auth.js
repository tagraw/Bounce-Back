import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { app } from '../config/firebase';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import * as Font from 'expo-font';  
import { useNavigation } from '@react-navigation/native';

export const Auth = () => {
  const [fontLoaded, setFontLoaded] = useState(false); 
  const auth = getAuth(app);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();


  // Load the font
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
      Alert.alert('Success', 'User signed up successfully!');
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Error', 'There was an issue signing up. Please try again.');
    }
  };

  const signInUser = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully:', userCredential.user);
      Alert.alert('Success', 'User signed in successfully!');
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Error', 'There was an issue signing in. Please try again.');
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      Alert.alert('Success', 'You have signed out successfully.');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'There was an issue signing out. Please try again.');
    }
  };

  
  if (!fontLoaded) {
    return <Text>Loading fonts...</Text>; 
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Welcome Back!</Text>
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.formSubTitle}>Login to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <View style={styles.rememberMe}>
          <Text style={styles.rememberText}>Remember me</Text>
          <Text style={styles.forgotPassword}>Forgot password</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={signInUser}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('signup')}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
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
  rememberMe: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rememberText: {
    fontSize: 14,
    color: '#777',
    fontFamily: 'SpaceMono-Regular', 
  },
  forgotPassword: {
    fontSize: 14,
    color: '#007bff',
    textDecorationLine: 'underline',
    fontFamily: 'SpaceMono-Regular', 
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    fontFamily: 'SpaceMono-Regular', 
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
  signUpText: {
    fontSize: 14,
    color: '#007bff',
    textDecorationLine: 'underline',
    fontFamily: 'SpaceMono-Regular', 
  },
});

export default Auth;

