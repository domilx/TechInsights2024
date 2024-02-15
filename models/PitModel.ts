import { MatchModel } from './MatchModel';
export interface PitModel {
  //General Info
  ScoutName: string;
  TeamNumber: number;
  TeamName: string;
  //Robot Specs
  DriveBaseType: DriveBaseType;
  DriveBaseMotor: DriveBaseMotor;
  DriverExperience: Years;
  WeightLbs: number;
  WidthInches: number;
  LengthInches: number;
  Stability: Stability;
  //Robot Capabilities
  WellMade: WellMade;
  SingleIntakeShooter: boolean; // Boolean for single intake and shooter
  PickupSpots: PickupSpots;
  ScoreSpots: ScoreSpots;
  CenterOfGravity: Gravity;
  YearsUsingSwerve: Years;
  ShootsFrom: ShootSpots[];
  AutoExtraNotesButtons?: number[]; //For the buttons in the form
  ObjectRecognition: boolean;
  ReadAprilTags: boolean;
  AutonomousProgram: AutoPositions[];
  AutoProgramsForSpeaker: boolean;
  CanGetOnStage: boolean;
  CanScoreNotesInTrap: boolean;
  HumanPlayerSpotlight: HumanPlayerSpotlight;
  CheesecakeAbility: boolean; // Boolean for robot's lifting ability
  Comments?: string;
  HeightInches: number;
  FrameClearanceInches: number;
  matches?: MatchModel[];
}

// Enums for dropdowns
export enum DriveBaseType {
  Swerve = "Swerve",
  Tank = "Tank",
  Other = "Other",
}

export enum DriveBaseMotor {
  CIM = "CIM",
  NEO = "NEO",
  FALCON = "FALCON",
  KRAKEN = "KRAKEN",
}

export enum Years {
  Zero = "0",
  One = "1",
  Two = "2",
  ThreePlus = "3+",
  Unknown = "Unknown",
}

export enum Stability {
  NotStable = "Not Stable",
  Stable = "Stable",
  VeryStable = "Very Stable",
}

export enum WellMade {
  No = "No",
  Yes = "Yes",
  Very = "Very",
}

export enum PickupSpots {
  SourceOnly = "Source Only",
  GroundOnly = "Ground Only",
  Both = "Both",
  Neither = "Neither",
}

export enum ScoreSpots {
  SpeakerOnly = 'Speaker Only',
  AmpOnly = "Amp Only",
  Both = "Both",
  Neither = "Neither",
}

export enum Gravity {
  Low = "Low",
  High = "High",
}

export enum ShootSpots {
  StartingZone = "Starting Zone",
  Podium = "Podium",
  ElsewhereInWing = "Elsewhere in Wing",
  NearCentreLine = "Near Centre Line",
  None = "None",
}

export enum HumanPlayerSpotlight {
  OneOfThree = "1 of 3 High Notes",
  TwoOfThree = "2 of 3 High Notes",
  AllHighNotes = "3 of 3 High Notes",
}

export enum AutoPositions {
  RedLeft = "Red Left",
  RedCenter = "Red Center",
  RedRight = "Red Right",
  BlueLeft = "Blue Left",
  BlueCenter = "Blue Center",
  BlueRight = "Blue Right",
}


// Create an initial state object that matches the PitModel interface
export const initialPitData: PitModel = {  
  ScoutName: "",
  TeamNumber: 0,
  TeamName: "",
  DriveBaseType: DriveBaseType.Other,
  DriveBaseMotor: DriveBaseMotor.CIM,
  DriverExperience: Years.Zero,
  WeightLbs: 0,
  WidthInches: 0,
  LengthInches: 0,
  Stability: Stability.NotStable,
  WellMade: WellMade.No,
  SingleIntakeShooter: false,
  PickupSpots: PickupSpots.Neither,
  ScoreSpots: ScoreSpots.Neither,
  CenterOfGravity: Gravity.Low,
  YearsUsingSwerve: Years.Zero,
  ShootsFrom: [ShootSpots.None],
  AutoExtraNotesButtons: [],
  ObjectRecognition: false,
  ReadAprilTags: false,
  AutonomousProgram: [AutoPositions.RedLeft],
  AutoProgramsForSpeaker: false,
  CanGetOnStage: false,
  CanScoreNotesInTrap: false,
  HumanPlayerSpotlight: HumanPlayerSpotlight.OneOfThree,
  CheesecakeAbility: false,
  Comments: "",
  HeightInches: 0,
  FrameClearanceInches: 0,
  matches: [],
};