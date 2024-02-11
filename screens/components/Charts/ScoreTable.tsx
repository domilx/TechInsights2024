import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MatchModel } from '../../../models/MatchModel';
import { getAvgTotalPoints } from '../../../models/StatsCalculations';

interface TableProps {
  data: MatchModel[];
}

const ScoreTable: React.FC<TableProps> = ({ data }) => {
  // Sort data based on Avg Total Points
  const sortedData = [...data].sort((a, b) => getAvgTotalPoints([b]) - getAvgTotalPoints([a]));

  return (
    <ScrollView style={styles.container}>
      {sortedData.map((match, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{match.TeamNumber}</Text>
          <Text style={styles.cell}>{getAvgTotalPoints([match]).toFixed(2)}</Text>
          {/* Additional cells for Avg Teleop, Auto, and Endgame scores can be added here */}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default ScoreTable;
