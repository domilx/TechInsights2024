import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase"; // Adjust this import to your Firebase configuration file
import { doc, setDoc } from "firebase/firestore";
import AuthService from "../services/AuthService";
import { useNavigation } from "@react-navigation/native";
import ModalHeader from "./components/ModalHeader";

const RegistrationScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const navigation = useNavigation();

  const handleRegisterPress = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const { success, message } = await AuthService.register(
        email,
        password,
        name
      );
      if (success) {
        Alert.alert(
          "Registration Successful",
          "Please wait for an admin to approve your account"
        );
        // No navigation code here, so the user will stay on this screen
      } else {
        Alert.alert("Registration Failed", message);
      }
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <>
      <ModalHeader title="Create Account" onClose={handleBackPress} />
      <View style={styles.container}>
        <Text style={styles.headerText}>Create Account 🔧</Text>
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
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
          keyboardType="default"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegisterPress}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    alignItems: "center",
    backgroundColor: "#f2f2f2", // Adjusted to match other screens
    padding: 20,
  },
  headerText: {
    fontSize: 22,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
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
    color: "#007bff", // Keep or adjust to match theme
  },
});

export default RegistrationScreen;
