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
          <Text>Row: {cell.rowIndex}</Text>
          <Text>Column: {cell.columnIndex}</Text>
          <Text>Auto: {cell.autoScored}</Text>
          <Text>Type: {cell.GamePieceType}</Text>
          <Text>Count: {cell.count}</Text>
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
  },
  cell: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    margin: 5,
    width: '30%', // Adjust as needed
    alignItems: 'center',
  },
});

export default GamePieceGrid;
