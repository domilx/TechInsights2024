import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { MatchModel } from "../models/MatchModel";
import { PitModel } from "../models/PitModel";
import { uploadPitData, uploadMatchData } from "../services/UploadService"; // Import the upload functions
import Icon from "@expo/vector-icons/Ionicons";
import Animated from "react-native-reanimated";

export default function ConfirmDataScreen({ route, navigation }: any) {
  const { data } = route.params;
  const [isLoading, setIsLoading] = useState(false);

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
    let result: { worked: boolean; message: string };

    const confirmOverride = () => {
      return new Promise<boolean>((resolve) => {
        Alert.alert(
          "Confirmation",
          "This action will override existing data. Are you sure?",
          [
            { text: "Cancel", onPress: () => resolve(false) },
            { text: "OK", onPress: () => resolve(true) },
          ]
        );
      });
    };

    if (isMatchModel) {
      setIsLoading(true);
      result = await uploadMatchData(parsedData, confirmOverride);
      if (result.worked) {
        setIsLoading(false);
        Alert.alert(
          "Success",
          "Data uploaded successfully, You will only see the changes once you SYNC the data",
          [
            {
              text: "OK",
              onPress: () => result.worked && navigation.navigate("MainTabs"),
            },
          ]
        );
      } else {
        setIsLoading(false);
        Alert.alert("Error", result.message);
      }
    } else {
      result = await uploadPitData(parsedData, confirmOverride);
      if (result.worked) {
        setIsLoading(false);
        Alert.alert(
          "Success",
          "Data uploaded successfully, You will only see the changes once you SYNC the data",
          [
            {
              text: "OK",
              onPress: () => result.worked && navigation.navigate("MainTabs"),
            },
          ]
        );
      } else {
        setIsLoading(false);
        Alert.alert("Error", result.message);
      }
    }
  };

  // Check the type of model and render accordingly
  const isMatchModel =
    parsedData.hasOwnProperty("ScoutName") ||
    parsedData.hasOwnProperty("TeamNumber");
  const content = isMatchModel
    ? renderMatchModel(parsedData)
    : renderPitModel(parsedData);

  return (
    <>
      {isLoading && (
        <Animated.View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#F6EB14" />
          <Text style={styles.loadingText}>Uploading Data</Text>
        </Animated.View>
      )}
      <ScrollView style={styles.container}>
        {content}
        <View style={styles.uploadButtonContainer}>
          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
            <Icon name="cloud-upload" size={20} color="#FFF" />
            <Text style={styles.uploadButtonText}>Upload Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  uploadButtonContainer: {
    marginTop: 20,
    marginBottom: 70,
    backgroundColor: "#1E1E1E",
  },
  loadingOverlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderRadius: 10,
  },
  loadingText: {
    marginTop: 20,
    color: "#FFFFFF",
  },
  uploadButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#FFF",
    marginLeft: 10,
    fontWeight: "bold",
  },
});
