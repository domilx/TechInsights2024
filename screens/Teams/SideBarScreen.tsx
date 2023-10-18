import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import teams from "../../jsons/teams.json";

export default function SideBarScreen({ navigation }: any) {
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handlePress = (team : any) => {
    setSelectedTeam(team.teamName);
    navigation.navigate("Teams", { team }); // Pass the entire team object
    navigation.closeDrawer();
  };

  const renderItem = ({ item } : any) => (
    <TouchableOpacity
      style={[
        styles.item,
        {
          backgroundColor:
            selectedTeam === item.teamName ? "#636262" : "transparent",
        }, // Light grey for selected team
      ]}
      onPress={() => handlePress(item)}
    >
      <Text
        style={
          selectedTeam === item.teamName ? styles.selectedText : styles.text
        }
      >
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
        ListHeaderComponent={<View style={styles.listHeader} />} // Added for offset at the top
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#ccc",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
    color: "#F6EB14",
  },
  selectedText: {
    fontSize: 16,
    color: "#F6EB14",
  },
  chip: {
    fontSize: 14,
    color: "#F6EB14",
  },
  listHeader: {
    height: 70, // Adjust this height as needed for your design
  },
});