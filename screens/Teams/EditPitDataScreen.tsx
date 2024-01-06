import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import {
  DriveBaseMotor,
  DriveBaseType,
  DriverExperience,
  PitModel,
  Stability,
  initialPitData,
} from "../../models/PitModel";
import {
  updatePitData,
  uploadPitDataToFirebase,
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
    if (!pitData.RobScout) {
      Alert.alert("Validation Error", "Robot Scout is required");
      return;
    }

    try {
      await updatePitData(pitData, pitData.TeamNb);
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

  const driverExperienceItems = Object.keys(DriverExperience).map((key) => ({
    label: DriverExperience[key as keyof typeof DriverExperience],
    value: DriverExperience[key as keyof typeof DriverExperience],
  }));

  const stabilityItems = Object.keys(Stability).map((key) => ({
    label: Stability[key as keyof typeof Stability],
    value: Stability[key as keyof typeof Stability],
  }));

  return (
    <ScrollView style={styles.container}>
      <InputField
        label="Robot Scout"
        value={pitData.RobScout}
        onChange={(text) => handleChange("RobScout", text)}
      />
      <InputField
        label="Team Number"
        value={pitData.TeamNb.toString()}
        keyboardType="numeric"
        onChange={(text) => handleChange("TeamNb", parseInt(text))}
      />
      <InputField
        label="Robot Team Name"
        value={pitData.RobTeamNm}
        onChange={(text) => handleChange("RobTeamNm", text)}
      />
      <DropDownSelector
        label="Drive Base Type"
        items={driveBaseTypeItems}
        value={pitData.RobDrive}
        setValue={(itemValue) => handleChange("RobDrive", itemValue)}
      />
      <DropDownSelector
        label="Drive Base Motor"
        items={driveBaseMotorItems}
        value={pitData.RobMotor}
        setValue={(itemValue) => handleChange("RobMotor", itemValue)}
      />
      <DropDownSelector
        label="Driver Experience"
        items={driverExperienceItems}
        value={pitData.RobDriveExp}
        setValue={(itemValue) => handleChange("RobDriveExp", itemValue)}
      />
      <InputField
        label="Drive Weight"
        value={pitData.RobWtlbs.toString()}
        keyboardType="numeric"
        onChange={(text) => handleChange("RobWtlbs", parseInt(text))}
      />
      <InputField
        label="Drive Width"
        value={pitData.RobWidth.toString()}
        keyboardType="numeric"
        onChange={(text) => handleChange("RobWidth", parseInt(text))}
      />
      <InputField
        label="Drive Length"
        value={pitData.RobLength.toString()}
        keyboardType="numeric"
        onChange={(text) => handleChange("RobLength", parseInt(text))}
      />
      <DropDownSelector
        label="Stability"
        items={stabilityItems}
        value={pitData.RobStble}
        setValue={(itemValue) => handleChange("RobStble", itemValue)}
      />
      <ToggleSwitch
        label="RobQuest1"
        value={pitData.RobQuest1}
        onToggle={(value) => handleChange("RobQuest1", value)}
      />
      <ToggleSwitch
        label="RobQuest2"
        value={pitData.RobQuest2}
        onToggle={(value) => handleChange("RobQuest2", value)}
      />
      <ToggleSwitch
        label="RobQuest3"
        value={pitData.RobQuest3}
        onToggle={(value) => handleChange("RobQuest3", value)}
      />
      <ToggleSwitch
        label="RobQuest4"
        value={pitData.RobQuest4}
        onToggle={(value) => handleChange("RobQuest4", value)}
      />
      <ToggleSwitch
        label="RobQuest5"
        value={pitData.RobQuest5}
        onToggle={(value) => handleChange("RobQuest5", value)}
      />
      <ToggleSwitch
        label="RobQuest6"
        value={pitData.RobQuest6}
        onToggle={(value) => handleChange("RobQuest6", value)}
      />
      <ToggleSwitch
        label="RobQuest7"
        value={pitData.RobQuest7}
        onToggle={(value) => handleChange("RobQuest7", value)}
      />
      <ToggleSwitch
        label="RobQuest8"
        value={pitData.RobQuest8}
        onToggle={(value) => handleChange("RobQuest8", value)}
      />
      <ToggleSwitch
        label="RobQuest9"
        value={pitData.RobQuest9}
        onToggle={(value) => handleChange("RobQuest9", value)}
      />
      <ToggleSwitch
        label="RobQuest10"
        value={pitData.RobQuest10}
        onToggle={(value) => handleChange("RobQuest10", value)}
      />
      <ToggleSwitch
        label="RobQuest11"
        value={pitData.RobQuest11}
        onToggle={(value) => handleChange("RobQuest11", value)}
      />
      <ToggleSwitch
        label="RobQuest12"
        value={pitData.RobQuest12}
        onToggle={(value) => handleChange("RobQuest12", value)}
      />
      <ToggleSwitch
        label="RobQuest13"
        value={pitData.RobQuest13}
        onToggle={(value) => handleChange("RobQuest13", value)}
      />
      <ToggleSwitch
        label="RobQuest14"
        value={pitData.RobQuest14}
        onToggle={(value) => handleChange("RobQuest14", value)}
      />
      <ToggleSwitch
        label="RobQuest15"
        value={pitData.RobQuest15}
        onToggle={(value) => handleChange("RobQuest15", value)}
      />
      <InputField
        label="Comment"
        value={pitData.RobComm1.toString()}
        onChange={(text) => handleChange("RobComm1", parseInt(text))}
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
