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

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#25292e',
    padding: 20,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
