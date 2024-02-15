import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { MatchModel } from "../../models/MatchModel";
import displayMatchData from "../../models/DisplayMatchData";
import Icon from "@expo/vector-icons/Ionicons";
import ModalHeader from "../components/ModalHeader";
import EditMatchDataScreen from "./EditMatchDataScreen";
import { PitModel } from "../../models/PitModel";
import { doc } from "firebase/firestore";
import { db } from "../../firebase";
import { deleteMatchDataFromFirebase } from "../../services/FirebaseService";
import { syncData } from "../../services/SyncService";
import { DataContext } from "../../contexts/DataContext";
import { saveDataLocally } from "../../services/LocalStorageService";

interface MatchViewProps {
  matches: MatchModel[] | undefined;
  team: PitModel;
}

const MatchView: React.FC = () => {
  const [selectedMatchNumber, setSelectedMatchNumber] = useState<number | null>(
    null
  );
  const [editModalVisible, setEditModalVisible] = useState(false);
  const toggleMatchDetails = (matchNumber: number) => {
    setSelectedMatchNumber(
      selectedMatchNumber === matchNumber ? null : matchNumber
    );
  };
  const {
    teams,
    setTeams,
    lastSync,
    setLastSync,
    selectedTeam,
    setSelectedTeam,
  } = useContext(DataContext);

  const handleDeleteMatch = async () => {
    try {
        Alert.alert(
          "Confirm Delete",
          "Are you sure you want to delete this match?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            { text: "OK", onPress: () => confirmDelete() },
          ]
        );
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteMatchDataFromFirebase(selectedTeam?.TeamNumber || 0, selectedMatchNumber?.toString() || "");
      const syncResult = await syncData();
      if (syncResult.success && syncResult.data) {
        setTeams(syncResult.data);
        setLastSync(new Date().toISOString());
        saveDataLocally("fetchedData", syncResult.data);
        setSelectedTeam(undefined);
      }
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  const renderMatchDetails = (match: MatchModel) => (
    <View style={styles.matchDetailsCard}>
      {displayMatchData(match).map((item, idx) => (
        <View key={idx} style={styles.detailRow}>
          <Text style={styles.detailLabel}>{item.label}:</Text>
          <Text style={styles.detailValue}>{item.value}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.editMatch} onPress={() => setEditModalVisible(true)}>
        <Text style={styles.deleteButtonText}>Edit Match Data</Text>
      </TouchableOpacity>

      <Modal
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
        animationType="slide"
      >
        <ModalHeader
          title="Edit Pit Data"
          onClose={() => setEditModalVisible(false)}
        />
       {<EditMatchDataScreen match={match} />}

      </Modal>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteMatch}>
        <Text style={styles.deleteButtonText}>Delete Match</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {selectedTeam?.matches?.map((match, index) => (
        <View key={index}>
          <TouchableOpacity
            onPress={() => toggleMatchDetails(match.MatchNumber)}
            style={styles.teamButton}
          >
            <Text style={styles.matchButton}>Match {match.MatchNumber}</Text>
            <Icon
              name={
                selectedMatchNumber === match.MatchNumber
                  ? "chevron-up-outline"
                  : "chevron-down-outline"
              }
              size={20}
              color="#F6EB14"
            />
          </TouchableOpacity>
          {selectedMatchNumber === match.MatchNumber &&
            renderMatchDetails(match)}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "flex-start", // Ensure alignment when text wraps
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#333",
    marginRight: 5,
    flexShrink: 1, // Allows the label to shrink if necessary, but not wrap
  },
  detailValue: {
    color: "#555",
    flex: 1, // Allows the value to grow and wrap
    textAlign: "left", // Align text to the left
  },
  matchDetailsCard: {
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
  teamButton: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 10,
  },
  matchButton: {
    fontSize: 18,
    color: "#F6EB14",
  },
  editMatch: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 10,
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
});

export default MatchView;
