import { initialMatchData } from './../models/MatchModel';
import { db } from "../firebase";
import { collection, getDocs, getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { PitModel, initialPitData } from "../models/PitModel";
import { MatchModel } from "../models/MatchModel";

export const fetchDataFromFirebase = async (): Promise<PitModel[]> => {
  const teamsCol = collection(db, "teams");
  const teamSnapshot = await getDocs(teamsCol);

  const teamList: PitModel[] = await Promise.all(
    teamSnapshot.docs.map(async (teamDoc) => {
      // Assuming teamDoc.id is a string that can be converted to a number
      const teamNumber = parseInt(teamDoc.id, 10); // Convert the teamDoc.id to a number
      if (isNaN(teamNumber)) {
        // Handle cases where conversion isn't possible
        console.error(`Document ID '${teamDoc.id}' is not a valid team number`);
        throw new Error(`Document ID '${teamDoc.id}' is not a valid team number`);
      }

      const teamData: PitModel = {
        ...initialPitData, // Your initial data for a PitModel
        ...teamDoc.data(), // Firestore document's data
        TeamNb: teamNumber, // Set the TeamNb property to the converted number
        matches: [], // Initialize matches, to be filled in below
      };

      const matchesCol = collection(db, `teams/${teamDoc.id}/matches`);
      const matchSnapshot = await getDocs(matchesCol);
      teamData.matches = matchSnapshot.docs.map((matchDoc) => {
        // If MatchModel closely matches the Firestore structure:
        return {
          ...matchDoc.data(),
          id: matchDoc.id,
        } as unknown as MatchModel;
      });

      return teamData;
    })
  );

  return teamList;
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
  } catch (error) {
    console.error("Error uploading Pit data to Firebase: ", error);
    return { success: false, message: "Failed to upload pit data to Firebase." };
  }
};

export const uploadMatchDataToFirebase = async (matchData: MatchModel, teamRef: any, matchRef: any) => {
  try {
    const teamSnap = await getDoc(teamRef);
    if (!teamSnap.exists()) {
      await setDoc(teamRef, initialPitData); // Assuming initialPitData is defined elsewhere
    }
    await setDoc(matchRef, matchData);
    return { success: true, message: "Match data uploaded successfully." };
  } catch (error) {
    console.error("Error uploading Match data to Firebase: ", error);
    return { success: false, message: "Failed to upload match data to Firebase." };
  }
};
