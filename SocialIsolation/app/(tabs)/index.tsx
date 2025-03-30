import { Auth } from '../../services/auth';
import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router'; 


export default function Index() {
  
  return (
    <div className= "App">
      <Auth/>
    </div>
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

