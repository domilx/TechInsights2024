import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import teams from '../jsons/teams.json'; // Importing the JSON data

export default function SideBarScreen({ onTeamSelect }) {
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handlePress = (teamNumber, teamName) => {
    setSelectedTeam(teamName);
    onTeamSelect(teamNumber);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.item,
        { backgroundColor: selectedTeam === item.teamName ? '#E6F0FA' : 'transparent' },
      ]}
      onPress={() => handlePress(item.teamNumber, item.teamName)}
    >
      <Text style={selectedTeam === item.teamName ? styles.selectedText : styles.text}>
        {item.teamName}
      </Text>
      <Text style={styles.chip}>➜</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={teams}
        renderItem={renderItem}
        keyExtractor={(item) => item.teamNumber.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  selectedText: {
    fontSize: 16,
    color: '#007AFF',
  },
  chip: {
    fontSize: 14,
    color: '#aaa',
  },
});
