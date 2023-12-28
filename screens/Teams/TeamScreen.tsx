import React, { FC, useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import DisplayPitData from '../../models/DisplayPitData';
import DisplayStatsData from '../../models/DisplayStatsData';
import { PitModel } from '../../models/PitModel';
import Icon from '@expo/vector-icons/Ionicons';
import { DataContext } from '../../contexts/DataContext';
import MatchView from './MatchView';

export type RootDrawerParamList = {
  Teams: { team: PitModel };
};

interface TeamScreenProps {
  route: any;
}

const TeamScreen: FC<TeamScreenProps> = ({ route }) => {
  const { teams } = useContext(DataContext);
  const [selectedTeam, setSelectedTeam] = useState<PitModel | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        <Text style={styles.sectionTitle}>{sectionKey.replace(/([A-Z])/g, ' $1').trim()}</Text>
        {details.map((detail, detailIndex) => (
          <View key={detailIndex} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{detail.label}:</Text>
            <Text style={styles.detailValue}>{`${detail.value}${detail.unit ? ` ${detail.unit}` : ''}`}</Text>
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
          <Text style={styles.sectionTitle}>{sectionKey.replace(/([A-Z])/g, ' $1').trim()}</Text>
          {stats.map((stat, statIndex) => {
            const value = stat.func(matches);
            const displayValue =
              typeof value === 'number' ? value.toFixed(2) : value;
            return (
              <View key={statIndex} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{stat.label}:</Text>
                <Text style={styles.detailValue}>{`${displayValue}${stat.unit ? ` ${stat.unit}` : ''}`}</Text>
              </View>
            );
          })}
        </View>
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.teamHeader}>
        <Text style={styles.headerTitle}>
          {selectedTeam ? selectedTeam.RobTeamNm : 'Team Details'} - Summary
        </Text>
      </View>
      {renderRobotDetails()}
      <View style={styles.teamHeader}>
        <Text style={styles.headerTitle}>
          {selectedTeam ? selectedTeam.RobTeamNm : 'Team Details'} - Stats
        </Text>
      </View>
      {renderStats()}
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <View style={styles.butHeader}>
          <Text style={styles.butTitle}>
            {selectedTeam ? selectedTeam.RobTeamNm : 'Team Details'} - All Matches
          </Text>
        </View>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType='slide'
      >
        <ModalHeader onClose={() => setIsModalVisible(false)} />
        <MatchView matches={selectedTeam?.matches || []} />
      </Modal>
    </ScrollView>
  );
};

const ModalHeader: FC<{ onClose: () => void }> = ({ onClose }) => (
  <View style={styles.modalHeader}>
    <TouchableOpacity style={styles.backButtonWrapper} onPress={onClose}>
      <Icon name="chevron-back" size={30} color="#F6EB14" />
      <Text style={styles.backButtonText}>Back</Text>
    </TouchableOpacity>
    <Text style={styles.modalHeaderText}>Match Details</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
  },
  teamHeader: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center', // Center the text horizontally
  },
  butHeader: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#1E1E1E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center', // Center the text horizontally
  },
  headerTitle: {
    fontSize: 22, // Increased font size
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center', // Center the text within the view
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
  modal: {
    paddingVertical: 20,
    justifyContent: "center",
    color: "#F6EB14",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  teamTitle: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  butTitle: {
    fontSize: 18,
    color: '#F6EB14',
    fontWeight: 'bold',
  },
  dataCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
    flexShrink: 1,
  },
  detailValue: {
    color: '#555',
    flex: 1,
    textAlign: 'left',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    padding: 20,
  },
});

export default TeamScreen;
