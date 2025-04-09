import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Login } from '../../services/login';

export default function Index() {
  return (
    <ScrollView>
      <Login />
    </ScrollView>
  );
}


