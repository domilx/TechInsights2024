import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const windowHeight = Dimensions.get("window").height;

export default function App() {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scannedData, setScannedData] = useState(null);
  const [type, setType] = useState(BarCodeScanner.Constants.Type.back);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  const handleBarCodeScanned = ({ type, data, bounds }: any) => {
    setScannedData(data);
    setX(bounds.origin.x);
    setY(bounds.origin.y);
    setWidth(bounds.size.width);
    setHeight(bounds.size.height);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  function handleCapture(): void {
    if (scannedData) {
      alert('Scanned Data: ' + scannedData);
    } else {
      alert('No QR code detected.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <BarCodeScanner
        style={styles.camera}
        type={type}
        onBarCodeScanned={handleBarCodeScanned}
      >
        <View style={{ position: "absolute", top: y, left: x, width: width, height: height, borderColor: "green", borderWidth: 2 }} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity activeOpacity={1} style={styles.circleButton} onPress={handleCapture}></TouchableOpacity>
        </View>
      </BarCodeScanner>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
