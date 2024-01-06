import { MatchModel } from "./MatchModel";

export interface PitModel {  
    RobScout: string;
    TeamNb: number;
    RobTeamNm: string;
    RobDrive: DriveBaseType;
    RobMotor: DriveBaseMotor;
    RobDriveExp: DriverExperience;
    RobWtlbs: number;
    RobWidth: number;
    RobLength: number;
    RobStble: Stability;
    RobQuest1: boolean;
    RobQuest2: boolean;
    RobQuest3: boolean;
    RobQuest4: boolean;
    RobQuest5: boolean;
    RobQuest6: boolean;
    RobQuest7: boolean;
    RobQuest8: boolean;
    RobQuest9: boolean;
    RobQuest10: boolean;
    RobQuest11: boolean;
    RobQuest12: boolean;
    RobQuest13: boolean;
    RobQuest14: boolean;
    RobQuest15: boolean;
    RobComm1: string;
    matches?: MatchModel[];
  }
  
  // Enums for dropdowns
  export enum DriveBaseType {
    Swerve = 'Swerve',
    Tank = 'Tank',
    Other = 'Other',
  }
  
  export enum DriveBaseMotor {  CIM = 'CIM',
    NEO = 'NEO',
    FALCON = 'FALCON',
    KRAKEN = 'KRAKEN',
  }
  
  export enum DriverExperience {  Zero = 'Zero',
    One = 'One',
    Two = 'Two',
    Three = 'Three',
    Four = 'Four',
    Unknown = 'Unknown',
  }
  
  export enum Stability {  NO = 'Not Stable',
    YES = 'Stable',
    VERY_STABLE = 'Very Stable',
  }
  
  
  // Create an initial state object that matches the PitModel interface
  export const initialPitData: PitModel = {  
    RobScout: "",
    TeamNb: 0, 
    RobTeamNm: "",
    RobDrive: DriveBaseType.Other, // Default value as 'Other'
    RobMotor: DriveBaseMotor.CIM, // Default value as 'CIM'
    RobDriveExp: DriverExperience.Zero, // Default as 'Zero'
    RobWtlbs: 0,
    RobWidth: 0,
    RobLength: 0,
    RobStble: Stability.NO, // Default as 'NO'
    RobQuest1: false,
    RobQuest2: false,
    RobQuest3: false,
    RobQuest4: false,
    RobQuest5: false,
    RobQuest6: false,
    RobQuest7: false,
    RobQuest8: false,
    RobQuest9: false,
    RobQuest10: false,
    RobQuest11: false,
    RobQuest12: false,
    RobQuest13: false,
    RobQuest14: false,
    RobQuest15: false,
    RobComm1: "",
  };
  