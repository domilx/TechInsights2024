import React, { useState, useEffect, FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import AuthService from "../services/AuthService";

interface IUser {
  id: string;
  name: string;
  isDev: boolean;
  hasAccess: boolean;
}

const SettingsScreen: FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isDev, setIsDev] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    const init = async () => {
      const dev = await AuthService.getUserRole();
      setIsDev(dev === "DEV");
      if (dev === "DEV") {
        await fetchUsers();
      }
    };
    init();

    const getUser = async () => {
      const userName = await AuthService.getUserName();
      setUser(userName || "Unnamed User"); // Fallback to 'Unnamed User' if name is not available
    };
    getUser();
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
            await AuthService.logout();
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Logout Failed", "An error occurred during logout.");
    }
  };

  const fetchUsers = async () => {
    const fetchedUsers = await AuthService.fetchAllUsers();
    //@ts-ignore
    setUsers(fetchedUsers);
  };

  const handleAccessChange = async (userId: string, hasAccess: boolean) => {
    try {
      const response = hasAccess
        ? await AuthService.revokeAccess(userId)
        : await AuthService.grantAccess(userId);
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

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await AuthService.deleteUser(userId);
      if (response.success) {
        Alert.alert("Success", "User deleted successfully.");
        fetchUsers();
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while deleting the user.");
    }
  };

  const renderUserItem = ({ item }: { item: IUser }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>
      <View style={styles.roleButtons}>
        <TouchableOpacity
          style={[styles.roleButton, styles.additionalMargin]}
          onPress={() => handleAccessChange(item.id, item.hasAccess)}
        >
          <Text style={styles.buttonText}>
            {item.hasAccess ? "Revoke Access" : "Grant Access"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => handleDeleteUser(item.id)}
        >
          <Text style={styles.buttonText}>Delete User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.headerText}>Hello {user}!</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
        {isDev && (
          <>
            <Text style={styles.headerText}>Dev User Management</Text>
            <FlatList
              data={users}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id}
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
    padding: 20,
    backgroundColor: "#fff",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%", // Ensure full width
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "80%", // Ensure full width
  },
  credit: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
  userList: {
    marginTop: 20,
    width: "100%", // Ensure full width
  },
  userName: {
    fontSize: 18,
    flex: 1, // Give the user name component flex to take available space
    paddingRight: 10, // Add some padding to prevent text from touching the buttons
  },
  roleButtons: {
    flexDirection: "row",
    alignItems: "center",
    // Remove flex property to allow natural sizing of buttons
  },
  roleButton: {
    backgroundColor: "#1E1E1E",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 5,
  },
  additionalMargin: {
    marginRight: 0,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonText: {
    color: "red",
    fontSize: 14,
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
  button: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  modalContent: {
    flexGrow: 1,
    padding: 20,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
});

export default SettingsScreen;
