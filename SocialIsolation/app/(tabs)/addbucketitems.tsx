import { BucketList } from '../../services/bucketlist';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router'; 


export default function Index() {
  return (
    <ScrollView>
      <BucketList/>
    </ScrollView>
  );
}


