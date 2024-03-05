import React, { useState, useEffect, FC, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { AuthContext, Role, UserType } from "../contexts/AuthContext";
import AuthService from "../services/AuthService";
import { Picker } from "@react-native-picker/picker";
import { DropDownSelector } from "./components/DropDownSelector";

const SettingsScreen = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    isLoggedIn,
    id: userId,
    insightsRole,
    partsRole,
    setInsightsRole,
    setPartsRole,
  } = useContext(AuthContext);
  const [users, setUsers] = useState<UserType | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

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
            await AuthService.getInstance().logout();
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Logout Failed", "An error occurred during logout.");
    }
  };

  const fetchUsers = async () => {
    const fetchedUsers = await AuthService.getInstance().fetchAllUsers();
    //@ts-ignore
    setUsers(fetchedUsers);
  };

  const handleDelete = async () => {
    try {
      Alert.alert("Are you sure you want to delete your account?", "", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete Account",
          onPress: async () => {
            await AuthService.getInstance().deleteLoggedInUser();
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Deletion Failed",
        "An error occurred during account deletion."
      );
    }
  };

  const handleForgotPassword = async () => {
    try {
      Alert.alert("Are you sure you want to send an email to reset your password?", "", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset Password",
          onPress: async () => {
            await AuthService.getInstance().resetPassword();
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Password Reset Failed",
        "An error occurred during password reset."
      );
    }
  }

  const handleAccessChange = async (userId: string, role: Role) => {
    try {
      const response = await AuthService.getInstance().changeRole(userId, role);
      if (response.success) {
        Alert.alert("Success", `User access updated.`);
        fetchUsers();
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating user access.");
    }
  };

  const renderUserItem = ({ item }: { item: UserType }) => {
    const handleRoleChange = (selectedRole: Role) => {
      handleAccessChange(item.id, selectedRole);
    };

    return (
      <View style={styles.userItem}>
        <Text style={styles.userName}>{item.name}</Text>
        <View style={styles.roleButtons}>
          <DropDownSelector
            label="Select Role"
            items={[
              { label: "Unvalidated", value: Role.UNVALIDATED },
              { label: "Developper", value: Role.DEV },
              { label: "View-Only", value: Role.VIEW },
              { label: "Edit", value: Role.EDIT },
            ]}
            value={item.insightsRole}
            // @ts-ignore
            setValue={handleRoleChange}
          />
        </View>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <ScrollView >
        <Text style={styles.headerText}>Hello {name}!</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.button}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgotPassword} style={styles.button}>
          <Text style={styles.buttonText}>Forgot Password</Text>
        </TouchableOpacity>
        {insightsRole === Role.DEV && (
          <>
            <Text style={styles.headerText}>Dev User Management</Text>
            <FlatList
              // @ts-ignore
              data={users}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id || ""}
              style={styles.userList}
            />
          </>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.credit}>
            Made with ❤️ by Domenico and Noril, with assistance from Tanya and
            the rest of the strategy team.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  userItem: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  roleButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  userList: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
  },
  credit: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20,
  },
});


export default SettingsScreen;
