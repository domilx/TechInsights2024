import { EndGameHarmony, EndGameOnStage, Trap, MatchModel, Position, RankingPoints } from "./MatchModel";

const getMatchesPlayed = (matches: MatchModel[]) => {
  return matches.filter((match) => match.TeamNumber !== 0);
}

const getMatchesWon = (matches: MatchModel[]) => {
  return matches.filter((match) => match.AllianceRankingPoints === "Win");
}

const getWinRate = (matches: MatchModel[]) => {
  const played = getMatchesPlayed(matches).length;
  return played === 0 ? 0 : getMatchesWon(matches).length / played;
}

const getTotalRankingPoints = (matches: MatchModel[]) => {
  return matches.reduce((total, match) => {
    switch (match.AllianceRankingPoints) {
      case RankingPoints.Win:
        return total + 2; // Assuming 2 points for a win
      case RankingPoints.Tie:
        return total + 1; // Assuming 1 point for a tie
      case RankingPoints.Lose:
        return total;
    }
  }, 0);
}

const getAverageRankingPoints = (matches: MatchModel[]) => {
  const played = getMatchesPlayed(matches).length;
  return played === 0 ? 0 : getTotalRankingPoints(matches) / played;
}

const getAutoPositionFrequency = (matches: MatchModel[]) => {
  const positionFrequency = { Left: 0, Middle: 0, Right: 0 };

  matches.forEach(match => {
      positionFrequency[match.AutoStartingPosition]++;
  });

  return positionFrequency;
};


const getAvgAutoNotesAmp = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + match.AutoAmp, 0) / (lastFive.length || 1);
};

const getAvgAutoNotesSpeaker = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + match.AutoSpeaker, 0) / (lastFive.length || 1);
};

const getAvgTotalAutoPoints = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + match.AutoAmp + match.AutoSpeaker, 0) / (lastFive.length || 1);
};

const getLeavePercentage = (matches: MatchModel[]) => {
  const leaveCount = matches.filter((match) => match.AutoLeave).length;
  return leaveCount / (matches.length || 1);
};

const getAvgTeleopNotesAmp = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + match.TeleopAmplifier, 0) / (lastFive.length || 1);
};

const getAvgTeleopNotesSpeaker = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + match.TeleopSpeaker, 0) / (lastFive.length || 1);
};

const getAvgTeleopNotesAmplifiedSpeaker = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + match.TeleopSpeakerAmplified, 0) / (lastFive.length || 1);
};

const getAvgTotalTeleopPoints = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + match.TeleopAmplifier + match.TeleopSpeaker + match.TeleopSpeakerAmplified, 0) / (lastFive.length || 1);
};

const getTrapPoints = (trap: Trap) => {
  switch (trap) {
    case Trap.ZeroPoints:
      return 0;
    case Trap.FivePoints:
      return 5;
    case Trap.TenPoints:
      return 10;
    case Trap.FifteenPoints:
      return 15;
    case Trap.TrapFailed:
      return 0;
    default:
      return 0;
  }
}

const getAvgTotalEndGamePoints = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => {
    let points = 0;
    points += match.EndGameOnStage === EndGameOnStage.Park ? 2 : (match.EndGameOnStage === EndGameOnStage.OnStage ? 3 : 0);
    points += match.EndGameHarmony === EndGameHarmony.TwoPoints ? 2 : 0;
    points += getTrapPoints(match.EndGameTrap);
    points += match.EndGameSpotLighted ? 1 : 0;
    return total + points;
  }, 0) / (lastFive.length || 1);
};

const getAvgOnStagePoints = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => {
    return total + (match.EndGameOnStage === EndGameOnStage.Park ? 2 : (match.EndGameOnStage === EndGameOnStage.OnStage ? 3 : 0));
  }, 0) / (lastFive.length || 1);
};

const getAvgTrapPoints = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + getTrapPoints(match.EndGameTrap), 0) / (lastFive.length || 1);
};

const getTrapNotes = (trap: Trap) => {
  switch (trap) {
    case Trap.ZeroPoints:
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
  return lastFive.reduce((total, match) => {
    const endGameTrap = getTrapNotes(match.EndGameTrap);
    const teleopTrap = getTrapNotes(match.TeleopTrap);
    return total + match.AutoAmp + match.AutoSpeaker + match.TeleopAmplifier + match.TeleopSpeaker + match.TeleopSpeakerAmplified + endGameTrap + teleopTrap;
  }, 0) / (lastFive.length || 1);
};

const getAvgTotalPoints = (matches: MatchModel[], isLastFive: boolean = false) => {
  const relevantMatches = isLastFive ? matches.slice(-5) : matches;
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => {
    const autoPoints = match.AutoAmp * 2 + match.AutoSpeaker * 5;
    const teleopPoints = match.TeleopSpeakerAmplified * 5 + match.TeleopSpeaker * 2 + match.TeleopAmplifier;
    let endGamePoints = (match.EndGameOnStage === EndGameOnStage.Park ? 2 : (match.EndGameOnStage === EndGameOnStage.OnStage ? 3 : 0)) +
                        (match.EndGameHarmony === EndGameHarmony.TwoPoints ? 2 : 0) +
                        getTrapPoints(match.EndGameTrap) +
                        (match.EndGameSpotLighted ? 1 : 0);
    return total + autoPoints + teleopPoints + endGamePoints;
  }, 0) / (lastFive.length || 1);
};

