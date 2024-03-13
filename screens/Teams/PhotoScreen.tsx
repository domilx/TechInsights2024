import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert, Modal
} from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { PitModel } from "../../models/PitModel";
import {
  fetchPhotosFromFirebase,
  uploadPhotoToFirebase,
  removePhotoFromFirebase,
} from "../../services/FirebaseService";
import Carousel from "react-native-snap-carousel";
import ModalHeader from "../components/ModalHeader";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const PhotoScreen = ({ team }: { team: PitModel }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoToConfirm, setPhotoToConfirm] = useState<string | null>(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
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
      } else {
        Alert.alert("Error", result.message);
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
      setCameraVisible(false);
      setPhotoToConfirm(photoTaken.uri);
    } catch (error) {
      console.error("Error taking photo: ", error);
      Alert.alert("Error", "Failed to take photo.");
    }
  };

  const confirmPhotoUpload = async () => {
    if (photoToConfirm) {
      const uploadResult = await uploadPhotoToFirebase(photoToConfirm, team.TeamNumber);
      if (uploadResult.success) {
        //@ts-ignore
        setPhotos([...photos, uploadResult.url]);
      } else {
        Alert.alert("Error", uploadResult.message);
      }
      setPhotoToConfirm(null);
    }
  };

  const removePhoto = async (photoUrl: string) => {
    // Extract the file path from the URL
    let photoName = photoUrl.split("/").pop();

    // Decode the file path
    photoName = decodeURIComponent(photoName ?? "");

    // Remove query parameters if any
    const queryParamIndex = photoName.indexOf("?");
    if (queryParamIndex !== -1) {
      photoName = photoName.substring(0, queryParamIndex);
    }

    if (!photoName) {
      console.error("Invalid photo name");
      Alert.alert("Error", "Invalid photo name.");
      return;
    }

    try {
      const removeResult = await removePhotoFromFirebase(
        photoName
      );
      if (removeResult.success) {
        setPhotos(photos.filter((photo) => photo !== photoUrl));
      }
    } catch (error) {
      console.error("Error removing photo: ", error);
      Alert.alert("Error", "Failed to remove photo.");
    }
  };

  const renderPhotoItem = ({ item, index }: any) => {
    return (
      <View style={styles.photoContainer}>
        <Image source={{ uri: item }} style={styles.photo} />
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmAndRemovePhoto(item)}
        >
          <Ionicons name="trash-bin" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
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

  const cancel = () => {
    setPhotoToConfirm(null)
    setCameraVisible(true)
  }

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera.</Text>;
  }
  7;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cameraButton} onPress={() => setCameraVisible(true)}>
        <Text style={styles.cameraButtonText}>Open Camera</Text>
      </TouchableOpacity>
  
      {photos.length > 0 && (
        <Carousel
        data={photos}
        renderItem={renderPhotoItem}
        sliderWidth={windowWidth}
        itemWidth={windowWidth - 50}
        layout="default"
        onSnapToItem={(index) => setSelectedPhoto(photos[index])}
      />
      )}
      {photos.length === 0 && (
        <Text style={{flex: 1}}>No photos to display.</Text>
      )
      }
  
      <Modal
        visible={cameraVisible}
        onRequestClose={() => setCameraVisible(false)}
        animationType="slide"
        transparent={false}
      >
        <ModalHeader onClose={() => setCameraVisible(false)} title="Camera" />
        <Camera
          style={styles.fullScreenCamera}
          type={CameraType.back}
          flashMode={flashMode}
          ref={cameraRef}
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
              <Ionicons
                name={flashMode === FlashMode.off ? "flash-off" : "flash"}
                size={30}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={takePhoto}>
              <Ionicons name="camera" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </Camera>
      </Modal>
  
      <Modal
        visible={!!photoToConfirm}
        transparent={true}
        onRequestClose={() => setPhotoToConfirm(null)}
      >
        <View style={styles.confirmationModalView}>
          {/* @ts-ignore */}
          <Image source={{ uri: photoToConfirm }} style={styles.confirmationPhoto} />
          <View style={styles.confirmationButtons}>
            <TouchableOpacity style={styles.confirmButton} onPress={confirmPhotoUpload}>
              <Text style={styles.confirmButtonText}>Upload Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => cancel()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  cameraButton: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#1E1E1E",
    shadowColor: "#000",
    alignItems: 'center',
  },
  cameraButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#F6EB14",
  },
  fullScreenCamera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    padding: 10,
  },
  confirmationModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  confirmationPhoto: {
    width: windowWidth * 0.9,
    height: windowHeight - 175,
    borderRadius: 20,
  },
  confirmationButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  confirmButton: {
    padding: 10,
    backgroundColor: '#28A745',
    borderRadius: 8,
    marginRight: 10,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#DC3545',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraSection: {
    flex: 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  photoGallerySection: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  fullSizePhoto: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.8,
    borderRadius: 20,
  },
  closeModalButton: {
    padding: 10,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    marginTop: 10,
  },
  closeModalButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  photoContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 20,
  },
  photo: {
    width: "100%",
    height: "100%",
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
  butHeader: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: "#1E1E1E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: windowWidth - 20,
    elevation: 3,
    alignItems: "center",
  },
  butTitle: {
    fontSize: 18,
    color: "#F6EB14",
    fontWeight: "bold",
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
});

export default PhotoScreen;
