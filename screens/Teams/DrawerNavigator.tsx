import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TeamScreen from "./TeamScreen";
import DrawerScreen from "./DrawerScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1E1E1E" },
        headerTintColor: "#F6EB14",
        headerTitleStyle: { fontWeight: "bold" },
      }}
      drawerContent={(props) => <DrawerScreen {...props} />}
    >
      <Drawer.Screen name="Teams" component={TeamScreen} />
    </Drawer.Navigator>
  );
}
