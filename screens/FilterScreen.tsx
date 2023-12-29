import React, { useState, useEffect, FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DriveBaseMotor,
  DriveBaseType,
  DriverExperience,
  PitModel,
  Stability,
} from "../models/PitModel";
import Icon from "@expo/vector-icons/Ionicons";

interface FilterScreenProps {}

type FilterConfig = {
  [key in keyof PitModel]?: Array<string | number | boolean>;
};

const filterConfig: FilterConfig = {
  RobDrive: Object.values(DriveBaseType),
  RobMotor: Object.values(DriveBaseMotor),
  RobDriveExp: Object.values(DriverExperience),
  RobStble: Object.values(Stability),
  RobQuest1: [true, false],
  RobQuest2: [true, false],
  RobQuest3: [true, false],
  RobQuest4: [true, false],
  RobQuest5: [true, false],
  RobQuest6: [true, false],
  RobQuest7: [true, false],
  RobQuest8: [true, false],
  RobQuest9: [true, false],
  RobQuest10: [true, false],
  RobQuest11: [true, false],
  RobQuest12: [true, false],
  RobQuest13: [true, false],
  RobQuest14: [true, false],
  RobQuest15: [true, false],
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
  const [filterGroups, setFilterGroups] = useState({});
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupManagementModalVisible, setGroupManagementModalVisible] =
    useState(false);

  useEffect(() => {
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
  }, []);

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
  };
  

  const deleteFilterGroup = async (groupName: any) => {
    const updatedGroups = { ...filterGroups };
    delete updatedGroups[groupName];
    await AsyncStorage.setItem("filterGroups", JSON.stringify(updatedGroups));
    setFilterGroups(updatedGroups);
  };

  const renameFilterGroup = async (oldName: any, newName: any) => {
    const updatedGroups = { ...filterGroups, [newName]: filterGroups[oldName] };
    delete updatedGroups[oldName];
    await AsyncStorage.setItem("filterGroups", JSON.stringify(updatedGroups));
    setFilterGroups(updatedGroups);
  };

  const saveFilterGroup = async (groupName: any) => {
    try {
      const newGroups = { ...filterGroups, [groupName]: filters };
      await AsyncStorage.setItem("filterGroups", JSON.stringify(newGroups));
      setFilterGroups(newGroups);
    } catch (e) {
      console.log(e);
    }
  };

  const GroupManagementModal = ({ isVisible, onClose }) => {
    const [newGroupName, setNewGroupName] = useState("");

    const handleSaveGroup = () => {
      saveFilterGroup(newGroupName);
      setNewGroupName("");
      onClose();
    };

    return (
      <Modal visible={isVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Manage Filter Groups</Text>
          <TextInput
            style={styles.input}
            placeholder="New Group Name"
            value={newGroupName}
            onChangeText={setNewGroupName}
          />
          <TouchableOpacity style={styles.button} onPress={handleSaveGroup}>
            <Text style={styles.buttonText}>Save New Group</Text>
          </TouchableOpacity>
          {Object.keys(filterGroups).map((groupName) => (
            <View key={groupName} style={styles.groupItem}>
              <Text style={styles.groupNameText}>{groupName}</Text>
              <TouchableOpacity
                style={styles.groupButton}
                onPress={() => applyFilterGroup(groupName)}
              >
                <Text>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.groupButton}
                onPress={() => renameFilterGroup(groupName, newGroupName)}
              >
                <Text>Rename</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.groupButton}
                onPress={() => deleteFilterGroup(groupName)}
              >
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
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
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setIsModalVisible(false)}
        >
          <Icon name="chevron-back" size={30} color="#F6EB14" />
        </TouchableOpacity>
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
      </View>
    </Modal>
  );

  const renderFilterValuePicker = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isValueModalVisible}
      onRequestClose={() => setIsValueModalVisible(false)}
    >
      <View style={styles.modalContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setIsValueModalVisible(false)}
        >
          <Icon name="chevron-back" size={30} color="#F6EB14" />
        </TouchableOpacity>
        {selectedFilterField &&
          filterConfig[selectedFilterField]?.map((option) => (
            <TouchableOpacity
              key={String(option)}
              style={styles.modalButton}
              onPress={() => {
                setFilter(selectedFilterField, option);
                setIsValueModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>{String(option)}</Text>
            </TouchableOpacity>
          ))}
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>+ Add Filter</Text>
      </TouchableOpacity>

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

      <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
        <Text style={styles.applyButtonText}>Apply Filters</Text>
      </TouchableOpacity>

      {renderFilterPicker()}
      {renderFilterValuePicker()}

      {displayedPitData.map((team, index) => (
        <View key={index} style={styles.teamContainer}>
          <Text style={styles.teamText}>{team.RobTeamNm}</Text>
        </View>
      ))}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setGroupManagementModalVisible(true)}
      >
        <Text style={styles.buttonText}>Manage Filter Groups</Text>
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
  buttonContainer: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    margin: 10,
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 10,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  groupNameText: {
    flex: 1,
  },
  groupButton: {
    backgroundColor: '#E8E8E8',
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#F6EB14",
    fontWeight: "bold",
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
  applyButtonText: {
    fontSize: 18,
    color: "#F6EB14",
    fontWeight: "bold",
  },
  teamContainer: {
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
  teamText: {
    fontWeight: "bold",
    color: "#333",
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
