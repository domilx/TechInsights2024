import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MatchModel } from '../models/MatchModel';
import { PitModel } from '../models/PitModel';

export default function ConfirmDataScreen({ route }: any) {
  const { data } = route.params;
  
  // Parse the JSON data
  const parsedData = JSON.parse(data);

  // Function to render MatchModel data
  const renderMatchModel = (matchData: MatchModel) => {
    return Object.entries(matchData).map(([key, value], index) => (
      <Text style={styles.text} key={index}>{`${key}: ${value}`}</Text>
    ));
  };

  // Function to render PitModel data
  const renderPitModel = (pitData: PitModel) => {
    return Object.entries(pitData).map(([key, value], index) => (
      <Text style={styles.text} key={index}>{`${key}: ${value}`}</Text>
    ));
  };

  // Check the type of model and render accordingly
  const isMatchModel = parsedData.hasOwnProperty('ScoutName') || parsedData.hasOwnProperty('TeamNumber');
  const content = isMatchModel
    ? renderMatchModel(parsedData)
    : renderPitModel(parsedData);

  return (
    <ScrollView style={styles.container}>
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});
