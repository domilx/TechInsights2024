import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Button,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { PitModel } from "../../models/PitModel";
import { syncData, updateLastSyncTime } from "../../services/SyncService";
import { DataContext } from "../../contexts/DataContext";

export default function DrawerScreen({ navigation }: any) {
  const {
    teams,
    setTeams,
    lastSync,
    setLastSync,
    selectedTeam,
    setSelectedTeam,
  } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePress = (team: PitModel) => {
    setSelectedTeam(team);
    navigation.navigate("Teams", { team });
    navigation.closeDrawer();
  };

  const getLastSyncDisplay = () => {
    if (!lastSync) return "Never synced";

    const date = new Date(lastSync);
    if (isNaN(date.getTime())) {
      console.error("Invalid date format:", lastSync);
      return "Invalid date";
    }

    const daysSince = Math.floor(
      (new Date().getTime() - date.getTime()) / (1000 * 3600 * 24)
    );

    if (daysSince === 0)
      return `Last synced Today @ ${date.toLocaleTimeString()}`;
    else if (daysSince === 1)
      return `Last synced Yesterday @ ${date.toLocaleTimeString()}`;
    return `Last synced: ${daysSince} days ago @ ${date.toLocaleTimeString()}`;
  };

  const handleSyncButtonPress = () => {
    Alert.alert(
      "Confirmation",
      "This action will sync all data from the server manually. Are you sure?",
      [
        { text: "Cancel", onPress: () => {} },
        { text: "OK", onPress: handleSync },
      ]
    );
  };

  const handleSync = async () => {
    setIsLoading(true);
    const response = await syncData();
    setIsLoading(false);

    if (response.success) {
      if (response.data) {
        setTeams(response.data);
        setLastSync(new Date().toISOString());
        // Save the updated teams data locally
        saveDataLocally("fetchedData", response.data);
      }
      Alert.alert("Sync Complete", response.message);
    } else {
      Alert.alert("Sync Failed", response.message);
    }
  };

  //everytime the screen is viewed it will sync
  useEffect(() => {
    const sync = async () => {
      const response = await syncData();
      if (response.success && response.data) {
        setTeams(response.data);
        setLastSync(new Date().toISOString());
        saveDataLocally("fetchedData", response.data);
      }
    };
    sync();
  }, [selectedTeam]);

  // This function remains unchanged
  const loadLastSyncTime = async () => {
    try {
      const lastSyncTime = await AsyncStorage.getItem("lastSyncTime");
      if (lastSyncTime) {
        // Remove any quotes that might be around the date string
        const formattedLastSyncTime = lastSyncTime.replace(/['"]+/g, "");
        setLastSync(formattedLastSyncTime);
      }
    } catch (e) {
      console.error("Error loading last sync time: ", e);
    }
  };

  const handleClearButton = () => {
    Alert.alert(
      "Confirmation",
      "This action will clear all data stored locally. Are you sure?",
      [
        { text: "Cancel", onPress: () => {} },
        { text: "OK", onPress: handleClear },
      ]
    );
  };

  const handleClear = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.clear();
      await AsyncStorage.setItem("isLoggedIn", "true");
      setTeams([]);
      setIsLoading(false);
      updateLastSyncTime();
      setSelectedTeam(undefined);
      Alert.alert("Success", "All data cleared successfully");
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert("Error", error.message);
    }
  };

  const handleBackgroundSync = async () => {
    const response = await syncData();
    if (response.success && response.data) {
      setTeams(response.data);
      setLastSync(new Date().toISOString());
      saveDataLocally("fetchedData", response.data);
    }
  };

  const saveDataLocally = async (key: string, data: any) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error("Error saving data locally: ", e);
    }
  };

  const renderItem = ({ item }: { item: PitModel }) => (
    <TouchableOpacity
      style={[
        styles.item,
        {
          backgroundColor:
            selectedTeam === item ? "#636262" : "transparent",
        },
      ]}
      onPress={() => handlePress(item)}
    >
      <Text
        style={
          selectedTeam === item ? styles.selectedText : styles.text
        }
      >
        {item.TeamName}
      </Text>
      <Text style={styles.chip}>➜</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const loadTeamsData = async () => {
      const teamsData = await AsyncStorage.getItem("fetchedData");
      if (teamsData) {
        setTeams(JSON.parse(teamsData));
      }
    };

    const syncInterval = setInterval(() => {
      handleBackgroundSync();
    }, 1000 * 60 * 15); // Adjust the interval as needed, e.g., 15 minutes

    loadTeamsData();

    loadLastSyncTime();

    // Clean up the interval on unmount
    return () => clearInterval(syncInterval);
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#F6EB14" />
          <Text style={styles.loadingText}>Syncing...</Text>
          <Button
            title="Cancel"
            onPress={() => {
              setIsLoading(false);
            }}
          />
        </View>
      )}
      <View style={styles.sync}>
        <View style={{ flexDirection: "row" }}>
          <Button title="Sync Data" onPress={handleSyncButtonPress} />
          <Text> </Text>
          <Button
            color={"red"}
            title="Clear Data"
            onPress={handleClearButton}
          />
        </View>
        <Text style={styles.syncText}>{getLastSyncDisplay()}</Text>
      </View>
      {teams.length !== 0 && (
        <FlatList
          data={teams}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.TeamNumber ? item.TeamNumber.toString() : index.toString()}
          ListHeaderComponent={<View style={styles.listHeader} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  sync: {
    backgroundColor: "#1E1E1E",
    paddingTop: 65,
    alignContent: "center",
    alignItems: "center",
    color: "#F6EB14",
  },
  syncText: {
    color: "#5C5C5C",
    fontSize: 14,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#ccc",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
    color: "#F6EB14",
  },
  selectedText: {
    fontSize: 16,
    color: "#F6EB14",
  },
  chip: {
    fontSize: 14,
    color: "#F6EB14",
  },
  listHeader: {
    height: 10,
  },
  loadingOverlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderRadius: 10,
  },
  loadingText: {
    marginTop: 20,
    color: "#FFFFFF",
  },
});
