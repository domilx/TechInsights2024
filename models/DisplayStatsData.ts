import {
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
    getTimesIncapacitatedAndFalls
} from "./StatsCalculations";

const DisplayStatsData = {
    MatchOutcomes: [
        { label: "Matches Played", func: getMatchesPlayed, unit: "matches" },
        { label: "Matches Won", func: getMatchesWon, unit: "matches" },
        { label: "Win Rate", func: getWinRate, unit: "%" },
    ],
    RankingPoints: [
        { label: "Total Ranking Points", func: getTotalRankingPoints, unit: "points" },
        { label: "Average Ranking Points", func: getAverageRankingPoints, unit: "points" },
    ],
    Auto: [
        { label: "Auto Position Frequency", func: getAutoPositionFrequency, unit: "%" },
        { label: "Avg Auto Notes Amp", func: getAvgAutoNotesAmp, unit: "notes" },
        { label: "Avg Auto Notes Speaker", func: getAvgAutoNotesSpeaker, unit: "notes" },
        { label: "Avg Total Auto Points", func: getAvgTotalAutoPoints, unit: "points" },
        { label: "Leave Percentage", func: getLeavePercentage, unit: "%" },
    ],
    Teleop: [
        { label: "Avg Teleop Notes Amp", func: getAvgTeleopNotesAmp, unit: "notes" },
        { label: "Avg Teleop Notes Speaker", func: getAvgTeleopNotesSpeaker, unit: "notes" },
        { label: "Avg Teleop Notes Amplified Speaker", func: getAvgTeleopNotesAmplifiedSpeaker, unit: "notes" },
        { label: "Avg Total Teleop Points", func: getAvgTotalTeleopPoints, unit: "points" },
        { label: "Avg Total End Game Points", func: getAvgTotalEndGamePoints, unit: "points" },
        { label: "Avg On Stage Points", func: getAvgOnStagePoints, unit: "points" },
        { label: "Avg Trap Points", func: getAvgTrapPoints, unit: "points" },
    ],
    Notes: [
        { label: "Avg Num Total Notes Full Match", func: getAvgNumTotalNotesFullMatch, unit: "notes" },
        { label: "Avg Total Points", func: getAvgTotalPoints, unit: "points" },
        { label: "Avg Points Contribution Ratio All Matches", func: getAvgPointsContributionRatioAllMatches, unit: "%" },
        { label: "Avg Points Contribution Ratio Last Five", func: getAvgPointsContributionRatioLastFive, unit: "%" },
        { label: "Abs Max Min Notes", func: getAbsMaxMinNotes, unit: "notes" },
        { label: "Standard Deviation Notes", func: getStandardDeviationNotes, unit: "notes" },
    ],
    Shooting: [
        { label: "Shooting Position Frequency", func: getShootingPositionFrequency, unit: "%" },
        { label: "Avg Cycle Time Last Five", func: getAvgCycleTimeLastFive, unit: "seconds" },
        { label: "Percentage Dropped Notes", func: getPercentageDroppedNotes, unit: "%" },
    ],
    Incapacitated: [
        { label: "Times Incapacitated", func: getTimesIncapacitatedAndFalls, unit: "times" },
        { label: "Times Fell", func: getTimesIncapacitatedAndFalls, unit: "times" },
    ],
};

export default DisplayStatsData;