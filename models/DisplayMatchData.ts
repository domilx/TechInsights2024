import { MatchModel } from "./MatchModel"

const displayMatchData = (match: MatchModel) => {
    const data = [
        { label: 'Match Number', value: match.MatchNumber.toString() },
        { label: 'Scout Name', value: match.ScoutName },
        { label: 'Team Number', value: match.TeamNumber.toString() },
        // Auto Phase Details
        { label: 'Auto Notes', value: match.AutoNotes },
        { label: 'Auto Amplifier', value: match.AutoAmp.toString() },
        { label: 'Auto Speaker', value: match.AutoSpeaker.toString() },
        { label: 'Auto Starting Position', value: match.AutoStartingPosition },
        { label: 'Auto Leave', value: match.AutoLeave ? 'Yes' : 'No' },
        { label: 'Auto Extra Notes', value: match.AutoExtraNotes },
        { label: 'Auto Dropped', value: match.AutoDropped.toString() },
        { label: 'Auto Robot Falls', value: match.AutoRobotFalls ? 'Yes' : 'No' },
        { label: 'Auto A Stop Pressed', value: match.AutoAStopPressed ? 'Yes' : 'No' },
        { label: 'Auto Incapacitated', value: match.AutoIncapacitated ? 'Yes' : 'No' },
        { label: 'Auto Fell', value: match.AutoFell ? 'Yes' : 'No' },
        { label: 'Auto Robot Did Not Play', value: match.AutoRobotDidNotPlay ? 'Yes' : 'No' },
        // Teleop Phase Details
        { label: 'Teleop Speaker Amplified', value: match.TeleopSpeakerAmplified.toString() },
        { label: 'Teleop Speaker', value: match.TeleopSpeaker.toString() },
        { label: 'Teleop Amplifier', value: match.TeleopAmplifier.toString() },
        { label: 'Teleop Cycle Time', value: match.TeleopCycleTime.toString() },
        { label: 'Teleop Dropped', value: match.TeleopDropped.toString() },
        { label: 'Teleop Trap', value: match.TeleopTrap },
        { label: 'Teleop Fell', value: match.TeleopFell ? 'Yes' : 'No' },
        { label: 'Teleop Incapacitated', value: match.TeleopIncapacitated ? 'Yes' : 'No' },
        { label: 'Teleop Game Piece Stuck', value: match.TeleopGamePieceStuck.toString() },
        { label: 'Teleop Shoots From', value: match.TeleopShootsFrom },
        { label: 'Teleop Under Stage', value: match.TeleopUnderStage ? 'Yes' : 'No' },
        // EndGame Details
        { label: 'End Game On Stage', value: match.EndGameOnStage },
        { label: 'End Game Harmony', value: match.EndGameHarmony },
        { label: 'End Game Trap', value: match.EndGameTrap },
        { label: 'End Game Robot Fell', value: match.EndGameRobotFell ? 'Yes' : 'No' },
        { label: 'End Game Robot Incapacitated', value: match.EndGameRobotIncapacitated ? 'Yes' : 'No' },
        { label: 'End Game Spot Lighted', value: match.EndGameSpotLighted ? 'Yes' : 'No' },
        // Alliance Details
        { label: 'Alliance Total Points', value: match.AllianceTotalPoints.toString() },
        { label: 'Alliance Ranking Points', value: match.AllianceRankingPoints },
        { label: 'Alliance Melody', value: match.AllianceMelody ? 'Yes' : 'No' },
        { label: 'Alliance Coopertition', value: match.AllianceCoopertition ? 'Yes' : 'No' },
        { label: 'Alliance Ensemble', value: match.AllianceEnsemble ? 'Yes' : 'No' },
        // Robot Performance
        { label: 'Plays Defense', value: match.PlaysDefense },
        { label: 'Robot Tippy', value: match.RobotTippy },
        { label: 'Robot Quickness', value: match.RobotQuickness },
        { label: 'Field Awareness', value: match.FieldAwareness },
        // Additional Comments
        { label: 'Comment', value: match.Comment ? match.Comment : 'None' },
        { label: 'Got Scanned', value: match.gotScanned ? 'Yes' : 'No' },
        // Add any other match properties as needed
    ];
    return data;
};

export default displayMatchData;
