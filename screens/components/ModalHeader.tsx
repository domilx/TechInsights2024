import React, { FC } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ModalHeader: FC<{ onClose: () => void; title: string }> = ({
  onClose,
  title,
}) => (
  <View style={styles.modalHeader}>
    <TouchableOpacity style={styles.backButtonWrapper} onPress={onClose}>
      <Icon name="chevron-back" size={30} color="#F6EB14" />
      <Text style={styles.backButtonText}>Back</Text>
    </TouchableOpacity>
    <Text style={styles.modalHeaderText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
    modalHeader: {
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#1E1E1E",
  },
  backButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: 10,
    top: 45,
  },
  backButtonText: {
    color: "#F6EB14",
    marginLeft: 5,
  },
  modalHeaderText: {
    fontSize: 16,
    color: "#F6EB14",
    fontWeight: "bold",
  },
});

export default ModalHeader;
