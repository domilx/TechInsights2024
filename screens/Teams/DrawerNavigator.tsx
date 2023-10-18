// Navigation.js
import React from "react";
import {
  DrawerNavigationProp,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import TeamScreen from "./TeamScreen";
import DrawerScreen from "./DrawerScreen";
import { RouteProp } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

type DrawerScreenProps = {
  navigation: DrawerNavigationProp<any, any>;
  route?: RouteProp<any, any>;
};

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
