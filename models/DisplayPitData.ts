import displayMatchData from "./DisplayMatchData";
import { PitModel } from "./PitModel";

const DisplayPitData = (pitData: PitModel) => {
  const data = {
    GeneralInfo: [
      { label: "Team Number", value: pitData.TeamNumber, unit: "" },
      { label: "Team Name", value: pitData.TeamName, unit: "" },
    ],
    RobotSpecs: [
      { label: "Drive Base Type", value: pitData.DriveBaseType, unit: "" },
      { label: "Drive Base Motor", value: pitData.DriveBaseMotor, unit: "" },
      { label: "Driver Experience", value: `${pitData.DriverExperience}`, unit: "years" },
      { label: "Robot Weight", value: `${pitData.WeightLbs}`, unit: "lbs" },
      { label: "Robot Width", value: `${pitData.WidthInches}`, unit: "in" },
      { label: "Robot Length", value: `${pitData.LengthInches}`, unit: "in" },
      { label: "Robot Height", value: `${pitData.HeightInches}`, unit: "in" },
      { label: "Frame Clearance", value: `${pitData.FrameClearanceInches}`, unit: "in" },
      { label: "Robot Stability", value: pitData.Stability, unit: "" },
      { label: "Well Made", value: pitData.WellMade, unit: "" },
    ],
    RobotCapabilities: [
      { label: "Single Intake Shooter", value: pitData.SingleIntakeShooter ? "Yes" : "No", unit: "" },
      {
        label: "Pickup Spots", 
        value: Array.isArray(pitData.PickupSpots) ? pitData.PickupSpots.join(', ') : '', 
        unit: ""
      },
      { label: "Score Spots", value: pitData.ScoreSpots, unit: "" },
      { label: "Center of Gravity", value: pitData.CenterOfGravity, unit: "" },
      { label: "Years Using Swerve", value: pitData.YearsUsingSwerve, unit: "years" },
      {
        label: "Shoots From", 
        value: pitData.ShootsFrom,
        unit: ""
      },
      { label: "Object Recognition", value: pitData.ObjectRecognition ? "Yes" : "No", unit: "" },
      { label: "Read April Tags", value: pitData.ReadAprilTags ? "Yes" : "No", unit: "" },
      { label: "Autonomous Program", value: Array.isArray(pitData.AutonomousProgram) ? pitData.AutonomousProgram.join(', ') : '', unit: "" },
      { label: "Auto Programs For Speaker", value: pitData.AutoProgramsForSpeaker ? "Yes" : "No", unit: "" },
      { label: "Can Get On Stage", value: pitData.CanGetOnStage ? "Yes" : "No", unit: "" },
      { label: "Can Score Notes In Trap", value: pitData.CanScoreNotesInTrap ? "Yes" : "No", unit: "" },
      { label: "Human Player Spotlight", value: pitData.HumanPlayerSpotlight, unit: "" },
      { label: "Cheesecake Ability", value: pitData.CheesecakeAbility ? "Yes" : "No", unit: "" },
    ],
    AdditionalInfo: [
      { label: "Comment", value: pitData.Comments, unit: "" },
    ],
  };

  if (pitData.matches && pitData.matches.length > 0) {
    pitData.matches.forEach((match, index) => {
      displayMatchData(match);
    });
  }

  return data;
};

export default DisplayPitData;