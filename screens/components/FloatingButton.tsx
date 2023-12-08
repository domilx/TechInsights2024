import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function FloatingButton({ navigation }: any) {
  const handleAddButtonClick = () => {
    // Example of navigating to the CameraScreen
    navigation.navigate('CameraScreen');
  };

  return (
    <View style={styles.floatingButton}>
      <TouchableOpacity onPress={handleAddButtonClick}>
        <Icon name="add" size={30} color="#F6EB14" />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
  modalScreen: {
    backgroundColor: "#1E1E1E",
    margin: 0,
  },
});
