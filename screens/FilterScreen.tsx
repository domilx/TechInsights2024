import React, { useState, useEffect, FC } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DriveBaseMotor, DriveBaseType, DriverExperience, PitModel, Stability } from "../models/PitModel";
import Icon from '@expo/vector-icons/Ionicons';

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
  const [availableFilters, setAvailableFilters] = useState<Array<keyof FilterConfig>>([]);
  const [filters, setFilters] = useState<{ [key in keyof FilterConfig]?: string | number | boolean }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFilterField, setSelectedFilterField] = useState<keyof FilterConfig | null>(null);
  const [isValueModalVisible, setIsValueModalVisible] = useState(false);

  useEffect(() => {
    const getPitData = async () => {
      const storedPitData = await AsyncStorage.getItem("fetchedData");
      if (storedPitData) {
        const data = JSON.parse(storedPitData);
        setOriginalPitData(data);
        setDisplayedPitData(data);
      }
    };
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

  const setFilter = (field: keyof FilterConfig, value: string | number | boolean | undefined) => {
    setFilters(prevFilters => ({ ...prevFilters, [field]: value }));
    if (value === undefined) {
      removeFilter(field);
    }
  };

  const addFilter = (filterField: keyof FilterConfig) => {
    if (!availableFilters.includes(filterField)) {
      setAvailableFilters(prevFilters => [...prevFilters, filterField]);
    }
  };

  const removeFilter = (filterField: keyof FilterConfig) => {
    setAvailableFilters(prevFilters => prevFilters.filter(f => f !== filterField));
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      delete newFilters[filterField];
      return newFilters;
    });
  };

  const renderFilterPicker = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => setIsModalVisible(false)}>
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
        <TouchableOpacity style={styles.backButton} onPress={() => setIsValueModalVisible(false)}>
          <Icon name="chevron-back" size={30} color="#F6EB14" />
        </TouchableOpacity>
        {selectedFilterField && filterConfig[selectedFilterField]?.map((option) => (
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
              {filters[filterField] ? String(filters[filterField]) : 'Select Value'}
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

      <TouchableOpacity
        style={styles.applyButton}
        onPress={applyFilters}
      >
        <Text style={styles.applyButtonText}>Apply Filters</Text>
      </TouchableOpacity>

      {renderFilterPicker()}
      {renderFilterValuePicker()}

      {displayedPitData.map((team, index) => (
        <View key={index} style={styles.teamContainer}>
          <Text style={styles.teamText}>{team.RobTeamNm}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
  },
  buttonContainer: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#F6EB14',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  valueButton: {
    backgroundColor: '#D6E0D9',
    padding: 10,
    borderRadius: 8,
  },
  valueButtonText: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 8,
  },
  applyButton: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 18,
    color: '#F6EB14',
    fontWeight: 'bold',
  },
  teamContainer: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  teamText: {
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalButton: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: "#F6EB14",
    fontWeight: "bold",
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
});

export default FilterScreen;
