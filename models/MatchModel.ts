export interface MatchModel {
    // Robot Information
    ScoutName: string;
    TeamNumber: number;
    MatchNumber: number;
    //Auto 
    AutoGamePiece1: number;
    AutoGamePiece2: number;
    AutoGamePiece3: number;
    AutoGamePiece4: number;
    AutoPosition: Position;
    AutoMobility: boolean;
    AutoObjective1: boolean;
    AutoObjective2: boolean;
    AutoObjective3: boolean;
    AutoObjective4: boolean;
    AutoRobotFalls: boolean;
    //Teleop + Endgame
    CycleTime: number;
    EndGameObjective1: boolean;
    EndGameObjective2: boolean;
    EndGameObjective3: boolean;
    EndGameObjective4: boolean;
    EndGameObjective5: boolean;
    EndGameObjective6: boolean;
    DroppedGamePiece: number;
    // Robot Performance + match results
    Comment: string;
    TotalPointsAlliance: number;
    RankingPointsAlliance: number;
    AllianceObjective1: number;
    AllianceObjective2: boolean;
    WonMatch: boolean;
    TeleopStatus1: boolean; //Robot falls
    TeleopStatus2: boolean; //Incapacitated? --> if more than 8 seconds then considered YES
    TeleopStatus3: boolean; //plays defense
    TeleopStatus4: boolean; //Robot Tippy
    TeleopStatus5: Speed; //Robot Quickness
    TeleopStatus6: Aware; //Field Awareness
    TeleopGamePeice1: number; //Cubes
    TeleopGamePeice2: number; //Cones
    TeleopGamePeice3: number; //N/A
    TeleopGamePeice4: number; //n/A
    gotScanned: boolean;
  }
  
  export enum Position {
    Left = "Left",
    Middle = "Middle",
    Right = "Right",
  }
  
  export enum Speed {
    Slow = "Slow",
    Average = "Average",
    Fast = "Fast",
  }
  
  export enum Aware {
    Minus = "Less aware",
    Normal = "Average",
    More = "Very aware",
  }
  
  export const initialMatchData: MatchModel = {
    ScoutName: "",
    TeamNumber: 0,
    MatchNumber: 0,
    AutoGamePiece1: 0, 
    AutoGamePiece2: 0,
    AutoGamePiece3: 0,
    AutoGamePiece4: 0,
    AutoPosition: Position.Middle,
    AutoMobility: false,
    AutoObjective1: false,
    AutoObjective2: false,
    AutoObjective3: false,
    AutoObjective4: false,
    AutoRobotFalls: false,
    CycleTime: 0,
    EndGameObjective1: false,
    EndGameObjective2: false,
    EndGameObjective3: false,
    EndGameObjective4: false,
    EndGameObjective5: false,
    EndGameObjective6: false,
    DroppedGamePiece: 0,
    Comment: "",
    TotalPointsAlliance: 0,
    RankingPointsAlliance: 0,
    AllianceObjective1: 0,
    AllianceObjective2: false,
    WonMatch: false,
    TeleopStatus1: false,
    TeleopStatus2: false,
    TeleopStatus3: false,
    TeleopStatus4: false,
    TeleopStatus5: Speed.Average,
    TeleopStatus6: Aware.Normal,
    TeleopGamePeice1: 0,
    TeleopGamePeice2: 0,
    TeleopGamePeice3: 0,
    TeleopGamePeice4: 0,
    gotScanned: false,
  };
  