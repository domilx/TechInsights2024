import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkInternetConnection } from './NetworkService';
import { fetchDataChangesSinceLastSync, uploadPitDataToFirebase } from './FirebaseService';
import { getDataLocally, saveDataLocally } from './LocalStorageService';
import { PitModel } from '../models/PitModel';
import { db } from "../firebase";
import { doc } from "firebase/firestore";

interface SyncResult {
    success: boolean;
    data?: PitModel[];
    message: string;
}

export const syncData = async (techTeam: string): Promise<SyncResult> => {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
        // Return local data if offline
        const localData: PitModel[] | undefined = await getDataLocally('fetchedData');
        return { success: true, data: localData, message: "Offline mode: Displaying local data." };
    }

    try {
        // Fetch the latest modifications from Firebase based on local lastModified timestamps
        const localData: PitModel[] = await getDataLocally('fetchedData') || [];
        const localDataMap = new Map(localData.map(item => [item.TeamNumber, item]));
        const latestUpdates: PitModel[] = await fetchDataChangesSinceLastSync(localDataMap, techTeam);
        if (latestUpdates.length === 0) {
            return { success: false, data: localData, message: "No new updates found." };
        }

        // Merge updates and local data
        for (const update of latestUpdates) {
            localDataMap.set(update.TeamNumber, update);
        }

        // Save updated records back to local storage and Firebase if necessary
        const allData = Array.from(localDataMap.values());
        await saveDataLocally('fetchedData', allData);

        // Optional: Update records back to Firebase if there were local changes
        // This step can be skipped if bidirectional sync is not needed or handled elsewhere

        await updateLastSyncTime();

        return { success: true, data: allData, message: "Data synced successfully." };
    } catch (error: any) {
        console.error("Error during sync: ", error);
        return { success: false, message: error.message || "Failed to sync data." };
    }
};

export const updateLastSyncTime = async (): Promise<void> => {
    const lastSyncTime = new Date().toISOString();
    await AsyncStorage.setItem('lastSyncTime', lastSyncTime);
};

export const eraseLastSyncTime = async (): Promise<void> => {
    await AsyncStorage.removeItem('lastSyncTime');
}
