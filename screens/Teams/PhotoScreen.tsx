import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { PitModel } from "../../models/PitModel";
import {
  fetchPhotosFromFirebase,
  uploadPhotoToFirebase,
  removePhotoFromFirebase,
} from "../../services/FirebaseService";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const PhotoScreen = ({ team }: { team: PitModel }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photos, setPhotos] = useState<string[]>([]); // Changed to an array
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestPermissionsAsync();
        setHasPermission(status === "granted");
        await fetchPhoto();
      } catch (error) {
        Alert.alert("Error", "Failed to get camera permissions.");
      }
    })();
  }, []);

  const fetchPhoto = async () => {
    try {
      const result = await fetchPhotosFromFirebase(team.TeamNumber);
      if (result.success && result.photos) {
        setPhotos(result.photos);
      }
    } catch (error) {
      console.error("Error fetching photos: ", error);
      Alert.alert("Error", "Failed to fetch photos.");
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current) {
      console.error("Camera reference is null");
      Alert.alert("Error", "Camera not available.");
      return;
    }

    try {
      const photoTaken = await cameraRef.current.takePictureAsync();
      const uploadResult = await uploadPhotoToFirebase(
        photoTaken.uri,
        team.TeamNumber
      );
      if (uploadResult.success) {
        //@ts-ignore
        setPhotos([...photos, uploadResult.url]);
      }
    } catch (error) {
      console.error("Error taking photo: ", error);
      Alert.alert("Error", "Failed to take photo.");
    }
  };

  const removePhoto = async (photoUrl: string) => {
    // Extract the file path from the URL
    let photoName = photoUrl.split('/').pop();
  
    // Decode the file path
    photoName = decodeURIComponent(photoName ?? '');
  
    // Remove query parameters if any
    const queryParamIndex = photoName.indexOf('?');
    if (queryParamIndex !== -1) {
      photoName = photoName.substring(0, queryParamIndex);
    }
  
    if (!photoName) {
      console.error("Invalid photo name");
      Alert.alert("Error", "Invalid photo name.");
      return;
    }
  
    try {
      const removeResult = await removePhotoFromFirebase(team.TeamNumber, photoName);
      if (removeResult.success) {
        setPhotos(photos.filter((photo) => photo !== photoUrl));
      }
    } catch (error) {
      console.error("Error removing photo: ", error);
      Alert.alert("Error", "Failed to remove photo.");
    }
  };  


  const confirmAndRemovePhoto = (photoUrl: string) => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => removePhoto(photoUrl) },
      ],
      { cancelable: true }
    );
  };

  const toggleFlash = () => {
    setFlashMode(flashMode === FlashMode.off ? FlashMode.torch : FlashMode.off);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera.</Text>;
  }7

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={CameraType.back}
        flashMode={flashMode}
        ref={cameraRef}
      >
        <View style={styles.cameraUI}>
          <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
            <Ionicons
              name={flashMode === FlashMode.off ? "flash-off" : "flash"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
      <ScrollView style={styles.photoScrollContainer}>
        {photos.map((photoUrl, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{ uri: photoUrl }} style={styles.photo} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => confirmAndRemovePhoto(photoUrl)}
            >
              <Ionicons name="trash-bin" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  photoContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 20,
    width: windowWidth * 0.8, // Adjust width as needed
  },
  photo: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 5,
  },
  camera: {
    width: windowWidth,
    height: windowHeight * 0.6,
    justifyContent: "flex-end",
  },
  cameraUI: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  captureButton: {
    alignSelf: "center",
    marginBottom: 20,
  },
  flashButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  photoScrollContainer: {
    marginTop: 20,
  },
  removeButton: {
    marginTop: 10,
  },
});

export default PhotoScreen;
