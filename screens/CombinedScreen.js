import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MainScreen from './MainScreen';
import SideBarScreen from './SideBarScreen';

export default function CombinedScreen() {
  const [selectedTeam, setSelectedTeam] = useState('');

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
  };

  return (
    <View style={styles.container}>
    <SideBarScreen onTeamSelect={handleTeamSelect} />
      <MainScreen team={selectedTeam} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});
