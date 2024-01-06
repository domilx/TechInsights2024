import displayMatchData from "./DisplayMatchData";
import { PitModel } from "./PitModel";

const DisplayPitData = (pitData: PitModel) => {
  const data = {
    GeneralInfo: [
      { label: "Team Number", value: pitData.TeamNb.toString(), unit: "" },
      { label: "Team Name", value: pitData.RobTeamNm, unit: "" },
    ],
    RobotSpecs: [
      { label: "Drive Base Type", value: pitData.RobDrive, unit: "" },
      { label: "Drive Base Motor", value: pitData.RobMotor, unit: "" },
      { label: "Driver Experience", value: `${pitData.RobDriveExp}`, unit: "years" },
      { label: "Robot Weight", value: `${pitData.RobWtlbs}`, unit: "lbs" },
      { label: "Robot Width", value: `${pitData.RobWidth}`, unit: "in" },
      { label: "Robot Length", value: `${pitData.RobLength}`, unit: "in" },
      { label: "Robot Stability", value: pitData.RobStble, unit: "" },
    ],
    RobotCapabilities: [
      { label: "Split Intake", value: pitData.RobQuest1 ? "Yes" : "No", unit: "" },
      { label: "Can Pick Up Cones from Ground", value: pitData.RobQuest2 ? "Yes" : "No", unit: "" },
      { label: "Can Pick Up Cones from DSS", value: pitData.RobQuest3 ? "Yes" : "No", unit: "" },
      { label: "Can Place Cones/Cubes High Row", value: pitData.RobQuest4 ? "Yes" : "No", unit: "" },
      { label: "Dual Intake", value: pitData.RobQuest5 ? "Yes" : "No", unit: "" },
      { label: "Auto Engages from left", value: pitData.RobQuest6 ? "Yes" : "No", unit: "" },
      { label: "Auto Engages from right", value: pitData.RobQuest7 ? "Yes" : "No", unit: "" },
      { label: "Auto Engages from middle", value: pitData.RobQuest8 ? "Yes" : "No", unit: "" },
      { label: "Question 9", value: pitData.RobQuest9 ? "Yes" : "No", unit: "" },
      { label: "Question 10", value: pitData.RobQuest10 ? "Yes" : "No", unit: "" },
      { label: "Question 11", value: pitData.RobQuest11 ? "Yes" : "No", unit: "" },
      { label: "Question 12", value: pitData.RobQuest12 ? "Yes" : "No", unit: "" },
      { label: "Question 13", value: pitData.RobQuest13 ? "Yes" : "No", unit: "" },
      { label: "Question 14", value: pitData.RobQuest14 ? "Yes" : "No", unit: "" },
      { label: "Question 15", value: pitData.RobQuest15 ? "Yes" : "No", unit: "" },
    ],
    AdditionalInfo: [
      { label: "Comment", value: pitData.RobComm1, unit: "" },
    ],
  };

  if (pitData.matches && pitData.matches.length > 0) {
    pitData.matches.forEach((match, index) => {
      displayMatchData(match);
    });
  }

  return data;
};

export default DisplayPitData;
