import { getDataLocally } from './LocalStorageService';
import { db, storage } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { PitModel, initialPitData } from "../models/PitModel";
import { MatchModel, initialMatchData } from "../models/MatchModel";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchDataFromFirebase = async (techTeam: string): Promise<PitModel[]> => {
  const teamsCol = collection(db, `${techTeam}teams`);
  const teamSnapshot = await getDocs(teamsCol);
  let teamList: (PitModel | null)[] = await Promise.all(
    teamSnapshot.docs.map(async (teamDoc) => {
      const teamData: PitModel = {
        ...initialPitData,
        ...teamDoc.data(),
        TeamNumber: parseInt(teamDoc.id, 10),
        matches: [],
      };

      const matchesCol = collection(db, `${techTeam}teams/${teamDoc.id}/matches`);
      const matchSnapshot = await getDocs(matchesCol);
      teamData.matches = matchSnapshot.docs.map((matchDoc) => ({
        ...initialMatchData,
        ...matchDoc.data(),
        id: matchDoc.id,
      }) as MatchModel);

      return teamData;
    })
  );
  return teamList.filter((team): team is PitModel => team !== null);
};


export const isLatest = async () => {
  try {
    const currentVersion = "2.2.4"; // Replace with the actual version
    const versionDoc = await getDoc(doc(db, "safeties/insights"));
    return versionDoc.exists() && versionDoc.data().version === currentVersion;
  } catch (error: any) {
    console.error("Error checking latest version: ", error);
    return false;
  }
};

export const uploadPitDataToFirebase = async (pitData: PitModel, teamRef: any) => {
  try {
    const docSnap = await getDoc(teamRef);
    if (docSnap.exists()) {
      await updateDoc(teamRef, { ...pitData });
    } else {
      await setDoc(teamRef, pitData);
    }
    await updateLastModified(teamRef); // Update lastModified timestamp
    return { success: true, message: "Pit data uploaded successfully." };
  } catch (error: any) {
    console.error("Error uploading Pit data to Firebase: ", error);
    return { success: false, message: error.message };
  }
};


export const uploadMatchDataToFirebase = async (matchData: MatchModel, teamRef: any, matchRef: any) => {
  try {
    const teamSnap = await getDoc(teamRef);
    if (!teamSnap.exists()) {
      await setDoc(teamRef, { ...initialPitData, TeamNumber: matchData.TeamNumber, TeamName: matchData.TeamNumber.toString() });
    }
    await setDoc(matchRef, matchData);
    await updateLastModified(teamRef); // Update lastModified timestamp
    return { success: true, message: "Match data uploaded successfully." };
  } catch (error: any) {
    console.error("Error uploading Match data to Firebase: ", error);
    return { success: false, message: error.message };
  }
};

export const deleteMatchDataFromFirebase = async (teamNumber: number, matchId: string, techTeam: string) => {
  try {
    const matchRef = doc(db, `${techTeam}teams/${teamNumber}/matches/${matchId}`);
    await deleteDoc(matchRef);
    const teamRef = doc(db, `${techTeam}teams`, teamNumber.toString());
    await updateLastModified(teamRef); // Update lastModified timestamp
    return { success: true, message: "Match data deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting Match data from Firebase: ", error);
    return { success: false, message: error.message };
  }
};

export const deleteTeamFromFirebase = async (
  teamRef: any,
  techTeam: string
) => {
  try {
    const matchesCol = collection(db, `${teamRef.path}/matches`);
    const matchSnapshot = await getDocs(matchesCol);
    for (const matchDoc of matchSnapshot.docs) {
      await deleteDoc(matchDoc.ref);
    }

    // List all files in the team's folder and delete them
    const teamFolderRef = ref(storage, `${techTeam}teams/${teamRef.id}/`); // Adjust the path according to your storage structure
    const fileList = await listAll(teamFolderRef);
    for (const fileRef of fileList.items) {
      await deleteObject(fileRef); // Delete each file
    }

    // After deleting all photos, delete the team document
    await deleteDoc(teamRef);

    return {
      success: true,
      message: "Team and all associated photos deleted successfully.",
    };
  } catch (error: any) {
    console.error("Error deleting Team from Firebase: ", error);
    return {
      success: false,
      message: error.message || "Failed to delete team from Firebase.",
    };
  }
};

export const updatePitData = async (pitData: PitModel, teamNumber: number, techTeam: string) => {
  const teamRef = doc(db, `${techTeam}teams`, teamNumber.toString());
  try {
    // Merge the new data with an updated timestamp
    await setDoc(teamRef, { ...pitData, lastModified: serverTimestamp() }, { merge: true });
    return { success: true, message: "Pit data updated successfully." };
  } catch (error: any) {
    console.error("Error updating Pit data in Firebase: ", error);
    return {
      success: false,
      message: error.message || "Failed to update pit data in Firebase.",
    };
  }
};

