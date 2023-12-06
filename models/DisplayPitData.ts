// displayPitData.ts

import { PitModel } from "./PitModel";

const displayPitData = (pitData: PitModel) => {
  const data = [
    { label: "Scout Name", value: pitData.RobScout },
    { label: "Team Number", value: pitData.TeamNb.toString() },
    { label: "Team Name", value: pitData.RobTeamNm },
    { label: "Drive Base Type", value: pitData.RobDrive },
    { label: "Drive Base Motor", value: pitData.RobMotor },
    { label: "Driver Experience", value: pitData.RobDriveExp },
    { label: "Robot Weight (lbs)", value: pitData.RobWtlbs.toString() },
    { label: "Robot Width", value: pitData.RobWidth.toString() },
    { label: "Robot Length", value: pitData.RobLength.toString() },
    { label: "Robot Stability", value: pitData.RobStble },
    { label: "Question 1", value: pitData.RobQuest1 ? "Yes" : "No" },
    { label: "Question 2", value: pitData.RobQuest2 ? "Yes" : "No" },
    { label: "Question 3", value: pitData.RobQuest3 ? "Yes" : "No" },
    { label: "Question 4", value: pitData.RobQuest4 ? "Yes" : "No" },
    { label: "Question 5", value: pitData.RobQuest5 ? "Yes" : "No" },
    { label: "Question 6", value: pitData.RobQuest6 ? "Yes" : "No" },
    { label: "Question 7", value: pitData.RobQuest7 ? "Yes" : "No" },
    { label: "Question 8", value: pitData.RobQuest8 ? "Yes" : "No" },
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
      data.push({ label: `Match ${index + 1} Number`, value: match.MatchNumber.toString() });
      data.push({ label: "Scout Name", value: match.ScoutName });
      data.push({ label: "Auto Game Piece 1", value: match.AutoGamePiece1 });
      data.push({ label: "Auto Game Piece 2", value: match.AutoGamePiece2 });
      data.push({ label: "Auto Game Piece 3", value: match.AutoGamePiece3 });
      data.push({ label: "Auto Game Piece 4", value: match.AutoGamePiece4 });
      data.push({ label: "Auto Position", value: match.AutoPosition });
      data.push({ label: "Auto Mobility", value: match.AutoMobility ? "Yes" : "No" });
      data.push({ label: "Auto Charging Station", value: match.AutoChargingStation });
      data.push({ label: "Auto Objective 1", value: match.AutoObjective1 });
      data.push({ label: "Auto Objective 2", value: match.AutoObjective2 });
      data.push({ label: "Auto Robot Falls", value: match.AutoRobotFalls ? "Yes" : "No" });
      data.push({ label: "Cycle Time", value: match.CycleTime.toString() });
      data.push({ label: "End Game Objective 1", value: match.EndGameObjective1 ? "Yes" : "No" });
      data.push({ label: "Dropped Game Piece", value: match.DroppedGamePiece.toString() });
      data.push({ label: "Total Points Alliance", value: match.TotalPointsAlliance.toString() });
      data.push({ label: "Ranking Points Alliance", value: match.RankingPointsAlliance.toString() });
      data.push({ label: "Alliance Objective 1", value: match.AllianceObjective1.toString() });
      data.push({ label: "Alliance Objective 2", value: match.AllianceObjective2 ? "Yes" : "No" });
      data.push({ label: "Won Match", value: match.WonMatch ? "Yes" : "No" });
      data.push({ label: "Teleop Status 1", value: match.TeleopStatus1 ? "Yes" : "No" });
      data.push({ label: "Teleop Status 2", value: match.TeleopStatus2 ? "Yes" : "No" });
      data.push({ label: "Teleop Status 3", value: match.TeleopStatus3 ? "Yes" : "No" });
      data.push({ label: "Teleop Status 4", value: match.TeleopStatus4 ? "Yes" : "No" });
      data.push({ label: "Teleop Status 5", value: match.TeleopStatus5 });
      data.push({ label: "Teleop Status 6", value: match.TeleopStatus6 });
      data.push({ label: "Robot Falls", value: match.TeleopStatus1 ? "Yes" : "No" });
      data.push({ label: "Incapacitated", value: match.TeleopStatus2 ? "Yes" : "No" });
      data.push({ label: "Plays Defense", value: match.TeleopStatus3 ? "Yes" : "No" });
      data.push({ label: "Robot Tippy", value: match.TeleopStatus4 ? "Yes" : "No" });
      data.push({ label: "Robot Quickness", value: match.TeleopStatus5 });
      data.push({ label: "Field Awareness", value: match.TeleopStatus6 });
      data.push({ label: "Comment", value: match.Comment });
      // Add any other match properties as needed
    });
  }

  return data;
};

export default displayPitData;
