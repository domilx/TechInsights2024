import { db } from "../firebase";
import { collection, getDocs, getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { PitModel, initialPitData } from "../models/PitModel";
import { MatchModel, initialMatchData } from "../models/MatchModel";

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
