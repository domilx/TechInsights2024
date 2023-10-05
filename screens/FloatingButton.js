import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Button, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function FloatingButton({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const rotation = useState(new Animated.Value(0))[0];

    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg']
    });

    const toggleModal = () => {
        // If modal is open, close it and reset rotation
        if (modalVisible) {
            setModalVisible(false);
            Animated.timing(rotation, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start();
        } 
        // Otherwise, open the modal and rotate the button
        else {
            setModalVisible(true);
            Animated.timing(rotation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start();
        }
    };

    const handleQRChoice = (choice) => {
        toggleModal();
        navigation.navigate(choice);
    };

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModal}
            >
                <TouchableOpacity style={styles.modalBackground} onPress={toggleModal}>
                    <View style={styles.modalView}>
                        <Button title="Photo QR" onPress={() => handleQRChoice('PhotoQRScreen')} />
                        <Button title="Scout QR" onPress={() => handleQRChoice('ScoutQRScreen')} />
                    </View>
                </TouchableOpacity>
            </Modal>

            <Animated.View style={{ ...styles.floatingButton, transform: [{ rotate: spin }] }}>
                <TouchableOpacity onPress={toggleModal}>
                    <Icon name="add" size={30} color="#FFF" />
                </TouchableOpacity>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: 'blue',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalView: {
        paddingBottom: 50,
        backgroundColor: 'white', // assuming you want a white background for the modal content
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    }
});
