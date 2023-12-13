import { uploadPitDataToFirebase, uploadMatchDataToFirebase, fetchDataFromFirebase } from './FirebaseService';
import { getDataLocally, removeDataLocally } from './LocalStorageService';
import { checkInternetConnection } from './NetworkService';
import { doc } from "firebase/firestore";
import { db } from "../firebase";
import { PitModel } from '../models/PitModel';

export const syncData = async (): Promise<{ success: boolean; data?: PitModel[]; message: string }> => {
  try {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      return { success: false, message: "No internet connection." };
    }

    // Local data syncing
    const localPitDataResult = await syncLocalPitData();
    if (!localPitDataResult.success) {
      return localPitDataResult;
    }

    const localMatchDataResult = await syncLocalMatchData();
    if (!localMatchDataResult.success) {
      return localMatchDataResult;
    }

    // Fetching fresh data from Firebase
    const fetchedData = await fetchDataFromFirebase();
    return { success: true, data: fetchedData, message: "Data synced successfully." };
  } catch (error) {
    console.error("Error during sync: ", error);
    return { success: false, message: "Failed to sync data." };
  }
};

async function syncLocalPitData(): Promise<{ success: boolean; message: string }> {
  const localPitData = await getDataLocally("pitData");
  if (localPitData) {
    const teamRef = doc(db, "teams", `${localPitData.TeamNb}`);
    const uploadResult = await uploadPitDataToFirebase(localPitData, teamRef);
    if (!uploadResult.success) {
      return uploadResult;
    }
    await removeDataLocally("pitData");
  }
  return { success: true, message: "Local pit data synced successfully." };
}

async function syncLocalMatchData(): Promise<{ success: boolean; message: string }> {
  const localMatchData = await getDataLocally("matchData");
  if (localMatchData) {
    const teamRef = doc(db, "teams", `${localMatchData.TeamNumber}`);
    const matchRef = doc(db, `teams/${localMatchData.TeamNumber}/matches`, `${localMatchData.MatchNumber}`);
    const uploadResult = await uploadMatchDataToFirebase(localMatchData, teamRef, matchRef);
    if (!uploadResult.success) {
      return uploadResult;
    }
    await removeDataLocally("matchData");
  }
  return { success: true, message: "Local match data synced successfully." };
}
