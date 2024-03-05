import React, { useState, useEffect, FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DriveBaseMotor,
  DriveBaseType,
  Gravity,
  HumanPlayerSpotlight,
  PickupSpots,
  PitModel,
  ScoreSpots,
  Stability,
  WellMade,
  Years,
} from "../models/PitModel";
import Icon from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import ModalHeader from "./components/ModalHeader";
import { ShootSpots } from "../models/MatchModel";

interface FilterScreenProps {}

type FilterConfig = {
  [key in keyof PitModel]?: Array<string | number | boolean>;
};

type FilterGroup = {
  [key: string]: {
    [key in keyof FilterConfig]?: string | number | boolean;
  };
};

const filterConfig: FilterConfig = {
  DriveBaseType: Object.values(DriveBaseType),
  DriveBaseMotor: Object.values(DriveBaseMotor),
  DriverExperience: Object.values(Years),
  Stability: Object.values(Stability),
  WellMade: Object.values(WellMade),
  PickupSpots: Object.values(PickupSpots),
  ScoreSpots: Object.values(ScoreSpots),
  CenterOfGravity: Object.values(Gravity),
  YearsUsingSwerve: Object.values(Years),
  ShootsFrom: Object.values(ShootSpots),
  HumanPlayerSpotlight: Object.values(HumanPlayerSpotlight),
};

