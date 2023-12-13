import { MatchModel } from "./MatchModel"

const displayMatchData = (match: MatchModel) => {
    const data = [
        { label: 'Match Number', value: match.MatchNumber.toString() },
        { label: 'Scout Name', value: match.ScoutName },
        // Auto Phase Details
        { label: 'Auto Game Piece 1', value: match.AutoGamePiece1.toString() },
        { label: 'Auto Game Piece 2', value: match.AutoGamePiece2.toString() },
        { label: 'Auto Game Piece 3', value: match.AutoGamePiece3.toString() },
        { label: 'Auto Game Piece 4', value: match.AutoGamePiece4.toString() },
        { label: 'Auto Position', value: match.AutoPosition },
        { label: 'Auto Mobility', value: match.AutoMobility ? 'Yes' : 'No' },
        // Auto Objectives
        { label: 'Auto Objective 1', value: match.AutoObjective1 },
        { label: 'Auto Objective 2', value: match.AutoObjective2 },
        { label: 'Auto Robot Falls', value: match.AutoRobotFalls ? 'Yes' : 'No' },
        // Teleop Phase Details
        { label: 'Cycle Time', value: `[${match.CycleTime.join(', ')}]` },
        // Endgame Objectives
        { label: 'End Game Objective 1', value: match.EndGameObjective1 },
        { label: 'End Game Objective 2', value: match.EndGameObjective2 },
        { label: 'Dropped Game Piece', value: match.DroppedGamePiece.toString() },
        // Match Performance and Results
        { label: 'Total Points Alliance', value: match.TotalPointsAlliance.toString() },
        { label: 'Ranking Points Alliance', value: match.RankingPointsAlliance.toString() },
        { label: 'Alliance Objective 1', value: match.AllianceObjective1.toString() },
        { label: 'Alliance Objective 2', value: match.AllianceObjective2 ? 'Yes' : 'No' },
        { label: 'Won Match', value: match.WonMatch ? 'Yes' : 'No' },
        // Robot Performance
        { label: 'Robot Falls', value: match.TeleopStatus1 ? 'Yes' : 'No' },
        { label: 'Incapacitated', value: match.TeleopStatus2 ? 'Yes' : 'No' },
        { label: 'Plays Defense', value: match.TeleopStatus3 ? 'Yes' : 'No' },
        { label: 'Robot Tippy', value: match.TeleopStatus4 ? 'Yes' : 'No' },
        { label: 'Robot Quickness', value: match.TeleopStatus5 },
        { label: 'Field Awareness', value: match.TeleopStatus6 },
        { label: 'Comment', value: match.Comment },        
        // Add any other match properties as needed
    ];
    return data;
};

export default displayMatchData;
