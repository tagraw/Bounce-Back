import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons or react-native-vector-icons



export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Welcome Back, (User)!</Text>
        <Ionicons name="person-circle-outline" size={36} color="black" />
      </View>

      {/* Bucket List Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bucket List</Text>
          <Text style={styles.editList}>Edit List</Text>
        </View>

        {/* Item 1 */}
        <View style={styles.bucketItem}>
          <Text style={styles.bucketText}>Backpacking Trip</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
        </View>

        {/* Item 2 */}
        <View style={styles.bucketItem}>
          <Text style={styles.bucketText}>Arts and Crafts</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '30%' }]} />
          </View>
        </View>

        {/* Item 3 */}
        <View style={styles.bucketItem}>
          <Text style={styles.bucketText}>Cook a Three Course Meal</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '70%' }]} />
          </View>
        </View>
      </View>

      {/* My Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Progress</Text>
        {/* Placeholder for any progress graph or stats */}
        <View style={styles.placeholderBox}>
          <Text>Progress Graph/Stats Here</Text>
        </View>
      </View>

      {/* My Next Event */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Next Event</Text>
        <View style={styles.nextEventCard}>
          <Text style={styles.eventTitle}>Going on a Hike</Text>
          <Text style={styles.eventDetails}>February 28 • 6:30 PM</Text>
          <Text style={styles.eventDetails}>1.0 mi • Mount Bonnell</Text>
          <Text style={styles.eventDetails}>10 going</Text>
          <Text style={styles.eventTag}>Exercise</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editList: {
    fontSize: 14,
    color: 'blue',
  },
  bucketItem: {
    marginBottom: 12,
  },
  bucketText: {
    fontSize: 16,
    marginBottom: 4,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  placeholderBox: {
    height: 80,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  nextEventCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  eventTag: {
    marginTop: 8,
    color: 'green',
    fontWeight: 'bold',
  },
});

