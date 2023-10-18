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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  logoEmoji: {
    fontSize: 24,
    marginLeft: 10,
  },
});

export default LoginScreen;
