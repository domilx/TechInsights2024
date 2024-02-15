import React from "react";
import { View, Text, StyleSheet } from "react-native";
const Dropdown: any = require('react-native-element-dropdown').Dropdown;

interface DropDownSelectorProps {
  label: string;
  items?: { label: string; value: string | number }[];
  value: any;
  setValue: (value: string | number) => void;
}

export const DropDownSelector: React.FC<DropDownSelectorProps> = ({
  label,
  items = [],
  value,
  setValue,
}) => (
  <View style={styles.subViews}>
    <Text style={styles.label}>{label}</Text>
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.dropdownPlaceholder}
      selectedTextStyle={styles.dropdownSelectedText}
      activeColor="#F0F0F0"
      data={items}
      maxHeight={200}
      labelField="label"
      valueField="value"
      placeholder="Select item"
      value={value}
      onChange={(item: any) => setValue(item.value)}
      zIndex={5000}
    />
  </View>
);


const styles = StyleSheet.create({
  subViews: {
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
    flexDirection: "column",
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  dropdown: {
    height: 45,
    width: "100%",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#A0A0A0",
    padding: 10,
  },
  dropdownPlaceholder: {
    color: "#A0A0A0",
  },
  dropdownSelectedText: {
    color: "#333",
  },
});