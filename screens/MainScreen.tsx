import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function MainScreen({ team }) {
  return (
    <View style={styles.container}>
      <Text>{team}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
