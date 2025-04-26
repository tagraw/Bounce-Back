import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export const Conditions = () => {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handleAgree = () => {
    if (agreed) {
      router.push('/(auth)/selectgroup'); // change this path to where you want them to go after agreeing
    } else {
      Alert.alert('Agreement Required', 'You must agree to the terms and conditions to proceed.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>
      <Text style={styles.content}>
        By using this app, you acknowledge that you may be communicating with other individuals. We do not conduct background checks on users and cannot guarantee their safety, behavior, or intentions. You agree to exercise caution and personal judgment when interacting with others.

        The app and its creators are not responsible or liable for any harm, injury, loss, or damages that may result from interactions with other users. By proceeding, you accept full responsibility for your actions and agree to release the app and its developers from any claims or liabilities.

        Additional Terms:
        - You must be at least 13 years old to use this app.
        - You agree not to use the app for any unlawful purposes.
        - Your data may be collected and used in accordance with our Privacy Policy.
        - We reserve the right to suspend or terminate accounts that violate our policies.
        - Content shared within the app may be monitored or removed if it violates community guidelines.
        - The app is provided "as is" without any warranties of any kind.
        - We reserve the right to update these terms at any time without prior notice.
      </Text>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity style={styles.checkbox} onPress={() => setAgreed(!agreed)}>
          {agreed && <MaterialIcons name="check" size={20} color="white" />}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>I have agreed to the Terms and Conditions</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAgree}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    paddingBottom: 150,
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  content: {
    fontSize: 16,
    marginBottom: 50,
    lineHeight: 24,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbd5d5',
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#fbd5d5',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
