import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkInternetConnection } from './NetworkService';
import { fetchDataFromFirebase, uploadPitDataToFirebase, uploadMatchDataToFirebase } from './FirebaseService';
import { getDataLocally, removeDataLocally, saveDataLocally } from './LocalStorageService';
import { PitModel } from '../models/PitModel';
import { MatchModel } from '../models/MatchModel';
import { db } from "../firebase";
import { doc } from "firebase/firestore";

interface SyncResult {
    success: boolean;
    data?: PitModel[];
    message: string;
}

export const syncData = async (): Promise<SyncResult> => {
    try {
        const isConnected = await checkInternetConnection();
        if (!isConnected) {
            throw new Error("No internet connection available.");
        }

        const lastSyncTime = await AsyncStorage.getItem('lastSyncTime');
        const syncNeeded = await needsSyncing(lastSyncTime);
        if (!syncNeeded) {
            return { success: true, message: "Data already up-to-date." };
        }

        const fetchedData: PitModel[] = await fetchDataFromFirebase();
        const sortedData = fetchedData.sort((a, b) => a.TeamNumber - b.TeamNumber); // Sort data by team number

        for (const pitData of sortedData) {
            const teamRef = doc(db, "scoutTeams", `${pitData.TeamNumber}`);
            const uploadResult = await uploadPitDataToFirebase(pitData, teamRef);
            if (uploadResult.success) {
                await removeDataLocally('pitData');
            }
        }

        await syncLocalData();
        await saveDataLocally('fetchedData', sortedData);
        await updateLastSyncTime();

        return { success: true, data: sortedData, message: "Data synced successfully." };
    } catch (error: any) {
        console.error("Error during sync: ", error);
        return { success: false, message: error.message || "Failed to sync data." };
    }
};

const needsSyncing = async (lastSyncTime: string | null): Promise<boolean> => {
  const localLastModified = await AsyncStorage.getItem('lastModifiedTime');
  if (localLastModified === null) {
      return true; // If there's no recorded last modified time, assume syncing is needed
  }
  return new Date(localLastModified) > new Date(lastSyncTime ?? 0);
};


const syncLocalData = async (): Promise<void> => {
    const localPitData: PitModel | null = await getDataLocally('pitData');
    if (localPitData) {
        const teamRef = doc(db, "scoutTeams", `${localPitData.TeamNumber}`);
        const uploadResult = await uploadPitDataToFirebase(localPitData, teamRef);
        if (uploadResult.success) {
            await removeDataLocally('pitData');
        }
    }

    const localMatchData: MatchModel | null = await getDataLocally('matchData');
    if (localMatchData) {
        const teamRef = doc(db, "scoutTeams", `${localMatchData.TeamNumber}`);
        const matchRef = doc(db, `scoutTeams/${localMatchData.TeamNumber}/matches`, `${localMatchData.MatchNumber}`);
        const uploadResult = await uploadMatchDataToFirebase(localMatchData, teamRef, matchRef);
        if (uploadResult.success) {
            await removeDataLocally('matchData');
        }
    }
};

export const updateLastSyncTime = async (): Promise<void> => {
    const lastSyncTime = new Date().toISOString();
    await AsyncStorage.setItem('lastSyncTime', lastSyncTime);
};