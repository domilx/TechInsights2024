import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import displayPitData from "../../models/DisplayPitData";
import { Picker } from "@react-native-picker/picker";
import { PitModel } from "../../models/PitModel";
import { MatchModel } from "../../models/MatchModel";
import displayMatchData from "../../models/DisplayMatchData";
import Icon from "@expo/vector-icons/Ionicons";
import {
  getMatchesPlayed,
  getMatchesWon,
  getCurrentRankingPoints,
  getAverageRankingPoints,
  getAverageCycleTime,
  getMostFrequentAutoPosition,
  getAutoMobilityPercentage,
  getAutoAverageScore,
  getAverageAutoGamePieces,
  getAverageAutoObjectivesAchieved,
  getAverageTeleopGamePiecesScored,
  getMaxGamePieces,
  getMinGamePieces,
  getStandardDeviationOfGamePieces,
  getAverageDroppedGamePieces,
  getTimesIncapacitated,
  getTimesRobotFalls,
  getAverageRobotTippyScore,
  getAveragePlaysDefenseScore,
  getAverageRobotFieldAwareness,
  getAverageRobotQuickness
} from '../../models/StatsCalculations';
import { initialPitData } from "../../models/PitModel";

const TeamScreen = ({ route }: any) => {
  const team: PitModel = route.params?.team || initialPitData;
  const [selectedMatch, setSelectedMatch] = useState<MatchModel | undefined>(
    team?.matches?.[0]
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const matches = team?.matches || [];

  if (team == initialPitData) {
    return (
      <View style={styles.noTeamContainer}>
        <Text>Please select a team to view its stats</Text>
      </View>
    );
  }

  const ModalHeader = () => {
    return (
      <View style={styles.modalHeader}>
        <TouchableOpacity
          style={styles.backButtonWrapper}
          onPress={() => setIsModalVisible(false)}
        >
          <Icon name="chevron-back" size={30} color="#F6EB14" />
          <Text style={{ color: "#F6EB14", marginLeft: 5 }}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.modalHeaderText}>Match Details</Text>
      </View>
    );
  };

  const teamData = displayPitData(team);

  const renderRobotDetails = (startIndex: number, endIndex: number) => (
    <View style={styles.robotDetails}>
      {teamData.slice(startIndex, endIndex).map((item, index) => (
        <View key={index} style={{ flexDirection: "row", paddingVertical: 2 }}>
          <Text style={styles.detailItem}>{item.label}: </Text>
          <Text style={styles.detailItem}>{item.value}</Text>
        </View>
      ))}
    </View>
  );

  const renderMatchDetails = (match: MatchModel) => {
    return (
      <View style={styles.matchDetails}>
        {displayMatchData(match).map((item, idx) => (
          <View key={idx} style={{ flexDirection: "row", paddingVertical: 2 }}>
            <Text style={styles.detailItem}>{item.label}:</Text>
            <Text style={styles.detailItem}>{item.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  

  const handleMatchSelect = (match: MatchModel) => {
    setSelectedMatch(match);
    renderMatchDetails(match);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.teamHeader}>
        <Text style={styles.teamTitle}>{team.RobTeamNm} Summary Screen</Text>
      </View>

      {renderRobotDetails(0, 2)}
      {renderRobotDetails(3, 5)}
      {renderRobotDetails(5, 6)}
      {renderRobotDetails(6, 10)}
      {renderRobotDetails(10, 26)}

      {/* Robot Statistics */}

      <View style={styles.teamHeader}>
        <Text style={styles.teamTitle}>{team.RobTeamNm} Robot Statistics</Text>
      </View>

      <View style={styles.robotDetails}>
        <Text style={styles.detailItem}>Matches Played: {getMatchesPlayed(matches)}</Text>
      </View>

      <TouchableOpacity
        style={styles.selectTeam}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={{ color: "#F6EB14", fontWeight: "bold" }}>
          View Individual Matches
        </Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible}>
        <ModalHeader />
        <ScrollView>
          <View style={styles.modal}>
            {team.matches?.map((match: any, index: any) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleMatchSelect(match)}
                style={styles.teamButton}
              >
                <Text style={styles.matchButton}>
                  Match {match.MatchNumber}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedMatch && renderMatchDetails(selectedMatch)}
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  noTeamContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    backgroundColor: "#FFF",
  },
  teamHeader: {
    alignItems: "flex-start",
    padding: 10,
  },
  teamButton: {
    color: "#F6EB14",
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  teamTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  matchButton: {
    fontSize: 18,
    color: "#F6EB14",
  },
  robotImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  modal: {
    paddingVertical: 20,
    justifyContent: "center",
    color: "#F6EB14",
  },
  matchDropdown: {
    margin: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    padding: 5,
    backgroundColor: "#f9f9f9",
  },
  modalHeader: {
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center", // Centers items horizontally in the container
    justifyContent: "center", // Centers items vertically in the container    alignItems: "center",
    padding: 15,
    backgroundColor: "#1E1E1E",
  },
  modalHeaderText: {
    fontSize: 16,
    color: "#F6EB14",
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 30,
  },
  teambutton: {
    color: "#F6EB14",
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  matchDetails: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  robotDetails: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  detailItem: {
    fontSize: 18,
  },
  robotCapabilities: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  matchPerformance: {
    padding: 20,
  },
  backButtonWrapper: {
    flexDirection: "row", // Aligns items in a row
    alignItems: "center", // Centers items vertically in the container
    position: "absolute",
    left: 10,
    top: 45,
  },
  selectTeam: {
    color: "#F6EB14",
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
});

export default TeamScreen;
