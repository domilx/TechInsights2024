import {
  getMatchesPlayed,
  getMatchesWon,
  getCurrentRankingPoints,
  getAverageRankingPoints,
  getAverageCycleTime,
  getMostFrequentAutoPosition,
  getAutoMobilityPercentage,
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
  getTotalAutoPoints,
  getTotalTeleopPoints,
  getAveragePointsPerMatch,
  getWinRateWithHighMobility,
  getPointsContributionRatio,
  getAverageGamePiece1,
  getAverageGamePiece2,
  getAverageGamePiece3,
  getAverageGamePiece4,
} from "./StatsCalculations";

const DisplayStatsData = {
  MatchOutcomes: [
    { label: "Matches Played", func: getMatchesPlayed, unit: "matches" },
    { label: "Matches Won", func: getMatchesWon, unit: "matches" },
    { label: "Win Rate", func: getWinRateWithHighMobility, unit: "%" },
  ],
  Scoring: [
    { label: "Total Auto Points", func: getTotalAutoPoints, unit: "points" },
    { label: "Total Teleop Points", func: getTotalTeleopPoints, unit: "points" },
    { label: "Average Points Per Match", func: getAveragePointsPerMatch, unit: "points/match" },
    { label: "Average Game Piece1", func: getAverageGamePiece1, unit: "pieces/match" },
    { label: "Average Game Piece2", func: getAverageGamePiece2, unit: "pieces/match" },
    { label: "Average Game Piece3", func: getAverageGamePiece3, unit: "pieces/match" },
    { label: "Average Game Piece4", func: getAverageGamePiece4, unit: "pieces/match" },
  ],
  Ranking: [
    { label: "Current Ranking Points", func: getCurrentRankingPoints, unit: "points" },
    { label: "Average Ranking Points", func: getAverageRankingPoints, unit: "points/match" },
  ],
  RobotPerformance: [
    { label: "Average Cycle Time", func: getAverageCycleTime, unit: "seconds" },
    { label: "Average Robot Quickness", func: getAverageRobotQuickness, unit: "rating" },
    { label: "Average Robot Field Awareness", func: getAverageRobotFieldAwareness, unit: "rating" },
    { label: "Average Robot Tippy Score", func: getAverageRobotTippyScore, unit: "rating" },
  ],
  GamePieceHandling: [
    { label: "Abs Max Game Pieces", func: getMaxGamePieces, unit: "pieces/match" },
    { label: "Abs Min Game Pieces", func: getMinGamePieces, unit: "pieces/match" },
    { label: "Standard Deviation of Game Pieces", func: getStandardDeviationOfGamePieces, unit: "pieces" },
    { label: "Average Dropped Game Pieces", func: getAverageDroppedGamePieces, unit: "pieces/match" },
    { label: "Average Teleop Game Pieces Scored", func: getAverageTeleopGamePiecesScored, unit: "pieces/match" },
  ],
  AutoPerformance: [
    { label: "Average Auto Objectives Achieved", func: getAverageAutoObjectivesAchieved, unit: "pts/match" },
    { label: "Average Auto Game Pieces", func: getAverageAutoGamePieces, unit: "/match" },
    { label: "Most Frequent Auto Position", func: getMostFrequentAutoPosition, unit: "" },
    { label: "Auto Mobility Percentage", func: getAutoMobilityPercentage, unit: "%" },
  ],
  Miscellaneous: [
    { label: "Times Incapacitated", func: getTimesIncapacitated, unit: "" },
    { label: "Times Robot Falls", func: getTimesRobotFalls, unit: "" },
    { label: "Average Plays Defense Score", func: getAveragePlaysDefenseScore, unit: "%" },
    { label: "Points Contribution Ratio", func: getPointsContributionRatio, unit: "ratio" },
  ],
};

export default DisplayStatsData;