import { EndGameHarmony, EndGameOnStage, Trap, MatchModel, Position, RankingPoints, ShootSpots } from "./MatchModel";

const getMatchesPlayed = (matches: MatchModel[]) => {
  let played = 0;
  matches.forEach(match => {
      if (match.AllianceTotalPoints > 0) {
          played++;
      }
  });
  return played;
}

const getMatchesWon = (matches: MatchModel[]) => {
  let won = 0;
  matches.forEach(match => {
      if (match.AllianceRankingPoints === RankingPoints.Win) {
          won++;
      }
  });
  return won;
}

const getWinRate = (matches: MatchModel[]) => {
  const played = getMatchesPlayed(matches);
  return played === 0 ? 0 : getMatchesWon(matches) / played * 100;
}

const getTotalRankingPoints = (matches: MatchModel[]) => {
  return matches.reduce((total, match) => {
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

    if (match.EndGameOnStage === EndGameOnStage.OnStage) {
      points += 1;
    }

    if (
      match.AutoAmp + match.AutoSpeaker >= 18 &&
      match.TeleopAmplifier + match.TeleopSpeakerAmplified + match.TeleopSpeaker >= 18
    ) {
      points += 1;
    } else if (
      match.AutoAmp + match.AutoSpeaker >= 15 &&
      match.TeleopAmplifier + match.TeleopSpeakerAmplified + match.TeleopSpeaker >= 15 &&
      match.EndGameHarmony === EndGameHarmony.TwoPoints
    ) {
      points += 1;
    }

    return total + points;
  }, 0);
}

const getAverageRankingPoints = (matches: MatchModel[]) => {
  const played = getMatchesPlayed(matches);
  return played === 0 ? 0 : getTotalRankingPoints(matches) / played;
}

const getAutoPositionFrequencyLeft = (matches: MatchModel[]) => {
  const left = matches.filter(match => match.AutoStartingPosition === Position.Left).length;
  return left / (matches.length || 1) * 100;
}

const getAutoPositionFrequencyRight = (matches: MatchModel[]) => {
  const right = matches.filter(match => match.AutoStartingPosition === Position.Right).length;
  return right / (matches.length || 1) * 100;
}

const getAutoPositionFrequencyMiddle = (matches: MatchModel[]) => {
  const middle = matches.filter(match => match.AutoStartingPosition === Position.Middle).length;
  return middle / (matches.length || 1) * 100;
}

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
  return lastFive.reduce((total, match) => {
    const autoPoints = match.AutoAmp * 2 + match.AutoSpeaker * 5;
    return total + autoPoints + (match.AutoLeave ? 0 : 2);
  }, 0) / (lastFive.length || 1);
};

const getLeavePercentage = (matches: MatchModel[]) => {
  const leaveCount = matches.filter((match) => match.AutoLeave).length;
  return leaveCount / (matches.length || 1) * 100;
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
  return lastFive.reduce((total, match) => {
    const teleopPoints = match.TeleopSpeakerAmplified * 5 + match.TeleopSpeaker * 2 + match.TeleopAmplifier;
    return total + teleopPoints;
  }, 0) / (lastFive.length || 1);
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
  return relevantMatches.reduce((total, match) => {
    const autoPoints = match.AutoAmp * 2 + match.AutoSpeaker * 5;
    const teleopPoints = match.TeleopSpeakerAmplified * 5 + match.TeleopSpeaker * 2 + match.TeleopAmplifier;
    let endGamePoints = (match.EndGameOnStage === EndGameOnStage.Park ? 2 : (match.EndGameOnStage === EndGameOnStage.OnStage ? 3 : 0)) +
                        (match.EndGameHarmony === EndGameHarmony.TwoPoints ? 2 : 0) +
                        getTrapPoints(match.EndGameTrap) +
                        (match.EndGameSpotLighted ? 1 : 0);
    return total + autoPoints + teleopPoints + endGamePoints;
  }, 0) / (relevantMatches.length || 1);
};

