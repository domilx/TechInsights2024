export interface MatchModel {
  //General
  ScoutName: string;
  TeamNumber: number;
  MatchNumber: number;
  //Auto
  AutoAmp: number;
  AutoSpeaker: number;
  AutoStartingPosition: Position;
  AutoLeave: boolean;
  AutoExtraNotes: ExtraNotes[];
  AutoDropped: number;
  AutoAStopPressed: boolean;
  AutoIncapacitated: boolean;
  AutoFell: boolean;
  AutoRobotDidNotPlay: boolean;
  //Teleop
  TeleopSpeakerAmplified: number;
  TeleopSpeaker: number;
  TeleopAmplifier: number;
  TeleopCycleTime: number[];
  TeleopDropped: number;
  TeleopTrap: Trap;
  TeleopFell: boolean;
  TeleopIncapacitated: boolean;
  TeleopGamePieceStuck: number;
  TeleopShootsFrom: ShootSpots[];
  TeleopUnderStage: boolean;
  //EndGame
  EndGameOnStage: EndGameOnStage; // None=0; Park=2; OnStage=3; points
  EndGameHarmony: EndGameHarmony; // 0=0; 1=2; 2=3; points
  EndGameTrap: Trap; // 0=0; 1=2; 2=0; points
  EndGameRobotFell: boolean;
  EndGameRobotIncapacitated: boolean;
  EndGameSpotLighted: boolean;// 0=0; 1=1; points
  //Alliance
  AllianceTotalPoints: number;
  AllianceRankingPoints: RankingPoints;
  AllianceMelody: boolean;
  AllianceCoopertition: boolean;
  AllianceEnsemble: boolean;
  //Performance
  PlaysDefense: DefenseLevel;
  RobotTippy: Tippiness;
  RobotSpeed: Speed;
  FieldAwareness: Awareness;
  Comment?: string;
  gotScanned?: boolean;
}

export enum Position {
  Left = "Left",
  Middle = "Middle",
  Right = "Right",
}

export enum ExtraNotes {
  LeftWing = "Left Wing",
  CentreWing = "Centre Wing",
  RightWing = "Right Wing",
  FarLeftCentre = "Far Left Centre",
  LeftCentre = "Left Centre",
  CentreCentre = "Centre Centre",
  RightCentre = "Right Centre",
  FarRight = "Far Right",
}

export enum ShootSpots {
  StartingZone = "Starting Zone",
  Podium = "Podium",
  ElsewhereInWing = "Elsewhere in Wing",
  NearCentreLine = "Near Centre Line",
}

export enum EndGameOnStage {
  None = "None",
  Park = "Park",
  OnStage = "OnStage",
}

export enum EndGameHarmony {
  ZeroPoints = "0 Points",
  TwoPoints = "2 Points",
  HarmonyFailed = "Harmony Failed",
}

export enum Trap {
  ZeroPoints = "0 Points",
  FivePoints = "5 Points",
  TenPoints = "10 Points",
  FifteenPoints = "15 Points",
  TrapFailed = "Trap Failed",
}

export enum RankingPoints {
  Lose = "Lose",
  Tie = "Tie",
  Win = "Win",
}

export enum DefenseLevel {
  No = "No",
  A_Little = "A Little",
  Average = "Average",
  A_Lot = "A Lot",
}

export enum Tippiness {
  Not = "Not",
  A_Little = "A Little",
  Very = "Very",
}

export enum Speed {
  Slow = "Slow",
  Average = "Average",
  Fast = "Fast",
}

export enum Awareness {
  LessAware = "Less Aware",
  Average = "Average",
  VeryAware = "Very Aware",
}

// Initialize with default values
export const initialMatchData: MatchModel = {
  ScoutName: "",
  TeamNumber: 0,
  MatchNumber: 0,
  AutoAmp: 2,
  AutoSpeaker: 5,
  AutoStartingPosition: Position.Middle,
  AutoLeave: false,
  AutoExtraNotes: [ExtraNotes.LeftWing],
  AutoDropped: 0,
  AutoAStopPressed: false,
  AutoIncapacitated: false,
  AutoFell: false,
  AutoRobotDidNotPlay: false,
  TeleopSpeakerAmplified: 5,
  TeleopSpeaker: 2,
  TeleopAmplifier: 1,
  TeleopCycleTime: [0],
  TeleopDropped: 0,
  TeleopTrap: Trap.ZeroPoints,
  TeleopFell: false,
  TeleopIncapacitated: false,
  TeleopGamePieceStuck: 0,
  TeleopShootsFrom: [ShootSpots.StartingZone],
  TeleopUnderStage: false,
  EndGameOnStage: EndGameOnStage.None,
  EndGameHarmony: EndGameHarmony.ZeroPoints,
  EndGameTrap: Trap.ZeroPoints,
  EndGameRobotFell: false,
  EndGameRobotIncapacitated: false,
  EndGameSpotLighted: false,
  AllianceTotalPoints: 0,
  AllianceRankingPoints: RankingPoints.Lose,
  AllianceMelody: false,
  AllianceCoopertition: false,
  AllianceEnsemble: false,
  PlaysDefense: DefenseLevel.No,
  RobotTippy: Tippiness.Not,
  RobotSpeed: Speed.Average,
  FieldAwareness: Awareness.Average,
  Comment: "",
  gotScanned: false,
};
