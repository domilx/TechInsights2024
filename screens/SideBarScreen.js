import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function SideBarScreen({ onTeamSelect }) {
  const [selectedTeam, setSelectedTeam] = useState('');

  const handlePress = (team) => {
    setSelectedTeam(team);
    onTeamSelect(team);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teams</Text>
      <TouchableOpacity style={selectedTeam === 'team3990' ? styles.selectedOption : styles.option} onPress={() => handlePress('team3990')}>
        <Text style={selectedTeam === 'team3990' ? styles.selectedText : styles.text}>team3990</Text>
        <Text style={styles.chip}>➜</Text>
      </TouchableOpacity>

      <TouchableOpacity style={selectedTeam === 'team4990' ? styles.selectedOption : styles.option} onPress={() => handlePress('team4990')}>
        <Text style={selectedTeam === 'team4990' ? styles.selectedText : styles.text}>team4990</Text>
        <Text style={styles.chip}>➜</Text>
      </TouchableOpacity>

      <TouchableOpacity style={selectedTeam === 'more' ? styles.selectedOption : styles.option} onPress={() => handlePress('more')}>
        <Text style={selectedTeam === 'more' ? styles.selectedText : styles.text}>more</Text>
        <Text style={styles.chip}>➜</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1.5,  // Increase the flex value to make it take more space
    paddingVertical: 10,
    flexDirection: 'column',
    backgroundColor: '#F8F8F8',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    paddingLeft: 10,
    marginBottom: 10
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    paddingVertical: 15,
  },
  selectedOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#007AFF',
    backgroundColor: '#E6F0FA',
    paddingVertical: 15,
  },
  text: {
    fontSize: 18,
    color: '#000',
    paddingLeft: 10
  },
  selectedText: {
    fontSize: 18,
    color: '#007AFF',
    paddingLeft: 10
  },
  chip: {
    fontSize: 14,  // Reduced font size for the chip
    color: '#aaa',
    paddingRight: 10  // Added some spacing to keep the chip on the right
  }
});
