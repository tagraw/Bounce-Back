import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Signup } from '../../services/signup';
import { Link } from 'expo-router';

export default function SignupScreen() {
  return (
    <ScrollView style={{ backgroundColor: '#25292e' }} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Signup />
      <Link href="/login" style={styles.link}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  linkText: {
    color: '#fff',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});
