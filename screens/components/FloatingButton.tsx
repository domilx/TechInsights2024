import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CameraScreen from "../CameraScreen";
import Modal from "react-native-modal";

export default function FloatingButton() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddButtonClick = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <>
      <View style={styles.floatingButton}>
        <TouchableOpacity onPress={handleAddButtonClick}>
          <Icon name="add" size={30} color="#F6EB14" />
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationIn="slideInDown"
        animationOut="slideOutUp"
        animationInTiming={300}
        animationOutTiming={300}
        style={styles.modalScreen}
      >
        <CameraScreen />
      </Modal>
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
    zIndex: 10000,
  },
  modalScreen: {
    backgroundColor: "#1E1E1E",
    margin: 0,
  },
});
