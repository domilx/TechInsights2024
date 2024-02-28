import {
  EndGameHarmony,
  EndGameOnStage,
  Trap,
  MatchModel,
  Position,
  RankingPoints,
  ShootSpots,
  TrapEndGame,
} from "./MatchModel";

const getMatchesPlayed = (matches: MatchModel[]) => {
  let played = 0;
  matches.forEach((match) => {
    if (match.AllianceTotalPoints > 0) {
      played++;
    }
  });
  return played.toFixed(0);
};

const getMatchesWon = (matches: MatchModel[]) => {
  let won = 0;
  matches.forEach((match) => {
    if (match.AllianceRankingPoints === RankingPoints.Win) {
      won++;
    }
  });
  return won.toFixed(0);
};

const getWinRate = (matches: MatchModel[]) => {
  const played = getMatchesPlayed(matches);
  // @ts-ignore
  return (played === 0 ? 0 : (getMatchesWon(matches) / played) * 100).toFixed(
    0
  );
};

const getTotalRankingPoints = (matches: MatchModel[]) => {
  let totalPoints = 0;

  matches.forEach((match) => {
    let points = 0;

    switch (match.AllianceRankingPoints) {
      case RankingPoints.Win:
        points += 2;
        break;
      case RankingPoints.Tie:
        points += 1;
        break;
      case RankingPoints.Lose:
        break;
    }

    if (match.AllianceMelody === true) {
      points += 1;
    }
    if (match.AllianceEnsemble === true) {
      points += 1;
    }

    totalPoints += points;
  });

  return totalPoints.toFixed(0);
};

const getAverageRankingPoints = (matches: MatchModel[]) => {
  const played = getMatchesPlayed(matches);
  // @ts-ignore
  return (played === 0 ? 0 : getTotalRankingPoints(matches) / played).toFixed(
    1
  );
};

const getAutoPositionFrequencyLeft = (matches: MatchModel[]) => {
  const left = matches.filter(
    (match) => match.AutoStartingPosition === Position.Left
  ).length;
  return (left / (matches.length || 1)) * 100;
};

const getAutoPositionFrequencyRight = (matches: MatchModel[]) => {
  const right = matches.filter(
    (match) => match.AutoStartingPosition === Position.Right
  ).length;
  return (right / (matches.length || 1)) * 100;
};

const getAutoPositionFrequencyMiddle = (matches: MatchModel[]) => {
  const middle = matches.filter(
    (match) => match.AutoStartingPosition === Position.Middle
  ).length;
  return (middle / (matches.length || 1)) * 100;
};

const getAvgAutoNotesAmp = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return (
    lastFive.reduce((total, match) => total + match.AutoAmp, 0) /
    (lastFive.length || 1)
  ).toFixed(1);
};

const getAvgAutoNotesSpeaker = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return (
    lastFive.reduce((total, match) => total + match.AutoSpeaker, 0) /
    (lastFive.length || 1)
  ).toFixed(1);
};

const getAvgTotalAutoPoints = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return (
    lastFive.reduce((total, match) => {
      var autoPoints = match.AutoAmp * 2 + match.AutoSpeaker * 5;
      if (match.AutoLeave) {
        autoPoints += 2;
      }
      return total + autoPoints;
    }, 0) / (lastFive.length || 1)
  ).toFixed(1);
};

const getLeavePercentage = (matches: MatchModel[]) => {
  const leaveCount = matches.filter((match) => match.AutoLeave).length;
  return ((leaveCount / (matches.length || 1)) * 100).toFixed(0);
};

const getAvgTeleopNotesAmp = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return (
    lastFive.reduce((total, match) => total + match.TeleopAmplifier, 0) /
    (lastFive.length || 1)
  ).toFixed(1);
};

const getAvgTeleopNotesSpeaker = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return (
    lastFive.reduce((total, match) => total + match.TeleopSpeaker, 0) /
    (lastFive.length || 1)
  ).toFixed(1);
};

const getAvgTeleopNotesAmplifiedSpeaker = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return (
    lastFive.reduce((total, match) => total + match.TeleopSpeakerAmplified, 0) /
    (lastFive.length || 1)
  ).toFixed(1);
};

