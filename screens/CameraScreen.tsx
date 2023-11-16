import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scannedData, setScannedData] = useState(null);
  const [type, setType] = useState(BarCodeScanner.Constants.Type.back);
  const [isQRVisible, setIsQRVisible] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const qrTimeoutRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (qrTimeoutRef.current) clearTimeout(qrTimeoutRef.current);
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data, bounds }: any) => {
    setScannedData(data);
    setX(bounds.origin.x);
    setY(bounds.origin.y);
    setWidth(bounds.size.width);
    setHeight(bounds.size.height);
    setIsQRVisible(true);

    // Clear any existing timer
    if (qrTimeoutRef.current) clearTimeout(qrTimeoutRef.current);

    // Start a new timer
    qrTimeoutRef.current = setTimeout(() => {
      setIsQRVisible(false);
    }, 1000); // Adjust this duration as needed. For example, 1000 ms = 1 second
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  function handleCapture(): void {
    if (scannedData) {
      setIsQRVisible(false);
    } else {
      alert("No QR code detected.");
    }
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={styles.camera}
        type={type}
        onBarCodeScanned={handleBarCodeScanned}
      >
        {isQRVisible && (
          <View
            style={{
              position: "absolute",
              top: y,
              left: x,
              width: width,
              height: height,
              borderColor: "green",
              borderWidth: 4,
            }}
          />
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.circleButton}
            onPress={handleCapture}
          ></TouchableOpacity>
        </View>
      </BarCodeScanner>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex: 1, // This will ensure the container fills the whole screen
    justifyContent: "center", // Center children vertically
    alignItems: "center", // Center children horizontally
  },
  buttonContainer: {
    position: "absolute",
    bottom: windowHeight * 0.05,
    alignSelf: "center",
  },
  circleButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    bottom: 40,
    backgroundColor: "rgba(21, 21, 23, 0.7)",
    elevation: 10,
    borderWidth: 4,
    borderColor: "#D6E0D9",
  },
  camera: {
    height: windowHeight,
    width: windowWidth,
    justifyContent: "flex-start", // Align the scanner view to the top
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
