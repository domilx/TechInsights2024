import { Aware, MatchModel, Position, Speed } from "./MatchModel";

/**
 * Calculates the total number of matches played.
 * @param matches Array of MatchModel objects.
 * @returns Total number of matches.
 */
function getMatchesPlayed(matches: MatchModel[]): number {
  return matches.length;
}

/**
 * Calculates the number of matches won.
 * @param matches Array of MatchModel objects.
 * @returns Number of matches won.
 */
function getMatchesWon(matches: MatchModel[]): number {
  return matches.filter((match) => match.WonMatch).length;
}

/**
 * Calculates the total ranking points from all matches.
 * @param matches Array of MatchModel objects.
 * @returns Sum of ranking points.
 */
function getCurrentRankingPoints(matches: MatchModel[]): number {
  return matches.reduce((sum, match) => sum + match.RankingPointsAlliance, 0);
}

/**
 * Calculates the average ranking points per match.
 * @param matches Array of MatchModel objects.
 * @returns Average ranking points.
 */
function getAverageRankingPoints(matches: MatchModel[]): number {
  return matches.length ? getCurrentRankingPoints(matches) / matches.length : 0;
}

/**
 * Calculates the average cycle time based on the last 5 matches.
 * @param matches Array of MatchModel objects.
 * @returns Average cycle time.
 */
function getAverageCycleTime(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  const totalCycleTime = recentMatches.reduce(
    (sum, match) => sum + match.CycleTime,
    0
  );
  return recentMatches.length ? totalCycleTime / recentMatches.length : 0;
}

/**
 * Finds the most frequent autonomous position from the last 5 matches.
 * @param matches Array of MatchModel objects.
 * @returns Most frequent Position enum value or undefined.
 */
function getMostFrequentAutoPosition(
  matches: MatchModel[]
): Position | undefined {
  const recentMatches = matches.slice(-5);
  const positionCounts: Record<Position, number> = {} as Record<
    Position,
    number
  >;

  recentMatches.forEach((match) => {
    const position = match.AutoPosition;
    if (position in positionCounts) {
      positionCounts[position]++;
    } else {
      positionCounts[position] = 1;
    }
  });

  let mostFrequentPosition: Position | undefined;
  let maxCount = 0;

  for (const position in positionCounts) {
    if (positionCounts[position as Position] > maxCount) {
      mostFrequentPosition = position as Position;
      maxCount = positionCounts[position as Position];
    }
  }

  return mostFrequentPosition;
}

/**
 * Calculates the percentage of matches with successful auto mobility from the last 5 matches.
 * @param matches Array of MatchModel objects.
 * @returns Percentage of successful auto mobility.
 */
function getAutoMobilityPercentage(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  const mobilityCount = recentMatches.filter(
    (match) => match.AutoMobility
  ).length;
  return (mobilityCount / recentMatches.length) * 100;
}

/**
 * Calculates the average auto score from the last 5 matches, excluding the highest and lowest scores.
 * @param matches Array of MatchModel objects.
 * @returns Adjusted average auto score.
 */
function getAutoAverageScore(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  const scores = recentMatches.map((match) => match.TotalPointsAlliance);
  const sortedScores = scores.sort((a, b) => a - b);
  sortedScores.pop();
  sortedScores.shift();
  const sum = sortedScores.reduce((sum, score) => sum + score, 0);
  return sum / sortedScores.length;
}

/**
 * Calculates the adjusted average of auto game pieces handled, removing the highest and lowest values.
 * @param matches Array of MatchModel objects.
 * @returns Adjusted average of auto game pieces.
 */
