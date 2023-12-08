import displayMatchData from "./DisplayMatchData";
import { PitModel } from "./PitModel";

const displayPitData = (pitData: PitModel) => {
  const data = [
    { label: "Scout Name", value: pitData.RobScout },
    { label: "Team Number", value: pitData.TeamNb.toString() },
    { label: "Team Name", value: pitData.RobTeamNm },
    { label: "Drive Base Type", value: pitData.RobDrive },
    { label: "Drive Base Motor", value: pitData.RobMotor },
    { label: "Driver Experience (yrs)", value: pitData.RobDriveExp },
    { label: "Robot Weight (lbs)", value: pitData.RobWtlbs.toString() },
    { label: "Robot Width (in.)", value: pitData.RobWidth.toString() },
    { label: "Robot Length (in.)", value: pitData.RobLength.toString() },
    { label: "Robot Stability", value: pitData.RobStble },
    { label: "Split Intake", value: pitData.RobQuest1 ? "Yes" : "No" },
    { label: "Can Pick Up Cones from Ground", value: pitData.RobQuest2 ? "Yes" : "No" },
    { label: "Can Pick Up Cones from DSS", value: pitData.RobQuest3 ? "Yes" : "No" },
    { label: "Can Place Cones/Cubes High Row4", value: pitData.RobQuest4 ? "Yes" : "No" },
    { label: "Dual Intake", value: pitData.RobQuest5 ? "Yes" : "No" },
    { label: "Auto Engages from left", value: pitData.RobQuest6 ? "Yes" : "No" },
    { label: "Auto Engages from right", value: pitData.RobQuest7 ? "Yes" : "No" },
    { label: "Auto Engages from middle", value: pitData.RobQuest8 ? "Yes" : "No" },
    { label: "Question 9", value: pitData.RobQuest9 ? "Yes" : "No" },
    { label: "Question 10", value: pitData.RobQuest10 ? "Yes" : "No" },
    { label: "Question 11", value: pitData.RobQuest11 ? "Yes" : "No" },
    { label: "Question 12", value: pitData.RobQuest12 ? "Yes" : "No" },
    { label: "Question 13", value: pitData.RobQuest13 ? "Yes" : "No" },
    { label: "Question 14", value: pitData.RobQuest14 ? "Yes" : "No" },
    { label: "Question 15", value: pitData.RobQuest15 ? "Yes" : "No" },
    { label: "Comment", value: pitData.RobComm1 },
  ];

  if (pitData.matches && pitData.matches.length > 0) {
    pitData.matches.forEach((match, index) => {
      displayMatchData(match);
    });
  }

  return data;
};

export default displayPitData;
