import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import CombinedScreen from './CombinedScreen';
import SimulateScreen from './SimulateScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import FloatingButton from './FloatingButton';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Teams" 
          component={CombinedScreen} 
          options={{
            tabBarLabel: 'Teams',
            tabBarIcon: ({ color, size, focused }) => (
              <Icon 
                name={focused ? "people-circle-sharp" : "people-circle-outline"} 
                color={color} 
                size={size} 
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Simulate" 
          component={SimulateScreen} 
          options={{
            tabBarLabel: 'Simulate',
            tabBarIcon: ({ color, size, focused }) => (
                <Icon 
                  name={focused ? "cube" : "cube-outline"} 
                  color={color} 
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
