import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [scannedData, setScannedData] = useState(null);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      //@ts-ignore
      setHasPermission(status === 'granted'); //Type error ignored
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScannedData(data);
    // Handle the scanned data as needed
  };

  function handleCapture() {
    if (scannedData) {
      //@ts-ignore
      //if scanne data is not a TeamModel or MatchModel, ignore it
      if (scannedData.includes("TeamNumber")) {
        //@ts-ignore
        navigation.navigate("UploadScreen", { data: scannedData });
      } else {
        alert("Invalid QR code detected.");
      }
    } else {
      alert("No QR code detected.");
    }
  }

  function toggleFlash() {
    setFlashMode(
      flashMode === FlashMode.off
        ? FlashMode.torch
        : FlashMode.off
    );
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={type}
          onBarCodeScanned={handleBarCodeScanned}
          flashMode={flashMode}
        />
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.flashButton}
          onPress={toggleFlash}
        >
          <Ionicons name={flashMode === FlashMode.off ? 'flash-off' : 'flash'} size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.captureButton}
          onPress={handleCapture}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    width: windowWidth * 0.90,
    height: windowHeight * 0.70,
    borderRadius: 20,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'white', // Default color
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  captureButtonActive: {
    borderColor: 'green', // Color changes when QR is in view
  },
  flashButton: {
    position: 'absolute',
    left: '40%', // Adjust this percentage to place the flash button as needed
    padding: 10,
  },
});