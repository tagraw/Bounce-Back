import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';

export default function LoadingScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')} // ⬅️ Replace with your actual mascot logo file
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>BOUNCE</Text>
      <Text style={styles.title}>BACK</Text>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBD5D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins_700Bold',
    color: '#000',
    lineHeight: 40,
  },
});
