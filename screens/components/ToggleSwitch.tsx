import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

interface ToggleSwitchProps {
  label: string;
  onToggle: (value: boolean) => void;
  value: any;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  onToggle,
  value,
}) => (
  <View style={styles.switchContainer}>
    <Text>{label}</Text>
    <Switch
      trackColor={{ false: "#333", true: "#333" }}
      thumbColor={value ? "white" : "white"}
      onValueChange={onToggle}
      value={value}
    />
  </View>
);

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
    marginHorizontal: 28,
    borderRadius: 15,
    padding: 10,
    borderColor: "#A0A0A0",
    borderWidth: 1,
  },
});
