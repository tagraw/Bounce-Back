import React from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Signup } from '../../services/signup';
import { useNavigation } from '@react-navigation/native';


export default function SignupScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ backgroundColor: '#25292e' }} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Signup />
      <TouchableOpacity onPress={() => navigation.navigate('auth')}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
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
