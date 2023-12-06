import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
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

  const handlePress = (team: any) => {
    setSelectedTeam(team.teamName);
    navigation.navigate("Teams", { team }); // Pass the entire team object
    navigation.closeDrawer();
  };

  const getLastSyncDisplay = () => {
    if (!lastSync) return "Never synced";
    const date = new Date(lastSync);
    return `Last synced: ${date.toLocaleDateString()} @ ${date.toLocaleTimeString()}`;
  };

  const handleSync = async () => {
    try {
      // Fetch locally stored data
      const localPitData = await AsyncStorage.getItem("pitData");
      const localMatchData = await AsyncStorage.getItem("matchData");

      if (localPitData) {
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
    } catch (error: any) {
      // If there's an error, alert the user and don't update the synced data
      Alert.alert("Sync Failed", error.message);
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
  

  const formatSyncTime = (isoString: any) => {
    if (!isoString) return "Never synced";

    const date = new Date(isoString);
    const now = new Date();

    // Here you can format the date as you like, e.g., '2 days ago'
    // For simplicity, we'll just return the ISO string
    return `Last synced: ${date.toLocaleString()}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.sync}>
        <Button title="Sync Data" onPress={handleSync} />
        <Text>{getLastSyncDisplay()}</Text>
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
});
