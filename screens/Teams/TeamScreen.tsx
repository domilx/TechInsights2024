import React, { FC, useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import DisplayPitData from "../../models/DisplayPitData";
import DisplayStatsData from "../../models/DisplayStatsData";
import { PitModel } from "../../models/PitModel";
import Icon from "@expo/vector-icons/Ionicons";
import { DataContext } from "../../contexts/DataContext";
import MatchView from "./MatchView";
import ModalHeader from "../components/ModalHeader";
import { doc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  deletePitDataFromFirebase,
  deleteTeamFromFirebase,
} from "../../services/FirebaseService";
import EditPitDataScreen from "./EditPitDataScreen";
import { syncData } from "../../services/SyncService";
import { saveDataLocally } from "../../services/LocalStorageService";

export type RootDrawerParamList = {
  Teams: { team: PitModel };
};

interface TeamScreenProps {
  route: any;
}

const TeamScreen: FC<TeamScreenProps> = ({ route }) => {
  const [selectedTeam, setSelectedTeam] = useState<PitModel | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { teams, setTeams, lastSync, setLastSync } = useContext(DataContext);

  useEffect(() => {
    const teamFromRoute = route.params?.team;
    setSelectedTeam(teamFromRoute || (teams.length > 0 ? teams[0] : undefined));
  }, [route.params?.team, teams]);

  const renderRobotDetails = () => {
    if (!selectedTeam) {
      return <Text style={styles.noDataText}>No team data available</Text>;
    }

    const teamData = DisplayPitData(selectedTeam);
    return Object.entries(teamData).map(([sectionKey, details], index) => (
      <View key={index} style={styles.dataCard}>
        <Text style={styles.sectionTitle}>
          {sectionKey.replace(/([A-Z])/g, " $1").trim()}
        </Text>
        {details.map((detail, detailIndex) => (
          <View key={detailIndex} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{detail.label}:</Text>
            <Text style={styles.detailValue}>{`${detail.value}${
              detail.unit ? ` ${detail.unit}` : ""
            }`}</Text>
          </View>
        ))}
      </View>
    ));
  };

  const renderStats = () => {
    const matches = selectedTeam?.matches || [];

    return Object.entries(DisplayStatsData).map(
      ([sectionKey, stats], sectionIndex) => (
        <View key={sectionIndex} style={styles.dataCard}>
          <Text style={styles.sectionTitle}>
            {sectionKey.replace(/([A-Z])/g, " $1").trim()}
          </Text>
          {stats.map((stat, statIndex) => {
            const value = stat.func(matches);
            const displayValue =
              typeof value === "number" ? value.toFixed(2) : value;
            return (
              <View key={statIndex} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{stat.label}:</Text>
                <Text style={styles.detailValue}>{`${displayValue}${
                  stat.unit ? ` ${stat.unit}` : ""
                }`}</Text>
              </View>
            );
          })}
        </View>
      )
    );
  };

  const handleDeletePitData = async () => {
    if (!selectedTeam) {
      Alert.alert("Error", "No team selected");
      return;
    }

    Alert.alert(
      "Delete Pit Data",
      "Are you sure you want to delete pit data for the selected team?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              const teamRef = doc(db, "teams", selectedTeam.TeamNb.toString());
              const response = await deletePitDataFromFirebase(teamRef);
              Alert.alert(
                response.success ? "Success" : "Error",
                response.message
              );
              const syncResult = await syncData();
              if (syncResult.success && syncResult.data) {
                setTeams(syncResult.data);
                setLastSync(new Date().toISOString());
                // Save the updated teams data locally
                saveDataLocally("fetchedData", syncResult.data);
              }
            } catch (error) {
              Alert.alert("Error", (error as Error).message);
            }
          },
        },
      ]
    );
  };

  const handleDeleteTeam = async () => {
    if (!selectedTeam) {
      Alert.alert("Error", "No team selected");
      return;
    }

    Alert.alert(
      "Delete Team",
      "Are you sure you want to delete the selected team?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              const teamRef = doc(db, "teams", selectedTeam.TeamNb.toString());
              await deleteTeamFromFirebase(teamRef);
              const syncResult = await syncData();
              if (syncResult.success && syncResult.data) {
                setTeams(syncResult.data);
                setLastSync(new Date().toISOString());
                // Save the updated teams data locally
                saveDataLocally("fetchedData", syncResult.data);
              }
            } catch (error) {
              Alert.alert("Error", (error as Error).message);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.teamHeader}>
        <Text style={styles.headerTitle}>
          {selectedTeam ? selectedTeam.RobTeamNm : "Team Details"} - Summary
        </Text>
      </View>
      {renderRobotDetails()}
      <View style={styles.teamHeader}>
        <Text style={styles.headerTitle}>
          {selectedTeam ? selectedTeam.RobTeamNm : "Team Details"} - Stats
        </Text>
      </View>
      {renderStats()}
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <View style={styles.butHeader}>
          <Text style={styles.butTitle}>
            {selectedTeam ? selectedTeam.RobTeamNm : "Team Details"} - All
            Matches
          </Text>
        </View>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="slide"
      >
        <ModalHeader
          title="All Matches"
          onClose={() => setIsModalVisible(false)}
        />
        <MatchView matches={selectedTeam?.matches || []} />
      </Modal>
      <Modal
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
        animationType="slide"
      >
        <ModalHeader
          title="Edit Pit Data"
          onClose={() => setEditModalVisible(false)}
        />
        {selectedTeam && <EditPitDataScreen team={selectedTeam} />}
      </Modal>
      <TouchableOpacity onPress={() => setEditModalVisible(true)}>
        <View style={styles.butHeader}>
          <Text style={styles.butTitle}>
            {selectedTeam ? selectedTeam.RobTeamNm : "Team Details"} - Edit Pit
            Data
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeletePitData}
      >
        <Text style={styles.deleteButtonText}>Delete Pit Data</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteTeam}>
        <Text style={styles.deleteButtonText}>Delete Team</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
  },
  teamHeader: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center", // Center the text horizontally
  },
  deleteButton: {
    backgroundColor: "red", // Choose a color that indicates a delete action
    padding: 15,
    borderRadius: 8,
    margin: 10,
    alignItems: "center", // Center the text horizontally
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    color: "#fff", // Text color that contrasts with the button's background
    fontSize: 18,
    fontWeight: "bold",
  },
  butHeader: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: "#1E1E1E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center", // Center the text horizontally
  },
  headerTitle: {
    fontSize: 22, // Increased font size
    color: "#333",
    fontWeight: "bold",
    textAlign: "center", // Center the text within the view
  },
  teamTitle: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  butTitle: {
    fontSize: 18,
    color: "#F6EB14",
    fontWeight: "bold",
  },
  dataCard: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#333",
    marginRight: 5,
    flexShrink: 1,
  },
  detailValue: {
    color: "#555",
    flex: 1,
    textAlign: "left",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
    padding: 20,
  },
});

export default TeamScreen;
