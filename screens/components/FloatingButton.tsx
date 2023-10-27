import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CameraScreen from "../CameraScreen";

export default function FloatingButton() {
  const [cameraVisible, setCameraVisible] = useState(false);
  const [dataVisible, setDataVisible] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleDataScanned = (data: string) => {
    setScannedData(data);
    setCameraVisible(false); // Close the camera once data is scanned
    setDataVisible(true); // Show the scanned data after camera is closed
  };

  const handleAddButtonClick = () => {
    if (scannedData && !cameraVisible) {
      setScannedData(null); // Reset the scanned data
    }
    setCameraVisible(!cameraVisible);
    setDataVisible(false); // Hide scanned data when re-opening the camera
  };

  return (
    <>
      {cameraVisible && <CameraScreen onDataScanned={handleDataScanned} />}
      <Modal visible={dataVisible} transparent={false} animationType="slide">
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text> {scannedData} </Text>
          <TouchableOpacity onPress={() => setDataVisible(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.floatingButton}>
        <TouchableOpacity onPress={handleAddButtonClick}>
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
    zIndex: 2,
  }
});
