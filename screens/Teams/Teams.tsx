// Navigation.js
import React from "react";
import {
  DrawerNavigationProp,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import MainScreen from "./MainScreen";
import SideBarScreen from "./SideBarScreen";
import { RouteProp } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

type SideBarScreenProps = {
  navigation: DrawerNavigationProp<any, any>;
  route?: RouteProp<any, any>;
};

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
