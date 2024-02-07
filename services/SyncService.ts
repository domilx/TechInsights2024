import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkInternetConnection } from './NetworkService';
import { fetchDataFromFirebase, uploadPitDataToFirebase, uploadMatchDataToFirebase } from './FirebaseService';
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
        if (isConnected) {
            await processSyncQueue();
            const fetchedData: PitModel[] = await fetchDataFromFirebase();
            await saveDataLocally('fetchedData', fetchedData);
            await updateLastSyncTime();
            return { success: true, data: fetchedData, message: "Data synced successfully." };
        } else {
            return { success: true, message: "Offline: Data queued for sync." };
        }
    } catch (error: any) {
        console.error("Error during sync: ", error);
        return { success: false, message: error.message || "Failed to sync data." };
    }
};

const processSyncQueue = async (): Promise<void> => {
    const syncQueue = JSON.parse(await AsyncStorage.getItem('syncQueue') || '') || [];

    for (const item of syncQueue) {
        if (item.type === 'pitData') {
            const teamRef = doc(db, "teams", `${item.data.TeamNumber}`);
            const uploadResult = await uploadPitDataToFirebase(item.data, teamRef);
            if (!uploadResult.success) {
                throw new Error('Failed to sync pit data');
            }
        } else if (item.type === 'matchData') {
            const teamRef = doc(db, "teams", `${item.data.TeamNumber}`);
            const matchRef = doc(db, `teams/${item.data.TeamNumber}/matches`, `${item.data.MatchNumber}`);
            const uploadResult = await uploadMatchDataToFirebase(item.data, teamRef, matchRef);
            if (!uploadResult.success) {
                throw new Error('Failed to sync match data');
            }
        }
    }

    await clearSyncQueue();
};

export const addToSyncQueue = async (data: PitModel | MatchModel, type: 'pitData' | 'matchData') => {
    const syncQueue = JSON.parse(await AsyncStorage.getItem('syncQueue') || '') || [];
    syncQueue.push({ data, type });
    await AsyncStorage.setItem('syncQueue', JSON.stringify(syncQueue));
};

const clearSyncQueue = async () => {
    await AsyncStorage.setItem('syncQueue', JSON.stringify([]));
};

const updateLastSyncTime = async (): Promise<void> => {
    const lastSyncTime = new Date().toISOString();
    await AsyncStorage.setItem('lastSyncTime', lastSyncTime);
};

const saveDataLocally = async (key: string, data: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(data));
};