const getAvgTotalTeleopPoints = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return (
    lastFive.reduce((total, match) => {
      const teleopPoints =
        match.TeleopSpeakerAmplified * 5 +
        match.TeleopSpeaker * 2 +
        match.TeleopAmplifier;
      return total + teleopPoints;
    }, 0) / (lastFive.length || 1)
  ).toFixed(1);
};

const getEndTrapPoints = (trap: TrapEndGame) => {
  switch (trap) {
    case TrapEndGame.ZeroPoints:
      return 0;
    case TrapEndGame.FivePoints:
      return 5;
    case TrapEndGame.TrapFailed:
      return 0;
    default:
      return 0;
  }
};

const getAvgTotalEndGamePoints = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  const totalPoints = lastFive.reduce((total, match) => {
    let points = 0;
    points += match.EndGameOnStage === EndGameOnStage.Park ? 1 : 0;
    points += match.EndGameOnStage === EndGameOnStage.OnStage ? 3 : 0;
    points += match.EndGameHarmony === EndGameHarmony.TwoPoints ? 2 : 0;
    points += getEndTrapPoints(match.EndGameTrap);
    points += match.EndGameSpotLighted ? 1 : 0;
    return total + points;
  }, 0);
  return (totalPoints / (lastFive.length || 1)).toFixed(1);
};

const getAvgOnStagePoints = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return (
    lastFive.reduce((total, match) => {
      return (
        total +
        (match.EndGameOnStage === EndGameOnStage.Park
          ? 2
          : match.EndGameOnStage === EndGameOnStage.OnStage
          ? 3
          : 0)
      );
    }, 0) / (lastFive.length || 1)
  ).toFixed(1);
};

const getAvgTrapPoints = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return (
    lastFive.reduce(
      (total, match) => total + getEndTrapPoints(match.EndGameTrap),
      0
    ) / (lastFive.length || 1)
  ).toFixed(1);
};

const getTrapNotes = (trap: Trap) => {
  switch (trap) {
    case Trap.TrapFailed:
      return 0;
    case Trap.FivePoints:
      return 1;
    case Trap.TenPoints:
      return 2;
    case Trap.FifteenPoints:
      return 3;
    default:
      return 0;
  }
};

const getAvgNumTotalNotesFullMatch = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return (
    lastFive.reduce((total, match) => {
      return (
        total +
        match.AutoAmp +
        match.AutoSpeaker +
        match.TeleopAmplifier +
        match.TeleopSpeaker +
        match.TeleopSpeakerAmplified
      );
    }, 0) / (lastFive.length || 1)
  ).toFixed(1);
};

const getAvgTotalPoints = (
  matches: MatchModel[],
  isLastFive: boolean = false
) => {
  const relevantMatches = isLastFive ? matches.slice(-5) : matches;
  const autoPoints = getAvgTotalAutoPoints(relevantMatches);
  const teleopPoints = getAvgTotalTeleopPoints(relevantMatches);
  const endGamePoints = getAvgTotalEndGamePoints(relevantMatches);
  return (
    parseFloat(autoPoints) + parseFloat(teleopPoints) + parseFloat(endGamePoints)
  ).toFixed(1);
};

const getAvgPointsContributionRatioAllMatches = (matches: MatchModel[]) => {
  if (matches.length === 0) return 0;

  const avgTotalPointsAllMatches = getAvgTotalPoints(matches);
  return (
    (matches.reduce((total, match) => {
      const matchContributionRatio =
        // @ts-ignore
        avgTotalPointsAllMatches / match.AllianceTotalPoints;
      return total + matchContributionRatio;
    }, 0) /
      matches.length) *
    100
  ).toFixed(1);
};

const getAvgPointsContributionRatioLastFive = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  if (lastFive.length === 0) return 0;

  const avgTotalPointsLastFive = getAvgTotalPoints(matches, true);
  return (
    (lastFive.reduce((total, match) => {
      const matchContributionRatio =
        // @ts-ignore
        avgTotalPointsLastFive / match.AllianceTotalPoints;
      return total + matchContributionRatio;
    }, 0) /
      lastFive.length) *
    100
  ).toFixed(1);
};

