import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./LoginScreen"; // Import your login
import Icon from "@expo/vector-icons/Ionicons";
import FloatingButton from "./components/FloatingButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DrawerNavigator from "./Teams/DrawerNavigator";
import VisualizeScreen from "./VisualizeScreen";
import { createStackNavigator } from "@react-navigation/stack";
import CameraScreen from "./CameraScreen";
import UploadScreen from "./UploadScreen";
import FilterScreen from "./FilterScreen";
import RegistrationScreen from "./RegistrationScreen";
import AuthService from "../services/AuthService"; // Ensure this path is correct
import { User } from "firebase/auth";
import SettingsScreen from "./SettingsScreen";
import { auth } from "../firebase";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  return (
    <NavigationContainer>
      {isLoggedIn ? (
      <Stack.Navigator>
        <Stack.Screen name="MainTabs" options={{ headerShown: false, title: "Home", }}>
          {({ navigation }) => (
            <>
              <Tab.Navigator
                initialRouteName="Pits"
                screenOptions={{
                  tabBarStyle: {
                    paddingVertical: 10,
                    backgroundColor: "#1E1E1E",
                  },
                  tabBarActiveTintColor: "#F6EB14",
                  tabBarInactiveTintColor: "gray",
                }}
              >
                <Tab.Screen
                  name="Teams"
                  component={DrawerNavigator}
                  options={({ route }) => ({
                    headerShown: route.name !== "Teams",
                    tabBarLabel: "Teams",
                    tabBarIcon: ({ color, size, focused }) => (
                      <Icon
                        name={
                          focused
                            ? "people-circle-sharp"
                            : "people-circle-outline"
                        }
                        color={focused ? "#F6EB14" : color}
                        size={size}
                      />
                    ),
                  })}
                />
                <Tab.Screen
                  name="Filter Teams"
                  component={FilterScreen}
                  options={{
                    tabBarLabel: "Filter Teams",
                    headerStyle: {
                      backgroundColor: "#1E1E1E", // Set your desired background color here
                    },
                    headerTintColor: "#F6EB14", // Set your desired text color here
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                      <Icon
                        name={focused ? "filter" : "filter-outline"}
                        color={focused ? "#F6EB14" : color}
                        size={size}
                      />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Visualize"
                  component={VisualizeScreen}
                  options={{
                    tabBarLabel: "Visualize",
                    headerStyle: {
                      backgroundColor: "#1E1E1E", // Set your desired background color here
                    },
                    headerTintColor: "#F6EB14", // Set your desired text color here
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                      <Icon
                        name={focused ? "bar-chart" : "bar-chart-outline"}
                        color={focused ? "#F6EB14" : color}
                        size={size}
                      />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{
                    tabBarLabel: "Settings",
                    headerStyle: {
                      backgroundColor: "#1E1E1E", // Set your desired background color here
                    },
                    headerTintColor: "#F6EB14", // Set your desired text color here
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                    tabBarIcon: ({ color, size, focused }) => (
                      <Icon
                        name={focused ? "cog" : "cog-outline"}
                        color={focused ? "#F6EB14" : color}
                        size={size}
                      />
                    ),
                  }}
                />
              </Tab.Navigator>
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
      ) : (
        // User is not logged in, render the login and register screens
        <>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegistrationScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </>
      )}
    </NavigationContainer>
  );
}

export default AppNavigator;