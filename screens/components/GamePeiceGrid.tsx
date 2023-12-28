import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GamePieceCell } from '../../models/MatchModel';

interface GamePieceGridProps {
  gridData: GamePieceCell[];
}

const GamePieceGrid: React.FC<GamePieceGridProps> = ({ gridData }) => {
  return (
    <View style={styles.gridContainer}>
      {gridData.map((cell, index) => (
        <View key={index} style={styles.cell}>
          <Text style={styles.cellText}>Auto: {cell.autoScored}</Text>
          <Text style={styles.cellText}>Type: {cell.GamePieceType.toString()}</Text>
          <Text style={styles.cellText}>TeleOp: {cell.count}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  cell: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 5,
    width: '30%', // Adjust as needed
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cellText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
});

export default GamePieceGrid;
