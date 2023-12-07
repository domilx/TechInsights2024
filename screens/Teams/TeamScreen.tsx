import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import displayPitData from "../../models/DisplayPitData";
import { Picker } from "@react-native-picker/picker";
import { PitModel } from "../../models/PitModel";
import { MatchModel } from "../../models/MatchModel";
interface TeamScreenProps {
  route: {
    params: {
      team: PitModel | null;
    };
  };
}

const TeamScreen: React.FC<TeamScreenProps> = ({ route }) => {
  const team = route.params?.team;
  const [selectedMatch, setSelectedMatch] = useState<MatchModel | undefined>(
    team?.matches?.[0]
  );

  if (!team) {
    return (
      <View style={styles.noTeamContainer}>
        <Text>Please select a team to view its stats</Text>
      </View>
    );
  }

  const teamData = displayPitData(team);

  const renderRobotDetails = (startIndex: number, endIndex: number) => (
    <View style={styles.robotDetails}>
      {teamData.slice(startIndex, endIndex).map((item, index) => (
        <View key={index} style={{ flexDirection: "row", paddingVertical: 2 }}>
          <Text style={styles.detailItem}>{item.label}:</Text>
          <Text style={styles.detailItem}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
  
  const handleMatchSelection = (matchNumber: number) => {
    // Find the selected match from the matches array
    const selected = team.matches?.find(
      (match) => match.MatchNumber === matchNumber
    );

    // Set the selected match state
    setSelectedMatch(matchNumber === -1 ? undefined : selected);
  };

  const renderMatchDetails = (match?: MatchModel) => {
    return match ? (
      <View style={styles.matchDetails}>
        <Text>Scout Name: {match.ScoutName}</Text>
        {/* Add other match properties here */}
      </View>
    ) : null;
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

      <View style={styles.matchDropdown}>
        <Picker
          selectedValue={selectedMatch?.MatchNumber ?? -1}
          onValueChange={handleMatchSelection}
        >
          <Picker.Item label="No Match Selected" value={-1} />
          {team.matches?.map((match) => (
            <Picker.Item
              key={match.MatchNumber}
              label={`Match ${match.MatchNumber}`}
              value={match.MatchNumber}
            />
          ))}
        </Picker>
      </View>

      {selectedMatch && renderMatchDetails(selectedMatch)}
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
  teamTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  robotImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  matchDropdown: {
    margin: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    padding: 5,
    backgroundColor: "#f9f9f9",
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
  // Additional styles as needed
});

export default TeamScreen;
