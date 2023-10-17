// Navigation.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainScreen from "./MainScreen";
import SideBarScreen from "./SideBarScreen";

const Drawer = createDrawerNavigator();

export default function Teams() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1E1E1E" },
        headerTintColor: "#F6EB14",
        headerTitleStyle: { fontWeight: "bold" },
      }}
      drawerContent={(props) => <SideBarScreen {...props} />}
    >
      <Drawer.Screen name="Teams" component={MainScreen} />
    </Drawer.Navigator>
  );
}
