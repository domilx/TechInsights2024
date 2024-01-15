import { db, storage } from "../firebase";
import { collection, getDocs, getDoc, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { PitModel, initialPitData } from "../models/PitModel";
import { MatchModel, initialMatchData } from "../models/MatchModel";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";

export const fetchDataFromFirebase = async (): Promise<PitModel[]> => {
  const teamsCol = collection(db, "teams");
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
        TeamNb: teamNumber,
        matches: [],
      };

      const matchesCol = collection(db, `teams/${teamDoc.id}/matches`);
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
      await setDoc(teamRef, initialPitData);
    }
    await setDoc(matchRef, matchData);
    return { success: true, message: "Match data uploaded successfully." };
  } catch (error: any) {
    console.error("Error uploading Match data to Firebase: ", error);
    return { success: false, message: error.message || "Failed to upload match data to Firebase." };
  }
};

export const deleteMatchDataFromFirebase = async (matchRef: any) => {
  try {
    await setDoc(matchRef, initialMatchData);
    return { success: true, message: "Match data deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting Match data from Firebase: ", error);
    return { success: false, message: error.message || "Failed to delete match data from Firebase." };
  }
};

export const deleteTeamFromFirebase = async (teamRef: any) => {
  try {
    const matchesCol = collection(db, `${teamRef.path}/matches`);
    const matchSnapshot = await getDocs(matchesCol);
    for (const matchDoc of matchSnapshot.docs) {
      await deleteDoc(matchDoc.ref);
    }
    await deleteDoc(teamRef);
    return { success: true, message: "Team deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting Team from Firebase: ", error);
    return { success: false, message: error.message || "Failed to delete team from Firebase." };
  }
};

export const updatePitData = async (pitData: PitModel, teamNumber: number) => {
  const teamRef = doc(db, "teams", teamNumber.toString()); 

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

export const fetchPhotosFromFirebase = async (teamNumber: number) => {
  const teamFolderRef = ref(storage, `${teamNumber}/`);
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

export const uploadPhotoToFirebase = async (photoUri: string, teamNumber: number) => {
  try {
    const response = await fetch(photoUri);
    const blob = await response.blob();

    const teamFolderRef = ref(storage, `${teamNumber}/`);

    // Use a timestamp to create a unique photo name
    const timestamp = new Date().getTime();
    const photoName = `photo_${timestamp}.jpg`;
    const photoRef = ref(storage, `${teamNumber}/${photoName}`);

    await uploadBytes(photoRef, blob);

    // Getting download URL to display the image
    const downloadURL = await getDownloadURL(photoRef);
    return { success: true, message: "Photo uploaded successfully.", url: downloadURL };
  } catch (error: any) {
    console.error("Error uploading photo to Firebase: ", error);
    return { success: false, message: error.message || "Failed to upload photo." };
  }
};

export const removePhotoFromFirebase = async (teamNumber: number, photoName: string) => {
  try {
    const photoRef = ref(storage, `${teamNumber}/${photoName}`);
    await deleteObject(photoRef);
    return { success: true, message: "Photo removed successfully." };
  } catch (error: any) {
    console.error("Error removing photo from Firebase: ", error);
    return { success: false, message: error.message || "Failed to remove photo." };
  }
};
