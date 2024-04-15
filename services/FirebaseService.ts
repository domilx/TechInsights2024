import { db, storage } from "../firebase";
import { collection, getDocs, getDoc, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { PitModel, initialPitData } from "../models/PitModel";
import { MatchModel, initialMatchData } from "../models/MatchModel";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export const fetchDataFromFirebase = async (techTeam: string): Promise<PitModel[]> => {
  const teamsCol = collection(db, `${techTeam}teams`);
  const teamSnapshot = await getDocs(teamsCol);

  let teamList: (PitModel | null)[] = await Promise.all(
    teamSnapshot.docs.map(async (teamDoc) => {
      const teamNumber = parseInt(teamDoc.id, 10);
      if (isNaN(teamNumber)) {
        console.error(`Document ID '${teamDoc.id}' is not a valid team number`);
        return null;
      }

      const teamData: PitModel = {
        ...initialPitData,
        ...teamDoc.data(),
        TeamNumber: teamNumber,
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

  // Filter out null values
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
}


export const uploadPitDataToFirebase = async (pitData: PitModel, teamRef: any) => {
  try {
    const docSnap = await getDoc(teamRef);
    if (docSnap.exists()) {
      await updateDoc(teamRef, { ...pitData });
    } else {
      await setDoc(teamRef, pitData);
    }
    return { success: true, message: "Pit data uploaded successfully." };
  } catch (error: any) {
    console.error("Error uploading Pit data to Firebase: ", error);
    return { success: false, message: error.message || "Failed to upload pit data to Firebase." };
  }
};

export const uploadMatchDataToFirebase = async (matchData: MatchModel, teamRef: any, matchRef: any) => {
  try {
    const teamSnap = await getDoc(teamRef);
    if (!teamSnap.exists()) {
      const initialPitDataWithTeamNumber = { ...initialPitData, TeamNumber: matchData.TeamNumber, TeamName: matchData.TeamNumber.toString() };
      await setDoc(teamRef, initialPitDataWithTeamNumber);
    }
    await setDoc(matchRef, matchData);
    return { success: true, message: "Match data uploaded successfully." };
  } catch (error: any) {
    console.error("Error uploading Match data to Firebase: ", error);
    return { success: false, message: error.message || "Failed to upload match data to Firebase." };
  }
};

export const deleteMatchDataFromFirebase = async (teamNumber: number, matchId: string, techTeam: string) => {
  try {
    // Construct the reference to the specific match document within the team's matches collection
    const matchRef = doc(db, `${techTeam}teams/${teamNumber}/matches/${matchId}`);
    
    // Delete the match document
    await deleteDoc(matchRef);

    return { success: true, message: "Match data deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting Match data from Firebase: ", error);
    return { success: false, message: error.message || "Failed to delete match data from Firebase." };
  }
};

export const deleteTeamFromFirebase = async (teamRef: any, techTeam: string) => {
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

    return { success: true, message: "Team and all associated photos deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting Team from Firebase: ", error);
    return { success: false, message: error.message || "Failed to delete team from Firebase." };
  }
};


export const updatePitData = async (pitData: PitModel, teamNumber: number, techTeam: string) => {
  const teamRef = doc(db, `${techTeam}teams`, teamNumber.toString()); 
  try {
    const docSnap = await getDoc(teamRef);
    if (docSnap.exists()) {
      await updateDoc(teamRef, { ...pitData });
    } else {
      await setDoc(teamRef, pitData);
    }
    return { success: true, message: "Pit data uploaded successfully." };
  } catch (error: any) {
    console.error("Error uploading Pit data to Firebase: ", error);
    return { success: false, message: error.message || "Failed to upload pit data to Firebase." };
  }
};

export const updateMatchData = async (matchData: MatchModel, teamNumber: number, matchId: string, techTeam: string) => {
  const teamRef = doc(db, `${techTeam}teams`, teamNumber.toString());
  const matchRef = doc(db, `${techTeam}teams/${teamNumber}/matches`, matchId);

  try {
    const teamSnap = await getDoc(teamRef);
    if (!teamSnap.exists()) {
      return { success: false, message: "Team does not exist." };
    }
    await setDoc(matchRef, matchData);
    return { success: true, message: "Match data uploaded successfully." };
  } catch (error: any) {
    console.error("Error uploading Match data to Firebase: ", error);
    return { success: false, message: error.message || "Failed to upload match data to Firebase." };
  }
}

export const fetchPhotosFromFirebase = async (teamNumber: number, techTeam: string) => {
  const teamFolderRef = ref(storage, `${techTeam}scouting/${teamNumber}/`);
  try {
    const photosList = await listAll(teamFolderRef);
    const photoUrls = await Promise.all(
      photosList.items.map(item => getDownloadURL(item))
    );
    return { success: true, photos: photoUrls };
  } catch (error: any) {
    console.error("Error fetching photos from Firebase: ", error);
    return { success: false, message: error.message || "Failed to fetch photos." };
  }
};

export const uploadPhotoToFirebase = async (photoUri: string, teamNumber: number, techTeam: string) => {
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
    const photoRef = ref(storage, `${techTeam}scouting/${teamNumber}/${photoName}`);

    await uploadBytes(photoRef, blob);

    // Getting download URL to display the image
    const downloadURL = await getDownloadURL(photoRef);
    return { success: true, message: "Photo uploaded successfully.", url: downloadURL };
  } catch (error: any) {
    console.error("Error uploading photo to Firebase: ", error);
    return { success: false, message: error.message || "Failed to upload photo." };
  }
};


export const removePhotoFromFirebase = async (photoName: string, techTeam: string) => {
  try {
    const photoRef = ref(storage, photoName);
    await deleteObject(photoRef);
    return { success: true, message: "Photo removed successfully." };
  } catch (error: any) {
    console.error("Error removing photo from Firebase: ", error);
    return { success: false, message: error.message || "Failed to remove photo." };
  }
};
