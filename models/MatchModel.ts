export interface MatchModel {
  // Robot Information
  ScoutName: string;
  TeamNumber: number;
  MatchNumber: number;
  //Auto
  AutoGamePiece1: number; //amount of cubes
  AutoGamePiece2: number; // amount of cones
  AutoGamePiece3: number; // N/A
  AutoGamePiece4: number; // N/A
  AutoPosition: Position; //Left, Middle, Right
  AutoMobility: boolean; //Yes or No
  AutoObjective1: AutoObjective; //Stage 1, 2, 3, 4
  AutoObjective2: AutoObjective; //Stage 1, 2, 3, 4
  AutoRobotFalls: boolean; //Yes or No
  //Teleop + Endgame
  CycleTime: number[]; //array of cycle times
  EndGameObjective1: EndGameObjective; //Stage 1, 2, 3, 4
  EndGameObjective2: EndGameObjective; //Stage 1, 2, 3, 4
  DroppedGamePiece: number;
  // Robot Performance + match results
  Comment: string; //comment
  TotalPointsAlliance: number; //total points
  RankingPointsAlliance: number; //ranking points
  AllianceObjective1: number; //Links
  AllianceObjective2: boolean; //Coopertition
  WonMatch: boolean;
  TeleopStatus1: boolean; //Robot falls
  TeleopStatus2: boolean; //Incapacitated? --> if more than 8 seconds then considered YES
  TeleopStatus3: boolean; //plays defense
  TeleopStatus4: boolean; //Robot Tippy
  TeleopStatus5: Speed; //Robot Quickness
  TeleopStatus6: Aware; //Field Awareness
  TeleopGamePiece1: number; //Cubes
  TeleopGamePiece2: number; //Cones
  TeleopGamePiece3: number; //N/A
  TeleopGamePiece4: number; //n/A
  GamePiecesGrid: GamePieceCell[];
  gotScanned?: boolean;
}

export type GamePieceCell = {
  rowIndex: number;
  columnIndex: number;
  autoScored: number;
  GamePieceType: GamePieceType;
  count: number;
};

export enum GamePieceType {
  GamePiece1 = "Cone",
  GamePiece2 = "Cube",
  GamePiece3 = "3",
  GamePiece4 = "4",
}

export enum AutoObjective {
  Stage1 = "Stage 1", // 2pts
  Stage2 = "Stage 2", // 4pts
  Stage3 = "Stage 3", // 6pts
  Stage4 = "Stage 4", // 8pts
}

export enum EndGameObjective {
  Stage1 = "Stage 1", // 2pts
  Stage2 = "Stage 2", // 4pts
  Stage3 = "Stage 3", // 6pts
  Stage4 = "Stage 4", // 8pts
}

export const AutoObjectivePoints = {
  [AutoObjective.Stage1]: 2,
  [AutoObjective.Stage2]: 4,
  [AutoObjective.Stage3]: 6,
  [AutoObjective.Stage4]: 8, 
};

export const EndGameObjectivePoints = {
  [EndGameObjective.Stage1]: 2,
  [EndGameObjective.Stage2]: 4,
  [EndGameObjective.Stage3]: 6,
  [EndGameObjective.Stage4]: 8,
};

export const AutoGamePeicePoints = {
  [GamePieceType.GamePiece1]: 1,
  [GamePieceType.GamePiece2]: 2,
  [GamePieceType.GamePiece3]: 0,
  [GamePieceType.GamePiece4]: 0,
};

export const TeleopGamePiecePoints = {
  [GamePieceType.GamePiece1]: 1,
  [GamePieceType.GamePiece2]: 2,
  [GamePieceType.GamePiece3]: 0,
  [GamePieceType.GamePiece4]: 0,
};

export const EndGamePiecePoints = {
  [GamePieceType.GamePiece1]: 1,
  [GamePieceType.GamePiece2]: 2,
  [GamePieceType.GamePiece3]: 0,
  [GamePieceType.GamePiece4]: 0,
};

export const AutoMobilityPoints = 6;

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
  AutoObjective1: AutoObjective.Stage1,
  AutoObjective2: AutoObjective.Stage1,
  AutoRobotFalls: false,
  CycleTime: [0],
  EndGameObjective1: EndGameObjective.Stage1,
  EndGameObjective2: EndGameObjective.Stage1,
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
  TeleopGamePiece1: 0,
  TeleopGamePiece2: 0,
  TeleopGamePiece3: 0,
  TeleopGamePiece4: 0,
  GamePiecesGrid: Array.from({ length: 3 * 3 }, (_, index) => {
    const rowIndex = Math.floor(index / 3);
    const columnIndex = index % 3;

    return {
      rowIndex,
      columnIndex,
      autoScored: 0,
      GamePieceType: GamePieceType.GamePiece1,
      count: 0
    };
  }),


};
