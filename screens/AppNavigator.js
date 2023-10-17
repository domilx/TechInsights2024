import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import SimulateScreen from "./SimulateScreen";
import LoginScreen from "./LoginScreen"; // Import your login
import Icon from "react-native-vector-icons/Ionicons";
import FloatingButton from "./FloatingButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Teams from "./Teams";
import VisualizeScreen from "./VisualizeScreen";

const Tab = createBottomTabNavigator();

function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in when the component mounts
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("isLoggedIn");
        if (value !== null) {
          setIsLoggedIn(value === "true");
        }
      } catch (error) {
        // Handle error
        console.error("Failed to load login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
    } catch (error) {
      // Handle error
      console.error("Failed to save login status:", error);
    }
  };

  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Pits"
        screenOptions={{
          tabBarStyle: {
            height: 90,
            paddingVertical: 10,
            backgroundColor: "#1E1E1E",
          },
          tabBarActiveTintColor: "#F6EB14",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tab.Screen
          name="Teams"
          component={Teams}
          options={({ route }) => ({
            headerShown: route.name !== "Teams",
            tabBarLabel: "Teams",
            tabBarIcon: ({ color, size, focused }) => (
              <Icon
                name={focused ? "people-circle-sharp" : "people-circle-outline"}
                color={focused ? "#F6EB14" : color}
                size={size}
              />
            ),
          })}
        />
        <Tab.Screen
          name="Simulate"
          component={SimulateScreen}
          options={{
            tabBarLabel: "Simulate",
            headerStyle: {
              backgroundColor: "#1E1E1E", // Set your desired background color here
            },
            headerTintColor: "#F6EB14", // Set your desired text color here
            headerTitleStyle: {
              fontWeight: "bold",
            },
            tabBarIcon: ({ color, size, focused }) => (
              <Icon
                name={focused ? "cube" : "cube-outline"}
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
      </Tab.Navigator>
      <FloatingButton />
    </NavigationContainer>
  );
}

export default AppNavigator;
