import { db } from "../firebase"; // Make sure to import your Firebase configuration
import { collection, getDocs, getDoc, doc } from "firebase/firestore";

export const fetchDataFromFirebase = async () => {
  const teamsCol = collection(db, "teams");
  const teamSnapshot = await getDocs(teamsCol);

  // Using Promise.all to fetch all teams and their matches concurrently
  const teamList = await Promise.all(
    teamSnapshot.docs.map(async (teamDoc) => {
      const teamData = teamDoc.data();
      const matchesCol = collection(db, `teams/${teamDoc.id}/matches`);
      const matchSnapshot = await getDocs(matchesCol);

      // Add a matches array to team data
      teamData.matches = matchSnapshot.docs.map((matchDoc) => ({
        id: matchDoc.id,
        ...matchDoc.data(),
      }));

      return teamData;
    })
  );

  return teamList; // This will be an array of team objects with their matches
};
