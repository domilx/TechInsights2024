import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Button } from "react-native";
import { uploadMatchData, uploadPitData } from "../../services/UploadService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchDataFromFirebase } from "../../services/FetchService";
import { PitModel } from "../../models/PitModel";

export default function DrawerScreen({ navigation }: any) {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [lastSync, setLastSync] = useState("");
  const [teams, setTeams] = useState<PitModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handlePress = (team: any) => {
    setSelectedTeam(team.teamName);
    navigation.navigate("Teams", { team }); // Pass the entire team object
    navigation.closeDrawer();
  };

  const getLastSyncDisplay = () => {
    if (!lastSync) return "Never synced";
    const date = new Date(lastSync);
    const daysSince = Math.floor(
      (new Date().getTime() - date.getTime()) / (1000 * 3600 * 24)
    );
    if (daysSince === 0) return `Last synced Today @ ${date.toLocaleTimeString()}`;
    else if (daysSince === 1) return `Last synced Yesterday @ ${date.toLocaleTimeString()}`;
    return `Last synced: ${daysSince} days ago @ ${date.toLocaleTimeString()}`;
  };

  const handleSyncButtonPress = () => {
    Alert.alert(
      "Confirmation",
      "This action will upload the offline scanned data and download newer versions of data from the server. Are you sure?",
      [
        { text: "Cancel", onPress: () => {} },
        { text: "OK", onPress: handleSync },
      ]
    );
  }

  const handleSync = async () => {
    try {
      setIsLoading(true);
      // Fetch locally stored data
      const localPitData = await AsyncStorage.getItem("pitData");
      const localMatchData = await AsyncStorage.getItem("matchData");

      if (localPitData) {
        setLoadingMessage("Uploading local Pit data");
        const resultPit = await uploadPitData(
          JSON.parse(localPitData),
          alwaysConfirm
        );
        if (!resultPit.worked) {
          Alert.alert("Error", resultPit.message);
          return;
        }
        await AsyncStorage.removeItem("pitData");
      }

      if (localMatchData) {
        setLoadingMessage("Uploading local Match data");
        const resultMatch = await uploadMatchData(
          JSON.parse(localMatchData),
          alwaysConfirm
        );
        if (!resultMatch.worked) {
          Alert.alert("Error", resultMatch.message);
          return;
        }
        await AsyncStorage.removeItem("matchData");
      }

      setLoadingMessage("Fetching data");
      const fetchedData: PitModel[] =
        (await fetchDataFromFirebase()) as PitModel[];
      if (fetchedData) {
        await saveDataLocally("fetchedData", fetchedData);

        // Record the current time as the last sync time
        const lastSyncTime = new Date().toISOString();
        await AsyncStorage.setItem("lastSyncTime", lastSyncTime);
        setLastSync(lastSyncTime); // Update the state to trigger re-render
        setTeams(fetchedData); // Update the local state to reflect the new teams data

        console.log("Synced data: ", JSON.stringify(fetchedData, null, 2));
        Alert.alert("Sync Complete", "All data is synced!");
      } else {
        throw new Error("Failed to fetch data from Firebase.");
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      // If there's an error, alert the user and don't update the synced data
      Alert.alert("Sync Failed", error.message);
    }
  };

  const handleClearButton = () => {
    Alert.alert(
      "Confirmation",
      "This action will clear all data stored locally awaitng upload. Are 100% you sure?",
      [
        { text: "Cancel", onPress: () => {} },
        { text: "OK", onPress: handleClear },
      ]
    );
  }

  const handleClear = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem("matchData");
      await AsyncStorage.removeItem("pitData")
      setIsLoading(false);
      Alert.alert("Success", "All data cleared successfully");
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert("Error", error.message);
    }
  };

  // Define alwaysConfirm here or import it from where it is defined
  const alwaysConfirm = () => Promise.resolve(true);

  const saveDataLocally = async (key: any, data: any) => {
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
            selectedTeam === item.TeamNb ? "#636262" : "transparent",
        },
      ]}
      onPress={() => handlePress(item)}
    >
      <Text
        style={selectedTeam === item.TeamNb ? styles.selectedText : styles.text}
      >
        {item.RobTeamNm}
      </Text>
      <Text style={styles.chip}>➜</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const loadTeamsData = async () => {
      const teamsData = await AsyncStorage.getItem("fetchedData"); // Make sure this key matches the one used in handleSync
      if (teamsData) {
        setTeams(JSON.parse(teamsData));
      }
    };
  
    loadTeamsData();
  
    const loadLastSyncTime = async () => {
      const lastSyncTime = await AsyncStorage.getItem("lastSyncTime");
      if (lastSyncTime) {
        setLastSync(lastSyncTime);
      }
    };
  
    loadLastSyncTime();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#F6EB14" />
          <Text style={styles.loadingText}>{loadingMessage}</Text>
        </View>
      )}
      <View style={styles.sync}>
        <View style={{ flexDirection: "row" }}>
          <Button title="Sync Data" onPress={handleSyncButtonPress} />
          <Text> </Text>
          <Button color={"red"} title="Clear Pending" onPress={handleClearButton} />
        </View>
        <Text style={styles.syncText}>{getLastSyncDisplay()}</Text>
      </View>
      <FlatList
        data={teams}
        renderItem={renderItem}
        keyExtractor={(item) => item.TeamNb.toString()}
        ListHeaderComponent={<View style={styles.listHeader} />}
      />
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
    height: 10, // Adjust this height as needed for your design
  },
  loadingOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderRadius: 10,
  },
  loadingText: {
    marginTop: 20,
    color: '#FFFFFF',
  },
});
