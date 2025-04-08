import React from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Signup } from '../../services/signup';

export default function SignupScreen() {
  return (
    <ScrollView>
      <Signup />
    </ScrollView>
  );
}

