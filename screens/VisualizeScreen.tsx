import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { DataContext } from "../contexts/DataContext";
import { saveDataLocally } from "../services/LocalStorageService";
import { syncData } from "../services/SyncService";

export default function VisualizeScreen() {
  const { teams, setTeams, lastSync, setLastSync, isTeamSelected, setIsTeamSelected } = useContext(DataContext);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const defaultTeamName = "Default Team";

  useEffect(() => {
    const syncAndLoadData = async () => {
      try {
        const response = await syncData();
        if (response.success && response.data) {
          setTeams(response.data);
          setLastSync(new Date().toISOString());
          saveDataLocally("fetchedData", response.data);
        }
        
        const teamsData = await AsyncStorage.getItem("fetchedData");
        if (teamsData) {
          setTeams(JSON.parse(teamsData));
        }

        const lastSyncTime = await AsyncStorage.getItem("lastSyncTime");
        if (lastSyncTime) {
          const formattedLastSyncTime = lastSyncTime.replace(/['"]+/g, "");
          setLastSync(formattedLastSyncTime);
        }
      } catch (e) {
        console.error("Error in sync and load data: ", e);
      }

      if (selectedTeam !== "Default Team" && selectedTeam !== null) {
        setIsTeamSelected(true);
      } else {
        setIsTeamSelected(false);
      }

      if (selectedTeam === null) {
        setSelectedTeam(defaultTeamName);
      }
    };

    syncAndLoadData();

    const syncInterval = setInterval(() => {
      syncAndLoadData();
    }, 1000 * 60 * 15); // 15 minutes

    return () => clearInterval(syncInterval);
  }, [selectedTeam, teams, lastSync]);

  return (
    <View style={styles.container}>
      <Text>Visualize Screen</Text>
      <Text>{lastSync}</Text>
      <Text>{isTeamSelected ? "Team is selected" : "Team is not selected"}</Text>
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
