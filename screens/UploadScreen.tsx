import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet, Alert,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { MatchModel } from "../models/MatchModel";
import { PitModel } from "../models/PitModel";
import Icon from "@expo/vector-icons/Ionicons";
import Animated from "react-native-reanimated";
import { syncData } from "../services/SyncService";
import {
  uploadMatchDataToFirebase,
  uploadPitDataToFirebase,
} from "../services/FirebaseService";
import { doc } from "firebase/firestore";
import { db } from "../firebase";
import { DataContext } from "../contexts/DataContext";
import { useContext } from "react";
import { saveDataLocally } from "../services/LocalStorageService";

export default function UploadScreen({ route, navigation }: any) {
  const { setTeams, setLastSync } = useContext(DataContext);
  const { data } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  let parsedData: MatchModel | PitModel;

  try {
    parsedData = JSON.parse(data);
    // Perform additional validation if necessary
  } catch (e) {
    Alert.alert("Error", "The scanned data is not valid JSON.");
    navigation.goBack();
    return null;
  }

  // Function to handle upload
  const handleUpload = async () => {
    setIsLoading(true);
    let result;

    // Assuming "MatchNumber" is unique to MatchModel, which differentiates it from PitModel
    if ("MatchNumber" in parsedData) {
      // Now TypeScript knows parsedData must be MatchModel
      const matchData = parsedData as MatchModel;
      const teamRef = doc(db, "teams", `${matchData.TeamNumber}`);
      const matchRef = doc(
        db,
        `teams/${matchData.TeamNumber}/matches`,
        `${matchData.MatchNumber}`
      );
      result = await uploadMatchDataToFirebase(matchData, teamRef, matchRef);
    } else {
      // TypeScript now infers parsedData is PitModel
      const pitData = parsedData as PitModel;
      const teamRef = doc(db, "teams", `${pitData.TeamNumber}`);
      result = await uploadPitDataToFirebase(pitData, teamRef);
    }

    setIsLoading(false);

    if (result && result.success) {
      // Call syncData to update the server and reset the selected team
      const syncResult = await syncData();
      if (syncResult.success && syncResult.data) {
        setTeams(syncResult.data);
        setLastSync(new Date().toISOString());
        // Save the updated teams data locally
        saveDataLocally("fetchedData", syncResult.data);
      }
      Alert.alert("Success", result.message);
      navigation.goBack();
    } else {
      Alert.alert("Error", result.message);
    }
  };

  const renderModel = () => {
    if (parsedData.hasOwnProperty("MatchNumber")) {
      // Render MatchModel data
      return (
        <>
          {Object.entries(parsedData).map(([key, value], index) => {
            return <Text style={styles.text} key={index}>{`${key}: ${value}`}</Text>;
          })}
        </>
      );
    } else {
      // Render PitModel data
      return Object.entries(parsedData).map(([key, value], index) => (
        <Text style={styles.text} key={index}>{`${key}: ${value}`}</Text>
      ));
    }
  };


  return (
    <>
      {isLoading && (
        <Animated.View style={styles.loadingOverlay}>
          <ActivityIndicator size='large' color='#F6EB14' />
          <Text style={styles.loadingText}>Uploading Data</Text>
        </Animated.View>
      )}
      <ScrollView style={styles.container}>
        <View style={styles.dataCard}>
          {renderModel()}
        </View>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <Icon name='cloud-upload' size={20} color='#FFF' />
          <Text style={styles.uploadButtonText}>Upload Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  dataCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadButtonContainer: {
    marginTop: 20,
    marginBottom: 70,
  },
  loadingOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderRadius: 10,
  },
  loadingText: {
    marginTop: 20,
    color: '#FFFFFF',
  },
  uploadButton: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 70,
  },
  uploadButtonText: {
    color: '#FFF',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});