import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";
import {
  DriveBaseMotor,
  DriveBaseType,
  Gravity,
  HumanPlayerSpotlight,
  PickupSpots,
  PitModel,
  ScoreSpots,
  ShootSpots,
  Stability,
  WellMade,
  Years,
  initialPitData,
} from "../../models/PitModel";
import {
  updatePitData
} from "../../services/FirebaseService";
import { InputField } from "../components/InputField";
import { DropDownSelector } from "../components/DropDownSelector";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { DataContext } from "../../contexts/DataContext";
import { syncData } from "../../services/SyncService";
import { saveDataLocally } from "../../services/LocalStorageService";

interface EditPitDataScreenProps {
  team: PitModel;
}

const EditPitDataScreen: React.FC<EditPitDataScreenProps> = ({ team }) => {
  const [pitData, setPitData] = useState<PitModel>(initialPitData);
  const { teams, setTeams, lastSync, setLastSync } = useContext(DataContext);

  useEffect(() => {
    setPitData(team || initialPitData);
  }, [team]);

  const handleChange = (field: keyof PitModel, value: any) => {
    setPitData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Implement validation and saving logic
    if (!pitData.ScoutName) {
      Alert.alert("Validation Error", "Robot Scout is required");
      return;
    }

    try {
      await updatePitData(pitData, pitData.TeamNumber);
      Alert.alert("Success", "Pit data saved successfully");
      const syncResult = await syncData();
      if (syncResult.success && syncResult.data) {
        setTeams(syncResult.data);
        setLastSync(new Date().toISOString());
        // Save the updated teams data locally
        saveDataLocally("fetchedData", syncResult.data);
      }
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  const driveBaseTypeItems = Object.keys(DriveBaseType).map((key) => ({
    label: DriveBaseType[key as keyof typeof DriveBaseType],
    value: DriveBaseType[key as keyof typeof DriveBaseType],
  }));

  const driveBaseMotorItems = Object.keys(DriveBaseMotor).map((key) => ({
    label: DriveBaseMotor[key as keyof typeof DriveBaseMotor],
    value: DriveBaseMotor[key as keyof typeof DriveBaseMotor],
  }));

  const driverExperienceItems = Object.keys(Years).map((key) => ({
    label: Years[key as keyof typeof Years],
    value: Years[key as keyof typeof Years],
  }));

  const stabilityItems = Object.keys(Stability).map((key) => ({
    label: Stability[key as keyof typeof Stability],
    value: Stability[key as keyof typeof Stability],
  }));

  const wellMadeItems = Object.keys(WellMade).map((key) => ({
    label: WellMade[key as keyof typeof WellMade],
    value: WellMade[key as keyof typeof WellMade],
  }));

  const pickupSpotsItems = Object.keys(PickupSpots).map((key) => ({
    label: PickupSpots[key as keyof typeof PickupSpots],
    value: PickupSpots[key as keyof typeof PickupSpots],
  }));

  const scoreSpotsItems = Object.keys(ScoreSpots).map((key) => ({
    label: ScoreSpots[key as keyof typeof ScoreSpots],
    value: ScoreSpots[key as keyof typeof ScoreSpots],
  }));

  const gravityItems = Object.keys(Gravity).map((key) => ({
    label: Gravity[key as keyof typeof Gravity],
    value: Gravity[key as keyof typeof Gravity],
  }));

  const shootsFromItems = Object.keys(ShootSpots).map((key) => ({
    label: ShootSpots[key as keyof typeof ShootSpots],
    value: ShootSpots[key as keyof typeof ShootSpots],
  }));

  const spotlightItems  = Object.keys(HumanPlayerSpotlight).map((key) => ({
    label: HumanPlayerSpotlight[key as keyof typeof HumanPlayerSpotlight],
    value: HumanPlayerSpotlight[key as keyof typeof HumanPlayerSpotlight],
  }));

  return (
    <ScrollView style={styles.container}>
      <InputField
        label="Scout Name"
        value={pitData.ScoutName}
        onChange={(text) => handleChange("ScoutName", text)}
      />
      <InputField
        label="Team Number"
        value={pitData.TeamNumber.toString()}
        keyboardType="numeric"
        onChange={(text) => handleChange("TeamNumber", parseInt(text))}
      />
      <InputField
        label="Team Name"
        value={pitData.TeamName}
        onChange={(text) => handleChange("TeamName", text)}
      />
  
      {/* Robot Specs */}
      <DropDownSelector
        label="Drive Base Type"
        items={driveBaseTypeItems}
        value={pitData.DriveBaseType}
        setValue={(itemValue) => handleChange("DriveBaseType", itemValue)}
      />
      <DropDownSelector
        label="Drive Base Motor"
        items={driveBaseMotorItems}
        value={pitData.DriveBaseMotor}
        setValue={(itemValue) => handleChange("DriveBaseMotor", itemValue)}
      />
      <DropDownSelector
        label="Driver Experience"
        items={driverExperienceItems}
        value={pitData.DriverExperience}
        setValue={(itemValue) => handleChange("DriverExperience", itemValue)}
      />
      <InputField
        label="Weight (lbs)"
        value={pitData.WeightLbs.toString()}
        keyboardType="numeric"
        onChange={(text) => handleChange("WeightLbs", parseInt(text))}
      />
      <InputField
        label="Width (inches)"
        value={pitData.WidthInches.toString()}
        keyboardType="numeric"
        onChange={(text) => handleChange("WidthInches", parseInt(text))}
      />
      <InputField
        label="Length (inches)"
        value={pitData.LengthInches.toString()}
        keyboardType="numeric"
        onChange={(text) => handleChange("LengthInches", parseInt(text))}
      />
      <DropDownSelector
        label="Stability"
        items={stabilityItems}
        value={pitData.Stability}
        setValue={(itemValue) => handleChange("Stability", itemValue)}
      />
  
      {/* Robot Capabilities */}
      <DropDownSelector
        label="Well Made"
        items={wellMadeItems}
        value={pitData.WellMade}
        setValue={(itemValue) => handleChange("WellMade", itemValue)}
      />
      <ToggleSwitch
        label="Single Intake and Shooter"
        value={pitData.SingleIntakeShooter}
        onToggle={(value) => handleChange("SingleIntakeShooter", value)}
      />
      <DropDownSelector
        label="Pickup Spots"
        items={pickupSpotsItems}
        value={pitData.PickupSpots}
        setValue={(itemValue) => handleChange("PickupSpots", itemValue)}
      />
      <DropDownSelector
        label="Score Spots"
        items={scoreSpotsItems}
        value={pitData.ScoreSpots}
        setValue={(itemValue) => handleChange("ScoreSpots", itemValue)}
      />
      <DropDownSelector
        label="Center Of Gravity"
        items={gravityItems}
        value={pitData.CenterOfGravity}
        setValue={(itemValue) => handleChange("CenterOfGravity", itemValue)}
      />
      <DropDownSelector
        label="Shoots From"
        items={shootsFromItems}
        value={pitData.ShootsFrom}
        setValue={(itemValue) => handleChange("ShootsFrom", itemValue)}
      />
      <DropDownSelector
        label="Human Player Spotlight"
        items={spotlightItems}
        value={pitData.HumanPlayerSpotlight}
        setValue={(itemValue) => handleChange("HumanPlayerSpotlight", itemValue)}
      />
      <ToggleSwitch
        label="Object Recognition"
        value={pitData.ObjectRecognition}
        onToggle={(value) => handleChange("ObjectRecognition", value)}
      />
      <ToggleSwitch
        label="Read April Tags"
        value={pitData.ReadAprilTags}
        onToggle={(value) => handleChange("ReadAprilTags", value)}
      />
      <ToggleSwitch
        label="Autonomous Program"
        value={pitData.AutonomousProgram}
        onToggle={(value) => handleChange("AutonomousProgram", value)}
      />
      <ToggleSwitch
        label="Auto Programs For Speaker"
        value={pitData.AutoProgramsForSpeaker}
        onToggle={(value) => handleChange("AutoProgramsForSpeaker", value)}
      />
      <ToggleSwitch
        label="Can Get On Stage"
        value={pitData.CanGetOnStage}
        onToggle={(value) => handleChange("CanGetOnStage", value)}
      />
      <ToggleSwitch
        label="Can Score Notes In Trap"
        value={pitData.CanScoreNotesInTrap}
        onToggle={(value) => handleChange("CanScoreNotesInTrap", value)}
      />
      <ToggleSwitch
        label="Cheesecake Ability"
        value={pitData.CheesecakeAbility}
        onToggle={(value) => handleChange("CheesecakeAbility", value)}
      />
      <InputField
        label="Comments"
        value={pitData.Comments || ""}
        onChange={(value) => handleChange("Comments", value)}
      />
      <InputField
        label="Height (inches)"
        value={pitData.HeightInches.toString()}
        keyboardType="numeric"
        onChange={(text) => handleChange("HeightInches", parseInt(text))}
      />
      <InputField
        label="Frame Clearance (inches)"
        value={pitData.FrameClearanceInches.toString()}
        keyboardType="numeric"
        onChange={(text) => handleChange("FrameClearanceInches", parseInt(text))}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleSave}>
        <Text style={styles.uploadButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#f2f2f2",
  },
  uploadButton: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 70,
    marginHorizontal: 20,
  },
  uploadButtonText: {
    color: "#FFF",
    marginLeft: 10,
    fontWeight: "bold",
  },
});

export default EditPitDataScreen;
