import React, { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, SafeAreaView } from 'react-native';
import { app } from '../config/firebase';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import styles from './loginStyles';
import * as Font from 'expo-font';

export const Login = () => {
  const [fontLoaded, setFontLoaded] = useState(false); 
  const auth = getAuth(app);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  
  // Load the font
  useEffect(() => {
      const loadFonts = async () => {
        await Font.loadAsync({
          'Baloo-Regular': require('../assets/fonts/Baloo-Regular.ttf'),
        });
        setFontLoaded(true);
      };
      loadFonts();
    }, []);

  // Show "Loading fonts..." while fonts are loading
  if (!fontLoaded) {
    return <Text>Loading fonts...</Text>; 
  }

  // Sign Up function
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

  // Sign In function
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

  // Sign Out function
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={styles.container}>
      <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image 
    source={require('../assets/images/logo.png')} 
    style={{ width: 120, height: 120 }} 
  />




</View>
        {/* Header */}
          <Text style={styles.headerTitle}>Welcome Back!</Text>
        {/* Login Form */}
        
          <Text style={styles.subtext}>Login to continue</Text>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            // placeholder="Email"
            // placeholderTextColor="#888" 
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            // placeholder="Password"
            // placeholderTextColor="#888" 
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
  
          <View style={styles.rememberMe}>
            <Text style={styles.subtext}>Remember me</Text>
            <Text style={styles.subtext}>Forgot password</Text>
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
    </SafeAreaView>
  );
};