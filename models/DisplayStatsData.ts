import {
  getMatchesPlayed,
  getMatchesWon,
  getCurrentRankingPoints,
  getAverageRankingPoints,
  getAverageCycleTime,
  getMostFrequentAutoPosition,
  getAutoMobilityPercentage,
  getAutoAverageScore,
  getAverageAutoGamePieces,
  getAverageAutoObjectivesAchieved,
  getAverageTeleopGamePiecesScored,
  getMaxGamePieces,
  getMinGamePieces,
  getStandardDeviationOfGamePieces,
  getAverageDroppedGamePieces,
  getTimesIncapacitated,
  getTimesRobotFalls,
  getAverageRobotTippyScore,
  getAveragePlaysDefenseScore,
  getAverageRobotFieldAwareness,
  getAverageRobotQuickness,
} from "./StatsCalculations";

const DisplayStatsData = [
  { label: "Matches Played", func: getMatchesPlayed },
  { label: "Matches Won", func: getMatchesWon },
  // ... add other stats following the same pattern
  //{ label: "Current Ranking Points", func: getCurrentRankingPoints },
  //{ label: "Average Ranking Points", func: getAverageRankingPoints },
  // ... continue with the rest
];

export default DisplayStatsData;
