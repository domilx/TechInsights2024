import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AuthService from '../services/AuthService'; // Adjust this import as per your path

const SettingsScreen: React.FC = () => {
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      // Optionally, navigate to the login screen or reset the navigation stack
      // navigation.navigate('LoginScreen');
      Alert.alert('Logged Out', 'You have been successfully logged out.');
    } catch (error) {
      Alert.alert('Logout Failed', 'An error occurred during logout.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SettingsScreen;