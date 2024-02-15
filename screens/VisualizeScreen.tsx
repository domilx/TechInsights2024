import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataContext } from "../contexts/DataContext";
import { PitModel } from "../models/PitModel";
import { syncData } from "../services/SyncService";
import Chart1 from "./components/Charts/Chart1";
import Chart2 from "./components/Charts/Chart2";
import Chart3 from "./components/Charts/Chart3";
import ScoreTable from "./components/Charts/ScoreTable";
import { Picker } from "@react-native-picker/picker";

const VisualizeScreen = () => {
  const { teams, setTeams, lastSync, setLastSync } = useContext(DataContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const lastSyncTime = await AsyncStorage.getItem("lastSyncTime");
        if (lastSyncTime) {
          setLastSync(JSON.parse(lastSyncTime));
        }
    
        const teamsData = await AsyncStorage.getItem("fetchedData");
        if (teamsData) {
          const parsedTeamsData: PitModel[] = JSON.parse(teamsData);
          setTeams(parsedTeamsData);
        } else {
          // Handle case where fetchedData is not available
          Alert.alert("Initialization Error", "No initial data found.");
        }
      } catch (error) {
        console.error("Error initializing data: ", error);
        Alert.alert("Initialization Error", "Failed to load initial data.");
      } finally {
        setIsLoading(false);
      }
    };
    
  }, []);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const response = await syncData();
      if (response.success && response.data) {
        setTeams(response.data);
        const newLastSync = new Date().toISOString();
        setLastSync(newLastSync);
        await AsyncStorage.setItem("lastSyncTime", JSON.stringify(newLastSync));
        await AsyncStorage.setItem("fetchedData", JSON.stringify(response.data));
        Alert.alert("Sync Successful", "Data has been updated.");
      } else {
        Alert.alert("Sync Failed", response.message || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Error during sync: ", error);
      Alert.alert("Sync Error", "Failed to sync data.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (teams.length === 0) {
      return <Text style={styles.noDataText}>No teams data available. Please sync to update data.</Text>;
    }

    switch (selectedIndex) {
      case 0:
        return <Chart1 data={teams} />;
      case 1:
        return <Chart2 data={teams} />;
      case 2:
        return <Chart3 data={teams} />;
      case 3:
        return <ScoreTable data={teams} />;
      default:
        return <Text>Select a visualization</Text>;
    }
  };

  const renderSegmentedControl = () => (
    <View style={styles.segmentedControl}>
      {['Chart 1', 'Chart 2', 'Chart 3', 'Score Table'].map((label, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.segmentButton, selectedIndex === index && styles.segmentButtonSelected]}
          onPress={() => setSelectedIndex(index)}
        >
          <Text style={[styles.segmentButtonText, selectedIndex === index && styles.segmentButtonTextSelected]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderSegmentedControl()}
      <View style={styles.contentSection}>
        {renderContent()}
      </View>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      <View style={styles.syncSection}>
        <TouchableOpacity onPress={handleSync} style={styles.syncButton}>
          <Text style={styles.syncButtonText}>Sync Data</Text>
        </TouchableOpacity>
        <Text style={styles.sync}>Last Sync: {lastSync ? new Date(lastSync).toLocaleString() : "Never"}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  sync: {
    textAlign: 'center',
    marginTop: 10,
  },
  syncSection: {
    marginTop: 40,
  },
  syncButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  syncButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  segmentButton: {
    padding: 10,
    flexGrow: 1,
    alignItems: 'center',
  },
  segmentButtonSelected: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
  segmentButtonText: {
    color: 'grey',
  },
  segmentButtonTextSelected: {
    color: 'blue',
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  contentSection: {
    flex: 1,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default VisualizeScreen;
