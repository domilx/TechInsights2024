import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TeamScreen from "./TeamScreen";
import DrawerScreen from "./DrawerScreen";
import { DataContext } from "../../contexts/DataContext";
import { Text, View } from "react-native";

const Drawer = createDrawerNavigator();

const NoTeamDataScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>No team data available</Text>
    <Text>Please select a team</Text>
  </View>
);

export default function DrawerNavigator() {
  const { isTeamSelected } = useContext(DataContext);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1E1E1E" },
        headerTintColor: "#F6EB14",
        headerTitleStyle: { fontWeight: "bold" },
      }}
      drawerContent={(props) => <DrawerScreen {...props} />}
    >
      {isTeamSelected ? (
        <Drawer.Screen name="Teams" component={TeamScreen} />
      ) : (
        <Drawer.Screen name="NoData" component={NoTeamDataScreen} />
      )}
    </Drawer.Navigator>
  );
}
