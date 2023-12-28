import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MatchModel } from '../../models/MatchModel';
import displayMatchData from '../../models/DisplayMatchData';
import GamePieceGrid from '../components/GamePeiceGrid';
import Icon from '@expo/vector-icons/Ionicons';

interface MatchViewProps {
  matches: MatchModel[] | undefined;
}

const MatchView: React.FC<MatchViewProps> = ({ matches }) => {
  const [selectedMatchNumber, setSelectedMatchNumber] = useState<number | null>(null);

  const toggleMatchDetails = (matchNumber: number) => {
    setSelectedMatchNumber(selectedMatchNumber === matchNumber ? null : matchNumber);
  };

  const renderMatchDetails = (match: MatchModel) => (
    <View style={styles.matchDetailsCard}>
      {displayMatchData(match).map((item, idx) => (
        <View key={idx} style={styles.detailRow}>
          <Text style={styles.detailLabel}>{item.label}:</Text>
          <Text style={styles.detailValue}>{item.value}</Text>
        </View>
      ))}
      <GamePieceGrid gridData={match.GamePiecesGrid} />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {matches?.map((match, index) => (
        <View key={index}>
          <TouchableOpacity
            onPress={() => toggleMatchDetails(match.MatchNumber)}
            style={styles.teamButton}
          >
            <Text style={styles.matchButton}>Match {match.MatchNumber}</Text>
            <Icon name={selectedMatchNumber === match.MatchNumber ? "chevron-up-outline" : "chevron-down-outline"} size={20} color="#F6EB14" />
          </TouchableOpacity>
          {selectedMatchNumber === match.MatchNumber && renderMatchDetails(match)}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-start', // Ensure alignment when text wraps
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
    flexShrink: 1, // Allows the label to shrink if necessary, but not wrap
  },
  detailValue: {
    color: '#555',
    flex: 1, // Allows the value to grow and wrap
    textAlign: 'left', // Align text to the left
  },
  matchDetailsCard: {
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
  teamButton: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  matchButton: {
    fontSize: 18,
    color: '#F6EB14',
  },
  // ... any additional styles
});

export default MatchView;
