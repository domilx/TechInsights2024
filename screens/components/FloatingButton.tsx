import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CameraScreen from "../CameraScreen";

export default function FloatingButton() {
  const [viewVisible, setViewVisible] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleDataScanned = (data: string) => {
    setScannedData(data);
    setViewVisible(false);
  };

  return (
    <>
      {viewVisible && <CameraScreen onDataScanned={handleDataScanned} />}
      
      <View style={styles.floatingButton}>
        <TouchableOpacity onPress={() => setViewVisible(!viewVisible)}>
          <Icon name="add" size={30} color="#F6EB14" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 100,
    backgroundColor: "#1E1E1E",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  }
});
