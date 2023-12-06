export interface MatchModel {
    // Robot Information
    ScoutName: string;
    TeamNumber: number;
    MatchNumber: number;
    //Auto 
    AutoGamePiece1: TBD; //to be determined
    AutoGamePiece2: string; //to be determined
    AutoGamePiece3: string; //to be determined
    AutoGamePiece4: string; //to be determined
    AutoPosition: Position;
    AutoMobility: boolean;
    AutoChargingStation: ChargingStation;
    AutoObjective1: TBD; //to be determined
    AutoObjective2: TBD; //to be determined
    AutoRobotFalls: boolean;
    //Teleop + Endgame
    CycleTime: number;
    EndGameObjective1: boolean;
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
  }
  
  export enum Position {
    Left = "Left",
    Middle = "Middle",
    Right = "Right",
  }
  
  export enum ChargingStation {
    Failed = "Failed",
    Docked = "Docked",
    Engaged = "Engaged",
  }
  
  export enum TBD {
    Option1 = "Option 1",
    Option2 = "Option 2",
    Option3 = "Option 3",
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
    AutoGamePiece1: TBD.Option1, 
    AutoGamePiece2: TBD.Option1,
    AutoGamePiece3: TBD.Option1,
    AutoGamePiece4: TBD.Option1,
    AutoPosition: Position.Middle,
    AutoMobility: false,
    AutoChargingStation: ChargingStation.Failed,
    AutoObjective1: TBD.Option1,
    AutoObjective2: TBD.Option1,
    AutoRobotFalls: false,
    CycleTime: 0,
    EndGameObjective1: false,
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
  };
  