const FilterScreen: FC<FilterScreenProps> = () => {
  const [originalPitData, setOriginalPitData] = useState<PitModel[]>([]);
  const [displayedPitData, setDisplayedPitData] = useState<PitModel[]>([]);
  const [availableFilters, setAvailableFilters] = useState<
    Array<keyof FilterConfig>
  >([]);
  const [filters, setFilters] = useState<{
    [key in keyof FilterConfig]?: string | number | boolean;
  }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFilterField, setSelectedFilterField] = useState<
    keyof FilterConfig | null
  >(null);
  const [isValueModalVisible, setIsValueModalVisible] = useState(false);
  const [filterGroups, setFilterGroups] = useState<FilterGroup>({});
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupManagementModalVisible, setGroupManagementModalVisible] =
    useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const getPitData = async () => {
        const storedPitData = await AsyncStorage.getItem("fetchedData");
        if (storedPitData) {
          const data = JSON.parse(storedPitData);
          setOriginalPitData(data);
          setDisplayedPitData(data);
        }
      };
      const loadFilterGroups = async () => {
        const savedGroups = await AsyncStorage.getItem("filterGroups");
        if (savedGroups) {
          setFilterGroups(JSON.parse(savedGroups));
        }
      };

      loadFilterGroups();
      getPitData();
    }, [])
  );

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    const filteredData = originalPitData.filter((team) => {
      return availableFilters.every((filterField) => {
        if (filters[filterField] === undefined) {
          return true;
        }
        return String(team[filterField]) === String(filters[filterField]);
      });
    });
    setDisplayedPitData(filteredData);
  };

  const applyFilterGroup = (groupName: any) => {
    const groupFilters = filterGroups[groupName];
    if (groupFilters) {
      setFilters(groupFilters);

      // Update availableFilters to include keys from the applied group
      const filterKeys = Object.keys(groupFilters) as Array<keyof FilterConfig>;
      setAvailableFilters(filterKeys);

      applyFilters(); // Apply the filters
      setSelectedGroup(groupName); // Set the selected group
    }
    setIsModalVisible(false); // Ensure this is false to prevent reopening the modal
    setGroupManagementModalVisible(false); // Also ensure this is false to close the group management modal
  };

  const deleteFilterGroup = async (groupName: any) => {
    const updatedGroups = { ...filterGroups };
    delete updatedGroups[groupName];
    await AsyncStorage.setItem("filterGroups", JSON.stringify(updatedGroups));
    setFilterGroups(updatedGroups);
  };

  const renameFilterGroup = async (oldName: any, newName: any) => {
    const updatedGroups = { ...filterGroups, [newName]: filterGroups[oldName] };
    delete updatedGroups[oldName as keyof typeof updatedGroups];
    await AsyncStorage.setItem("filterGroups", JSON.stringify(updatedGroups));
    setFilterGroups(updatedGroups);
  };

  const saveFilterGroup = async (groupName: any) => {
    try {
      const newGroups = { ...filterGroups, [groupName]: filters };
      await AsyncStorage.setItem("filterGroups", JSON.stringify(newGroups));
      setFilterGroups(newGroups);
    } catch (e) {
      Alert.alert("Error", (e as Error).message);
    }
  };

  const GroupManagementModal = ({ isVisible, onClose }: any) => {
    const [newGroupName, setNewGroupName] = useState("");
    const [isRenaming, setIsRenaming] = useState(false);
    const [groupNameToRename, setGroupNameToRename] = useState<string | null>(null);

    const handleSaveGroup = async () => {
      if (isRenaming && groupNameToRename) {
        await renameFilterGroup(groupNameToRename, newGroupName);
      } else {
        if (!newGroupName.trim()) {
          Alert.alert("Error", "Group name cannot be empty!");
          return;
        }
        if (filterGroups.hasOwnProperty(newGroupName)) {
          Alert.alert("Error", "A group with this name already exists!");
          return;
        }
        await saveFilterGroup(newGroupName);
      }
      resetRenamingState();
      onClose(); // Close the modal after saving
    };

    const resetRenamingState = () => {
      setNewGroupName("");
      setIsRenaming(false);
      setGroupNameToRename(null);
    };

    const handleRenameClick = (groupName: string) => {
      setIsRenaming(true);
      setGroupNameToRename(groupName);
      setNewGroupName(groupName);
    };

    const handleDeleteClick = async (groupName: string) => {
      Alert.alert(
        "Confirm Delete",
        `Are you sure you want to delete '${groupName}'?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: async () => {
              await deleteFilterGroup(groupName);
            },
          },
        ]
      );
    };

    return (
      <Modal visible={isVisible} animationType="slide" transparent={false}>
        <View style={styles.fullScreenModal}>
          <ModalHeader
            onClose={() => {
              resetRenamingState();
              onClose();
            }}
            title={isRenaming ? "Rename Filter Group" : "Manage Filter Groups"}
          />
          <ScrollView contentContainerStyle={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder={isRenaming ? "Enter New Name" : "New Group Name"}
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveGroup}>
              <Text style={styles.buttonText}>
                {isRenaming ? "Rename Group" : "Save New Group"}
              </Text>
            </TouchableOpacity>
            {isRenaming && (
              <TouchableOpacity style={styles.button} onPress={resetRenamingState}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            )}
            {Object.keys(filterGroups).map((groupName, index) => (
              <View key={index} style={styles.groupItem}>
                <Text style={styles.groupNameText}>{groupName}</Text>
                <View style={styles.groupActions}>
                  <TouchableOpacity
                    style={styles.groupButton}
                    onPress={() => applyFilterGroup(groupName)}
                  >
                    <Text>Apply</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.groupButton}
                    onPress={() => handleRenameClick(groupName)}
                  >
                    <Text>Rename</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.groupButton}
                    onPress={() => handleDeleteClick(groupName)}
                  >
                    <Text>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    );
  };


  const setFilter = (
    field: keyof FilterConfig,
    value: string | number | boolean | undefined
  ) => {
    const isBoolean = typeof value === "boolean";
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: isBoolean ? value : String(value),
    }));

    // Ensure the filter field is in availableFilters
    if (!availableFilters.includes(field)) {
      setAvailableFilters((prevFilters) => [...prevFilters, field]);
    }
  };

  const removeFilter = (filterField: keyof FilterConfig) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      delete newFilters[filterField];
      return newFilters;
    });

    // Remove the filter field from availableFilters
    setAvailableFilters((prevFilters) =>
      prevFilters.filter((f) => f !== filterField)
    );
  };

  const addFilter = (filterField: keyof FilterConfig) => {
    if (!availableFilters.includes(filterField)) {
      setAvailableFilters((prevFilters) => [...prevFilters, filterField]);
    }
  };

  const renderFilterPicker = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <ModalHeader
        title="Pick a Filter"
        onClose={() => setIsModalVisible(false)}
      />
      <ScrollView style={styles.filterModal}>
        {Object.keys(filterConfig).map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.modalButton}
            onPress={() => {
              addFilter(key as keyof FilterConfig);
              setIsModalVisible(false);
            }}
          >
            <Text style={styles.modalButtonText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Modal>
  );

  const renderFilterValuePicker = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isValueModalVisible}
      onRequestClose={() => setIsValueModalVisible(false)}
    >
      <ModalHeader
        onClose={() => setIsValueModalVisible(false)}
        title="Select Filter Value"
      />
      <ScrollView style={styles.modalContent}>
        {selectedFilterField &&
          filterConfig[selectedFilterField]?.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.applyButton}
              onPress={() => {
                setFilter(selectedFilterField, option);
                setIsValueModalVisible(false);
              }}
            >
              <Text style={styles.applyButtonText}>{String(option)}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>All teams:</Text>
      </View>

      {displayedPitData.length === 0 ? (
        <View style={styles.noTeamsContainer}>
          <Text style={styles.noTeamsText}>No teams match the applied filters.</Text>
        </View>
      ) : (
        displayedPitData.map((team, index) => (
          <View style={styles.teamContainer} key={index}>
            <View style={styles.teamTextContainer}>
              <Text style={styles.teamText}>
                {"Team " + team.TeamNumber + " (" + team.TeamName + ")"}
              </Text>
            </View>
          </View>
        ))
      )}

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Current filters:</Text>
      </View>

      {availableFilters.length === 0? <View style={styles.noFiltersContainer}>
      <Text style={styles.noFiltersText}>No filters applied.</Text>
    </View> : null}
      {availableFilters.map((filterField) => (
        <View key={filterField} style={styles.filterContainer}>
          <Text style={styles.filterLabel}>{filterField}</Text>
          <TouchableOpacity
            style={styles.valueButton}
            onPress={() => {
              setSelectedFilterField(filterField);
              setIsValueModalVisible(true);
            }}
          >
            <Text style={styles.valueButtonText}>
              {typeof filters[filterField] === "boolean"
                ? filters[filterField]
                  ? "True"
                  : "False"
                : filters[filterField] || "Select Value"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFilter(filterField)}
          >
            <Icon name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      ))}
      {renderFilterPicker()}
      {renderFilterValuePicker()}

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>+ Add Filter</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => setGroupManagementModalVisible(true)}
      >
        <Text style={styles.applyButtonText}>Manage Filter Groups</Text>
      </TouchableOpacity>
      <GroupManagementModal
        isVisible={groupManagementModalVisible}
        onClose={() => setGroupManagementModalVisible(false)}
      />
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
  },
  noTeamsContainer: {
    backgroundColor: "#fff",
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  noTeamsText: {
    fontWeight: "bold",
    color: "#333",
  },
  teamContainer: {
    backgroundColor: "#fff",
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  teamTextContainer: {
    flex: 1,
  },
  noFiltersContainer: {
    backgroundColor: "#fff",
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  noFiltersText: {
    fontWeight: "bold",
    color: "#333",
  },

  teamText: {
    fontWeight: "bold",
    color: "#333",
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  modalContent: {
    flexGrow: 1,
    padding: 20,
  },
  authorText: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  headerContainer: {
    alignItems: "flex-start",
    margin: 12,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  groupActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  modalInnerContent: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  authorName: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#F6EB14",
    fontWeight: "bold",
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  groupItemContent: {
    flex: 1,
  },
  groupNameText: {
    fontWeight: "bold",
  },
  groupButton: {
    backgroundColor: "#E8E8E8",
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    margin: 10,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  filterModal: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 10,
    margin: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  valueButton: {
    backgroundColor: "#D6E0D9",
    padding: 10,
    borderRadius: 8,
  },
  valueButtonText: {
    fontSize: 16,
    color: "#333",
  },
  removeButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 8,
  },
  applyButton: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    margin: 10,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  applyButtonText: {
    fontSize: 18,
    color: "#F6EB14",
    fontWeight: "bold",
  },
  modalButton: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#F6EB14",
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
});

export default FilterScreen;


