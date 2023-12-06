import React from 'react';
import { View, Text, ScrollView, StyleSheet, Button, Alert } from 'react-native';
import { MatchModel } from '../models/MatchModel';
import { PitModel } from '../models/PitModel';
import { uploadPitData, uploadMatchData } from '../services/UploadService'; // Import the upload functions

export default function ConfirmDataScreen({ route, navigation }: any) {
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

  // Function to handle upload
  const handleUpload = async () => {
    let result: { worked: boolean; message: string; };
  
    const confirmOverride = () => {
      return new Promise<boolean>((resolve) => {
        Alert.alert(
          "Confirmation",
          "This action will override existing data. Are you sure?",
          [
            { text: "Cancel", onPress: () => resolve(false) },
            { text: "OK", onPress: () => resolve(true) }
          ]
        );
      });
    };
  
    if (isMatchModel) {
      result = await uploadMatchData(parsedData, confirmOverride);
    } else {
      result = await uploadPitData(parsedData, confirmOverride);
    }
  
    Alert.alert(result.worked ? "Success" : "Error", result.message, [
      { text: "OK", onPress: () => result.worked && navigation.navigate('MainTabs') }
    ]);
  };

  // Check the type of model and render accordingly
  const isMatchModel = parsedData.hasOwnProperty('ScoutName') || parsedData.hasOwnProperty('TeamNumber');
  const content = isMatchModel
    ? renderMatchModel(parsedData)
    : renderPitModel(parsedData);

  return (
    <ScrollView style={styles.container}>
      {content}
      <View style={styles.uploadButtonContainer}>
        <Button title="Upload Data" onPress={handleUpload} color="green" />
      </View>
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
  uploadButtonContainer: {
    marginTop: 20,
    marginBottom: 50,
    backgroundColor: "#1E1E1E",
  },
});