export const updateMatchData = async (matchData: MatchModel, teamNumber: number, matchId: string, techTeam: string) => {
  const matchRef = doc(db, `${techTeam}teams/${teamNumber}/matches`, matchId);

  try {
    // Check if the team exists before trying to update a match
    const teamRef = doc(db, `${techTeam}teams`, teamNumber.toString());
    const teamSnap = await getDoc(teamRef);
    if (!teamSnap.exists()) {
      return { success: false, message: "Team does not exist, cannot update match." };
    }

    // Update the match data with a new timestamp
    await setDoc(matchRef, { ...matchData, lastModified: serverTimestamp() }, { merge: true });
    // Update the team's last modified time as well
    await updateDoc(teamRef, { lastModified: serverTimestamp() });

    return { success: true, message: "Match data updated successfully." };
  } catch (error: any) {
    console.error("Error updating Match data in Firebase: ", error);
    return {
      success: false,
      message: error.message || "Failed to update match data in Firebase.",
    };
  }
};

export const fetchPhotosFromFirebase = async (
  teamNumber: number,
  techTeam: string
) => {
  const teamFolderRef = ref(storage, `${techTeam}scouting/${teamNumber}/`);
  try {
    const photosList = await listAll(teamFolderRef);
    const photoUrls = await Promise.all(
      photosList.items.map((item) => getDownloadURL(item))
    );
    return { success: true, photos: photoUrls };
  } catch (error: any) {
    console.error("Error fetching photos from Firebase: ", error);
    return {
      success: false,
      message: error.message || "Failed to fetch photos.",
    };
  }
};

export const uploadPhotoToFirebase = async (
  photoUri: string,
  teamNumber: number,
  techTeam: string
) => {
  try {
    // Resize and compress image
    const resizedImage = await manipulateAsync(
      photoUri,
      [{ resize: { width: 800 } }], // Resize to width of 800 pixels
      { compress: 0.7, format: SaveFormat.JPEG } // Compress and convert to JPEG
    );

    const response = await fetch(resizedImage.uri);
    const blob = await response.blob();

    // Use a timestamp to create a unique photo name
    const timestamp = new Date().getTime();
    const photoName = `photo_${timestamp}.jpg`;
    const photoRef = ref(
      storage,
      `${techTeam}scouting/${teamNumber}/${photoName}`
    );

    await uploadBytes(photoRef, blob);

    // Getting download URL to display the image
    const downloadURL = await getDownloadURL(photoRef);
    return {
      success: true,
      message: "Photo uploaded successfully.",
      url: downloadURL,
    };
  } catch (error: any) {
    console.error("Error uploading photo to Firebase: ", error);
    return {
      success: false,
      message: error.message || "Failed to upload photo.",
    };
  }
};

export const removePhotoFromFirebase = async (
  photoName: string,
  techTeam: string
) => {
  try {
    const photoRef = ref(storage, photoName);
    await deleteObject(photoRef);
    return { success: true, message: "Photo removed successfully." };
  } catch (error: any) {
    console.error("Error removing photo from Firebase: ", error);
    return {
      success: false,
      message: error.message || "Failed to remove photo.",
    };
  }
};

export const fetchDataChangesSinceLastSync = async (
  localDataMap: Map<number, PitModel>,
  techTeam: string
): Promise<PitModel[]> => {
  const promises: any[] = [];
  if (localDataMap.size === 0) {
    return fetchDataFromFirebase(techTeam);
  }
  localDataMap.forEach((value, key) => {
    const teamRef = doc(db, `${techTeam}teams`, `${key}`);
    const promise = getDoc(teamRef).then(async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const serverData = docSnapshot.data();
        const serverLastModified = convertFirestoreTimestampToDate(serverData.lastModified);
        const lastSync = await AsyncStorage.getItem("lastSyncTime");


        if (!lastSync || serverLastModified > new Date(lastSync)) {
          return { ...serverData, TeamNumber: key } as PitModel;
        }
      }
    });
    promises.push(promise);
  });
  const results = await Promise.all(promises);
  return results.filter((item) => item !== undefined) as PitModel[];
};

const convertFirestoreTimestampToDate = (timestamp: any) => {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
};

const updateLastModified = async (teamRef: any) => {
  await updateDoc(teamRef, { lastModified: new Date().toISOString() });
};
