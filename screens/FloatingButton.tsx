import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function FloatingButton({ navigation }) {
    const [viewVisible, setViewVisible] = useState(false);
    const rotation = useState(new Animated.Value(0))[0];
    const scaleValue = useState(new Animated.Value(0))[0];

    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg']
    });

    const scale = scaleValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    });

    const toggleView = () => {
        if (viewVisible) {
            setViewVisible(false);
            Animated.parallel([
                Animated.timing(rotation, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true
                }),
                Animated.timing(scaleValue, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true
                })
            ]).start();
        } else {
            setViewVisible(true);
            Animated.parallel([
                Animated.timing(rotation, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                }),
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                })
            ]).start();
        }
    };

    return (
        <>
            <Animated.View style={{ ...styles.expandingView, transform: [{ scale }] }}>
                {/* Content of your expanded view */}
            </Animated.View>

            <Animated.View style={{ ...styles.floatingButton, transform: [{ rotate: spin }] }}>
                <TouchableOpacity onPress={toggleView}>
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
        bottom: 100,
        backgroundColor: '#007AFF',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    expandingView: {
        position: 'absolute',
        right: 20,
        bottom: 170,
        backgroundColor: '#F8F8F8',
        borderRadius: 20,
        width: 250,
        height: 200,
        zIndex: 999,
    }
});
