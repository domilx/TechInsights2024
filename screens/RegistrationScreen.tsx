import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AuthService from "../services/AuthService";
import { useNavigation } from "@react-navigation/native";
import ModalHeader from "./components/ModalHeader";

const RegistrationScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oneTimePassword, setOneTimePassword] = useState(""); 
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");

  const navigation = useNavigation();

  const handleRegisterPress = async () => {
    const response = await AuthService.getInstance().register(email, password, name, oneTimePassword, team);
    if (response.success) {
      Alert.alert("Registration Successful", "Please log in with your new account.");
    } else {
      Alert.alert("Registration Failed", response.message);
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
        <TextInput
          style={styles.input}
          placeholder="One Time Password"
          secureTextEntry
          value={oneTimePassword}
          onChangeText={setOneTimePassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Team Number"
          secureTextEntry
          value={team}
          onChangeText={setTeam}
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
