import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Login } from '../../services/login';

export default function Index() {
  return (
    <ScrollView style={styles.scrollContainer}
    contentContainerStyle={styles.contentContainer}>
      <Login />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
