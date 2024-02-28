import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PitModel } from '../../../models/PitModel';
import { getAvgTotalPoints, getAvgTotalTeleopPoints, getAvgTotalAutoPoints, getAvgTotalEndGamePoints } from '../../../models/StatsCalculations';

interface TableProps {
  data: PitModel[];
}

const ScoreTable: React.FC<TableProps> = ({ data }) => {
  // Sort data based on Avg Total Points in descending order using the matches property
  const sortedData = [...data].sort((a, b) => {
    const avgPointsB = Number(getAvgTotalPoints(b.matches || []));
    const avgPointsA = Number(getAvgTotalPoints(a.matches || []));
    return avgPointsB - avgPointsA;
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Average Points Scored</Text>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Team #</Text>
        <Text style={styles.headerCell}>Total</Text>
        <Text style={styles.headerCell}>Teleop</Text>
        <Text style={styles.headerCell}>Auto</Text>
        <Text style={styles.headerCell}>Endgame</Text>
      </View>
      {sortedData.map((pit, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{pit.TeamNumber}</Text>
          <Text style={styles.cell}>{getAvgTotalPoints(pit.matches || [])}</Text>
          <Text style={styles.cell}>{getAvgTotalTeleopPoints(pit.matches || [])}</Text>
          <Text style={styles.cell}>{getAvgTotalAutoPoints(pit.matches || [])}</Text>
          <Text style={styles.cell}>{getAvgTotalEndGamePoints(pit.matches || [])}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0', // Added a background color for header row for distinction
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default ScoreTable;