function getAverageAutoGamePieces(matches: MatchModel[]): number {
  // Get only the last 5 matches
  const recentMatches = matches.slice(-5);

  // Calculate game pieces per match and sort them
  const gamePieceCounts = recentMatches
    .map((match) => {
      let count = 0;
      if (match.AutoGamePiece1) count++;
      if (match.AutoGamePiece2) count++;
      if (match.AutoGamePiece3) count++;
      if (match.AutoGamePiece4) count++;
      return count;
    })
    .sort((a, b) => a - b);

  // Remove the highest and lowest value
  if (gamePieceCounts.length > 2) {
    gamePieceCounts.pop(); // Remove highest
    gamePieceCounts.shift(); // Remove lowest
  }

  // Sum the remaining counts
  const totalGamePieces = gamePieceCounts.reduce(
    (sum, count) => sum + count,
    0
  );

  // Calculate average
  return gamePieceCounts.length ? totalGamePieces / gamePieceCounts.length : 0;
}

/**
 * Calculates the average number of auto objectives achieved in the last 5 matches.
 * Each auto objective is treated as a boolean value, and the average is calculated based on these values.
 * @param matches Array of MatchModel objects.
 * @returns The average number of objectives achieved.
 */
function getAverageAutoObjectivesAchieved(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  let totalObjectivesAchieved = 0;

  recentMatches.forEach((match) => {
    totalObjectivesAchieved += match.AutoObjective1 ? 1 : 0;
    totalObjectivesAchieved += match.AutoObjective2 ? 1 : 0;
    totalObjectivesAchieved += match.AutoObjective3 ? 1 : 0;
    totalObjectivesAchieved += match.AutoObjective4 ? 1 : 0;
    // Add more objectives here if necessary
  });

  return recentMatches.length
    ? totalObjectivesAchieved / recentMatches.length
    : 0;
}

/**
 * Calculates the average total number of game pieces scored during the teleop phase over the last five matches.
 * @param matches Array of MatchModel objects.
 * @returns The average total number of game pieces scored.
 */
function getAverageTeleopGamePiecesScored(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  let totalGamePieces = 0;

  recentMatches.forEach((match) => {
    totalGamePieces +=
      match.TeleopGamePeice1 +
      match.TeleopGamePeice2 +
      match.TeleopGamePeice3 +
      match.TeleopGamePeice4;
  });

  return recentMatches.length ? totalGamePieces / recentMatches.length : 0;
}

/**
 * Finds the maximum number of game pieces scored in any single match.
 * @param matches Array of MatchModel objects.
 * @returns Maximum number of game pieces scored.
 */
function getMaxGamePieces(matches: MatchModel[]): number {
  let maxGamePieces = 0;

  matches.forEach((match) => {
    const totalGamePieces =
      match.TeleopGamePeice1 +
      match.TeleopGamePeice2 +
      match.TeleopGamePeice3 +
      match.TeleopGamePeice4;
    if (totalGamePieces > maxGamePieces) {
      maxGamePieces = totalGamePieces;
    }
  });

  return maxGamePieces;
}

/**
 * Finds the minimum number of game pieces scored in any single match.
 * @param matches Array of MatchModel objects.
 * @returns Minimum number of game pieces scored.
 */
function getMinGamePieces(matches: MatchModel[]): number {
  let minGamePieces = Number.MAX_SAFE_INTEGER;

  matches.forEach((match) => {
    const totalGamePieces =
      match.TeleopGamePeice1 +
      match.TeleopGamePeice2 +
      match.TeleopGamePeice3 +
      match.TeleopGamePeice4;
    if (totalGamePieces < minGamePieces) {
      minGamePieces = totalGamePieces;
    }
  });

  // If no matches, return 0
  return minGamePieces === Number.MAX_SAFE_INTEGER ? 0 : minGamePieces;
}

/**
 * Calculates the standard deviation (1 σ) for the number of game pieces.
 * @param matches Array of MatchModel objects.
 * @returns The standard deviation for the number of game pieces.
 */
