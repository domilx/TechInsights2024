import React, { useState, useEffect, useContext, useRef } from "react";
//@ts-ignore
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import {
  StyleSheet,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView
} from "react-native";
import { updateMatchData } from "../../services/FirebaseService";
import { InputField } from "../components/InputField";
import { DropDownSelector } from "../components/DropDownSelector";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { DataContext } from "../../contexts/DataContext";
import { syncData, updateLastSyncTime } from "../../services/SyncService";
import { saveDataLocally } from "../../services/LocalStorageService";
import { RadioButtonGrid } from "../components/RadioButtonGrid";
import { Awareness, DefenseLevel, EndGameHarmony, EndGameOnStage, MatchModel, Position, RankingPoints, Speed, Tippiness, TrapEndGame, initialMatchData } from "../../models/MatchModel";

interface EditPitDataScreenProps {
  match: MatchModel;
  onClose: () => void;
}

const EditMatchDataScreen: React.FC<EditPitDataScreenProps> = ({ match, onClose }) => {
  const [matchData, setMatchData] = useState<MatchModel>(initialMatchData);
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const {
    teams,
    setTeams,
    lastSync,
    setLastSync,
    selectedTeam,
    setSelectedTeam,
  } = useContext(DataContext);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };
  useEffect(() => {
    setMatchData(match || initialMatchData);
  }, [match]);

  const handleChange = (field: any, value: any) => {
    setMatchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
      if (!matchData.ScoutName) {
        Alert.alert("Validation Error", "Robot Scout is required");
        return;
      }
  
      try {
        const resp = await updateMatchData(matchData, matchData.TeamNumber, matchData.MatchNumber.toString());
        const syncResult = await syncData();
        if (syncResult.success && syncResult.data && resp.success) {
          onClose();
          Alert.alert("Success", "Match data saved successfully");
          setTeams(syncResult.data);
          saveDataLocally("fetchedData", syncResult.data);
          setSelectedTeam(undefined);
          updateLastSyncTime();
        }
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
    onClose();
  };

  
  const content = ({ data }: { data: any }) => {
    return (
      <FlatList
        scrollEnabled={false}
        style={styles.container}
        data={data}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View key={item.key}>
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
                value={item.value.toString()}
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
                onPress={(selectedValue) =>
                  handleChange(item.key, selectedValue)
                }
                saveButtons={(selectedValue) =>
                  handleChange(item.saveButton, selectedValue)
                }
                value={matchData.TeleopTrapButtons}
              />
            )}
             
             
          </View>
        )}
      />
    );
  };

  function generateEnumItems(enumObject: any) {
    return Object.keys(enumObject).map((key) => ({
      label: enumObject[key],
      value: enumObject[key],
    }));
  }

  const PositionTypeItem = generateEnumItems(Position);
  const EndGameOnStageItem = generateEnumItems(EndGameOnStage);
  const EndGameHarmonyItem = generateEnumItems(EndGameHarmony);
  const RankingPointsItem = generateEnumItems(RankingPoints);
  const DefenseLevelItem = generateEnumItems(DefenseLevel);
  const TippinessItem = generateEnumItems(Tippiness);
  const SpeedItem = generateEnumItems(Speed);
  const AwareTypeItem = generateEnumItems(Awareness);
  const EndGameTrapITem = generateEnumItems(TrapEndGame);
  
  const InfoData = [
    {
      label: "Scout Name",
      key: "ScoutName",
      value: matchData.ScoutName,
      type: "text",
    },
    {
      label: "Match Number",
      key: "MatchNumber",
      value: matchData.MatchNumber.toString(),
      type: "number",
    },
  ];

  const AutoData = [
    {
      label: "Starting Position",
      key: "AutoStartingPosition",
      value: matchData.AutoStartingPosition,
      type: "dropdown",
      droptype: PositionTypeItem,
    },
    {
      label: "Auto Leave",
      key: "AutoLeave",
      value: matchData.AutoLeave,
      type: "boolean",
    },
    {
      label: "Amplifier",
      key: "AutoAmp",
      value: matchData.AutoAmp,
      type: "counter",
    },
    {
      label: "Speaker",
      key: "AutoSpeaker",
      value: matchData.AutoSpeaker,
      type: "counter",
    },
    {
      label: "Dropped Game Pieces",
      key: "AutoDropped",
      value: matchData.AutoDropped,
      type: "counter",
      saveButton: "AutoExtraNotesButtons",
    },
    {
      label: "A-Stop Pressed?",
      key: "AutoAStopPressed",
      value: matchData.AutoAStopPressed,
      type: "boolean",
    },
    {
      label: "Incapacitated in Auto?",
      key: "AutoIncapacitated",
      value: matchData.AutoIncapacitated,
      type: "boolean",
    },
    {
      label: "Fell in Auto?",
      key: "AutoRobotFalls",
      value: matchData.AutoFell,
      type: "boolean",
    },
    {
      label: "Robot Did Not Play",
      key: "AutoRobotDidNotPlay",
      value: matchData.AutoRobotDidNotPlay,
      type: "boolean",
    },
  ];

  const TeleopData = [
    {
      label: "Teleop Cycle Time",
      key: "TeleopCycleTime",
      value: matchData.TeleopCycleTime,
      type: "text",
    },
    {
      label: "Teleop Game Piece Stuck",
      key: "TeleopGamePieceStuck",
      value: matchData.TeleopGamePieceStuck,
      type: "text",
    },
    {
      label: "Fell in Feleop?",
      key: "TeleopFell",
      value: matchData.TeleopFell,
      type: "boolean",
    },
    {
      label: "Incapacitated in Teleop",
      key: "TeleopIncapacitated",
      value: matchData.TeleopIncapacitated,
      type: "boolean",
    },

    {
      label: "Shoots From",
      key: "TeleopShootsFrom",
      value: matchData.TeleopShootsFrom,
      type: "radio1",
      vertical: 1,
      horizontal: 4,
      titles: ["Starting Zone", "Podium", "Wing", "Center Line"],
      saveButton: "TeleopShootsFromButtons",
    },
    {
      label: "Can Pass Under Stage",
      key: "TeleopUnderStage",
      value: matchData.TeleopUnderStage,
      type: "boolean",
    },
  ];

  const EndGameData = [
    {
      label: "End Game OnStage",
      key: "EndGameOnStage",
      value: matchData.EndGameOnStage,
      type: "dropdown",
      droptype: EndGameOnStageItem,
    },
    {
      label: "End Game Harmony", //TODO not put in verif
      key: "EndGameHarmony",
      value: matchData.EndGameHarmony,
      type: "dropdown",
      droptype: EndGameHarmonyItem,
    },
    {
      label: "End Game Trap", //TODO not put in verif
      key: "EndGameTrap",
      value: matchData.EndGameTrap,
      type: "dropdown",
      droptype: EndGameTrapITem,
    },
    {
      label: "End Game Robot Fell",
      key: "EndGameRobotFell",
      value: matchData.EndGameRobotFell,
      type: "boolean",
    },
    {
      label: "End Game Robot Incapacitated",
      key: "EndGameRobotIncapacitated",
      value: matchData.EndGameRobotIncapacitated,
      type: "boolean",
    },
    {
      label: "End Game Spotlit",
      key: "EndGameSpotLighted",
      value: matchData.EndGameSpotLighted,
      type: "boolean",
    },
  ];

  const PerformanceData = [
    {
      label: "Total Points Alliance",
      key: "AllianceTotalPoints",
      value: matchData.AllianceTotalPoints,
      type: "number",
    },
    {
      label: "Alliance Game Status",
      key: "AllianceRankingPoints",
      value: matchData.AllianceRankingPoints,
      type: "dropdown",
      droptype: RankingPointsItem,
    },
    {
      label: "Alliance Melody",
      key: "AllianceMelody",
      value: matchData.AllianceMelody,
      type: "boolean",
    },
    {
      label: "Alliance Coopertition",
      key: "AllianceCoopertition",
      value: matchData.AllianceCoopertition,
      type: "boolean",
    },
    {
      label: "Alliance Ensemble",
      key: "AllianceEnsemble",
      value: matchData.AllianceEnsemble,
      type: "boolean",
    },
    {
      label: "Plays Defense?",
      key: "PlaysDefense",
      value: matchData.PlaysDefense,
      type: "dropdown",
      droptype: DefenseLevelItem,
    },
    {
      label: "Is robot tippy?",
      key: "RobotTippy",
      value: matchData.RobotTippy,
      type: "dropdown",
      droptype: TippinessItem,
    },
    {
      label: "Is robot fast?",
      key: "RobotSpeed",
      value: matchData.RobotSpeed,
      type: "dropdown",
      droptype: SpeedItem,
    },
    {
      label: "Field Awareness",
      key: "FieldAwareness",
      value: matchData.FieldAwareness,
      type: "dropdown",
      droptype: AwareTypeItem,
    },
    {
      label: "Comment",
      key: "Comment",
      value: matchData.Comment,
      type: "text",
    },
  ];
  const buttonTextStyle = {
    color: "#686868",
    fontWeight: "bold",
  };
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 90}
        >
          <ProgressSteps
            completedProgressBarColor="#1E1E1E"
            activeStepIconBorderColor="#1E1E1E"
            completedStepIconColor="#1E1E1E"
            activeStepIconColor="#F6EB14"
            activeLabelColor="#1E1E1E"
            completedCheckColor="#F6EB14"
            activeStep={currentStep}
          >
            <ProgressStep
              label="Info"
              nextBtnTextStyle={buttonTextStyle}
              previousBtnTextStyle={buttonTextStyle}
              scrollEnabled={false}
            >
              <View>{content({ data: InfoData })}</View>
            </ProgressStep>
  
            <ProgressStep
              label="Auto"
              nextBtnTextStyle={buttonTextStyle}
              previousBtnTextStyle={buttonTextStyle}
              scrollable={true}
              scrollViewProps={{ ref: scrollViewRef }}
              onNext={() => {
                setCurrentStep(1);
                scrollToTop();
              }}
            >
              <View>
                <View>{content({ data: AutoData })}</View>
              </View>
            </ProgressStep>
  
            <ProgressStep
              label="Teleop"
              nextBtnTextStyle={buttonTextStyle}
              previousBtnTextStyle={buttonTextStyle}
              scrollable={true}
              scrollViewProps={{ ref: scrollViewRef }}
              onNext={() => {
                setCurrentStep(2);
                scrollToTop();
              }}
            >
              <View>
                <View>{content({ data: TeleopData })}</View>
              </View>
            </ProgressStep>
            <ProgressStep
              label="EndGame"
              nextBtnTextStyle={buttonTextStyle}
              previousBtnTextStyle={buttonTextStyle}
              scrollable={true}
              scrollViewProps={{ ref: scrollViewRef }}
              onNext={() => {
                setCurrentStep(3);
                scrollToTop();
              }}
            >
              <View>
                <View>{content({ data: EndGameData })}</View>
              </View>
            </ProgressStep>
            <ProgressStep
              label="Results"
              onSubmit={handleSave}
              nextBtnTextStyle={buttonTextStyle}
              previousBtnTextStyle={buttonTextStyle}
            >
              <View>{content({ data: PerformanceData })}</View>
            </ProgressStep>
          </ProgressSteps>
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
  saveButton: {
    backgroundColor: "#F6EB14",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  label: {
    width: 100,
    marginRight: 10,
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

export default EditMatchDataScreen;
