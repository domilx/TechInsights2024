import { MatchModel } from "./MatchModel";

export const getMatchesPlayed = (matches: MatchModel[]) => {
  return matches.filter((match) => match.TeamNumber !== 0);
}

export const getMatchesWon = (matches: MatchModel[]) => {
  return matches.filter((match) => match.AllianceRankingPoints === "Win");
}

export const getMatchesLost = (matches: MatchModel[]) => {
  return matches.filter((match) => match.AllianceRankingPoints === "Lose");
}

export const getMatchesTied = (matches: MatchModel[]) => {
  return matches.filter((match) => match.AllianceRankingPoints === "Tie");
}

export const getCurrentRankingPoints = (matches: MatchModel[]) => {
  return matches.reduce((acc, match) => {
    if (match.AllianceRankingPoints === "Win") {
      acc += 2;
    } else if (match.AllianceRankingPoints === "Tie") {
      acc += 1;
    }
    return acc;
  }, 0);
}

export const getAverageRankingPoints = (matches: MatchModel[]) => {
  return getCurrentRankingPoints(matches) / matches.length;
}

export const getAverageAutoNotes = (matches: MatchModel[]) => {
  return matches.reduce((acc, match) => {
    acc += match.AutoNotes.length;
    return acc;
  }, 0) / matches.length;
}