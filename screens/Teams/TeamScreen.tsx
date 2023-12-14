import React, { FC, useEffect, useState } from "react";
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
import { initialPitData } from "../../models/PitModel";
import DisplayStatsData from "../../models/DisplayStatsData";
import GamePieceGrid from "../components/GamePeiceGrid";
import { DataContext } from "../../contexts/DataContext";
import { useContext } from "react";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RouteProp } from "@react-navigation/native";

export type RootDrawerParamList = {
  Teams: { team: PitModel };
  // ... other screens as needed
};

type TeamScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Teams'>;
type TeamScreenRouteProp = RouteProp<RootDrawerParamList, 'Teams'>;

interface MatchListProps {
  matches: MatchModel[];
  selectedMatch: MatchModel | undefined;
  onMatchSelect: (match: MatchModel) => void;
}

interface TeamScreenProps {
  route: TeamScreenRouteProp;
}

const TeamScreen: FC<TeamScreenProps> = ({ route }) => {  
  const { teams } = useContext(DataContext);
  const [selectedTeam, setSelectedTeam] = useState<PitModel | undefined>();  const [selectedMatch, setSelectedMatch] = useState<MatchModel | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Check if a team is passed through navigation, otherwise use context
    const teamFromRoute = route.params?.team;
    if (teamFromRoute) {
      setSelectedTeam(teamFromRoute);
    } else {
      // If no team is passed, you might want to handle this case differently
      setSelectedTeam(teams.length > 0 ? teams[0] : undefined);
    }
  }, [route.params?.team, teams]);

  const teamData = selectedTeam ? displayPitData(selectedTeam) : null;
  const matches = selectedTeam?.matches || [];
  
  const isSynced = selectedTeam !== initialPitData && matches.length > 0;

  if (!selectedTeam) {
    return (
      <View style={styles.noTeamContainer}>
        <Text>Please select a team to view its stats</Text>
      </View>
    );
  }

  const renderRobotDetails = (startIndex: number, endIndex: number) => {
    if (!teamData) {
      return <Text>No team data available</Text>;
    }
  
    // Render a slice of teamData details based on startIndex and endIndex
    return (
      <View style={styles.robotDetails}>
        {teamData.slice(startIndex, endIndex).map((item, index) => (
          <View key={index} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{item.label}: </Text>
            <Text style={styles.detailValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    );
  };
  

  const renderStats = () => {
    return DisplayStatsData.map((stat, index) => {
      const value = stat.func(matches);
      return (
        <View key={index} style={styles.statRow}>
          <Text style={styles.statLabel}>{stat.label}:</Text>
          <Text style={styles.statValue}>{value}</Text>
        </View>
      );
    });
  };

  const handleMatchSelect = (match: MatchModel) => {
    setSelectedMatch(match);
    renderMatchDetails(match);
  };
  
  const renderMatchDetails = (match: MatchModel) => (
    <View style={styles.matchDetails}>
      {displayMatchData(match).map((item, idx) => (
        <View key={idx} style={styles.detailRow}>
          <Text>{item.label}:</Text>
          <Text>{item.value}</Text>
        </View>
      ))}
      <GamePieceGrid gridData={match.GamePiecesGrid} />
    </View>
  );
  
  return (
    <>
      <ModalOpener onPress={() => setIsModalVisible(true)} />
      {selectedTeam  ? (
        <ScrollView style={styles.scrollView}>
          <TeamHeader title={`${selectedTeam.RobTeamNm} Summary `} />
          {renderRobotDetails(0, 2)}
          {renderRobotDetails(3, 5)}
          {renderRobotDetails(6, 10)}
          {renderRobotDetails(11, 26)}

          <View style={styles.statsContainer}>
          {renderStats()}
        </View>
          <Modal
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <ModalHeader onClose={() => setIsModalVisible(false)} />
            <ScrollView>
              <View style={styles.modal}>
                {selectedTeam.matches?.map((match: any, index: any) => (
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
      ) : (
        <NoTeamView />
      )}
    </>
  );
};

const ModalOpener: FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity style={styles.modalOpener} onPress={onPress}>
    <Icon name="list" size={30} color="#F6EB14" />
    <Text style={styles.modalOpenerText}>Matches</Text>
  </TouchableOpacity>
);

const TeamHeader: FC<{ title: string }> = ({ title }) => (
  <View style={styles.teamHeader}>
    <Text style={styles.teamTitle}>{title}</Text>
  </View>
);

const ModalHeader: FC<{ onClose: () => void }> = ({ onClose }) => (
  <View style={styles.modalHeader}>
    <TouchableOpacity style={styles.backButtonWrapper} onPress={onClose}>
      <Icon name="chevron-back" size={30} color="#F6EB14" />
      <Text style={styles.backButtonText}>Back</Text>
    </TouchableOpacity>
    <Text style={styles.modalHeaderText}>Match Details</Text>
  </View>
);

const MatchList: FC<MatchListProps> = ({
  matches,
  selectedMatch,
  onMatchSelect,
}) => (
  <View style={styles.matchList}>
    <Picker
      selectedValue={selectedMatch?.MatchNumber}
      onValueChange={(itemValue, itemIndex) =>
        onMatchSelect(matches[itemIndex])
      }
    >
      {matches.map((match, index) => (
        <Picker.Item
          key={index}
          label={`Match ${match.MatchNumber}`}
          value={match.MatchNumber}
        /> 
      ))}
    </Picker>
  </View>
);

const NoTeamView: FC = () => (
  <View style={styles.noTeamContainer}>
    <Text>Please select a team to view its stats</Text>
  </View>
);

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 3,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10, // Adds some space between the label and the value
  },
  statValue: {
    fontSize: 16,
    color: "#666",
    // Flex grow/shrink can be adjusted if needed to fit the layout
    flexGrow: 1,
    flexShrink: 1,
  },
  modalOpener: {
    position: "absolute",
    top: 20,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOpenerText: {
    color: "#F6EB14",
    marginLeft: 5,
  },
  modal: {
    paddingVertical: 20,
    justifyContent: "center",
    color: "#F6EB14",
  },
  teamHeader: {
    alignItems: "flex-start",
    marginBottom: 10,
  },
  teamTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  robotDetails: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginVertical: 7,
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: 2,
    flexWrap: "wrap",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 5,
  },
  detailValue: {
    fontSize: 16,
    color: "#555",
  },
  matchDetails: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  statsContainer: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginVertical: 10,
  },
  noTeamContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  matchList: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
  },
  teamButton: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  matchButton: {
    fontSize: 18,
    color: "#F6EB14",
  },
  modalHeader: {
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#1E1E1E",
  },
  backButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: 10,
    top: 45,
  },
  backButtonText: {
    color: "#F6EB14",
    marginLeft: 5,
  },
  modalHeaderText: {
    fontSize: 16,
    color: "#F6EB14",
    fontWeight: "bold",
  },
});

export default TeamScreen;
