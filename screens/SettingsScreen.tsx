import React, { useState, FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DriveBaseMotor,
  DriveBaseType,
  DriverExperience,
  PitModel,
  Stability,
} from "../models/PitModel";
import Icon from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import AuthService from "../services/AuthService";

interface SettingsScreenProps {}

const SettingsScreen: FC<SettingsScreenProps> = () => {
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useState("");
  const [isDev, setIsDev] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        const user = await AuthService.getUserName();
        setUser(user || "");
      };
      console.log(user);
      const getDev = async () => {
        const dev = await AuthService.getUserRole();
        setIsDev(dev === "DEV");
      }
      getDev();
      getUser();
    }
    , [])
  );

  const handleChangeProfile = async () => {
    try {
      // Your code to change the profile
      Alert.alert(
        "Profile Updated",
        "Your profile has been successfully updated."
      );
    } catch (error) {
      Alert.alert(
        "Profile Update Failed",
        "An error occurred during profile update."
      );
    }
  };

  const handleChangePassword = async () => {
    try {
      // Your code to change the password
      Alert.alert(
        "Password Changed",
        "Your password has been successfully changed."
      );
      setNewPassword(""); // Clear the new password field
    } catch (error) {
      Alert.alert(
        "Password Change Failed",
        "An error occurred during password change."
      );
    }
  };

  const handleLogout = async () => {
    try {
      Alert.alert("Are you sure you want to log out?", "", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          onPress: async () => {
            await AuthService.logout();
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Logout Failed", "An error occurred during logout.");
    }
  };

  const ModalHeader: FC<{ onClose: () => void; title: string }> = ({
    onClose,
    title,
  }) => (
    <View style={styles.modalHeader}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={onClose}>
        <Icon name="chevron-back" size={30} color="#F6EB14" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.modalHeaderText}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.headerText}>Hello {user}!</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Modify User</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.fullScreenModal}>
          <ModalHeader
            title="Modify User"
            onClose={() => setIsModalVisible(false)}
          />
          <ScrollView style={styles.modalContent}>
            <TextInput
              placeholder="Name"
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <TouchableOpacity
              onPress={handleChangeProfile}
              style={styles.Modalbutton}
            >
              <Text style={styles.buttonText}>Change Name</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="New Password"
              secureTextEntry
              style={styles.input}
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
            />
            <TouchableOpacity
              onPress={handleChangePassword}
              style={styles.Modalbutton}
            >
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          </ScrollView>
          {isDev && (
            <Text>Dev</Text>
          )
          }
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  Modalbutton: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 50,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#F6EB14",
    fontWeight: "bold",
  },
  modalContent: {
    flexGrow: 1,
    padding: 20,
  },
  modalHeader: {
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#1E1E1E",
  },
  backButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: 10,
    top: 45,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  backButtonText: {
    color: "#F6EB14",
    marginLeft: 5,
  },
  modalHeaderText: {
    fontSize: 16,
    color: "#F6EB14",
    fontWeight: "bold",
  },
});

export default SettingsScreen;