function getStandardDeviationOfGamePieces(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  let mean = 0;
  let sum = 0;

  // Calculate mean
  recentMatches.forEach((match) => {
    const totalGamePieces =
      match.TeleopGamePeice1 +
      match.TeleopGamePeice2 +
      match.TeleopGamePeice3 +
      match.TeleopGamePeice4;
    mean += totalGamePieces;
  });
  mean /= recentMatches.length;

  // Calculate variance
  recentMatches.forEach((match) => {
    const totalGamePieces =
      match.TeleopGamePeice1 +
      match.TeleopGamePeice2 +
      match.TeleopGamePeice3 +
      match.TeleopGamePeice4;
    sum += (totalGamePieces - mean) ** 2;
  });

  const variance = sum / recentMatches.length;

  // Return standard deviation
  return Math.sqrt(variance);
}

/**
 * Calculates the average number of dropped game pieces in the last 5 matches.
 * @param matches Array of MatchModel objects.
 * @returns The average number of dropped game pieces.
 */
function getAverageDroppedGamePieces(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  const totalDroppedGamePieces = recentMatches.reduce(
    (sum, match) => sum + match.DroppedGamePiece,
    0
  );
  return recentMatches.length
    ? totalDroppedGamePieces / recentMatches.length
    : 0;
}

/**
 * Counts the number of times the robot was incapacitated in the last 5 matches.
 * @param matches Array of MatchModel objects.
 * @returns The number of times the robot was incapacitated.
 */
function getTimesIncapacitated(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  return recentMatches.filter((match) => match.TeleopStatus2).length;
}

/**
 * Counts the number of times the robot falls in the last 5 matches.
 * @param matches Array of MatchModel objects.
 * @returns The number of times the robot fell.
 */
function getTimesRobotFalls(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  return recentMatches.filter((match) => match.TeleopStatus1).length;
}

/**
 * Calculates the average "Robot Tippy" score from the last 5 matches.
 * The score is determined by whether the 'TeleopStatus4' property is true.
 * @param matches Array of MatchModel objects.
 * @returns The average "Robot Tippy" score.
 */
function getAverageRobotTippyScore(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  const tippyCount = recentMatches.filter(
    (match) => match.TeleopStatus4
  ).length;
  return recentMatches.length ? tippyCount / recentMatches.length : 0;
}

/**
 * Calculates the average "Plays Defense" score from the last 5 matches.
 * The score is determined by whether the 'TeleopStatus3' property is true.
 * @param matches Array of MatchModel objects.
 * @returns The average "Plays Defense" score.
 */
function getAveragePlaysDefenseScore(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  const defenseCount = recentMatches.filter(
    (match) => match.TeleopStatus3
  ).length;
  return recentMatches.length ? defenseCount / recentMatches.length : 0;
}

/**
 * Calculates the average "Robot Field Awareness" score from the last 5 matches.
 * It uses the 'TeleopStatus6' property to determine the awareness level.
 * @param matches Array of MatchModel objects.
 * @returns The average "Robot Field Awareness" score.
 */
function getAverageRobotFieldAwareness(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  const awarenessScores = recentMatches.map((match) => {
    switch (match.TeleopStatus6) {
      case Aware.Minus:
        return 1; // Less aware
      case Aware.Normal:
        return 2; // Average
      case Aware.More:
        return 3; // Very aware
      default:
        return 0;
    }
  });
  const totalAwareness = awarenessScores.reduce(
    (sum: number, score) => sum + score,
    0
  );
  return recentMatches.length ? totalAwareness / recentMatches.length : 0;
}

/**
 * Calculates the average "Robot Quickness" score from the last 5 matches.
 * It uses the 'TeleopStatus5' property to determine the quickness level.
 * @param matches Array of MatchModel objects.
 * @returns The average "Robot Quickness" score.
 */
function getAverageRobotQuickness(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  const quicknessScores = recentMatches.map((match) => {
    switch (match.TeleopStatus5) {
      case Speed.Slow:
        return 1; // Slow
      case Speed.Average:
        return 2; // Average
      case Speed.Fast:
        return 3; // Fast
      default:
        return 0;
    }
  });
  const totalQuickness = quicknessScores.reduce(
    (sum: number, score) => sum + score,
    0
  );
  return recentMatches.length ? totalQuickness / recentMatches.length : 0;
}

export {
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
};