const getAbsMaxNotes = (matches: MatchModel[]) => {
  if (matches.length === 0) return 0;

  let maxNotes = Number.MIN_SAFE_INTEGER;

  matches.forEach((match) => {
    const totalNotes =
      match.AutoAmp +
      match.AutoSpeaker +
      match.TeleopAmplifier +
      match.TeleopSpeaker +
      match.TeleopSpeakerAmplified;
    maxNotes = Math.max(maxNotes, totalNotes);
  });

  return maxNotes.toFixed(0);
};

const getAbsMinNotes = (matches: MatchModel[]) => {
  if (matches.length === 0) return 0;

  let minNotes = Number.MAX_SAFE_INTEGER;

  matches.forEach((match) => {
    const totalNotes =
      match.AutoAmp +
      match.AutoSpeaker +
      match.TeleopAmplifier +
      match.TeleopSpeaker +
      match.TeleopSpeakerAmplified;
    minNotes = Math.min(minNotes, totalNotes);
  });

  return minNotes.toFixed(0);
};

const getStandardDeviationNotes = (matches: MatchModel[]) => {
  if (matches.length === 0) return 0;

  const mean =
    matches.reduce(
      (acc, match) =>
        acc +
        match.AutoAmp +
        match.AutoSpeaker +
        match.TeleopAmplifier +
        match.TeleopSpeaker +
        match.TeleopSpeakerAmplified,
      0
    ) / matches.length;
  const variance =
    matches.reduce((acc, match) => {
      const totalNotes =
        match.AutoAmp +
        match.AutoSpeaker +
        match.TeleopAmplifier +
        match.TeleopSpeaker +
        match.TeleopSpeakerAmplified;
      return acc + Math.pow(totalNotes - mean, 2);
    }, 0) / matches.length;

  return "±" + Math.sqrt(variance).toPrecision(3);
};

const getShootingPositionIfStartingZone = (match: MatchModel[]) => {
  let bool = false;
  for (let i = 0; i < match.length; i++) {
    if (match[i].AutoStartingPosition === Position.Middle) {
      bool = true;
      break;
    }
  }
  return bool ? "Yes" : "No";
};

const getShootingPositionIfPodium = (match: MatchModel[]) => {
  let bool = false;
  for (let i = 0; i < match.length; i++) {
    if (
      match[i].AutoStartingPosition === Position.Left ||
      match[i].AutoStartingPosition === Position.Right
    ) {
      bool = true;
      break;
    }
  }
  return bool ? "Yes" : "No";
};

const getShootingPositionIfElsewhereInWing = (match: MatchModel[]) => {
  let bool = false;
  for (let i = 0; i < match.length; i++) {
    if (match[i].AutoStartingPosition === Position.Middle) {
      bool = true;
      break;
    }
  }
  return bool ? "Yes" : "No";
};

const getShootingPositionIfNearCenterLine = (match: MatchModel[]) => {
  let bool = false;
  for (let i = 0; i < match.length; i++) {
    if (match[i].AutoStartingPosition === Position.Middle) {
      bool = true;
      break;
    }
  }
  return bool ? "Yes" : "No";
};

const getAvgCycleTimeLastFive = (matches: MatchModel[]): number => {
  const lastFive = matches.slice(-5);
  const cycleTimes = lastFive
    .flatMap((match) => match.TeleopCycleTime)
    //@ts-ignore
    .map((time) => parseFloat(time))
    .filter((time) => !isNaN(time));
  const sumCycleTimes = cycleTimes.reduce((total, time) => total + time, 0);
  const averageCycleTime =
    cycleTimes.length > 0 ? sumCycleTimes / cycleTimes.length : 0;
  return averageCycleTime;
};

const getPercentageDroppedNotes = (matches: MatchModel[]) => {
  const totalDropped = matches.reduce(
    (total, match) =>
      total +
      match.TeleopDropped +
      match.AutoDropped -
      match.TeleopGamePieceStuck,
    0
  );
  const totalNotes = matches.reduce(
    (total, match) =>
      total +
      match.AutoAmp +
      match.AutoSpeaker +
      match.TeleopAmplifier +
      match.TeleopSpeaker +
      match.TeleopSpeakerAmplified,
    0
  );

  return totalNotes > 0 ? (totalDropped / totalNotes) * 100 : 0;
};