const getAvgPointsContributionRatioAllMatches = (matches: MatchModel[]) => {
  if (matches.length === 0) return 0;

  const avgTotalPointsAllMatches = getAvgTotalPoints(matches);
  return matches.reduce((total, match) => {
      const matchContributionRatio = match.AllianceTotalPoints > 0 ? match.AllianceTotalPoints / avgTotalPointsAllMatches : 0;
      return total + matchContributionRatio;
  }, 0) / matches.length * 100;
};

const getAvgPointsContributionRatioLastFive = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  if (lastFive.length === 0) return 0;

  const avgTotalPointsLastFive = getAvgTotalPoints(matches, true);
  return lastFive.reduce((total, match) => {
      const matchContributionRatio = match.AllianceTotalPoints > 0 ? match.AllianceTotalPoints / avgTotalPointsLastFive : 0;
      return total + matchContributionRatio;
  }, 0) / lastFive.length * 100;
};

const getAbsMaxNotes = (matches: MatchModel[]) => {
  if (matches.length === 0) return 0;

  let maxNotes = Number.MIN_SAFE_INTEGER;

  matches.forEach(match => {
      const totalNotes = match.AutoAmp + match.AutoSpeaker + match.TeleopAmplifier + match.TeleopSpeaker + match.TeleopSpeakerAmplified;
      maxNotes = Math.max(maxNotes, totalNotes);
  });

  return maxNotes;
}

const getAbsMinNotes = (matches: MatchModel[]) => {
  if (matches.length === 0) return 0;

  let minNotes = Number.MAX_SAFE_INTEGER;

  matches.forEach(match => {
      const totalNotes = match.AutoAmp + match.AutoSpeaker + match.TeleopAmplifier + match.TeleopSpeaker + match.TeleopSpeakerAmplified;
      minNotes = Math.min(minNotes, totalNotes);
  });

  return minNotes;
}

const getStandardDeviationNotes = (matches: MatchModel[]) => {
  if (matches.length === 0) return 0;

  const mean = matches.reduce((acc, match) => acc + match.AutoAmp + match.AutoSpeaker + match.TeleopAmplifier + match.TeleopSpeaker + match.TeleopSpeakerAmplified, 0) / matches.length;
  const variance = matches.reduce((acc, match) => {
      const totalNotes = match.AutoAmp + match.AutoSpeaker + match.TeleopAmplifier + match.TeleopSpeaker + match.TeleopSpeakerAmplified;
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
  return bool;
}

const getShootingPositionIfPodium = (match: MatchModel[]) => {
  let bool = false;
  for (let i = 0; i < match.length; i++) {
      if (match[i].AutoStartingPosition === Position.Left || match[i].AutoStartingPosition === Position.Right) {
          bool = true;
          break;
      }
  }
  return bool;
}

const getShootingPositionIfElsewhereInWing = (match: MatchModel[]) => {
  let bool = false;
  for (let i = 0; i < match.length; i++) {
      if (match[i].AutoStartingPosition === Position.Middle) {
          bool = true;
          break;
      }
  }
  return bool;
}

const getShootingPositionIfNearCenterLine = (match: MatchModel[]) => {
  let bool = false;
  for (let i = 0; i < match.length; i++) {
      if (match[i].AutoStartingPosition === Position.Middle) {
          bool = true;
          break;
      }
  }
  return bool;
}

const getAvgCycleTimeLastFive = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  const cycleTime = lastFive.reduce((total, match) => total.concat(match.TeleopCycleTime), [] as number[]);
  return cycleTime.reduce((total, time) => total + time, 0) / (cycleTime.length || 1);
};

const getPercentageDroppedNotes = (matches: MatchModel[]) => {
  const totalDropped = matches.reduce((total, match) => total + match.TeleopDropped + match.AutoDropped, 0);
  const totalNotes = matches.reduce((total, match) => total + match.AutoAmp + match.AutoSpeaker + match.TeleopAmplifier + match.TeleopSpeaker + match.TeleopSpeakerAmplified, 0);

  return totalNotes > 0 ? (totalDropped / totalNotes) * 100 : 0;
};

const getTimesIncapacitated = (matches: MatchModel[]) => {
  return matches.filter(match => match.TeleopIncapacitated).length;
};

const getTimesFell = (matches: MatchModel[]) => {
  return matches.filter(match => match.TeleopFell).length + matches.filter(match => match.AutoFell).length;
};

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
  getTimesFell
}