const getAvgPointsContributionRatioAllMatches = (matches: MatchModel[]) => {
  if (matches.length === 0) return 0;

  const avgTotalPointsAllMatches = getAvgTotalPoints(matches);
  return matches.reduce((total, match) => {
      const matchContributionRatio = match.AllianceTotalPoints > 0 ? match.AllianceTotalPoints / avgTotalPointsAllMatches : 0;
      return total + matchContributionRatio;
  }, 0) / matches.length;
};

const getAvgPointsContributionRatioLastFive = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  if (lastFive.length === 0) return 0;

  const avgTotalPointsLastFive = getAvgTotalPoints(matches, true);
  return lastFive.reduce((total, match) => {
      const matchContributionRatio = match.AllianceTotalPoints > 0 ? match.AllianceTotalPoints / avgTotalPointsLastFive : 0;
      return total + matchContributionRatio;
  }, 0) / lastFive.length;
};

const getAbsMaxMinNotes = (matches: MatchModel[]) => {
  if (matches.length === 0) return { max: 0, min: 0 };

  let maxNotes = Number.MIN_SAFE_INTEGER;
  let minNotes = Number.MAX_SAFE_INTEGER;

  matches.forEach(match => {
      const totalNotes = match.AutoAmp + match.AutoSpeaker + match.TeleopAmplifier + match.TeleopSpeaker + match.TeleopSpeakerAmplified;
      maxNotes = Math.max(maxNotes, totalNotes);
      minNotes = Math.min(minNotes, totalNotes);
  });

  return { max: maxNotes, min: minNotes };
};

const getStandardDeviationNotes = (matches: MatchModel[]) => {
  if (matches.length === 0) return 0;

  const mean = matches.reduce((acc, match) => acc + match.AutoAmp + match.AutoSpeaker + match.TeleopAmplifier + match.TeleopSpeaker + match.TeleopSpeakerAmplified, 0) / matches.length;
  const variance = matches.reduce((acc, match) => {
      const totalNotes = match.AutoAmp + match.AutoSpeaker + match.TeleopAmplifier + match.TeleopSpeaker + match.TeleopSpeakerAmplified;
      return acc + Math.pow(totalNotes - mean, 2);
  }, 0) / matches.length;

  return Math.sqrt(variance);
};

const getShootingPositionFrequency = (matches: MatchModel[]) => {
  const shootingFrequency = {
      "Starting Zone": 0, 
      "Podium": 0, 
      "Elsewhere in Wing": 0, 
      "Near Centre Line": 0
  };

  matches.forEach(match => {
      if (match.TeleopShootsFrom in shootingFrequency) {
          shootingFrequency[match.TeleopShootsFrom]++;
      }
  });

  return shootingFrequency;
};

const getAvgCycleTimeLastFive = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + match.TeleopCycleTime, 0) / (lastFive.length || 1);
};

const getPercentageDroppedNotes = (matches: MatchModel[]) => {
  const totalDropped = matches.reduce((total, match) => total + match.TeleopDropped + match.AutoDropped, 0);
  const totalNotes = matches.reduce((total, match) => total + match.AutoAmp + match.AutoSpeaker + match.TeleopAmplifier + match.TeleopSpeaker + match.TeleopSpeakerAmplified, 0);

  return totalNotes > 0 ? (totalDropped / totalNotes) * 100 : 0;
};

const getTimesIncapacitatedAndFalls = (matches: MatchModel[]) => {
  const incapacitated = matches.filter(match => match.TeleopIncapacitated || match.AutoIncapacitated).length;
  const falls = matches.filter(match => match.TeleopFell || match.AutoFell).length;

  return { incapacitated, falls };
};

export {
  getMatchesPlayed,
  getMatchesWon,
  getWinRate,
  getTotalRankingPoints,
  getAverageRankingPoints,
  getAutoPositionFrequency,
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
  getAbsMaxMinNotes,
  getStandardDeviationNotes,
  getShootingPositionFrequency,
  getAvgCycleTimeLastFive,
  getPercentageDroppedNotes,
  getTimesIncapacitatedAndFalls,
}