const getTimesIncapacitated = (matches: MatchModel[]) => {
  return matches.filter((match) => match.TeleopIncapacitated).length.toFixed(0);
};

const getTimesFell = (matches: MatchModel[]) => {
  return (
    matches.filter((match) => match.TeleopFell).length +
    matches.filter((match) => match.AutoFell).length
  ).toFixed(0);
};

// Enum to Number mappings based on the provided scoring system
const DefenseLevelScores: { [key: string]: number } = {
  "No": 0,
  "A Little": 1,
  "Average": 2,
  "A Lot": 3
};

const TippinessScores: { [key: string]: number } = {
  "Not": 0,
  "A Little": 1,
  "Very": 2
};

const SpeedScores: { [key: string]: number } = {
  "Slow": 0,
  "Average": 1,
  "Fast": 2
};

const AwarenessScores: { [key: string]: number } = {
  "Less Aware": 0,
  "Average": 1,
  "Very Aware": 2
};

function calculateAveragePlaysDefense(matches: MatchModel[]): number {
  let totalScore = 0;
  let count = 0;

  matches.forEach(match => {
    if (match.PlaysDefense !== undefined) {
      totalScore += DefenseLevelScores[match.PlaysDefense];
      count++;
    }
  });

  return count > 0 ? parseFloat((totalScore / count).toFixed(2)) : 0;
}

function calculateAverageRobotTippy(matches: MatchModel[]): number {
  let totalScore = 0;
  let count = 0;

  matches.forEach(match => {
    if (match.RobotTippy !== undefined) {
      totalScore += TippinessScores[match.RobotTippy];
      count++;
    }
  });

  return count > 0 ? parseFloat((totalScore / count).toFixed(2)) : 0;
}

function calculateAverageRobotFast(matches: MatchModel[]): number {
  let totalScore = 0;
  let count = 0;

  matches.forEach(match => {
    if (match.RobotSpeed !== undefined) {
      totalScore += SpeedScores[match.RobotSpeed];
      count++;
    }
  });

  return count > 0 ? parseFloat((totalScore / count).toFixed(2)) : 0;
}

function calculateAverageRobotAwareness(matches: MatchModel[]): number {
  let totalScore = 0;
  let count = 0;

  matches.forEach(match => {
    if (match.FieldAwareness !== undefined) {
      totalScore += AwarenessScores[match.FieldAwareness];
      count++;
    }
  });

  return count > 0 ? parseFloat((totalScore / count).toFixed(2)) : 0;
}


export {
  getMatchesPlayed,
  getMatchesWon,
  getWinRate,
  getTotalRankingPoints,
  getAverageRankingPoints,
  getAutoPositionFrequencyLeft,
  getAutoPositionFrequencyRight,
  getAutoPositionFrequencyMiddle,
  getAvgAutoNotesAmp,
  getAvgAutoNotesSpeaker,
  getAvgTotalAutoPoints,
  getLeavePercentage,
  getAvgTeleopNotesAmp,
  getAvgTeleopNotesSpeaker,
  getAvgTeleopNotesAmplifiedSpeaker,
  getAvgTotalTeleopPoints,
  getAvgTotalEndGamePoints,
  getAvgOnStagePoints,
  getAvgTrapPoints,
  getAvgNumTotalNotesFullMatch,
  getAvgTotalPoints,
  getAvgPointsContributionRatioAllMatches,
  getAvgPointsContributionRatioLastFive,
  getAbsMaxNotes,
  getAbsMinNotes,
  getStandardDeviationNotes,
  getShootingPositionIfStartingZone,
  getShootingPositionIfPodium,
  getShootingPositionIfElsewhereInWing,
  getShootingPositionIfNearCenterLine,
  getAvgCycleTimeLastFive,
  getPercentageDroppedNotes,
  getTimesIncapacitated,
  getTimesFell,
  calculateAveragePlaysDefense,
  calculateAverageRobotTippy,
  calculateAverageRobotFast,
  calculateAverageRobotAwareness
};
