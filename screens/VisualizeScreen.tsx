import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { DataContext } from "../contexts/DataContext";
import { saveDataLocally } from "../services/LocalStorageService";
import { syncData } from "../services/SyncService";

export default function VisualizeScreen() {
  const { teams, setTeams, lastSync, setLastSync } = useContext(DataContext);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const defaultTeamName = "Default Team";

  useEffect(() => {
    const syncAndLoadData = async () => {
      try {
        console.log('Syncing and loading data');
        const response = await syncData();
        if (response.success && response.data) {
          setTeams(response.data);
          const newLastSync = new Date().toISOString();
          setLastSync(newLastSync);
          await saveDataLocally("fetchedData", response.data);
          await AsyncStorage.setItem("lastSyncTime", JSON.stringify(newLastSync));
        }
        
        const teamsData = await AsyncStorage.getItem("fetchedData");
        if (teamsData) {
          const parsedTeamsData = JSON.parse(teamsData);
          setTeams(parsedTeamsData);
        }
  
        const lastSyncTime = await AsyncStorage.getItem("lastSyncTime");
        if (lastSyncTime) {
          const formattedLastSyncTime = JSON.parse(lastSyncTime);
          setLastSync(formattedLastSyncTime);
        }
  
        // Determine if a team is selected
        const currentlySelectedTeam = selectedTeam === null ? defaultTeamName : selectedTeam;
        if (currentlySelectedTeam !== selectedTeam) {
          setSelectedTeam(currentlySelectedTeam);
        }
  
      } catch (e) {
        console.error("Error in sync and load data: ", e);
      }
    };
  
    syncAndLoadData();
  
    const syncInterval = setInterval(() => {
      syncAndLoadData();
    }, 1000 * 60 * 15); // 15 minutes
  
    return () => {
      console.log('Clearing sync interval');
      clearInterval(syncInterval);
    };
  }, []); // Empty dependency array to prevent infinite loops  

  return (
    <View style={styles.container}>
      <Text>Visualize Screen</Text>
      <Text>{lastSync}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
