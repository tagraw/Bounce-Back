import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Image, Dimensions, SafeAreaView
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../config/firebase';
import { useRouter } from 'expo-router';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const auth = getAuth(app);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const signInUser = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully:', userCredential.user);
      // Alert.alert('Success', 'User signed in successfully!');
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Error', 'Invalid credentials.');
    }
  };

  if (!fontsLoaded) return <Text>Loading fonts...</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.row}>
          <Text style={styles.remember}>□ Remember me</Text>
          <Text style={styles.forgot}>Forgot password</Text>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={signInUser}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Don’t have an account?{' '}
          <Text style={styles.signUpLink} onPress={() => router.replace('/signup')}>
            Sign Up
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 50,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height, // full screen height
  },
  heroImage: {
    width: width * 0.55,
    height: width * 0.55,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 4,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    fontFamily: 'Poppins_400Regular',
  },
  label: {
    alignSelf: 'flex-start',
    fontWeight: '600',
    color: '#228B22',
    marginBottom: 6,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  input: {
    width: '100%',
    backgroundColor: '#fdf8dd',
    borderRadius: 20,
    padding: 14,
    fontSize: 15,
    marginBottom: 18,
    fontFamily: 'Poppins_400Regular',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  remember: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Poppins_400Regular',
  },
  forgot: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'underline',
    fontFamily: 'Poppins_400Regular',
  },
  loginButton: {
    backgroundColor: '#fbd5d5',
    paddingVertical: 14,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins_600SemiBold',
  },
  bottomText: {
    fontSize: 13,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
  },
  signUpLink: {
    color: '#000',
    textDecorationLine: 'underline',
    fontFamily: 'Poppins_600SemiBold',
  },
});
