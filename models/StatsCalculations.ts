import { EndGameHarmony, EndGameOnStage, Trap, MatchModel, Position } from "./MatchModel";

export const getMatchesPlayed = (matches: MatchModel[]) => {
  return matches.filter((match) => match.TeamNumber !== 0);
}

export const getMatchesWon = (matches: MatchModel[]) => {
  return matches.filter((match) => match.AllianceRankingPoints === "Win");
}

export const getWinRate = (matches: MatchModel[]) => {
  return getMatchesWon(matches).length / getMatchesPlayed(matches).length;
}

export const getTotalRakingPoints = (matches: MatchModel[]) => {
  return matches.reduce((total, match) => total + parseInt(match.AllianceRankingPoints), 0);
}

export const getAverageRankingPoints = (matches: MatchModel[]) => {
  return getTotalRakingPoints(matches) / getMatchesPlayed(matches).length;
}

/**
 * Gets the frequency of each auto position (Left, Center, Right)
 */
export const getAutoPositionFrequency = (matches: MatchModel[]) => {
  const autoPositions = matches.map((match) => match.AutoStartingPosition);
  const autoPositionFrequency: { [key in Position]: number } = {
    Left: 0,
    Middle: 0,
    Right: 0,
  };
  autoPositions.forEach((position) => {
    autoPositionFrequency[position] += 1;
  });
  return autoPositionFrequency;
}

export const getAvgAutoNotesAmp = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + match.AutoAmp, 0) / lastFive.length;
};

export const getAvgAutoNotesSpeaker = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + match.AutoSpeaker, 0) / lastFive.length;
};

// Assuming Auto Points are calculated as some combination of AutoAmp and AutoSpeaker
export const getAvgTotalAutoPoints = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + match.AutoAmp + match.AutoSpeaker, 0) / lastFive.length;
};

export const getLeavePercentage = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.filter((match) => match.AutoLeave).length / matches.length;
};

export const getAvgTeleopNotesAmp = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + match.TeleopAmplifier, 0) / lastFive.length;
};

export const getAvgTeleopNotesSpeaker = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + match.TeleopSpeaker, 0) / lastFive.length;
};

export const getAvgTeleopNotesAmplifiedSpeaker = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + match.TeleopSpeakerAmplified, 0) / lastFive.length;
};

// Assuming Teleop Points are calculated as some combination of TeleopAmplifier, TeleopSpeaker, and TeleopSpeakerAmplified
export const getAvgTotalTeleopPoints = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => total + match.TeleopAmplifier + match.TeleopSpeaker + match.TeleopSpeakerAmplified, 0) / lastFive.length;
};

export const getAvgTotalEndGamePoints = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => {
    let points = 0;
    points += match.EndGameOnStage === EndGameOnStage.Park ? 2 : (match.EndGameOnStage === EndGameOnStage.OnStage ? 3 : 0);
    points += match.EndGameHarmony === EndGameHarmony.TwoPoints ? 2 : (match.EndGameHarmony === EndGameHarmony.HarmonyFailed ? 3 : 0);
    points += match.EndGameTrap === Trap.FivePoints ? 2 : 0;
    points += match.EndGameSpotLighted ? 1 : 0;
    return total + points;
  }, 0) / lastFive.length;
};

export const getAvgOnStagePoints = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => {
    return total + (match.EndGameOnStage === EndGameOnStage.Park ? 2 : (match.EndGameOnStage === EndGameOnStage.OnStage ? 3 : 0));
  }, 0) / lastFive.length;
};

export const getAvgTrapPoints = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => {
    // Calculate points for EndGameTrap
    let trapPoints = 0;
    switch (match.EndGameTrap) {
      case EndGameTrap.ZeroPoints:
        trapPoints = 0;
        break;
      case EndGameTrap.FivePoints:
        trapPoints = 5; // Assuming 5 points for FivePoints
        break;
      case EndGameTrap.TrapFailed:
        trapPoints = 0; // Assuming 0 points for TrapFailed
        break;
      default:
        trapPoints = 0;
    }

    return total + trapPoints;
  }, 0) / lastFive.length;
};

export const getAvgNumTotalNotesFullMatch = (matches: MatchModel[]) => {
  const lastFive = matches.slice(-5);
  return lastFive.reduce((total, match) => {
    const endTrap: boolean = match.EndGameTrap == EndGameTrap.FivePoints
    const TeleopTrap
    if
    return total + match.AutoAmp + match.AutoSpeaker + match.TeleopAmplifier + match.TeleopSpeaker + match.TeleopSpeakerAmplified + ;
  }, 0) / lastFive.length;
};