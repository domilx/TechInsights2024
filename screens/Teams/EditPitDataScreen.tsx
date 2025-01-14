import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  Button,
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
  SwerveType,
  WellMade,
  Years,
  initialPitData,
} from "../../models/PitModel";
import { updatePitData } from "../../services/FirebaseService";
import { InputField } from "../components/InputField";
import { DropDownSelector } from "../components/DropDownSelector";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { DataContext } from "../../contexts/DataContext";
import { syncData, updateLastSyncTime } from "../../services/SyncService";
import { saveDataLocally } from "../../services/LocalStorageService";
import { RadioButtonGrid } from "../components/RadioButtonGrid";
import { AuthContext } from "../../contexts/AuthContext";

interface EditPitDataScreenProps {
  team: PitModel;
}

const EditPitDataScreen: React.FC<EditPitDataScreenProps> = ({ team }) => {
  const [pitData, setPitData] = useState<PitModel>(initialPitData);
  const [loading, setLoading] = useState(false);
  const { teams, setTeams, lastSync, selectedTeam, setSelectedTeam, setLastSync } = useContext(DataContext);
  const {team: techTeam} = useContext(AuthContext);

  useEffect(() => {
    setPitData(team || initialPitData);
  }, [team]);

  const handleChange = (field: any, value: any) => {
    setPitData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Implement validation and saving logic
    if (!pitData.TeamNumber) {
      setLoading(false);
      Alert.alert("Validation Error", "Robot Scout is required");
      return;
    }

    try {
      const resp  = await updatePitData(pitData, pitData.TeamNumber, techTeam);
      const syncResult = await syncData(techTeam);
      if (syncResult.success && syncResult.data && resp.success) {
        setLoading(false);
        Alert.alert("Success", "Pit Data saved successfully");
        setTeams(syncResult.data);
        setLastSync(new Date().toISOString());
        // Save the updated teams data locally
        saveDataLocally("fetchedData", syncResult.data);
        updateLastSyncTime();
        setSelectedTeam(undefined);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", (error as Error).message);
    }
  };

  function generateEnumItems(enumObject: any) {
    return Object.keys(enumObject).map((key) => ({
      label: enumObject[key],
      value: enumObject[key],
    }));
  }

  const driveBaseTypeItems = generateEnumItems(DriveBaseType);
  const swerveTypeItems = generateEnumItems(SwerveType);
  const driveBaseMotorItems = generateEnumItems(DriveBaseMotor);
  const years = generateEnumItems(Years);
  const stabilityItems = generateEnumItems(Stability);
  const wellMadeItems = generateEnumItems(WellMade);
  const pickupSpotsItems = generateEnumItems(PickupSpots);
  const scoreSpotsItems = generateEnumItems(ScoreSpots);
  const gravityItems = generateEnumItems(Gravity);
  const shootSpotsItems = generateEnumItems(ShootSpots);
  const humanPlayerSpotlightItems = generateEnumItems(HumanPlayerSpotlight);

  // FlatList data
  const data = [
    {
      label: "Team Name",
      key: "TeamName",
      value: pitData.TeamName,
      type: "text",
    },
    {
      label: "Drivebase Type",
      key: "DriveBaseType",
      value: pitData.DriveBaseType,
      type: "dropdown",
      droptype: driveBaseTypeItems,
    },
    {
      label: "Swerve Type",
      key: "SwerveType",
      value: pitData.SwerveType,
      type: "dropdown",
      droptype: swerveTypeItems,
    },
    {
      label: "Drivebase Motor",
      key: "DriveBaseMotor",
      value: pitData.DriveBaseMotor,
      type: "dropdown",
      droptype: driveBaseMotorItems,
    },
    {
      label: "Driver Experience",
      key: "DriverExperience",
      value: pitData.DriverExperience,
      type: "dropdown",
      droptype: years,
    },
    {
      label: "Robot Weight (lbs)",
      key: "WeightLbs",
      value: pitData.WeightLbs.toString(),
      type: "number",
    },
    {
      label: "Robot Width (in)",
      key: "WidthInches",
      value: pitData.WidthInches.toString(),
      type: "number",
    },
    {
      label: "Robot Length (in)",
      key: "LengthInches",
      value: pitData.LengthInches.toString(),
      type: "number",
    },
    {
      label: "Height (in)",
      key: "HeightInches",
      value: pitData.HeightInches.toString(),
      type: "number",
    },
    {
      label: "Frame Clearance (in)",
      key: "FrameClearanceInches",
      value: pitData.FrameClearanceInches.toString(),
      type: "number",
    },
    {
      label: "Stability",
      key: "Stability",
      value: pitData.Stability,
      type: "dropdown",
      droptype: stabilityItems,
    },
    {
      label: "Well Made",
      key: "WellMade",
      value: pitData.WellMade,
      type: "dropdown",
      droptype: wellMadeItems,
    },
    {
      label: "Single Intake/Shooter",
      key: "SingleIntakeShooter",
      value: pitData.SingleIntakeShooter,
      type: "boolean",
    },
    {
      label: "Pickup Spots",
      key: "PickupSpots",
      value: pitData.PickupSpots,
      type: "dropdown",
      droptype: pickupSpotsItems,
    },
    {
      label: "Score Spots",
      key: "ScoreSpots",
      value: pitData.ScoreSpots,
      type: "dropdown",
      droptype: scoreSpotsItems,
    },
    {
      label: "Center of Gravity",
      key: "CenterOfGravity",
      value: pitData.CenterOfGravity,
      type: "dropdown",
      droptype: gravityItems,
    },
    {
      label: "Years Using Swerve",
      key: "YearsUsingSwerve",
      value: pitData.YearsUsingSwerve,
      type: "dropdown",
      droptype: years,
    },
    {
      label: "Shoots From",
      key: "ShootsFrom",
      value: pitData.ShootsFrom,
      type: "radio1",
      vertical: 1,
      horizontal: 4,
      titles: ["Starting Zone", "Podium", "Wing", "Center Line"],
      saveButton: "AutoExtraNotesButtons",
    },
    {
      label: "Object Recognition",
      key: "ObjectRecognition",
      value: pitData.ObjectRecognition,
      type: "boolean",
    },
    {
      label: "Reads April Tags",
      key: "ReadAprilTags",
      value: pitData.ReadAprilTags,
      type: "boolean",
    },
    {
      label: "Autonomous Program to Leave",
      key: "AutoProgramsToLeave",
      value: pitData.AutoProgramsToLeave,
      type: "boolean",
    },
    {
      label: "Can Get OnStage",
      key: "CanGetOnStage",
      value: pitData.CanGetOnStage,
      type: "boolean",
    },
    {
      label: "Can Score Notes in Trap",
      key: "CanScoreNotesInTrap",
      value: pitData.CanScoreNotesInTrap,
      type: "boolean",
    },
    {
      label: "Human Player Spotlight",
      key: "HumanPlayerSpotlight",
      value: pitData.HumanPlayerSpotlight,
      type: "dropdown",
      droptype: humanPlayerSpotlightItems,
    },
    {
      label: "Can Cheesecake or lift robot",
      key: "CheesecakeAbility",
      value: pitData.CheesecakeAbility,
      type: "boolean",
    },
    {
      label: "Comments",
      key: "Comments",
      value: pitData.Comments,
      type: "text",
    },
  ];

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#F6EB14" />
          <Text style={styles.loadingText}>Saving...</Text>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 90} // Adjust this offset as needed
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Pit Scouting for Team {pitData.TeamNumber}
          </Text>
        </View>
        <FlatList
          scrollEnabled={true}
          style={styles.container}
          data={data}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View>
              {item.type === "text" && (
                <InputField
                  label={item.label}
                  value={item.value}
                  onChange={(text) => handleChange(item.key, text)}
                  keyboardType="default"
                />
              )}
              {item.type === "number" && (
                <InputField
                  label={item.label}
                  value={item.value?.toString() ?? ""}
                  onChange={(text) => handleChange(item.key, text)}
                  keyboardType="numeric"
                />
              )}
              {item.type === "boolean" && (
                <ToggleSwitch
                  label={item.label}
                  value={item.value}
                  onToggle={(newValue) => handleChange(item.key, newValue)}
                />
              )}
              {item.type === "dropdown" && (
                <DropDownSelector
                  label={item.label}
                  value={item.value}
                  items={item.droptype}
                  setValue={(text) => handleChange(item.key, text)}
                />
              )}
              {item.type === "radio1" && (
                <RadioButtonGrid
                  horizontalAmount={item.horizontal}
                  verticalAmount={item.vertical}
                  columnTitles={item.titles}
                  rowTitles={["", ""]}
                  label={item.label}
                  onPress={(selectedValue: any) =>
                    handleChange(item.key, selectedValue)
                  }
                  saveButtons={(selectedValue: any) =>
                    handleChange(item.saveButton, selectedValue)
                  }
                  value={pitData.AutoExtraNotesButtons}
                />
              )}
            </View>
          )}
        />

        <TouchableOpacity style={styles.uploadButton} onPress={handleSave}>
          <Text style={styles.uploadButtonText}>Save</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
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
  loadingOverlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  loadingText: {
    marginTop: 20,
    color: "#FFFFFF",
  },
});

export default EditPitDataScreen;
