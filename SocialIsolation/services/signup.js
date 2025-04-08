import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { app } from '../config/firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import * as Location from 'expo-location';
import { Link, useRouter } from 'expo-router';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

export const Signup = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdayYear, setBirthdayYear] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const currentPosition = await Location.getCurrentPositionAsync({});
        if (Platform.OS !== 'web') {
          const [geo] = await Location.reverseGeocodeAsync(currentPosition.coords);
          setLocation(`${geo.city || ''}, ${geo.region || ''}`);
        } else {
          setLocation(`Lat: ${currentPosition.coords.latitude.toFixed(4)}, Lng: ${currentPosition.coords.longitude.toFixed(4)}`);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };
    fetchLocation();
  }, []);

  const signUpUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        firstName,
        lastName,
        email,
        birthdayYear,
        location,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'User signed up successfully!');
      router.push('/(auth)/selectgroup');
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Error', 'There was an issue signing up. Please try again.');
    }
  };

  if (!fontsLoaded) return <Text>Loading fonts...</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Welcome! Just a few details to begin.</Text>

        <Text style={styles.label}>First Name</Text>
        <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="First Name" placeholderTextColor="#888" />

        <Text style={styles.label}>Last Name</Text>
        <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Last Name" placeholderTextColor="#888" />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="Email" placeholderTextColor="#888" />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" placeholderTextColor="#888" />

        <Text style={styles.label}>Birth Year</Text>
        <TextInput style={styles.input} value={birthdayYear} onChangeText={setBirthdayYear} keyboardType="numeric" placeholder="e.g. 2005" placeholderTextColor="#888" />

        <Text style={styles.label}>Location (auto-fetched)</Text>
        <TextInput style={[styles.input, { color: '#999' }]} value={location} editable={false} />

        <TouchableOpacity style={styles.button} onPress={signUpUser}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Already have an account?{' '}
          <Link href="/login">
            <Text style={styles.loginText}>Log In</Text>
          </Link>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
  },
  label: {
    fontFamily: 'Poppins_700Bold',
    alignSelf: 'flex-start',
    color: '#228B22',
    marginBottom: 6,
    marginTop: 6,
  },
  input: {
    width: '100%',
    backgroundColor: '#fdf8dd',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
  button: {
    backgroundColor: '#fbd5d5',
    paddingVertical: 14,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#000',
  },
  bottomText: {
    fontSize: 13,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
  },
  loginText: {
    fontFamily: 'Poppins_700Bold',
    color: '#000',
    textDecorationLine: 'underline',
  },
});
