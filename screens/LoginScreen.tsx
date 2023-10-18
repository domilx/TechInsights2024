import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Alert } from "react-native";
import { ImageBackground } from "react-native";

type LoginScreenProps = {
  onLogin: () => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
}: React.PropsWithChildren<LoginScreenProps>) => {
  const [password, setPassword] = useState("");

  const handleLoginPress = () => {
    if (password === "FIRST2023$") {
      onLogin();
    } else {
      Alert.alert("Incorrect Password", "Please try again.", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/Mystic.png")}
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.content} />
      </ImageBackground>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logoText}>TechInsights</Text>
          <Text style={styles.logoEmoji}>🔧</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Access Password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          placeholderTextColor="#8a8a8a"
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.signUpText}>Need Access? Contact Domenico</Text>
      </View>
      <Text style={styles.credit}>made by domi & noril</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 110,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
  },
  logoText: {
    fontSize: 34,
    fontWeight: "800",
    textAlign: "left",
    flex: 1,
  },
  logoEmoji: {
    fontSize: 34,
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "white",
    marginBottom: 20,
    padding: 10,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#c2e9fb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  loginButton: {
    width: "100%",
    height: 45,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  signUpText: {
    marginTop: 10,
    color: "black",
    textAlign: "center",
  },
  credit: {
    marginTop: 5,
    marginBottom: 20,
    color: "grey",
    textAlign: "center",
  },
});

export default LoginScreen;
