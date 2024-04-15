import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import DisplayPitData from "../../models/DisplayPitData";
import DisplayStatsData from "../../models/DisplayStatsData";
import { PitModel } from "../../models/PitModel";
import { DataContext } from "../../contexts/DataContext";
import MatchView from "./MatchView";
import ModalHeader from "../components/ModalHeader";
import { doc } from "firebase/firestore";
import { db } from "../../firebase";
import { deleteTeamFromFirebase } from "../../services/FirebaseService";
import EditPitDataScreen from "./EditPitDataScreen";
import { syncData, updateLastSyncTime } from "../../services/SyncService";
import { saveDataLocally } from "../../services/LocalStorageService";
import { Platform } from "react-native";
import PhotoScreen from "./PhotoScreen";
import { AuthContext, Role } from "../../contexts/AuthContext";
export type RootDrawerParamList = {
  Teams: { team: PitModel };
};

const TeamScreen: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    name,
    setName,
    email,
    setEmail,
    isLoggedIn,
    id: userId,
    insightsRole,
    setInsightsRole,
    team,
  } = useContext(AuthContext);

  const {
    teams,
    setTeams,
    lastSync,
    setLastSync,
    selectedTeam,
    setSelectedTeam,
  } = useContext(DataContext);
  const [visible1, setVisible1] = useState(false);
  const [input, setInput] = useState("");

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
      ([sectionKey, stats], sectionIndex) => {
        if (sectionKey === "AutoPositionFrequency") {
          // Handle PositionFrequency section differently
          const positionStats = stats.map((stat) => {
            //@ts-ignore
            const value = stat.func(matches);
            const displayValue =
              typeof value === "number" ? value.toFixed(0) : value;
            return {
              label: stat.label,
              value: displayValue,
              unit: stat.unit,
            };
          });

          return (
            <View key={sectionIndex} style={styles.dataCard}>
              <Text style={styles.sectionTitle}>
                {sectionKey.replace(/([A-Z])/g, " $1").trim()}
              </Text>
              <View style={styles.detailRow}>
                {positionStats.map((stat, statIndex) => (
                  <View key={statIndex} style={styles.positionStat}>
                    <Text style={styles.detailLabel}>{stat.label}:</Text>
                    <Text style={styles.detailValue}>{`${stat.value}${
                      stat.unit ? ` ${stat.unit}` : ""
                    }`}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        } else {
          // Render other sections as a list
          return (
            <View key={sectionIndex} style={styles.dataCard}>
              <Text style={styles.sectionTitle}>
                {sectionKey.replace(/([A-Z])/g, " $1").trim()}
              </Text>
              {stats.map((stat, statIndex) => {
                //@ts-ignore
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
          );
        }
      }
    );
  };

  const handleOpenDialog = () => {
    setVisible1(true);
  };

  const handleCloseDialog = async () => {
    if (input === selectedTeam?.TeamNumber.toString()) {
      await confirmDelete();
    } else {
      Alert.alert("Error", "Incorrect team number");
    }
    setVisible1(false);
    setInput("");
  };

  const openPhoto = () => {
    setPhotoModalVisible(true);
  };

  const handleCancel = () => {
    setVisible1(false);
    setInput("");
  };

  const confirmDelete = async () => {
    try {
      const teamRef = doc(
        db,
        `${team}teams`,
        selectedTeam?.TeamNumber.toString() || ""
      );
      setLoading(true);
      const resp = await deleteTeamFromFirebase(teamRef, team);
      setLoading(false);
      const syncResult = await syncData(team);
      if (syncResult.success && syncResult.data && resp.success) {
        setTeams(syncResult.data);
        saveDataLocally("fetchedData", syncResult.data);
        setSelectedTeam(undefined);
        updateLastSyncTime();
      }
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  const handleDeleteTeam = async () => {
    if (!selectedTeam) {
      Alert.alert("Error", "No team selected");
      return;
    }

    if (Platform.OS === "ios") {
      Alert.prompt(
        "Confirm Delete",
        "Enter the team number to delete",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: async (text) => {
              if (text === selectedTeam.TeamNumber.toString()) {
                await confirmDelete();
              } else {
                Alert.alert("Error", "Incorrect team number");
              }
            },
          },
        ],

        "plain-text",
        "",
        "number-pad"
      );
    } else {
      handleOpenDialog();
    }
  };

  if (!selectedTeam) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No team data available</Text>
        <Text>Please select a team</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#F6EB14" />
          </View>
        )}
        <View style={styles.teamHeader}>
          <Text style={styles.headerTitle}>
            {selectedTeam ? selectedTeam.TeamName : "Team Details"} - Summary
          </Text>
        </View>
        <TouchableOpacity onPress={() => openPhoto()}>
          <View style={styles.butHeader}>
            <Text style={styles.butTitle}>Photos</Text>
          </View>
        </TouchableOpacity>
        {renderRobotDetails()}
        {(selectedTeam.matches?.length ?? 0) > 0 && renderStats()}
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <View style={styles.butHeader}>
            <Text style={styles.butTitle}>
              {selectedTeam ? selectedTeam.TeamName : "Team Details"} - All
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
          <MatchView />
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
        <Modal
          visible={photoModalVisible}
          onRequestClose={() => setPhotoModalVisible(false)}
          animationType="slide"
        >
          <ModalHeader
            title="Photos"
            onClose={() => setPhotoModalVisible(false)}
          />
          {selectedTeam && <PhotoScreen team={selectedTeam} />}
        </Modal>
        {!(insightsRole == Role.VIEW) && (
          <>
            <TouchableOpacity onPress={() => setEditModalVisible(true)}>
              <View style={styles.butHeader}>
                <Text style={styles.butTitle}>
                  {selectedTeam ? selectedTeam.TeamName : "Team Details"} - Edit
                  Pit Data
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteTeam}
            >
              <Text style={styles.deleteButtonText}>Delete Team</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
  },
  positionStat: {
    flex: 1,
    flexDirection: "row",
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
