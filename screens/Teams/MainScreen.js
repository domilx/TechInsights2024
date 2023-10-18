import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function MainScreen({ route }) {
  const team = route.params ? route.params.team : null;

  if (!team) return <View style={styles.container}><Text>Please select a team to view it's stats</Text></View>;

  return (
    <View style={styles.container}>
      <Text>Team Number: {team.teamNumber}</Text>
      <Text>Team Name: {team.teamName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
