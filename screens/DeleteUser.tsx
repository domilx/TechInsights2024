import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AuthService from "../services/AuthService"; // Ensure this path is correct

const DeleteScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation();

  const handleLoginPress = async () => {
    try {
      const { success, message } = await AuthService.deleteUser(email, password);
      if (success) {
        // Login was successful, navigate based on the user's role or to the main app screen
      } else {
        Alert.alert('Deleted Account', message);
      }
    } catch (error) {
      Alert.alert('Delet Failed', error instanceof Error ? error.message : 'An error occurred');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>We're sad to see you go!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 150,
    alignItems: "center",
    backgroundColor: "#f2f2f2", // Adjusted to match other screens
    padding: 20,
  },
  headerText: {
    fontSize: 22,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1E1E1E", // Matched with other screens
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#F6EB14", // Adjusted to match other screens
    fontWeight: "bold",
  },
  switchText: {
    marginTop: 15,
    color: "#1E1E1E", // Keep or adjust to match theme
  },
});

export default DeleteScreen;
