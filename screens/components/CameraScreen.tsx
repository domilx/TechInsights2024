import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { RNCamera } from "react-native-camera";

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const [qrData, setQrData] = useState(null);

  const handleBarcodeDetected = ({ barcodes }: any) => {
    if (barcodes.length > 0) {
      let qrInfo = barcodes[0].data;
      try {
        let parsedInfo = JSON.parse(qrInfo);
        setQrData(parsedInfo);
      } catch (err) {
        console.error("Not a valid JSON QR code:", err);
      }
    }
  };

  const handlePress = () => {
    if (qrData) {
      console.log(qrData);
    } else {
      console.log("No QR code detected");
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        onGoogleVisionBarcodesDetected={handleBarcodeDetected}
        googleVisionBarcodeType={
          RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.QR_CODE
        }
      >
        <TouchableOpacity style={styles.captureButton} onPress={handlePress}>
          <Text style={styles.captureButtonText}>Scan QR</Text>
        </TouchableOpacity>
      </RNCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    borderRadius: 20,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 20,
  },
  captureButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  captureButtonText: {
    color: "#000",
  },
});
