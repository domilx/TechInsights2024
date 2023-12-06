import { TapGestureHandler } from "./../node_modules/react-native-gesture-handler/src/handlers/TapGestureHandler";
import firebase from "firebase/app";
import "firebase/firestore";
import { PitModel } from "../models/PitModel";
import { MatchModel } from "../models/MatchModel";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";

const saveDataLocally = async (key: string, data: any) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error("Error saving data locally: ", e);
  }
};

export const uploadPitData = async (
  pitData: PitModel,
  confirmOverride: () => Promise<boolean>
) => {
  const teamRef = doc(db, "teams", `${pitData.TeamNb}`);
  const isConnected = await NetInfo.fetch().then((state) => state.isConnected);

  if (!isConnected) {
    try {
      // Save data locally if offline
      await saveDataLocally("pitData", pitData);
      return { worked: true, message: "Pit data saved locally." };
    } catch (e) {
      console.error("Error saving data locally: ", e);
      return { worked: false, message: "Failed to save pit data locally." };
    }
  }

  try {
    const docSnap = await getDoc(teamRef);
    if (docSnap.exists()) {
      const confirm = await confirmOverride();
      if (!confirm)
        return { worked: false, message: "Upload canceled by user." };

      // Update only the pit data fields
      await updateDoc(teamRef, { ...pitData });
    } else {
      // Create new document without specifying matches
      await setDoc(teamRef, pitData);
    }
    return { worked: true, message: "Pit data uploaded successfully." };
  } catch (error) {
    console.error("Error uploading Pit data: ", error);
    return { worked: false, message: "Failed to upload pit data." };
  }
};

const createEmptyTeam = () => {
  return new Promise((resolve) => {
    Alert.alert(
      "Create Empty Team",
      "The team does not exist. Do you want to create an empty team?",
      [
        {
          text: "Cancel",
          onPress: () => resolve(false),
          style: "cancel",
        },
        { text: "OK", onPress: () => resolve(true) },
      ],
      { cancelable: false }
    );
  });
};

export const uploadMatchData = async (
  matchData: MatchModel,
  confirmOverride: () => Promise<boolean>
) => {
  const isConnected = await NetInfo.fetch().then((state) => state.isConnected);

  if (!isConnected) {
    try {
      // Save data locally if offline
      await saveDataLocally("matchData", matchData);
      return { worked: true, message: "Match data saved locally." };
    } catch (error) {
      console.error("Error saving data locally: ", error);
      return { worked: false, message: "Failed to save match data locally." };
    }
  }

  const teamRef = doc(db, "teams", `${matchData.TeamNumber}`);
  const matchRef = doc(
    db,
    `teams/${matchData.TeamNumber}/matches`,
    `${matchData.MatchNumber}`
  );

  try {
    const teamSnap = await getDoc(teamRef);
    if (!teamSnap.exists()) {
      const confirmCreate = await confirmOverride();
      if (!confirmCreate)
        return { worked: false, message: "Team creation canceled by user." };

      // Create an empty team document and upload the match data
      await setDoc(teamRef, { /* empty team data or minimal structure */ });
    }

    // Proceed to upload the match data
    await setDoc(matchRef, matchData);
    return { worked: true, message: "Match data uploaded successfully." };
  } catch (error) {
    console.error("Error uploading Match data: ", error);
    return { worked: false, message: "Failed to upload match data." };
  }
};
