import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router'; 
import StackNavigator from '../../navigation/StackNavigation.tsx';
import SingleBucketItem from '../../screens/singularbucketitem.tsx';
import { NavigationContainer } from '@react-navigation/native';

export default function MyBucketList() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to My Bucket List!</Text>
    </View>
  );
}

const MyBucketListNav = () => {
    return (
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    );  
  }



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});

