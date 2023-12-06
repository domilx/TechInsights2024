import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { PitModel } from "../../models/PitModel";
import displayPitData from "../../models/DisplayPitData";

export default function TeamScreen({ route }: any) {
  const team: PitModel = route.params ? route.params.team : null;

  if (!team) {
    return (
      <View style={styles.container}>
        <Text>Please select a team to view its stats</Text>
      </View>
    );
  }

  const teamData = displayPitData(team);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {teamData.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.label}>{item.label}:</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff', // change color as needed
  },
  container: {
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  value: {
    flex: 1,
    flexWrap: 'wrap',
  },
});
