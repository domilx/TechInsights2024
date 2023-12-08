// Navigation.js
import React from "react";
import {
  DrawerNavigationProp,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import TeamScreen from "./TeamScreen";
import DrawerScreen from "./DrawerScreen";
import { RouteProp } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FloatingButton from "../components/FloatingButton";
import CameraScreen from "../CameraScreen";
import UploadScreen from "../UploadScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function DrawerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" options={{ headerShown: false, title: "Home" }}>
        {({ navigation }) => (
          <>
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
            <FloatingButton navigation={navigation} />
          </>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
          headerStyle: {
            backgroundColor: "#1E1E1E",
          },
          headerTintColor: "#F6EB14",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          title: "Camera",
        }}
      />
      <Stack.Screen
        name="UploadScreen"
        component={UploadScreen}
        options={{
          headerStyle: {
            backgroundColor: "#1E1E1E",
          },
          headerTintColor: "#F6EB14",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          title: "Confirm Data",
        }}
      />
    </Stack.Navigator>
  );
}
