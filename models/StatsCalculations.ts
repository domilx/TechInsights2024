import { AutoMobilityPoints, AutoObjectivePoints, Aware, GamePieceType, MatchModel, Position, Speed, TeleopGamePiecePoints } from "./MatchModel";

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
    (sum, match) => sum + (match.CycleTime.reduce((a, b) => a + b, 0) / match.CycleTime.length),
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
 * Calculates the average points for auto objectives achieved in the last 5 matches.
 * @param matches Array of MatchModel objects.
 * @returns The average points for objectives achieved.
 */
function getAverageAutoObjectivesAchieved(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  let totalObjectivesPoints = 0;

  recentMatches.forEach((match) => {
    totalObjectivesPoints += AutoObjectivePoints[match.AutoObjective1];
    totalObjectivesPoints += AutoObjectivePoints[match.AutoObjective2];
  });

  return recentMatches.length ? totalObjectivesPoints / (recentMatches.length * 2) : 0;
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
      match.TeleopGamePiece1 +
      match.TeleopGamePiece2 +
      match.TeleopGamePiece3 +
      match.TeleopGamePiece4;
  });

  return recentMatches.length ? totalGamePieces / recentMatches.length : 0;
}


/**
 * Finds the maximum number of game pieces scored in any single match.
 * @param matches Array of MatchModel objects.
 * @returns Maximum number of game pieces scored.
 */
function getMaxGamePieces(matches: MatchModel[]): number {
  return matches.reduce((max, match) => {
    const totalGamePieces =
      match.TeleopGamePiece1 +
      match.TeleopGamePiece2 +
      match.TeleopGamePiece3 +
      match.TeleopGamePiece4;
    return Math.max(max, totalGamePieces);
  }, 0);
}

/**
 * Finds the minimum number of game pieces scored in any single match.
 * @param matches Array of MatchModel objects.
 * @returns Minimum number of game pieces scored.
 */
function getMinGamePieces(matches: MatchModel[]): number {
  let minGamePieces = matches.reduce((min, match) => {
    const totalGamePieces =
      match.TeleopGamePiece1 +
      match.TeleopGamePiece2 +
      match.TeleopGamePiece3 +
      match.TeleopGamePiece4;
    return Math.min(min, totalGamePieces);
  }, Number.MAX_SAFE_INTEGER);

  return minGamePieces === Number.MAX_SAFE_INTEGER ? 0 : minGamePieces;
}


/**
 * Calculates the standard deviation (1 σ) for the number of game pieces in the teleop phase.
 * @param matches Array of MatchModel objects.
 * @returns The standard deviation for the number of game pieces.
 */
function getStandardDeviationOfGamePieces(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  let mean = recentMatches.reduce((sum, match) => sum + (
      match.TeleopGamePiece1 +
      match.TeleopGamePiece2 +
      match.TeleopGamePiece3 +
      match.TeleopGamePiece4
    ), 0) / recentMatches.length;

  const variance = recentMatches.reduce((sum, match) => {
    const totalGamePieces =
      match.TeleopGamePiece1 +
      match.TeleopGamePiece2 +
      match.TeleopGamePiece3 +
      match.TeleopGamePiece4;
    return sum + (totalGamePieces - mean) ** 2;
  }, 0) / recentMatches.length;

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
  return (recentMatches.length ? defenseCount / recentMatches.length : 0) * 100;
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
 * Calculates the total points scored during the Autonomous phase of matches.
 * Includes points from objectives and additional points for high auto mobility.
 * @param matches Array of MatchModel objects.
 * @returns Total Auto points.
 */
function getTotalAutoPoints(matches: MatchModel[]): number {
  return matches.reduce((sum, match) => {
    return sum + AutoObjectivePoints[match.AutoObjective1] + AutoObjectivePoints[match.AutoObjective2] + 
      (match.AutoMobility ? AutoMobilityPoints : 0);
  }, 0);
}

/**
 * Calculates the total points scored during the Teleoperated phase of matches.
 * @param matches Array of MatchModel objects.
 * @returns Total Teleop points.
 */
function getTotalTeleopPoints(matches: MatchModel[]): number {
  return matches.reduce((sum, match) => {
    return sum + 
      match.TeleopGamePiece1 * TeleopGamePiecePoints[GamePieceType.GamePiece1] +
      match.TeleopGamePiece2 * TeleopGamePiecePoints[GamePieceType.GamePiece2];
  }, 0);
}

/**
 * Calculates the average points scored per match.
 * @param matches Array of MatchModel objects.
 * @returns Average points per match.
 */
function getAveragePointsPerMatch(matches: MatchModel[]): number {
  const totalPoints = matches.reduce((sum, match) => sum + match.TotalPointsAlliance, 0);
  return matches.length ? totalPoints / matches.length : 0;
}

/**
 * Calculates the win rate for matches where the robot had high auto mobility.
 * @param matches Array of MatchModel objects.
 * @returns Win rate with high mobility.
 */
function getWinRateWithHighMobility(matches: MatchModel[]): number {
  const highMobilityWins = matches.filter(match => match.AutoMobility && match.WonMatch).length;
  const highMobilityMatches = matches.filter(match => match.AutoMobility).length;
  return highMobilityMatches ? highMobilityWins / highMobilityMatches : 0;
}

/**
 * Calculates the ratio of the team's points to the total alliance points.
 * @param matches Array of MatchModel objects.
 * @returns Points contribution ratio.
 */
function getPointsContributionRatio(matches: MatchModel[]): number {
  return matches.reduce((sum, match) => {
    return sum + (match.TotalPointsAlliance ? match.RankingPointsAlliance / match.TotalPointsAlliance : 0);
  }, 0) / matches.length;
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

/**
 * Calculates the average number of gamepiece 1
 * @param matches Array of MatchModel objects.
 * @returns The average number of gamepiece 1
 */
function getAverageGamePiece1(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  const totalGamePieces = recentMatches.reduce(
    (sum, match) => sum + match.TeleopGamePiece1,
    0
  );
  return recentMatches.length
    ? totalGamePieces / recentMatches.length
    : 0;
}

/**
 * Calculates the average number of gamepiece 2
 * @param matches Array of MatchModel objects.
 * @returns The average number of gamepiece 2
 */
function getAverageGamePiece2(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  const totalGamePieces = recentMatches.reduce(
    (sum, match) => sum + match.TeleopGamePiece2,
    0
  );
  return recentMatches.length
    ? totalGamePieces / recentMatches.length
    : 0;
}

/**
 * Calculates the average number of gamepiece 3
 * @param matches Array of MatchModel objects.
 * @returns The average number of gamepiece 3
 */
function getAverageGamePiece3(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  const totalGamePieces = recentMatches.reduce(
    (sum, match) => sum + match.TeleopGamePiece3,
    0
  );
  return recentMatches.length
    ? totalGamePieces / recentMatches.length
    : 0;
}

/**
 * Calculates the average number of gamepiece 4
 * @param matches Array of MatchModel objects.
 * @returns The average number of gamepiece 4
 */
function getAverageGamePiece4(matches: MatchModel[]): number {
  const recentMatches = matches.slice(-5);
  const totalGamePieces = recentMatches.reduce(
    (sum, match) => sum + match.TeleopGamePiece4,
    0
  );
  return recentMatches.length
    ? totalGamePieces / recentMatches.length
    : 0;
}

export {
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
};